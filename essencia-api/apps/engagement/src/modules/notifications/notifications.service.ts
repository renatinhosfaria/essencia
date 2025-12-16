import { Injectable, Inject } from '@nestjs/common';
import { eq, and, sql, desc } from 'drizzle-orm';
import { DB, DrizzleDB, deviceTokens, notificationQueue } from '@app/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findAll(tenantId: string, userId: string, query?: any) {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(notificationQueue)
      .where(and(
        eq(notificationQueue.tenantId, tenantId),
        eq(notificationQueue.userId, userId)
      ))
      .orderBy(desc(notificationQueue.createdAt))
      .limit(query?.limit || 50);

    return result;
  }

  async registerDeviceToken(
    tenantId: string,
    userId: string,
    dto: {
      token: string;
      platform: 'ios' | 'android' | 'web';
      deviceId: string;
      deviceName?: string;
    },
  ) {
    await this.setTenantContext(tenantId);
    
    // Check if device already registered
    const existing = await this.db
      .select()
      .from(deviceTokens)
      .where(and(
        eq(deviceTokens.tenantId, tenantId),
        eq(deviceTokens.userId, userId),
        eq(deviceTokens.deviceId, dto.deviceId)
      ))
      .limit(1);

    if (existing[0]) {
      // Update existing token
      const [updated] = await this.db
        .update(deviceTokens)
        .set({
          token: dto.token,
          isActive: true,
          lastUsedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(deviceTokens.id, existing[0].id))
        .returning();

      return updated;
    }

    // Create new token
    const [token] = await this.db
      .insert(deviceTokens)
      .values({
        tenantId,
        userId,
        token: dto.token,
        platform: dto.platform,
        deviceId: dto.deviceId,
        deviceName: dto.deviceName || null,
        isActive: true,
      })
      .returning();

    return token;
  }

  async removeDeviceToken(tenantId: string, userId: string, deviceId: string) {
    await this.setTenantContext(tenantId);
    
    await this.db
      .update(deviceTokens)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(
        eq(deviceTokens.tenantId, tenantId),
        eq(deviceTokens.userId, userId),
        eq(deviceTokens.deviceId, deviceId)
      ));

    return { removed: true };
  }

  async queueNotification(
    tenantId: string,
    dto: {
      userId: string;
      title: string;
      body: string;
      data?: Record<string, unknown>;
    },
  ) {
    await this.setTenantContext(tenantId);
    
    const [notification] = await this.db
      .insert(notificationQueue)
      .values({
        tenantId,
        userId: dto.userId,
        title: dto.title,
        body: dto.body,
        data: dto.data || {},
        status: 'pending',
        priority: 'normal',
      })
      .returning();

    // In production, this would trigger a background job to send the notification
    // For now, we just queue it

    return notification;
  }

  async getUserDeviceTokens(tenantId: string, userId: string) {
    await this.setTenantContext(tenantId);
    
    const result = await this.db
      .select()
      .from(deviceTokens)
      .where(and(
        eq(deviceTokens.tenantId, tenantId),
        eq(deviceTokens.userId, userId),
        eq(deviceTokens.isActive, true)
      ));

    return result;
  }

  private async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }
}
