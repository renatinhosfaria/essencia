import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DB, DrizzleDB, tenants } from '@app/database';
import { v4 as uuidv4 } from 'uuid';

export interface TenantDto {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TenantsService {
  constructor(@Inject(DB) private readonly db: DrizzleDB) {}

  async findBySlug(slug: string): Promise<TenantDto | null> {
    const normalizedSlug = slug.trim().toLowerCase();

    const result = await this.db.execute(
      sql`SELECT * FROM get_tenant_by_slug(${normalizedSlug})`,
    );

    const row = (result as any).rows?.[0] as
      | {
          id: string;
          name: string;
          slug: string;
          settings: Record<string, unknown> | null;
          created_at: Date;
          updated_at: Date;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      settings: row.settings ?? {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(id: string): Promise<TenantDto | null> {
    const result = await this.db
      .select()
      .from(tenants)
      .where(eq(tenants.id, id))
      .limit(1);

    return (result[0] as TenantDto) || null;
  }

  async create(dto: { name: string; slug: string; settings?: any }): Promise<TenantDto> {
    const id = uuidv4();

    const [tenant] = await this.db
      .insert(tenants)
      .values({
        id,
        name: dto.name,
        slug: dto.slug.toLowerCase(),
        settings: dto.settings || {},
      })
      .returning();

    return tenant as TenantDto;
  }

  async update(id: string, dto: { name?: string; settings?: any }): Promise<TenantDto> {
    const [tenant] = await this.db
      .update(tenants)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, id))
      .returning();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant as TenantDto;
  }
}
