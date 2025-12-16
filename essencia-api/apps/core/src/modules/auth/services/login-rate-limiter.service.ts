import { Injectable } from '@nestjs/common';

interface RateLimitEntry {
  failures: number;
  blockedUntil: number | null;
  lastFailure: number;
}

@Injectable()
export class InMemoryLoginRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly maxFailures = 5;
  private readonly blockDurationMs = 15 * 60 * 1000; // 15 minutes
  private readonly windowMs = 60 * 1000; // 1 minute

  isAllowed(key: string): boolean {
    const entry = this.entries.get(key);
    if (!entry) return true;

    const now = Date.now();

    // Check if blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return false;
    }

    // Reset if window expired
    if (now - entry.lastFailure > this.windowMs) {
      this.entries.delete(key);
      return true;
    }

    return entry.failures < this.maxFailures;
  }

  registerFailure(key: string): void {
    const now = Date.now();
    const entry = this.entries.get(key) || {
      failures: 0,
      blockedUntil: null,
      lastFailure: now,
    };

    entry.failures++;
    entry.lastFailure = now;

    if (entry.failures >= this.maxFailures) {
      entry.blockedUntil = now + this.blockDurationMs;
    }

    this.entries.set(key, entry);
  }

  reset(key: string): void {
    this.entries.delete(key);
  }
}
