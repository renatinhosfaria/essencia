import * as argon2 from 'argon2';
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const migrationsUrl =
  process.env.DATABASE_MIGRATIONS_URL ?? process.env.DATABASE_URL;

if (!migrationsUrl) {
  console.error(
    'DATABASE_MIGRATIONS_URL (or DATABASE_URL) is required to seed the database.',
  );
  process.exit(1);
}

// Fixed UUIDs for reproducibility
const TENANT_ID = '3f4a7b2d-1b2c-4d6f-9c0e-5f3d1c9a7b2d';

// Users
const ADMIN_ID = 'a1b2c3d4-1111-4000-8000-000000000001';
const TEACHER_CARLA_ID = 'a1b2c3d4-2222-4000-8000-000000000002';
const TEACHER_MARIA_ID = 'a1b2c3d4-2222-4000-8000-000000000003';
const GUARDIAN_MARINA_ID = 'a1b2c3d4-3333-4000-8000-000000000004';
const GUARDIAN_JOAO_ID = 'a1b2c3d4-3333-4000-8000-000000000005';
const SECRETARY_ANA_ID = 'a1b2c3d4-4444-4000-8000-000000000006';

// Classes
const CLASS_MATERNAL_ID = 'b1b2c3d4-1111-4000-8000-000000000001';
const CLASS_INFANTIL_ID = 'b1b2c3d4-1111-4000-8000-000000000002';
const CLASS_FUND_ID = 'b1b2c3d4-1111-4000-8000-000000000003';

// Students
const STUDENT_LUCAS_ID = 'c1b2c3d4-1111-4000-8000-000000000001';
const STUDENT_PEDRO_ID = 'c1b2c3d4-1111-4000-8000-000000000002';
const STUDENT_MIGUEL_ID = 'c1b2c3d4-1111-4000-8000-000000000003';
const STUDENT_SOFIA_ID = 'c1b2c3d4-1111-4000-8000-000000000004';
const STUDENT_ANA_ID = 'c1b2c3d4-1111-4000-8000-000000000005';

async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

const client = new Client({ connectionString: migrationsUrl });

try {
  await client.connect();
  await client.query('begin');

  console.log('🌱 Seeding demo data for Essencia...');

  // 1. Seed tenant (upsert)
  await client.query(
    `INSERT INTO tenants (id, name, slug, settings)
     VALUES ($1::uuid, $2, $3, $4::jsonb)
     ON CONFLICT (slug) DO UPDATE
       SET name = excluded.name,
           settings = excluded.settings,
           updated_at = now()`,
    [
      TENANT_ID,
      'Colégio Essência Feliz',
      'essencia-feliz',
      JSON.stringify({ timezone: 'America/Sao_Paulo', locale: 'pt-BR' }),
    ],
  );
  console.log('✓ Tenant seeded');

  // RLS requires an explicit tenant context for tenant-scoped tables.
  await client.query("select set_config('app.tenant_id', $1, false)", [TENANT_ID]);

  // 2. Seed users
  const defaultPassword = await hashPassword('demo123');

  const users = [
    {
      id: ADMIN_ID,
      email: 'daviane@essenciafeliz.com.br',
      name: 'Daviane (Diretora)',
      role: 'admin',
    },
    {
      id: SECRETARY_ANA_ID,
      email: 'ana@essenciafeliz.com.br',
      name: 'Ana (Secretária)',
      role: 'staff',
    },
    {
      id: TEACHER_CARLA_ID,
      email: 'carla@essenciafeliz.com.br',
      name: 'Prof. Carla',
      role: 'teacher',
    },
    {
      id: TEACHER_MARIA_ID,
      email: 'maria@essenciafeliz.com.br',
      name: 'Prof. Maria',
      role: 'teacher',
    },
    {
      id: GUARDIAN_MARINA_ID,
      email: 'marina@email.com',
      name: 'Marina Santos',
      role: 'guardian',
      phone: '(34) 99999-1111',
    },
    {
      id: GUARDIAN_JOAO_ID,
      email: 'joao@email.com',
      name: 'Seu João',
      role: 'guardian',
      phone: '(34) 99999-2222',
    },
  ];

  for (const user of users) {
    await client.query(
      `INSERT INTO users (id, tenant_id, email, password_hash, name, role, phone, status)
       VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, 'active')
       ON CONFLICT (tenant_id, email) DO UPDATE
         SET name = excluded.name,
             role = excluded.role,
             phone = excluded.phone,
             updated_at = now()`,
      [
        user.id,
        TENANT_ID,
        user.email,
        defaultPassword,
        user.name,
        user.role,
        user.phone || null,
      ],
    );
  }
  console.log('✓ Users seeded (password: demo123)');

  // 3. Seed classes
  const classes = [
    {
      id: CLASS_MATERNAL_ID,
      name: 'Maternal II - Manhã',
      grade: 'Maternal II',
      year: 2025,
      shift: 'morning',
    },
    {
      id: CLASS_INFANTIL_ID,
      name: 'Infantil I - Tarde',
      grade: 'Infantil I',
      year: 2025,
      shift: 'afternoon',
    },
    {
      id: CLASS_FUND_ID,
      name: '3º Ano - Manhã',
      grade: '3º Ano',
      year: 2025,
      shift: 'morning',
    },
  ];

  for (const cls of classes) {
    await client.query(
      `INSERT INTO classes (id, tenant_id, name, grade, year, shift, status)
       VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'active')
       ON CONFLICT (id) DO UPDATE
         SET name = excluded.name,
             grade = excluded.grade,
             year = excluded.year,
             shift = excluded.shift,
             updated_at = now()`,
      [cls.id, TENANT_ID, cls.name, cls.grade, cls.year, cls.shift],
    );
  }
  console.log('✓ Classes seeded');

  // 4. Seed class-teacher assignments
  const classTeachers = [
    {
      classId: CLASS_MATERNAL_ID,
      teacherId: TEACHER_CARLA_ID,
      isPrimary: 'true',
    },
    {
      classId: CLASS_INFANTIL_ID,
      teacherId: TEACHER_CARLA_ID,
      isPrimary: 'true',
    },
    { classId: CLASS_FUND_ID, teacherId: TEACHER_MARIA_ID, isPrimary: 'true' },
  ];

  for (const ct of classTeachers) {
    await client.query(
      `INSERT INTO class_teachers (id, tenant_id, class_id, teacher_id, is_primary)
       VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4)
       ON CONFLICT (class_id, teacher_id) DO UPDATE
         SET is_primary = excluded.is_primary`,
      [TENANT_ID, ct.classId, ct.teacherId, ct.isPrimary],
    );
  }
  console.log('✓ Class-teacher assignments seeded');

  // 5. Seed students
  const studentsData = [
    {
      id: STUDENT_LUCAS_ID,
      name: 'Lucas Silva',
      birthDate: '2019-03-15',
      classId: CLASS_MATERNAL_ID,
    },
    {
      id: STUDENT_PEDRO_ID,
      name: 'Pedro Santos',
      birthDate: '2015-07-22',
      classId: CLASS_FUND_ID,
    },
    {
      id: STUDENT_MIGUEL_ID,
      name: 'Miguel Oliveira',
      birthDate: '2016-11-08',
      classId: CLASS_FUND_ID,
    },
    {
      id: STUDENT_SOFIA_ID,
      name: 'Sofia Lima',
      birthDate: '2020-01-30',
      classId: CLASS_INFANTIL_ID,
    },
    {
      id: STUDENT_ANA_ID,
      name: 'Ana Clara Costa',
      birthDate: '2019-05-12',
      classId: CLASS_MATERNAL_ID,
    },
  ];

  for (const student of studentsData) {
    await client.query(
      `INSERT INTO students (id, tenant_id, class_id, name, birth_date, status)
       VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, 'active')
       ON CONFLICT (id) DO UPDATE
         SET name = excluded.name,
             class_id = excluded.class_id,
             birth_date = excluded.birth_date,
             updated_at = now()`,
      [student.id, TENANT_ID, student.classId, student.name, student.birthDate],
    );
  }
  console.log('✓ Students seeded');

  // 6. Seed student-guardian relationships
  const guardianLinks = [
    // Marina é mãe de Lucas e Pedro
    {
      studentId: STUDENT_LUCAS_ID,
      guardianId: GUARDIAN_MARINA_ID,
      relationship: 'mother',
      isPrimary: 'true',
    },
    {
      studentId: STUDENT_PEDRO_ID,
      guardianId: GUARDIAN_MARINA_ID,
      relationship: 'mother',
      isPrimary: 'true',
    },
    // Seu João é avô de Miguel
    {
      studentId: STUDENT_MIGUEL_ID,
      guardianId: GUARDIAN_JOAO_ID,
      relationship: 'grandparent',
      isPrimary: 'true',
    },
  ];

  for (const link of guardianLinks) {
    await client.query(
      `INSERT INTO student_guardians (id, tenant_id, student_id, guardian_id, relationship, is_primary, can_pickup)
       VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4, $5, 'true')
       ON CONFLICT (student_id, guardian_id) DO UPDATE
         SET relationship = excluded.relationship,
             is_primary = excluded.is_primary`,
      [
        TENANT_ID,
        link.studentId,
        link.guardianId,
        link.relationship,
        link.isPrimary,
      ],
    );
  }
  console.log('✓ Student-guardian relationships seeded');

  // 7. Seed diary entries (today and yesterday)
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const diaryEntries = [
    // Lucas - hoje
    {
      studentId: STUDENT_LUCAS_ID,
      classId: CLASS_MATERNAL_ID,
      date: today,
      mood: 'happy',
      meals: { breakfast: 'full', lunch: 'full', snack: 'partial' },
      napMinutes: 90,
      activities: ['pintura', 'parquinho', 'música'],
      observations:
        'Lucas participou muito na aula de matemática! Ganhou medalha de destaque.',
      createdBy: TEACHER_CARLA_ID,
    },
    // Lucas - ontem
    {
      studentId: STUDENT_LUCAS_ID,
      classId: CLASS_MATERNAL_ID,
      date: yesterday,
      mood: 'calm',
      meals: { breakfast: 'full', lunch: 'partial', snack: 'full' },
      napMinutes: 60,
      activities: ['leitura', 'brincadeira livre'],
      observations: 'Dia tranquilo. Lucas estava um pouco sonolento.',
      createdBy: TEACHER_CARLA_ID,
    },
    // Pedro - hoje
    {
      studentId: STUDENT_PEDRO_ID,
      classId: CLASS_FUND_ID,
      date: today,
      mood: 'happy',
      meals: { lunch: 'full', snack: 'full' },
      napMinutes: null,
      activities: ['matemática', 'educação física', 'inglês'],
      observations: 'Excelente participação na aula de matemática!',
      createdBy: TEACHER_MARIA_ID,
    },
    // Miguel - hoje
    {
      studentId: STUDENT_MIGUEL_ID,
      classId: CLASS_FUND_ID,
      date: today,
      mood: 'calm',
      meals: { lunch: 'partial', snack: 'full' },
      napMinutes: null,
      activities: ['matemática', 'educação física', 'inglês'],
      observations: 'Miguel está progredindo muito bem na leitura.',
      createdBy: TEACHER_MARIA_ID,
    },
  ];

  for (const entry of diaryEntries) {
    await client.query(
      `INSERT INTO diary_entries (id, tenant_id, student_id, class_id, date, mood, meals, nap_minutes, activities, observations, created_by)
       VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4, $5, $6::jsonb, $7, $8::jsonb, $9, $10::uuid)
       ON CONFLICT (student_id, date) DO UPDATE
         SET mood = excluded.mood,
             meals = excluded.meals,
             nap_minutes = excluded.nap_minutes,
             activities = excluded.activities,
             observations = excluded.observations,
             updated_at = now()`,
      [
        TENANT_ID,
        entry.studentId,
        entry.classId,
        entry.date,
        entry.mood,
        JSON.stringify(entry.meals),
        entry.napMinutes,
        JSON.stringify(entry.activities),
        entry.observations,
        entry.createdBy,
      ],
    );
  }
  console.log('✓ Diary entries seeded');

  await client.query('commit');

  console.log('\n🎉 Demo data seeded successfully!\n');
  console.log('📋 Login credentials (password: demo123):');
  console.log('   Admin:    daviane@essenciafeliz.com.br');
  console.log('   Teacher:  carla@essenciafeliz.com.br');
  console.log('   Teacher:  maria@essenciafeliz.com.br');
  console.log('   Guardian: marina@email.com');
  console.log('   Guardian: joao@email.com');
  console.log('   Staff:    ana@essenciafeliz.com.br');
  console.log('\n🏫 Tenant slug: essencia-feliz');
} catch (err) {
  await client.query('rollback');
  console.error('❌ Failed to seed demo data:', err);
  process.exitCode = 1;
} finally {
  await client.end();
}
