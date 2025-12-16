DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'essencia_app') THEN
    CREATE ROLE essencia_app LOGIN PASSWORD 'essencia_app';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'essencia_migrations') THEN
    CREATE ROLE essencia_migrations LOGIN PASSWORD 'essencia_migrations';
  END IF;
END $$;

GRANT CONNECT ON DATABASE essencia TO essencia_app;
GRANT CONNECT ON DATABASE essencia TO essencia_migrations;

\connect essencia

GRANT USAGE, CREATE ON SCHEMA public TO essencia_app;
GRANT USAGE, CREATE ON SCHEMA public TO essencia_migrations;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO essencia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO essencia_migrations;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO essencia_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO essencia_migrations;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO essencia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO essencia_migrations;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO essencia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO essencia_migrations;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO essencia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO essencia_migrations;

-- IMPORTANT: drizzle-kit will create objects as essencia_migrations,
-- so we must set default privileges for that object owner too.
ALTER DEFAULT PRIVILEGES FOR ROLE essencia_migrations IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO essencia_app;
ALTER DEFAULT PRIVILEGES FOR ROLE essencia_migrations IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO essencia_app;
ALTER DEFAULT PRIVILEGES FOR ROLE essencia_migrations IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO essencia_app;
