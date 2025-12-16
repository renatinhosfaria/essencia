import { Inject, Injectable } from '@nestjs/common';
import { DB, DrizzleDB, auditLogs } from '@app/database';

export interface AuditLogEntry {
  tenantId?: string;
  userId?: string;
  event: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.db.insert(auditLogs).values({
      tenantId: entry.tenantId || null,
      userId: entry.userId || null,
      event: entry.event,
      ip: entry.ip || null,
      userAgent: entry.userAgent || null,
      metadata: entry.metadata || {},
    });
  }
}
