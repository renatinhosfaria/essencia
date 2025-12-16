import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './libs/database/src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_MIGRATIONS_URL ?? process.env.DATABASE_URL ?? '',
  },
  strict: true,
});
