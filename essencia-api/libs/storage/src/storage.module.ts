import { S3Client } from '@aws-sdk/client-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3_CLIENT } from './s3-client.token';
import { StorageService } from './storage.service';

export { S3_CLIENT } from './s3-client.token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3_CLIENT,
      useFactory: (configService: ConfigService): S3Client => {
        const endpoint = configService.get<string>(
          'S3_ENDPOINT',
          'http://localhost:9000',
        );
        const region = configService.get<string>('S3_REGION', 'us-east-1');
        const accessKeyId = configService.get<string>(
          'S3_ACCESS_KEY',
          'minioadmin',
        );
        const secretAccessKey = configService.get<string>(
          'S3_SECRET_KEY',
          'minioadmin',
        );

        return new S3Client({
          endpoint,
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [S3_CLIENT, StorageService],
})
export class StorageModule {}
