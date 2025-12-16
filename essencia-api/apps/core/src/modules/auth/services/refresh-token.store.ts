import { Inject, Injectable } from '@nestjs/common';
import { DB, DrizzleDB, refreshTokens } from '@app/database';
import { and, eq, desc, isNull, inArray } from 'drizzle-orm';

@Injectable()
export class RefreshTokenStore {
  private readonly maxTokensPerUser = 5;
  private readonly tokenTtlMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async store(userId: string, token: string, tenantId: string): Promise<void> {
    const expiresAt = new Date(Date.now() + this.tokenTtlMs);

    await this.db.insert(refreshTokens).values({
      userId,
      tenantId,
      token,
      expiresAt,
    });

    // Enforce max tokens per user (keep most recent)
    const tokens = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .orderBy(desc(refreshTokens.createdAt));

    if (tokens.length > this.maxTokensPerUser) {
      const toRemove = tokens.slice(this.maxTokensPerUser);
      const ids = toRemove.map((t) => t.id);
      await this.db.delete(refreshTokens).where(inArray(refreshTokens.id, ids as string[]));
    }
  }

  async validate(userId: string, token: string): Promise<boolean> {
    const now = new Date();
    const result = await this.db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.userId, userId),
          eq(refreshTokens.token, token),
          isNull(refreshTokens.revokedAt),
        ),
      )
      .limit(1);

    const match = result[0];
    if (!match) return false;
    return match.expiresAt > now;
  }

  async invalidate(userId: string, token: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), eq(refreshTokens.token, token)));
  }

  async invalidateAll(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  }
}
