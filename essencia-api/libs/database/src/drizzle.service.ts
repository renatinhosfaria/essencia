import { Inject, Injectable } from '@nestjs/common';
import { eq, SQL, sql } from 'drizzle-orm';
import { DB, DrizzleDB } from './drizzle.tokens';

@Injectable()
export class DrizzleService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  get database(): DrizzleDB {
    return this.db;
  }

  /**
   * Set tenant context for RLS
   */
  async setTenantContext(tenantId: string): Promise<void> {
    await this.db.execute(
      sql`SELECT set_config('app.tenant_id', ${tenantId}, false)`,
    );
  }

  /**
   * Clear tenant context
   */
  async clearTenantContext(): Promise<void> {
    await this.db.execute(sql`SELECT set_config('app.tenant_id', '', false)`);
  }

  /**
   * Execute query with tenant context
   */
  async withTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    await this.setTenantContext(tenantId);
    try {
      return await fn();
    } finally {
      await this.clearTenantContext();
    }
  }

  /**
   * Build tenant filter condition
   */
  tenantFilter(table: { tenantId: any }, tenantId: string): SQL {
    return eq(table.tenantId, tenantId);
  }
}
