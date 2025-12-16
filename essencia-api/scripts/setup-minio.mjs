/**
 * Setup MinIO bucket for development
 * Creates the essencia-avatars bucket with public-read policy
 */
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import 'dotenv/config';

const endpoint =
  process.env.STORAGE_ENDPOINT ??
  process.env.S3_ENDPOINT ??
  // Inside Docker, localhost points to the container itself.
  'http://minio:9000';

const region =
  process.env.STORAGE_REGION ?? process.env.S3_REGION ?? 'us-east-1';
const accessKey =
  process.env.STORAGE_ACCESS_KEY ?? process.env.S3_ACCESS_KEY ?? 'minioadmin';
const secretKey =
  process.env.STORAGE_SECRET_KEY ?? process.env.S3_SECRET_KEY ?? 'minioadmin';
const bucket =
  process.env.STORAGE_BUCKET ?? process.env.S3_BUCKET ?? 'essencia-avatars';

const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  forcePathStyle: true,
  tls: false,
});

async function setupBucket() {
  try {
    // MinIO may still be starting; retry for a while before failing.
    const deadline = Date.now() + 90_000;
    let lastError;

    while (Date.now() < deadline) {
      try {
        // Check if bucket exists
        try {
          await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
          // eslint-disable-next-line no-console
          console.log(`✅ Bucket '${bucket}' already exists`);
        } catch (err) {
          if (
            err?.name === 'NotFound' ||
            err?.$metadata?.httpStatusCode === 404
          ) {
            // Create bucket
            await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
            // eslint-disable-next-line no-console
            console.log(`✅ Created bucket '${bucket}'`);
          } else {
            throw err;
          }
        }

        // Success path; stop retrying.
        lastError = undefined;
        break;
      } catch (err) {
        lastError = err;

        const code = err?.code ?? err?.name;
        const isConnectionIssue =
          code === 'ECONNREFUSED' ||
          code === 'TimeoutError' ||
          code === 'NetworkingError' ||
          String(code ?? '').includes('ECONNREFUSED');

        if (!isConnectionIssue) {
          throw err;
        }

        // eslint-disable-next-line no-console
        console.log(`⏳ Waiting for MinIO at ${endpoint}...`);
        await new Promise((r) => setTimeout(r, 2_000));
      }
    }

    if (lastError) {
      throw lastError;
    }

    // Set public-read policy
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: JSON.stringify(policy),
      }),
    );

    // eslint-disable-next-line no-console
    console.log(`✅ Set public-read policy on '${bucket}'`);
    // eslint-disable-next-line no-console
    console.log(`\n🎉 MinIO setup complete!`);
    // eslint-disable-next-line no-console
    console.log(`   Bucket: ${bucket}`);
    // eslint-disable-next-line no-console
    console.log(`   Endpoint: ${endpoint}`);
    // eslint-disable-next-line no-console
    console.log(`   Console: http://localhost:9001`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to setup MinIO:', err);
    process.exitCode = 1;
  }
}

setupBucket();
