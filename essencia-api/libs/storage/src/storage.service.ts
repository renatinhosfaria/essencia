import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3_CLIENT } from './s3-client.token';

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

@Injectable()
export class StorageService {
  private readonly defaultBucket: string;
  private readonly publicUrl: string;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.defaultBucket = configService.get<string>('S3_BUCKET', 'essencia');
    this.publicUrl = configService.get<string>(
      'S3_PUBLIC_URL',
      'http://localhost:9000/essencia',
    );
  }

  /**
   * Upload file to storage
   */
  async upload(
    file: Buffer,
    filename: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const bucket = options.bucket || this.defaultBucket;
    const ext = path.extname(filename);
    const key = options.folder
      ? `${options.folder}/${uuidv4()}${ext}`
      : `${uuidv4()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: options.contentType,
        Metadata: options.metadata,
      }),
    );

    return {
      key,
      url: `${this.publicUrl}/${key}`,
      bucket,
    };
  }

  /**
   * Upload tenant-specific file
   */
  async uploadForTenant(
    tenantId: string,
    file: Buffer,
    filename: string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const folder = options.folder
      ? `tenants/${tenantId}/${options.folder}`
      : `tenants/${tenantId}`;

    return this.upload(file, filename, { ...options, folder });
  }

  /**
   * Get file from storage
   */
  async get(key: string, bucket?: string): Promise<Buffer> {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: bucket || this.defaultBucket,
        Key: key,
      }),
    );

    const stream = response.Body;
    if (!stream) {
      throw new Error('Empty response body');
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  /**
   * Delete file from storage
   */
  async delete(key: string, bucket?: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: bucket || this.defaultBucket,
        Key: key,
      }),
    );
  }

  /**
   * Delete multiple files
   */
  async deleteMany(keys: string[], bucket?: string): Promise<void> {
    await Promise.all(keys.map((key) => this.delete(key, bucket)));
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    key: string,
    expiresInSeconds = 3600,
    bucket?: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket || this.defaultBucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }

  /**
   * Get signed URL for upload
   */
  async getUploadSignedUrl(
    key: string,
    contentType: string,
    expiresInSeconds = 3600,
    bucket?: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket || this.defaultBucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }

  /**
   * List files in folder
   */
  async list(prefix: string, bucket?: string): Promise<string[]> {
    const response = await this.s3.send(
      new ListObjectsV2Command({
        Bucket: bucket || this.defaultBucket,
        Prefix: prefix,
      }),
    );

    return (response.Contents || [])
      .map((item) => item.Key || '')
      .filter(Boolean);
  }

  /**
   * Get public URL for file
   */
  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}
