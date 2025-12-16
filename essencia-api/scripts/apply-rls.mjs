import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const databaseUrl =
  process.env.DATABASE_MIGRATIONS_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  // eslint-disable-next-line no-console
  console.error(
    'DATABASE_MIGRATIONS_URL (or DATABASE_URL) is required to apply RLS policies.',
  );
  process.exit(1);
}

// Helper function to generate RLS policies for a tenant-scoped table
function generateTenantRLS(tableName) {
  return `
  DO $$
  BEGIN
    IF to_regclass('public.${tableName}') IS NOT NULL THEN
      ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
      ALTER TABLE ${tableName} FORCE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS ${tableName}_select_tenant ON ${tableName};
      CREATE POLICY ${tableName}_select_tenant ON ${tableName}
        FOR SELECT
        USING (tenant_id = current_tenant_id());

      DROP POLICY IF EXISTS ${tableName}_insert_tenant ON ${tableName};
      CREATE POLICY ${tableName}_insert_tenant ON ${tableName}
        FOR INSERT
        WITH CHECK (tenant_id = current_tenant_id());

      DROP POLICY IF EXISTS ${tableName}_update_tenant ON ${tableName};
      CREATE POLICY ${tableName}_update_tenant ON ${tableName}
        FOR UPDATE
        USING (tenant_id = current_tenant_id())
        WITH CHECK (tenant_id = current_tenant_id());

      DROP POLICY IF EXISTS ${tableName}_delete_tenant ON ${tableName};
      CREATE POLICY ${tableName}_delete_tenant ON ${tableName}
        FOR DELETE
        USING (tenant_id = current_tenant_id());
    END IF;
  END $$;`;
}

// All tenant-scoped tables that need RLS
const tenantTables = [
  'users',
  'classes',
  'students',
  'student_guardians',
  'class_teachers',
  'diary_entries',
  'conversations',
  'messages',
  'announcements',
  'announcement_reads',
  'gallery_posts',
  'gallery_post_students',
  'device_tokens',
  'notification_queue',
  'notification_settings',
  'user_notification_preferences',
  'roles',
  'permissions',
  'user_roles',
  'audit_logs',
  'invitations',
  'password_reset_tokens',
];

const sqlStatements = [
  // Tenant context function
  `CREATE OR REPLACE FUNCTION current_tenant_id()
   RETURNS uuid
   LANGUAGE sql
   STABLE
   AS $$
     SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid;
   $$;`,

  // RLS for tenants
  'ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;',
  'ALTER TABLE tenants NO FORCE ROW LEVEL SECURITY;',

  // Recreate policies (idempotent)
  'DROP POLICY IF EXISTS tenants_select_isolated ON tenants;',
  'CREATE POLICY tenants_select_isolated ON tenants FOR SELECT USING (id = current_tenant_id());',

  // Allow platform-level writes (seed/admin workflows) without needing tenant context
  'DROP POLICY IF EXISTS tenants_insert_platform ON tenants;',
  "CREATE POLICY tenants_insert_platform ON tenants FOR INSERT WITH CHECK (current_user::text IN ('postgres', 'essencia_migrations'));",

  'DROP POLICY IF EXISTS tenants_update_platform ON tenants;',
  "CREATE POLICY tenants_update_platform ON tenants FOR UPDATE USING (current_user::text IN ('postgres', 'essencia_migrations')) WITH CHECK (current_user::text IN ('postgres', 'essencia_migrations'));",

  'DROP POLICY IF EXISTS tenants_delete_platform ON tenants;',
  "CREATE POLICY tenants_delete_platform ON tenants FOR DELETE USING (current_user::text IN ('postgres', 'essencia_migrations'));",

  // Helper for platform lookups without weakening the RLS policy itself.
  // SECURITY DEFINER runs with the owner privileges (recommended to run with a migration/superuser role).
  'DROP FUNCTION IF EXISTS get_tenant_by_slug(text);',
  `CREATE FUNCTION get_tenant_by_slug(p_slug text)
   RETURNS TABLE(
     id uuid,
     name text,
     slug text,
     settings jsonb,
     created_at timestamptz,
     updated_at timestamptz
   )
   LANGUAGE sql
   STABLE
   SECURITY DEFINER
   SET search_path = public
   AS $$
     SELECT t.id, t.name, t.slug, t.settings, t.created_at, t.updated_at
     FROM tenants t
     WHERE t.slug = p_slug
     LIMIT 1;
   $$;`,
  'REVOKE ALL ON FUNCTION get_tenant_by_slug(text) FROM PUBLIC;',
  'GRANT EXECUTE ON FUNCTION get_tenant_by_slug(text) TO essencia_app;',
  'GRANT EXECUTE ON FUNCTION get_tenant_by_slug(text) TO essencia_migrations;',

  // Generate RLS for all tenant-scoped tables
  ...tenantTables.map(generateTenantRLS),
];

const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query('begin');

  for (const statement of sqlStatements) {
    await client.query(statement);
  }

  await client.query('commit');
  // eslint-disable-next-line no-console
  console.log('RLS applied successfully.');
} catch (err) {
  await client.query('rollback');
  // eslint-disable-next-line no-console
  console.error('Failed to apply RLS:', err);
  process.exitCode = 1;
} finally {
  await client.end();
}
