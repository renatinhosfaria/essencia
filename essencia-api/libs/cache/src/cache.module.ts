import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { CacheService } from './cache.service';
import { REDIS_CLIENT } from './redis-client.token';

export { REDIS_CLIENT } from './redis-client.token';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisClientType> => {
        const redisUrl = configService.get<string>(
          'REDIS_URL',
          'redis://localhost:6379',
        );

        const client = createClient({
          url: redisUrl,
        });

        client.on('error', (err) => console.error('Redis Client Error', err));

        await client.connect();

        return client as RedisClientType;
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [REDIS_CLIENT, CacheService],
})
export class CacheModule {}
