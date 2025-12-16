---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "docs/prd.md"
  - "docs/ux-design-specification.md"
  - "docs/analysis/product-brief-Essencia-2025-12-11.md"
workflowType: "architecture"
lastStep: 8
status: "complete"
completedAt: "2025-12-12"
project_name: "Essencia"
user_name: "Renato"
date: "2025-12-12"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

- **50 FRs** organizados em 10 categorias
- Multi-tenancy é fundacional (FR1-FR4) - não é feature, é arquitetura
- RBAC com 5 perfis distintos (Admin, Secretaria, Professor, Resp. Principal, Resp. Secundário)
- Real-time chat obrigatório com status de leitura (FR23)
- Push notifications críticas para engajamento (FR39-42)

**Non-Functional Requirements:**

- **35 NFRs** com targets específicos e mensuráveis
- Performance: API < 500ms, WebSocket < 2s, Push < 5s
- Security: RLS obrigatório, LGPD compliance, dados de menores
- Scalability: 100 → 10.000 users, 1 → 100+ tenants
- Reliability: 99.5% uptime, RTO < 4h, RPO < 1h

**Scale & Complexity:**

- Primary domain: EdTech SaaS (B2B2C)
- Complexity level: **Alta** - Multi-tenant + Real-time + Mobile Nativo
- Architectural components: 3 microserviços MVP + Landing + Mobile Apps
- Timeline pressure: 1 semana para demo funcional

### Technical Constraints & Dependencies

| Constraint               | Impacto                                   |
| ------------------------ | ----------------------------------------- |
| **Solo developer**       | Precisa de alto nível de abstração (BaaS) |
| **1 week timeline**      | Frameworks com multi-tenant built-in      |
| **Multi-tenant Day 1**   | RLS no PostgreSQL, não pode ser retrofit  |
| **Android 8+ / iOS 13+** | Expo SDK 50+                              |
| **LGPD**                 | Audit trail, consent, soft delete         |

### Cross-Cutting Concerns Identified

| Concern                      | Afeta              | Decisão Necessária                              |
| ---------------------------- | ------------------ | ----------------------------------------------- |
| **Tenant Propagation**       | Todos os serviços  | tenant_id em JWT, headers, e database queries   |
| **Unified Auth**             | Mobile, Web, Admin | Single auth service com refresh tokens          |
| **Real-time Infrastructure** | Chat, Notificações | WebSockets + Redis pub/sub                      |
| **Media Pipeline**           | Diário, Mural      | Upload → resize → CDN → tenant-isolated storage |
| **Observability**            | Todos os serviços  | Logs com tenant_id, correlation_id, user_id     |
| **Error Boundaries**         | Frontend + Backend | Padrão consistente de erro em todas as APIs     |

---

## Stack Selection

### Technology Domain

**Enterprise Full-Stack SaaS** com controle total sobre infraestrutura e código.

### Selected Stack

#### Frontend (Web Admin + Landing)

| Tecnologia         | Versão            | Uso                     |
| ------------------ | ----------------- | ----------------------- |
| **Next.js**        | 15.x (App Router) | Framework web, SSR/SSG  |
| **React**          | 19.x              | UI library              |
| **TypeScript**     | 5.x               | Type safety             |
| **Tailwind CSS**   | 4.x               | Styling utility-first   |
| **shadcn/ui**      | Latest            | Component library       |
| **TanStack Query** | 5.x               | Server state management |
| **Vitest**         | Latest            | Unit testing            |
| **Playwright**     | Latest            | E2E testing             |
| **ESLint + Biome** | Latest            | Linting + formatting    |

#### Backend (API Services)

| Tecnologia          | Versão | Uso                      |
| ------------------- | ------ | ------------------------ |
| **NestJS**          | 10.x   | Framework API            |
| **TypeScript**      | 5.x    | Type safety              |
| **OpenAPI/Swagger** | 3.x    | API documentation        |
| **PostgreSQL**      | 16.x   | Primary database         |
| **Redis**           | 7.x    | Cache, sessions, pub/sub |
| **OpenTelemetry**   | Latest | Observability            |

#### Mobile (React Native)

| Tecnologia         | Versão | Uso                  |
| ------------------ | ------ | -------------------- |
| **React Native**   | 0.76.x | Mobile framework     |
| **Expo**           | SDK 52 | Development workflow |
| **Tamagui**        | 1.x    | Cross-platform UI    |
| **expo-router**    | 4.x    | File-based routing   |
| **TanStack Query** | 5.x    | Server state         |

#### Infrastructure

| Tecnologia         | Uso                    |
| ------------------ | ---------------------- |
| **Docker**         | Containerização        |
| **Kubernetes**     | Orchestration          |
| **Terraform**      | Infrastructure as Code |
| **GitHub Actions** | CI/CD                  |

### Architecture Style

**Multi-repo Microservices** com:

- API Gateway (Kong ou custom NestJS)
- Service-to-service communication via REST + Redis pub/sub
- Shared types via npm packages

### Repository Structure

```
essencia/
├── essencia-api/           # NestJS backend (monorepo interno)
│   ├── apps/
│   │   ├── auth/           # Auth microservice
│   │   ├── communication/  # Chat, notifications
│   │   └── engagement/     # Diário, mural
│   ├── libs/
│   │   ├── common/         # Shared utilities
│   │   ├── database/       # Drizzle ORM
│   │   └── tenant/         # Multi-tenant logic
│   └── docker-compose.yml
├── essencia-admin/         # Next.js web admin
├── essencia-mobile/        # Expo mobile app
├── essencia-landing/       # Landing page (ou dentro do admin)
├── essencia-infra/         # Terraform + K8s manifests
└── essencia-packages/      # Shared npm packages
    ├── types/              # Shared TypeScript types
    ├── ui/                 # Shared components (Tamagui)
    └── utils/              # Shared utilities
```

### Initialization Commands

**1. NestJS Backend (Monorepo):**

```bash
npm i -g @nestjs/cli
nest new essencia-api --package-manager npm
cd essencia-api
nest g app auth
nest g app communication
nest g app engagement
nest g lib common
nest g lib database
nest g lib tenant
```

**2. Next.js Admin:**

```bash
npx create-next-app@latest essencia-admin --typescript --tailwind --eslint --app --src-dir
cd essencia-admin
npx shadcn@latest init
npm install @tanstack/react-query
```

**3. Expo Mobile:**

```bash
npx create-expo-app@latest essencia-mobile -t tabs
cd essencia-mobile
npx expo install @tamagui/core tamagui
npx expo install expo-router
npm install @tanstack/react-query
```

**4. Infrastructure:**

```bash
mkdir essencia-infra && cd essencia-infra
terraform init
# Docker Compose para dev local
```

### Key Architectural Decisions by Stack

| Aspecto        | Decisão                     | Razão                            |
| -------------- | --------------------------- | -------------------------------- |
| **ORM**        | Drizzle ORM                 | Type-safe, SQL-like, performance |
| **Validation** | class-validator + Zod       | NestJS compat + frontend share   |
| **Auth**       | Custom JWT + Redis sessions | Full control, multi-tenant       |
| **Real-time**  | Socket.io + Redis adapter   | Scale horizontal                 |
| **Queue**      | BullMQ (Redis)              | Background jobs, notifications   |
| **Storage**    | S3-compatible (MinIO/AWS)   | Tenant-isolated buckets          |
| **Search**     | PostgreSQL full-text (MVP)  | Elasticsearch later              |

### Trade-offs Aceitos

| Trade-off            | Aceito | Mitigado Por               |
| -------------------- | ------ | -------------------------- |
| Mais código que BaaS | ✅     | NestJS generators, Drizzle |
| Setup inicial maior  | ✅     | Docker Compose local       |
| Multi-tenant manual  | ✅     | Tenant middleware + RLS    |
| Infra complexity     | ✅     | Terraform + K8s templates  |

---

## Core Architectural Decisions (ADRs)

### ADR-001: Multi-Tenant Strategy

**Status:** ✅ Accepted

**Decision:** Schema compartilhado com `tenant_id` + Row Level Security (RLS)

| Aspecto        | Escolha                         | Alternativa Rejeitada |
| -------------- | ------------------------------- | --------------------- |
| **Isolamento** | `tenant_id` em todas as tabelas | Schema por tenant     |
| **Segurança**  | RLS policies no PostgreSQL      | Middleware only       |
| **Propagação** | JWT claim `tenant_id`           | Header `X-Tenant-ID`  |

**Implementação:**

```sql
-- RLS Policy
CREATE POLICY tenant_isolation ON students
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

### ADR-002: Authentication Architecture

**Status:** ✅ Accepted

**Decision:** JWT + Refresh Token + Redis Sessions

| Componente         | Implementação          |
| ------------------ | ---------------------- |
| **Access Token**   | JWT (15min), RS256     |
| **Refresh Token**  | Opaque, Redis (7 days) |
| **Tenant Context** | Claim `tenant_id`      |
| **Roles**          | Claim `roles[]`        |

**JWT Payload:**

```typescript
interface JWTPayload {
  sub: string; // user_id
  tenant_id: string; // tenant isolation
  roles: string[]; // RBAC roles
  permissions: string[]; // granular permissions
  iat: number;
  exp: number;
}
```

---

### ADR-003: API Design

**Status:** ✅ Accepted

**Decision:** REST + OpenAPI 3.1 + URL Versioning

| Aspecto        | Escolha                  |
| -------------- | ------------------------ |
| **Style**      | RESTful                  |
| **Versioning** | `/api/v1/`               |
| **Docs**       | OpenAPI 3.1 + Swagger UI |
| **Validation** | class-validator + Zod    |
| **Errors**     | RFC 7807 Problem Details |

**Error Response:**

```typescript
interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  correlation_id: string;
}
```

---

### ADR-004: Real-time Architecture

**Status:** ✅ Accepted

**Decision:** Socket.io + Redis Adapter + BullMQ

| Componente    | Tecnologia              |
| ------------- | ----------------------- |
| **WebSocket** | Socket.io 4.x           |
| **Scaling**   | Redis Adapter           |
| **Rooms**     | `tenant:{id}:user:{id}` |
| **Queue**     | BullMQ                  |

**Namespaces:**

- `/chat` - Mensagens privadas
- `/diary` - Updates de diário
- `/announcements` - Comunicados

---

### ADR-005: Database Architecture

**Status:** ✅ Accepted

**Decision:** PostgreSQL 16 + Drizzle ORM

| Aspecto        | Escolha          |
| -------------- | ---------------- |
| **DB**         | PostgreSQL 16    |
| **ORM**        | Drizzle ORM      |
| **Migrations** | Drizzle Kit      |
| **Pool**       | PgBouncer (prod) |
| **Search**     | tsvector (MVP)   |

**Vantagens Drizzle vs Prisma:**

- ✅ SQL-like syntax (mais próximo do PostgreSQL)
- ✅ Zero overhead runtime (queries diretas)
- ✅ Bundle size ~7x menor
- ✅ Melhor performance em queries complexas
- ✅ Type inference automática do schema
- ✅ Suporte nativo a RLS patterns

**Schema Pattern:**

```typescript
// schema/students.ts
import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"), // LGPD soft delete
  },
  (table) => ({
    tenantIdx: index("idx_students_tenant_id").on(table.tenantId),
  })
);

// Type inference automática
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
```

**Query Pattern:**

```typescript
// Queries type-safe com SQL-like syntax
const result = await db
  .select()
  .from(students)
  .where(and(eq(students.tenantId, tenantId), isNull(students.deletedAt)))
  .orderBy(desc(students.createdAt))
  .limit(20);
```

---

### ADR-006: Caching Strategy

**Status:** ✅ Accepted

**Decision:** Redis 7 + Cache-Aside Pattern

| Cache Type  | TTL  | Invalidation   |
| ----------- | ---- | -------------- |
| **Session** | 7d   | Logout/refresh |
| **Profile** | 5min | On update      |
| **Config**  | 1h   | Admin change   |

**Key Pattern:** `tenant:{id}:entity:{id}:data`

---

### ADR-007: File Storage

**Status:** ✅ Accepted

**Decision:** S3-compatible + CDN

| Ambiente | Storage                 |
| -------- | ----------------------- |
| **Dev**  | MinIO (Docker)          |
| **Prod** | AWS S3 / Cloudflare R2  |
| **CDN**  | CloudFront / Cloudflare |

**Isolation:** Prefix `tenant/{id}/`

---

### ADR-008: Observability

**Status:** ✅ Accepted

**Decision:** OpenTelemetry + Structured Logging

| Aspecto       | Tecnologia    |
| ------------- | ------------- |
| **Tracing**   | OpenTelemetry |
| **Metrics**   | Prometheus    |
| **Logging**   | Pino (JSON)   |
| **Dashboard** | Grafana       |

**Log Context:**

```json
{
  "tenant_id": "uuid",
  "user_id": "uuid",
  "correlation_id": "uuid",
  "service": "engagement"
}
```

---

### ADR-009: Deployment Strategy

**Status:** ✅ Accepted

**Decision:** Docker + Kubernetes + GitOps

| Ambiente    | Infra           |
| ----------- | --------------- |
| **Local**   | Docker Compose  |
| **Staging** | K8s single-node |
| **Prod**    | K8s multi-node  |
| **IaC**     | Terraform       |
| **GitOps**  | ArgoCD          |

---

### ADR Summary

| ADR | Decision                       | Status |
| --- | ------------------------------ | ------ |
| 001 | Multi-tenant: Schema + RLS     | ✅     |
| 002 | Auth: JWT + Refresh + Redis    | ✅     |
| 003 | API: REST + OpenAPI 3.1        | ✅     |
| 004 | Real-time: Socket.io + Redis   | ✅     |
| 005 | Database: PostgreSQL + Drizzle | ✅     |
| 006 | Cache: Redis + Cache-Aside     | ✅     |
| 007 | Storage: S3 + CDN              | ✅     |
| 008 | Observability: OpenTelemetry   | ✅     |
| 009 | Deploy: K8s + GitOps           | ✅     |

### Deferred Decisions (Post-MVP)

| Decision       | Reason                          |
| -------------- | ------------------------------- |
| Elasticsearch  | PostgreSQL full-text ok for MVP |
| GraphQL        | REST covers MVP needs           |
| Event Sourcing | CRUD simpler for MVP            |
| Multi-region   | Single region (Brazil)          |

---

## Implementation Patterns & Consistency Rules

### 1. Naming Patterns

#### Database Naming

```
# Tables (plural, snake_case)
students, teachers, daily_entries, class_rooms

# Columns (snake_case)
created_at, updated_at, deleted_at, tenant_id
first_name, last_name, phone_number

# Foreign Keys
student_id (refs students.id)
class_room_id (refs class_rooms.id)

# Indexes
idx_{table}_{columns}
idx_students_tenant_id
idx_daily_entries_student_created

# Constraints
pk_{table}, fk_{table}_{ref}, uq_{table}_{columns}, ck_{table}_{rule}
```

#### API Naming

```
# Endpoints (plural nouns, kebab-case)
GET    /api/v1/students
GET    /api/v1/students/:id
POST   /api/v1/students
PATCH  /api/v1/students/:id
DELETE /api/v1/students/:id

# Nested resources
GET    /api/v1/students/:id/daily-entries

# Actions (verb at end)
POST   /api/v1/announcements/:id/publish
POST   /api/v1/messages/:id/mark-read

# Query params (camelCase)
?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

#### Code Naming

```typescript
// Classes: PascalCase
export class StudentService {}
export class CreateStudentDto {}

// Interfaces: PascalCase (I prefix for contracts)
export interface Student {}
export interface IStudentRepository {}

// Functions: camelCase
async findByTenant(tenantId: string) {}

// Constants: UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Enums: PascalCase + UPPER values
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Files: kebab-case
student.service.ts, create-student.dto.ts
```

### 2. Structure Patterns

#### NestJS Module Structure

```
src/modules/{module}/
├── dto/
│   ├── create-{entity}.dto.ts
│   ├── update-{entity}.dto.ts
│   └── {entity}-response.dto.ts
├── entities/
│   └── {entity}.entity.ts
├── {entity}.controller.ts
├── {entity}.service.ts
├── {entity}.module.ts
└── {entity}.spec.ts
```

#### Next.js App Router Structure

```
src/app/
├── (auth)/login/page.tsx
├── (dashboard)/
│   └── {feature}/
│       ├── page.tsx
│       ├── [id]/page.tsx
│       └── components/
```

#### React Native Structure

```
src/app/
├── (tabs)/_layout.tsx, index.tsx, diary.tsx, chat.tsx
├── (auth)/login.tsx
```

### 3. Format Patterns

#### API Response (Success)

```typescript
// Single item
{ "data": { "id": "...", "name": "..." } }

// Collection
{
  "data": [...],
  "meta": { "page": 1, "pageSize": 20, "total": 150, "totalPages": 8 }
}
```

#### API Error (RFC 7807)

```typescript
{
  "type": "https://essencia.app/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "O campo 'email' é obrigatório",
  "correlationId": "uuid"
}
```

### 4. Communication Patterns

#### Service Layer

```typescript
// 1. Validate → 2. Execute → 3. Cache invalidate → 4. Event emit → 5. Return
```

#### Real-time Events

```typescript
// Event names: domain.action
"diary.entry.created",
  "message.received",
  "announcement.published"// Room pattern
  `tenant:${tenantId}:user:${userId}`;
```

#### TanStack Query Keys

```typescript
["students", { tenantId, page, search }][("student", id)][
  ("daily-entries", { studentId, date })
];
```

### 5. Process Patterns

#### Error Handling

```typescript
// Custom exceptions extend NestJS base
export class StudentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({ type: "student-not-found", detail: `ID ${id} não encontrado` });
  }
}
```

#### Loading States

```typescript
if (isLoading) return <Skeleton />;
if (error) return <ErrorState onRetry={refetch} />;
return <Component data={data} />;
```

#### Optimistic Updates

```typescript
// onMutate: snapshot + optimistic update
// onError: rollback
// onSettled: invalidate queries
```

### Patterns Summary

| Category       | Key Pattern                            |
| -------------- | -------------------------------------- |
| **Database**   | snake_case, tenant_id em todas tabelas |
| **API URLs**   | kebab-case, /api/v1/{resource}         |
| **Code**       | camelCase funções, PascalCase classes  |
| **JSON**       | camelCase, ISO 8601 dates              |
| **Errors**     | RFC 7807 Problem Details               |
| **Events**     | domain.action (diary.entry.created)    |
| **Cache Keys** | tenant:{id}:resource:{id}              |

---

## Project Structure & Boundaries

### Complete Multi-Repository Project Structure

---

### 📦 Repository 1: `essencia-api` (NestJS Monorepo)

```
essencia-api/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── drizzle.config.ts                   # Drizzle Kit config
├── .env.example
├── .env.development
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── biome.json
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd-staging.yml
│       └── cd-production.yml
│
├── apps/
│   ├── gateway/                          # API Gateway (BFF)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   └── config/
│   │   │       ├── configuration.ts
│   │   │       └── validation.ts
│   │   ├── test/
│   │   └── tsconfig.app.json
│   │
│   ├── core/                             # Core Service (Auth, Users, Tenants)
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── core.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   │   ├── register.dto.ts
│   │   │   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   │   │   └── auth-response.dto.ts
│   │   │   │   │   ├── guards/
│   │   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   │   └── tenant.guard.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   │   └── refresh.strategy.ts
│   │   │   │   │   ├── decorators/
│   │   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   │   └── tenant.decorator.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── auth.module.ts
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-user.dto.ts
│   │   │   │   │   │   ├── update-user.dto.ts
│   │   │   │   │   │   └── user-response.dto.ts
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── users.repository.ts
│   │   │   │   │   └── users.module.ts
│   │   │   │   │
│   │   │   │   ├── tenants/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── tenants.controller.ts
│   │   │   │   │   ├── tenants.service.ts
│   │   │   │   │   └── tenants.module.ts
│   │   │   │   │
│   │   │   │   ├── students/
│   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── create-student.dto.ts
│   │   │   │   │   │   ├── update-student.dto.ts
│   │   │   │   │   │   └── student-response.dto.ts
│   │   │   │   │   ├── students.controller.ts
│   │   │   │   │   ├── students.service.ts
│   │   │   │   │   └── students.module.ts
│   │   │   │   │
│   │   │   │   ├── teachers/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── teachers.controller.ts
│   │   │   │   │   ├── teachers.service.ts
│   │   │   │   │   └── teachers.module.ts
│   │   │   │   │
│   │   │   │   ├── guardians/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── guardians.controller.ts
│   │   │   │   │   ├── guardians.service.ts
│   │   │   │   │   └── guardians.module.ts
│   │   │   │   │
│   │   │   │   └── class-rooms/
│   │   │   │       ├── dto/
│   │   │   │       ├── class-rooms.controller.ts
│   │   │   │       ├── class-rooms.service.ts
│   │   │   │       └── class-rooms.module.ts
│   │   │   │
│   │   │   └── config/
│   │   ├── test/
│   │   └── tsconfig.app.json
│   │
│   └── engagement/                       # Engagement Service (Diary, Chat, Announcements)
│       ├── src/
│       │   ├── main.ts
│       │   ├── engagement.module.ts
│       │   ├── modules/
│       │   │   ├── daily-entries/
│       │   │   │   ├── dto/
│       │   │   │   │   ├── create-daily-entry.dto.ts
│       │   │   │   │   ├── update-daily-entry.dto.ts
│       │   │   │   │   └── daily-entry-response.dto.ts
│       │   │   │   ├── daily-entries.controller.ts
│       │   │   │   ├── daily-entries.service.ts
│       │   │   │   └── daily-entries.module.ts
│       │   │   │
│       │   │   ├── announcements/
│       │   │   │   ├── dto/
│       │   │   │   ├── announcements.controller.ts
│       │   │   │   ├── announcements.service.ts
│       │   │   │   └── announcements.module.ts
│       │   │   │
│       │   │   ├── messages/
│       │   │   │   ├── dto/
│       │   │   │   ├── gateways/
│       │   │   │   │   └── messages.gateway.ts   # Socket.io
│       │   │   │   ├── messages.controller.ts
│       │   │   │   ├── messages.service.ts
│       │   │   │   └── messages.module.ts
│       │   │   │
│       │   │   └── notifications/
│       │   │       ├── dto/
│       │   │       ├── processors/
│       │   │       │   └── notification.processor.ts  # BullMQ
│       │   │       ├── notifications.service.ts
│       │   │       └── notifications.module.ts
│       │   │
│       │   └── config/
│       ├── test/
│       └── tsconfig.app.json
│
├── libs/
│   ├── common/                           # Shared utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── decorators/
│   │   │   │   ├── api-paginated.decorator.ts
│   │   │   │   └── api-tenant.decorator.ts
│   │   │   ├── dto/
│   │   │   │   ├── pagination.dto.ts
│   │   │   │   └── base-response.dto.ts
│   │   │   ├── filters/
│   │   │   │   ├── http-exception.filter.ts
│   │   │   │   └── drizzle-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── logging.interceptor.ts
│   │   │   │   ├── transform.interceptor.ts
│   │   │   │   └── tenant-context.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── validation.pipe.ts
│   │   │   └── utils/
│   │   │       ├── pagination.util.ts
│   │   │       └── date.util.ts
│   │   └── tsconfig.lib.json
│   │
│   ├── database/                         # Drizzle ORM
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── drizzle.service.ts
│   │   │   ├── drizzle.module.ts
│   │   │   ├── tenant-context.service.ts
│   │   │   └── schema/
│   │   │       ├── index.ts              # Export all schemas
│   │   │       ├── tenants.ts
│   │   │       ├── users.ts
│   │   │       ├── students.ts
│   │   │       ├── teachers.ts
│   │   │       ├── guardians.ts
│   │   │       ├── class-rooms.ts
│   │   │       ├── daily-entries.ts
│   │   │       ├── announcements.ts
│   │   │       ├── messages.ts
│   │   │       ├── notifications.ts
│   │   │       └── relations.ts          # Drizzle relations
│   │   ├── migrations/
│   │   │   └── 0000_initial.sql
│   │   ├── seed.ts
│   │   └── tsconfig.lib.json
│   │
│   ├── cache/                            # Redis cache utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── cache.service.ts
│   │   │   └── cache.module.ts
│   │   └── tsconfig.lib.json
│   │
│   ├── storage/                          # S3/MinIO storage utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── storage.service.ts
│   │   │   └── storage.module.ts
│   │   └── tsconfig.lib.json
│   │
│   └── queue/                            # BullMQ queue utilities
│       ├── src/
│       │   ├── index.ts
│       │   ├── queue.service.ts
│       │   └── queue.module.ts
│       └── tsconfig.lib.json
│
├── scripts/
│   ├── setup.sh
│   ├── seed.ts
│   └── generate-openapi.ts
│
└── test/
    ├── vitest.config.ts
    └── fixtures/
```

---

### 📦 Repository 2: `essencia-admin` (Next.js 15 Admin Portal)

```
essencia-admin/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── components.json              # shadcn/ui config
├── biome.json
├── .env.local
├── .env.example
├── .gitignore
├── Dockerfile
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                     # Redirect to login or dashboard
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx               # Sidebar + Header
│   │   │   ├── page.tsx                 # Dashboard home
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── page.tsx             # List students
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx         # Create student
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx         # View/Edit student
│   │   │   │   │   └── diary/
│   │   │   │   │       └── page.tsx     # Student diary entries
│   │   │   │   └── components/
│   │   │   │       ├── student-list.tsx
│   │   │   │       ├── student-card.tsx
│   │   │   │       ├── student-form.tsx
│   │   │   │       └── student-filters.tsx
│   │   │   │
│   │   │   ├── teachers/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── class-rooms/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── guardians/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── daily-entries/
│   │   │   │   ├── page.tsx             # Bulk daily entry
│   │   │   │   └── components/
│   │   │   │       ├── daily-entry-form.tsx
│   │   │   │       ├── daily-entry-card.tsx
│   │   │   │       └── mood-selector.tsx
│   │   │   │
│   │   │   ├── announcements/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       └── school/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/                         # API Routes (BFF proxy if needed)
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── user-nav.tsx
│   │   │
│   │   └── shared/
│   │       ├── loading-skeleton.tsx
│   │       ├── error-state.tsx
│   │       ├── empty-state.tsx
│   │       ├── confirm-dialog.tsx
│   │       ├── data-table.tsx
│   │       └── pagination.tsx
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-students.ts
│   │   ├── use-teachers.ts
│   │   ├── use-daily-entries.ts
│   │   └── use-debounce.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts               # Fetch/Axios wrapper
│   │   ├── query-client.ts             # TanStack Query setup
│   │   ├── auth.ts                     # Auth utilities
│   │   ├── utils.ts                    # cn() helper
│   │   └── validations/
│   │       ├── student.schema.ts       # Zod schemas
│   │       └── teacher.schema.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── teacher.service.ts
│   │   ├── daily-entry.service.ts
│   │   └── announcement.service.ts
│   │
│   ├── stores/                         # Zustand stores
│   │   └── auth.store.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   ├── student.types.ts
│   │   ├── teacher.types.ts
│   │   └── daily-entry.types.ts
│   │
│   └── middleware.ts                   # Auth middleware
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/
│
└── tests/
    ├── vitest.config.ts
    ├── setup.ts
    ├── components/
    └── e2e/
        └── playwright.config.ts
```

---

### 📦 Repository 3: `essencia-mobile` (React Native + Expo)

```
essencia-mobile/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── app.json
├── expo-env.d.ts
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── tamagui.config.ts
├── .env.example
├── .gitignore
├── eas.json                            # EAS Build config
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── build.yml
│
├── src/
│   ├── app/                            # expo-router pages
│   │   ├── _layout.tsx                 # Root layout
│   │   │
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── onboarding.tsx
│   │   │
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # Tab navigator
│   │   │   ├── index.tsx               # Home/Feed
│   │   │   ├── diary.tsx               # Daily entries
│   │   │   ├── chat.tsx                # Messages
│   │   │   └── profile.tsx             # Profile
│   │   │
│   │   ├── diary/
│   │   │   └── [id].tsx                # Entry detail
│   │   │
│   │   ├── announcements/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   │
│   │   ├── chat/
│   │   │   └── [conversationId].tsx    # Chat detail
│   │   │
│   │   └── settings/
│   │       ├── index.tsx
│   │       ├── notifications.tsx
│   │       └── children.tsx            # Manage children
│   │
│   ├── components/
│   │   ├── ui/                         # Tamagui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── ...
│   │   │
│   │   ├── diary/
│   │   │   ├── diary-card.tsx
│   │   │   ├── mood-badge.tsx
│   │   │   ├── activity-list.tsx
│   │   │   └── photo-gallery.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── message-bubble.tsx
│   │   │   ├── message-input.tsx
│   │   │   └── conversation-item.tsx
│   │   │
│   │   ├── announcements/
│   │   │   └── announcement-card.tsx
│   │   │
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── error-view.tsx
│   │       ├── empty-state.tsx
│   │       └── child-selector.tsx
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-children.ts
│   │   ├── use-diary.ts
│   │   ├── use-notifications.ts
│   │   └── use-socket.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── query-client.ts
│   │   ├── socket.ts
│   │   ├── storage.ts                  # AsyncStorage wrapper
│   │   └── notifications.ts            # Expo notifications
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── diary.service.ts
│   │   ├── chat.service.ts
│   │   └── notification.service.ts
│   │
│   ├── stores/
│   │   ├── auth.store.ts
│   │   └── selected-child.store.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── constants/
│       ├── colors.ts
│       └── config.ts
│
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   └── onboarding/
│   ├── fonts/
│   └── animations/                     # Lottie files
│
└── tests/
    └── ...
```

---

### 📦 Repository 4: `essencia-infra` (Terraform + Kubernetes)

```
essencia-infra/
├── README.md
├── .gitignore
│
├── terraform/
│   ├── environments/
│   │   ├── staging/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── terraform.tfvars
│   │   └── production/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       ├── outputs.tf
│   │       └── terraform.tfvars
│   │
│   └── modules/
│       ├── vpc/
│       ├── eks/
│       ├── rds/
│       ├── redis/
│       ├── s3/
│       └── cloudfront/
│
├── kubernetes/
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── configmaps/
│   │   ├── secrets/
│   │   └── services/
│   │       ├── core/
│   │       │   ├── deployment.yaml
│   │       │   ├── service.yaml
│   │       │   └── hpa.yaml
│   │       ├── engagement/
│   │       │   ├── deployment.yaml
│   │       │   ├── service.yaml
│   │       │   └── hpa.yaml
│   │       └── gateway/
│   │           ├── deployment.yaml
│   │           ├── service.yaml
│   │           └── ingress.yaml
│   │
│   └── overlays/
│       ├── staging/
│       │   └── kustomization.yaml
│       └── production/
│           └── kustomization.yaml
│
├── helm/
│   └── essencia/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-staging.yaml
│       ├── values-production.yaml
│       └── templates/
│
├── argocd/
│   ├── projects/
│   │   └── essencia.yaml
│   └── applications/
│       ├── staging.yaml
│       └── production.yaml
│
└── scripts/
    ├── setup-cluster.sh
    ├── deploy.sh
    └── rollback.sh
```

---

### 📦 Repository 5: `essencia-packages` (Shared NPM Packages)

```
essencia-packages/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
│
├── packages/
│   ├── types/                          # @essencia/types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── user.types.ts
│   │   │   ├── student.types.ts
│   │   │   ├── teacher.types.ts
│   │   │   ├── daily-entry.types.ts
│   │   │   ├── announcement.types.ts
│   │   │   ├── message.types.ts
│   │   │   └── api.types.ts
│   │   └── dist/
│   │
│   ├── utils/                          # @essencia/utils
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   └── dist/
│   │
│   ├── api-client/                     # @essencia/api-client
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── endpoints/
│   │   │       ├── auth.ts
│   │   │       ├── students.ts
│   │   │       └── diary.ts
│   │   └── dist/
│   │
│   └── ui/                             # @essencia/ui (React Native shared)
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── theme/
│       │   │   ├── colors.ts
│       │   │   ├── spacing.ts
│       │   │   └── typography.ts
│       │   └── components/
│       │       └── ...
│       └── dist/
│
└── .github/
    └── workflows/
        └── publish.yml
```

---

### 🔗 Architectural Boundaries

#### API Boundaries

| Boundary          | Service    | Endpoints                 |
| ----------------- | ---------- | ------------------------- |
| **Auth**          | Core       | `/api/v1/auth/*`          |
| **Users**         | Core       | `/api/v1/users/*`         |
| **Students**      | Core       | `/api/v1/students/*`      |
| **Teachers**      | Core       | `/api/v1/teachers/*`      |
| **ClassRooms**    | Core       | `/api/v1/class-rooms/*`   |
| **DailyEntries**  | Engagement | `/api/v1/daily-entries/*` |
| **Announcements** | Engagement | `/api/v1/announcements/*` |
| **Messages**      | Engagement | `/api/v1/messages/*`      |
| **Notifications** | Engagement | `/api/v1/notifications/*` |

#### Data Boundaries

| Domain         | Database Tables                                                        | Cache Prefix               |
| -------------- | ---------------------------------------------------------------------- | -------------------------- |
| **Core**       | `tenants`, `users`, `students`, `teachers`, `guardians`, `class_rooms` | `tenant:{id}:core:*`       |
| **Engagement** | `daily_entries`, `announcements`, `messages`, `notifications`          | `tenant:{id}:engagement:*` |

#### Service Communication

```
[Mobile App] ──▶ [Gateway] ──▶ [Core Service] ──▶ [PostgreSQL]
     │               │               │
     │               │               └──▶ [Redis Cache]
     │               │
     │               └──▶ [Engagement Service] ──▶ [PostgreSQL]
     │                           │
     │                           ├──▶ [Redis Cache]
     │                           ├──▶ [BullMQ Jobs]
     │                           └──▶ [Socket.io]
     │
     └──▶ [Socket.io] ◀── Real-time events

[Admin Portal] ──▶ [Gateway] ──▶ [Services]
```

---

### 📋 Requirements to Structure Mapping

| Epic/Feature           | Backend Location                         | Frontend Location                    | Mobile Location            |
| ---------------------- | ---------------------------------------- | ------------------------------------ | -------------------------- |
| **Authentication**     | `apps/core/modules/auth/`                | `src/app/(auth)/`                    | `src/app/(auth)/`          |
| **User Management**    | `apps/core/modules/users/`               | `src/app/(dashboard)/users/`         | -                          |
| **Student Management** | `apps/core/modules/students/`            | `src/app/(dashboard)/students/`      | -                          |
| **Teacher Management** | `apps/core/modules/teachers/`            | `src/app/(dashboard)/teachers/`      | -                          |
| **Class Management**   | `apps/core/modules/class-rooms/`         | `src/app/(dashboard)/class-rooms/`   | -                          |
| **Daily Diary**        | `apps/engagement/modules/daily-entries/` | `src/app/(dashboard)/daily-entries/` | `src/app/(tabs)/diary.tsx` |
| **Announcements**      | `apps/engagement/modules/announcements/` | `src/app/(dashboard)/announcements/` | `src/app/announcements/`   |
| **Messaging**          | `apps/engagement/modules/messages/`      | `src/app/(dashboard)/messages/`      | `src/app/(tabs)/chat.tsx`  |
| **Notifications**      | `apps/engagement/modules/notifications/` | -                                    | Push + `src/app/(tabs)/`   |

---

### 📊 Drizzle Schema Organization

```
libs/database/src/schema/
├── index.ts              # Re-export all schemas
├── tenants.ts            # Tenant table
├── users.ts              # Users + roles
├── students.ts           # Students
├── teachers.ts           # Teachers
├── guardians.ts          # Guardians (parents)
├── class-rooms.ts        # Class rooms
├── student-guardians.ts  # M:N relationship
├── daily-entries.ts      # Daily diary entries
├── announcements.ts      # School announcements
├── messages.ts           # Chat messages
├── conversations.ts      # Chat conversations
├── notifications.ts      # Push notifications
└── relations.ts          # Drizzle relations config
```

---

## Architecture Validation Results

### Coherence Validation ✅

#### Decision Compatibility

| Stack Component   | Compatible With                         | Status |
| ----------------- | --------------------------------------- | ------ |
| **NestJS 10.x**   | Drizzle ORM, Socket.io, BullMQ          | ✅     |
| **Drizzle ORM**   | PostgreSQL 16, TypeScript 5.x           | ✅     |
| **Next.js 15**    | React 19, Tailwind 4, shadcn/ui         | ✅     |
| **Expo SDK 52**   | React Native 0.76, Tamagui, expo-router | ✅     |
| **Redis 7**       | Socket.io Adapter, BullMQ, Cache        | ✅     |
| **PostgreSQL 16** | Drizzle, RLS, Full-text search          | ✅     |

**Veredito:** Todas as tecnologias são compatíveis e bem testadas em produção juntas.

#### Pattern Consistency

| Pattern          | Applied Consistently                               | Status |
| ---------------- | -------------------------------------------------- | ------ |
| **Naming**       | snake_case (DB), camelCase (TS), kebab-case (URLs) | ✅     |
| **Multi-tenant** | tenant_id em todas tabelas + RLS                   | ✅     |
| **API Design**   | REST + OpenAPI 3.1 + RFC 7807 errors               | ✅     |
| **Auth**         | JWT + Refresh + Redis sessions                     | ✅     |
| **Real-time**    | Socket.io + Redis Adapter                          | ✅     |

#### Structure Alignment

| Structure              | Supports Decisions                       | Status |
| ---------------------- | ---------------------------------------- | ------ |
| **NestJS Monorepo**    | Microservices pattern (core, engagement) | ✅     |
| **libs/database/**     | Drizzle schemas centralizados            | ✅     |
| **Next.js App Router** | Route groups (auth), (dashboard)         | ✅     |
| **Expo expo-router**   | Tab-based navigation                     | ✅     |

---

### Requirements Coverage Validation ✅

#### Functional Requirements Coverage (50 FRs)

| FR Category                 | Qty | Architectural Support       | Status |
| --------------------------- | --- | --------------------------- | ------ |
| **Multi-tenancy (FR1-4)**   | 4   | RLS + tenant_id + JWT claim | ✅     |
| **Auth & Roles (FR5-10)**   | 6   | JWT + RBAC Guards           | ✅     |
| **Student Mgmt (FR11-15)**  | 5   | Core Service + Drizzle      | ✅     |
| **Teacher Mgmt (FR16-19)**  | 4   | Core Service + Drizzle      | ✅     |
| **Class Mgmt (FR20-22)**    | 3   | Core Service + Relations    | ✅     |
| **Chat (FR23-28)**          | 6   | Engagement + Socket.io      | ✅     |
| **Daily Diary (FR29-34)**   | 6   | Engagement + Storage        | ✅     |
| **Announcements (FR35-38)** | 4   | Engagement + BullMQ         | ✅     |
| **Notifications (FR39-42)** | 4   | BullMQ + Expo Push          | ✅     |
| **Reports (FR43-50)**       | 8   | PostgreSQL aggregates       | ✅     |

**Cobertura: 50/50 FRs (100%)**

#### Non-Functional Requirements Coverage (35 NFRs)

| NFR Category      | Key Requirement   | Architectural Solution                | Status |
| ----------------- | ----------------- | ------------------------------------- | ------ |
| **Performance**   | API < 500ms       | Drizzle (zero overhead) + Redis cache | ✅     |
| **Performance**   | WebSocket < 2s    | Socket.io + Redis Adapter             | ✅     |
| **Security**      | RLS obrigatório   | PostgreSQL RLS policies               | ✅     |
| **Security**      | LGPD compliance   | Soft delete, audit trail              | ✅     |
| **Scalability**   | 100 → 10k users   | K8s HPA + Redis                       | ✅     |
| **Reliability**   | 99.5% uptime      | K8s + Multi-replica                   | ✅     |
| **Observability** | Logging + Tracing | OpenTelemetry + Pino                  | ✅     |

**Cobertura: 35/35 NFRs (100%)**

---

### Implementation Readiness Validation ✅

#### Decision Completeness

| Decision Area | Documented | Versions               | Examples           | Status |
| ------------- | ---------- | ---------------------- | ------------------ | ------ |
| **Database**  | ✅         | PostgreSQL 16, Drizzle | Schema patterns    | ✅     |
| **Backend**   | ✅         | NestJS 10.x            | Module structure   | ✅     |
| **Frontend**  | ✅         | Next.js 15, React 19   | Route patterns     | ✅     |
| **Mobile**    | ✅         | Expo 52, RN 0.76       | Tab navigation     | ✅     |
| **Cache**     | ✅         | Redis 7                | Key patterns       | ✅     |
| **Real-time** | ✅         | Socket.io 4.x          | Namespace patterns | ✅     |
| **Auth**      | ✅         | JWT RS256              | Claims structure   | ✅     |

#### Pattern Completeness

| Pattern Type      | Defined | Examples       | Conflict Prevention | Status |
| ----------------- | ------- | -------------- | ------------------- | ------ |
| **Naming**        | ✅      | DB, API, Code  | Convention table    | ✅     |
| **Structure**     | ✅      | All repos      | Directory trees     | ✅     |
| **Format**        | ✅      | API responses  | RFC 7807 errors     | ✅     |
| **Communication** | ✅      | Service layer  | Event patterns      | ✅     |
| **Process**       | ✅      | Error handling | Loading states      | ✅     |

---

### Gap Analysis Results

#### Critical Gaps: NONE ✅

#### Important Gaps (addressed)

| Gap                        | Resolution                      |
| -------------------------- | ------------------------------- |
| Drizzle migration strategy | Drizzle Kit + SQL migrations    |
| RLS policy setup           | Schema-level RLS definitions    |
| Multi-tenant seeding       | Seed script with tenant context |

#### Nice-to-Have (Post-MVP)

| Enhancement    | Priority |
| -------------- | -------- |
| GraphQL layer  | P3       |
| Elasticsearch  | P3       |
| Event sourcing | P4       |
| Multi-region   | P4       |

---

### Architecture Completeness Checklist

#### ✅ Requirements Analysis

- [x] Project context thoroughly analyzed (50 FRs, 35 NFRs)
- [x] Scale and complexity assessed (High - Multi-tenant + Real-time)
- [x] Technical constraints identified (Solo dev, 1 week, LGPD)
- [x] Cross-cutting concerns mapped (6 concerns)

#### ✅ Architectural Decisions

- [x] 9 ADRs documented with status
- [x] Technology stack fully specified with versions
- [x] Integration patterns defined (REST + Socket.io + BullMQ)
- [x] Performance considerations addressed (Drizzle, Redis cache)

#### ✅ Implementation Patterns

- [x] Naming conventions established (5 categories)
- [x] Structure patterns defined (NestJS module, Next.js routes)
- [x] Communication patterns specified (Events, TanStack Query)
- [x] Process patterns documented (Error handling, Optimistic UI)

#### ✅ Project Structure

- [x] Complete directory structure defined (5 repos)
- [x] Component boundaries established (Core vs Engagement)
- [x] Integration points mapped (API boundaries table)
- [x] Requirements to structure mapping complete

---

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** 🟢 HIGH

**Key Strengths:**

1. **Type-safety end-to-end**: Drizzle + TypeScript + Zod
2. **Multi-tenant from Day 1**: RLS + tenant_id + JWT claims
3. **Performance optimized**: Drizzle zero-overhead + Redis cache
4. **Real-time ready**: Socket.io + Redis Adapter scales horizontally
5. **Enterprise patterns**: OpenTelemetry, BullMQ, K8s

**Areas for Future Enhancement:**

1. GraphQL BFF layer (quando complexidade de queries aumentar)
2. Elasticsearch (quando full-text search precisar de mais features)
3. Event sourcing (se auditoria detalhada for requerida)
4. Multi-region deployment (expansão geográfica)

---

### Implementation Handoff

**AI Agent Guidelines:**

1. Seguir todas as decisões arquiteturais exatamente como documentado
2. Usar patterns de implementação consistentemente em todos os componentes
3. Respeitar estrutura do projeto e boundaries entre serviços
4. Referir a este documento para todas as questões arquiteturais
5. Manter `tenant_id` em TODAS as queries de banco de dados
6. Usar Drizzle schema types para type inference

**First Implementation Priority:**

```bash
# 1. Criar repositório essencia-api
# 2. Setup NestJS monorepo com Drizzle
# 3. Criar schemas base (tenants, users)
# 4. Implementar auth module com JWT + RLS
```

---

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-12
**Document Location:** docs/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 9 architectural decisions (ADRs) made
- 5 implementation pattern categories defined
- 5 repositories specified
- 50 FRs + 35 NFRs fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All 50 functional requirements are supported
- [x] All 35 non-functional requirements are addressed
- [x] 6 cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen enterprise stack (NestJS + Drizzle + Next.js + Expo) provides a production-ready foundation following current best practices.

---

**Architecture Status:** ✅ READY FOR IMPLEMENTATION

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
