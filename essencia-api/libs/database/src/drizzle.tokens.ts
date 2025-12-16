// Tokens for Drizzle database injection
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const DB_POOL = Symbol('DB_POOL');
export const DB = Symbol('DB');

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
