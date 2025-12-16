import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const migrationsUrl =
  process.env.DATABASE_MIGRATIONS_URL ?? process.env.DATABASE_URL;

if (!migrationsUrl) {
  // eslint-disable-next-line no-console
  console.error(
    'DATABASE_MIGRATIONS_URL (or DATABASE_URL) is required to seed the database.',
  );
  process.exit(1);
}

const TENANT_ID = '3f4a7b2d-1b2c-4d6f-9c0e-5f3d1c9a7b2d';
const TENANT_SLUG = 'essencia-feliz';
const TENANT_NAME = 'Colégio Essência Feliz';
const TENANT_SETTINGS = {
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR',
};

const client = new Client({ connectionString: migrationsUrl });

try {
  await client.connect();
  await client.query('begin');

  await client.query(
    `insert into tenants (id, name, slug, settings)
     values ($1::uuid, $2, $3, $4::jsonb)
     on conflict (slug) do update
       set name = excluded.name,
           settings = excluded.settings,
           updated_at = now()`,
    [TENANT_ID, TENANT_NAME, TENANT_SLUG, JSON.stringify(TENANT_SETTINGS)],
  );

  await client.query('commit');

  // eslint-disable-next-line no-console
  console.log(`Seeded tenant: ${TENANT_NAME} (${TENANT_SLUG})`);
  // eslint-disable-next-line no-console
  console.log(`Fixed UUID: ${TENANT_ID}`);
} catch (err) {
  await client.query('rollback');
  // eslint-disable-next-line no-console
  console.error('Failed to seed tenant:', err);
  process.exitCode = 1;
} finally {
  await client.end();
}
