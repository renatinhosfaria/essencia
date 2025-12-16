import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtTokenService } from './../src/auth/token.service';
import { UsersService } from './../src/users/users.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as Record<string, unknown>;

        if (body.status !== 'ok') {
          throw new Error('Expected status="ok"');
        }
        if (typeof body.timestamp !== 'string') {
          throw new Error('Expected timestamp to be a string');
        }
        if (typeof body.version !== 'string') {
          throw new Error('Expected version to be a string');
        }
      });
  });

  const hasDbConfigured = Boolean(
    process.env.DATABASE_URL || process.env.DATABASE_MIGRATIONS_URL,
  );

  const hasStorageConfigured = Boolean(
    process.env.STORAGE_ENDPOINT &&
    process.env.STORAGE_ACCESS_KEY &&
    process.env.STORAGE_SECRET_KEY,
  );

  const TENANT_ID = '3f4a7b2d-1b2c-4d6f-9c0e-5f3d1c9a7b2d';
  const TENANT_SLUG = 'essencia-feliz';
  let tenantSeeded = false;

  const ensureTenantSeeded = () => {
    if (tenantSeeded) {
      return;
    }

    const seedScriptPath = join(
      __dirname,
      '..',
      'scripts',
      'seed-first-tenant.mjs',
    );

    execFileSync(process.execPath, [seedScriptPath], {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
      env: process.env,
    });

    tenantSeeded = true;
  };

  const createUser = async (
    usersService: UsersService,
    overrides: Partial<{
      email: string;
      password: string;
      name: string;
      phone: string | null;
      role: string;
      status: string;
      tenantId: string;
    }> = {},
  ) => {
    const email =
      overrides.email ?? `user-${Date.now()}-${Math.random()}@example.com`;
    const password = overrides.password ?? 'P@ssw0rd!';

    const user = await usersService.create({
      tenantId: overrides.tenantId ?? TENANT_ID,
      email,
      password,
      name: overrides.name ?? 'Test User',
      phone: overrides.phone ?? null,
      role: overrides.role ?? 'admin',
      status: overrides.status ?? 'active',
    });

    return { user, password };
  };

  const loginAndGetAccessToken = async (
    appInstance: INestApplication<App>,
    email: string,
    password: string,
  ) => {
    const res = await request(appInstance.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
        tenantSlug: TENANT_SLUG,
      })
      .expect(201);

    const body = res.body as { accessToken?: string };
    if (!body.accessToken) {
      throw new Error('Login did not return accessToken');
    }

    return body.accessToken;
  };

  (hasDbConfigured ? it : it.skip)(
    '/tenants/essencia-feliz (GET)',
    async () => {
      const seedScriptPath = join(
        __dirname,
        '..',
        'scripts',
        'seed-first-tenant.mjs',
      );

      execFileSync(process.execPath, [seedScriptPath], {
        cwd: join(__dirname, '..'),
        stdio: 'inherit',
        env: process.env,
      });

      const res = await request(app.getHttpServer())
        .get('/tenants/essencia-feliz')
        .expect(200);

      const body = res.body as Record<string, unknown>;
      if (body.slug !== 'essencia-feliz') {
        throw new Error('Expected slug="essencia-feliz"');
      }
      if (body.name !== 'Colégio Essência Feliz') {
        throw new Error('Expected name="Colégio Essência Feliz"');
      }

      const settings = body.settings as Record<string, unknown>;
      if (settings?.timezone !== 'America/Sao_Paulo') {
        throw new Error('Expected settings.timezone="America/Sao_Paulo"');
      }
      if (settings?.locale !== 'pt-BR') {
        throw new Error('Expected settings.locale="pt-BR"');
      }
    },
  );

  (hasDbConfigured ? describe : describe.skip)('Users profile (e2e)', () => {
    beforeAll(() => {
      ensureTenantSeeded();
    });

    it('GET /users/me retorna perfil do usuário autenticado', async () => {
      const usersService = app.get(UsersService);
      const { user, password } = await createUser(usersService);

      const accessToken = await loginAndGetAccessToken(
        app,
        user.email,
        password,
      );

      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toMatchObject({
        id: user.id,
        tenantId: TENANT_ID,
        email: user.email,
        name: user.name,
        phone: null,
        role: user.role,
        status: user.status,
      });
    });

    it('PATCH /users/me atualiza nome e phone', async () => {
      const usersService = app.get(UsersService);
      const { user, password } = await createUser(usersService, {
        phone: null,
        name: 'Old Name',
      });

      const accessToken = await loginAndGetAccessToken(
        app,
        user.email,
        password,
      );

      const updateRes = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name', phone: '+55 11 99999-9999' })
        .expect(200);

      expect(updateRes.body).toMatchObject({
        name: 'New Name',
        phone: '+55 11 99999-9999',
      });

      const res = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toMatchObject({
        name: 'New Name',
        phone: '+55 11 99999-9999',
      });
    });

    it('PATCH /users/me rejeita campos inválidos', async () => {
      const usersService = app.get(UsersService);
      const { user, password } = await createUser(usersService);

      const accessToken = await loginAndGetAccessToken(
        app,
        user.email,
        password,
      );

      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ phone: 'abc' })
        .expect(400);

      await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: 'hack@example.com' })
        .expect(400);
    });

    it('GET /users/me recusa usuário inativo', async () => {
      const usersService = app.get(UsersService);
      const tokenService = app.get(JwtTokenService);

      const { user } = await createUser(usersService, { status: 'inactive' });

      const accessToken = tokenService.createAccessToken({
        userId: user.id,
        tenantId: TENANT_ID,
        role: user.role,
      });

      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401);
    });

    (hasStorageConfigured ? it : it.skip)(
      'POST /users/me/avatar faz upload com sucesso',
      async () => {
        const usersService = app.get(UsersService);
        const { user, password } = await createUser(usersService);

        const accessToken = await loginAndGetAccessToken(
          app,
          user.email,
          password,
        );

        // Create a tiny 1x1 PNG image (smallest valid PNG)
        const pngBuffer = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64',
        );

        const uploadRes = await request(app.getHttpServer())
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('avatar', pngBuffer, 'test.png')
          .expect(200);

        expect(uploadRes.body).toHaveProperty('avatarUrl');
        expect(uploadRes.body.avatarUrl).toContain(
          `${TENANT_ID}/avatars/${user.id}/`,
        );
        expect(uploadRes.body.avatarUrl).toMatch(/\.jpg$/);

        // Verify profile shows avatar
        const profileRes = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(profileRes.body.avatarUrl).toBe(uploadRes.body.avatarUrl);
      },
    );

    (hasStorageConfigured ? it : it.skip)(
      'POST /users/me/avatar rejeita arquivo sem imagem',
      async () => {
        const usersService = app.get(UsersService);
        const { user, password } = await createUser(usersService);

        const accessToken = await loginAndGetAccessToken(
          app,
          user.email,
          password,
        );

        const textBuffer = Buffer.from('not an image');

        await request(app.getHttpServer())
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('avatar', textBuffer, 'test.txt')
          .expect(400);
      },
    );

    (hasStorageConfigured ? it : it.skip)(
      'POST /users/me/avatar rejeita arquivo muito grande',
      async () => {
        const usersService = app.get(UsersService);
        const { user, password } = await createUser(usersService);

        const accessToken = await loginAndGetAccessToken(
          app,
          user.email,
          password,
        );

        // Create a buffer larger than 5MB
        const largeBuffer = Buffer.alloc(6 * 1024 * 1024);

        await request(app.getHttpServer())
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('avatar', largeBuffer, 'large.jpg')
          .expect(413);
      },
    );

    (hasStorageConfigured ? it : it.skip)(
      'POST /users/me/avatar substitui avatar antigo',
      async () => {
        const usersService = app.get(UsersService);
        const { user, password } = await createUser(usersService);

        const accessToken = await loginAndGetAccessToken(
          app,
          user.email,
          password,
        );

        const pngBuffer = Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          'base64',
        );

        // Upload first avatar
        const firstUpload = await request(app.getHttpServer())
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('avatar', pngBuffer, 'first.png')
          .expect(200);

        const firstUrl = firstUpload.body.avatarUrl as string;

        // Upload second avatar
        const secondUpload = await request(app.getHttpServer())
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('avatar', pngBuffer, 'second.png')
          .expect(200);

        const secondUrl = secondUpload.body.avatarUrl as string;

        // URLs should be different
        expect(firstUrl).not.toBe(secondUrl);

        // Profile should show second avatar
        const profileRes = await request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(profileRes.body.avatarUrl).toBe(secondUrl);
      },
    );
  });
});
