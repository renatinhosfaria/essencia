import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from './redis-client.token';

@Injectable()
export class CacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClientType) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /**
   * Set value in cache with optional TTL
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setEx(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * Delete keys by pattern
   */
  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * Get or set with callback (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    return await this.redis.incr(key);
  }

  /**
   * Set hash field
   */
  async hSet(key: string, field: string, value: string): Promise<void> {
    await this.redis.hSet(key, field, value);
  }

  /**
   * Get hash field
   */
  async hGet(key: string, field: string): Promise<string | undefined> {
    const result = await this.redis.hGet(key, field);
    return result ?? undefined;
  }

  /**
   * Get all hash fields
   */
  async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.redis.hGetAll(key);
  }

  /**
   * Publish message to channel
   */
  async publish(channel: string, message: string): Promise<void> {
    await this.redis.publish(channel, message);
  }

  /**
   * Generate cache key with tenant prefix
   */
  tenantKey(tenantId: string, ...parts: string[]): string {
    return `tenant:${tenantId}:${parts.join(':')}`;
  }
}
