/**
 * Story 3-1: Seed Default Roles
 * Creates default roles with permissions for each tenant
 */

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import pg from 'pg';

const { Pool } = pg;

// Define minimal schema needed for seeding
const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull(),
  resource: text('resource').notNull(),
  action: text('action').notNull(),
  scope: text('scope').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const schema = { tenants, roles, permissions };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
});

const client = await pool.connect();
const db = drizzle(client, { schema });

async function seedRoles() {
  console.log('🌱 Seeding default roles...');

  // Get all tenants
  const tenants = await db.select().from(schema.tenants);

  console.log(`Found ${tenants.length} tenant(s)`);

  for (const tenant of tenants) {
    console.log(`\n📦 Seeding roles for tenant: ${tenant.name} (${tenant.id})`);

    // RLS requires an explicit tenant context for tenant-scoped tables.
    await client.query("select set_config('app.tenant_id', $1, false)", [
      tenant.id,
    ]);

    // Check if roles already exist
    const existingRoles = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.tenantId, tenant.id));

    if (existingRoles.length > 0) {
      console.log(
        `  ⏭️  Tenant ${tenant.name} already has ${existingRoles.length} roles. Skipping.`,
      );
      continue;
    }

    // Create roles
    const [adminRole] = await db
      .insert(schema.roles)
      .values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        name: 'admin',
        description: 'Administrador com acesso total ao sistema',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log(`  ✅ Created role: admin`);

    const [teacherRole] = await db
      .insert(schema.roles)
      .values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        name: 'teacher',
        description: 'Professor com acesso às turmas atribuídas',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log(`  ✅ Created role: teacher`);

    const [guardianRole] = await db
      .insert(schema.roles)
      .values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        name: 'guardian',
        description: 'Responsável com acesso aos próprios filhos',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log(`  ✅ Created role: guardian`);

    const [staffRole] = await db
      .insert(schema.roles)
      .values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        name: 'staff',
        description: 'Funcionário com acesso limitado',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    console.log(`  ✅ Created role: staff`);

    // Create permissions for admin (full access)
    const adminPermissions = [
      // Users
      { resource: 'users', action: 'create', scope: 'all' },
      { resource: 'users', action: 'read', scope: 'all' },
      { resource: 'users', action: 'update', scope: 'all' },
      { resource: 'users', action: 'delete', scope: 'all' },
      // Students
      { resource: 'students', action: 'create', scope: 'all' },
      { resource: 'students', action: 'read', scope: 'all' },
      { resource: 'students', action: 'update', scope: 'all' },
      { resource: 'students', action: 'delete', scope: 'all' },
      // Classes
      { resource: 'classes', action: 'create', scope: 'all' },
      { resource: 'classes', action: 'read', scope: 'all' },
      { resource: 'classes', action: 'update', scope: 'all' },
      { resource: 'classes', action: 'delete', scope: 'all' },
      // Diary
      { resource: 'diary', action: 'create', scope: 'all' },
      { resource: 'diary', action: 'read', scope: 'all' },
      { resource: 'diary', action: 'update', scope: 'all' },
      { resource: 'diary', action: 'delete', scope: 'all' },
      // Audit logs
      { resource: 'audit-logs', action: 'read', scope: 'all' },
    ];

    for (const perm of adminPermissions) {
      await db.insert(schema.permissions).values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        roleId: adminRole.id,
        resource: perm.resource,
        action: perm.action,
        scope: perm.scope,
        createdAt: new Date(),
      });
    }
    console.log(
      `  ✅ Created ${adminPermissions.length} permissions for admin`,
    );

    // Create permissions for teacher (assigned scope)
    const teacherPermissions = [
      { resource: 'students', action: 'read', scope: 'assigned' },
      { resource: 'students', action: 'update', scope: 'assigned' },
      { resource: 'classes', action: 'read', scope: 'assigned' },
      { resource: 'diary', action: 'create', scope: 'assigned' },
      { resource: 'diary', action: 'read', scope: 'assigned' },
      { resource: 'diary', action: 'update', scope: 'assigned' },
    ];

    for (const perm of teacherPermissions) {
      await db.insert(schema.permissions).values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        roleId: teacherRole.id,
        resource: perm.resource,
        action: perm.action,
        scope: perm.scope,
        createdAt: new Date(),
      });
    }
    console.log(
      `  ✅ Created ${teacherPermissions.length} permissions for teacher`,
    );

    // Create permissions for guardian (own scope)
    const guardianPermissions = [
      { resource: 'students', action: 'read', scope: 'own' },
      { resource: 'diary', action: 'read', scope: 'own' },
    ];

    for (const perm of guardianPermissions) {
      await db.insert(schema.permissions).values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        roleId: guardianRole.id,
        resource: perm.resource,
        action: perm.action,
        scope: perm.scope,
        createdAt: new Date(),
      });
    }
    console.log(
      `  ✅ Created ${guardianPermissions.length} permissions for guardian`,
    );

    // Create permissions for staff
    const staffPermissions = [
      { resource: 'students', action: 'create', scope: 'all' },
      { resource: 'students', action: 'read', scope: 'all' },
      { resource: 'students', action: 'update', scope: 'all' },
      { resource: 'classes', action: 'read', scope: 'all' },
    ];

    for (const perm of staffPermissions) {
      await db.insert(schema.permissions).values({
        id: crypto.randomUUID(),
        tenantId: tenant.id,
        roleId: staffRole.id,
        resource: perm.resource,
        action: perm.action,
        scope: perm.scope,
        createdAt: new Date(),
      });
    }
    console.log(
      `  ✅ Created ${staffPermissions.length} permissions for staff`,
    );
  }

  console.log('\n✨ Seed completed successfully!');
}

try {
  await seedRoles();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('❌ Seed failed:', err);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
