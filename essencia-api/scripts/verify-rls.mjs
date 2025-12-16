import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const { Client } = pg;

const appUrl = process.env.DATABASE_URL;
const migrationsUrl = process.env.DATABASE_MIGRATIONS_URL;

if (!appUrl) {
  // eslint-disable-next-line no-console
  console.error('DATABASE_URL is required for RLS verification (app role).');
  process.exit(1);
}

if (!migrationsUrl) {
  // eslint-disable-next-line no-console
  console.error(
    'DATABASE_MIGRATIONS_URL is required for RLS verification (admin role).',
  );
  process.exit(1);
}

const slug = `temp-rls-check-${Date.now()}`;
const tempId = randomUUID();

const admin = new Client({ connectionString: migrationsUrl });
const app = new Client({ connectionString: appUrl });

let insertedTenantId;

try {
  await admin.connect();
  await app.connect();

  const adminIdentity = await admin.query(
    "select current_user as u, session_user as su, (current_user::text = any(array['postgres','essencia_migrations'])) as allowed",
  );
  // eslint-disable-next-line no-console
  console.log('admin identity:', adminIdentity.rows[0]);

  await admin.query('begin');

  await admin.query(
    `insert into tenants (id, name, slug, settings)
     values ($2::uuid, 'Temp RLS Check', $1, '{}'::jsonb)`,
    [slug, tempId],
  );

  insertedTenantId = tempId;

  // Make the row visible for the app connection.
  await admin.query('commit');

  // 1) Direct select without tenant context must return empty
  const directNoContext = await app.query(
    'select id from tenants where slug = $1 limit 1',
    [slug],
  );
  if (directNoContext.rowCount !== 0) {
    throw new Error(
      'RLS check failed: direct select returned rows without tenant context.',
    );
  }

  // 2) SECURITY DEFINER helper should still be able to fetch by slug
  const viaHelper = await app.query(
    'select id from get_tenant_by_slug($1) limit 1',
    [slug],
  );
  if (viaHelper.rowCount !== 1) {
    throw new Error(
      'RLS helper check failed: get_tenant_by_slug did not return the row.',
    );
  }

  // 3) With tenant context set, select-by-id should return the row
  await app.query("select set_config('app.tenant_id', $1, false)", [
    insertedTenantId,
  ]);

  const directWithContext = await app.query(
    'select id from tenants where id = $1 limit 1',
    [insertedTenantId],
  );
  if (directWithContext.rowCount !== 1) {
    throw new Error(
      'RLS check failed: direct select did not return row after setting tenant context.',
    );
  }

  await admin.query('begin');
  await admin.query('delete from tenants where slug = $1', [slug]);
  await admin.query('commit');

  // eslint-disable-next-line no-console
  console.log('✅ RLS verification passed.');
} catch (err) {
  try {
    await admin.query('rollback');
  } catch {
    // ignore
  }

  // eslint-disable-next-line no-console
  console.error('❌ RLS verification failed:', err);
  process.exitCode = 1;
} finally {
  await app.end();
  await admin.end();
}
