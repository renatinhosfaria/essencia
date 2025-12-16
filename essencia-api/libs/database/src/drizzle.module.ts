import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DB, DB_POOL } from './drizzle.tokens';
import * as schema from './schema';

export { DB, DB_POOL, DrizzleDB } from './drizzle.tokens';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB_POOL,
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is required');
        }

        const pool = new Pool({
          connectionString: databaseUrl,
          min: 2,
          max: 10,
        });

        // Warmup pool
        const clients = await Promise.all([pool.connect(), pool.connect()]);
        clients.forEach((client) => client.release());

        // Validate connection
        await pool.query('SELECT 1');

        return pool;
      },
      inject: [ConfigService],
    },
    {
      provide: DB,
      useFactory: (pool: Pool) => {
        return drizzle(pool, { schema });
      },
      inject: [DB_POOL],
    },
  ],
  exports: [DB_POOL, DB],
})
export class DrizzleModule implements OnModuleDestroy {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
