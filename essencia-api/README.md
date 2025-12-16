# Essencia API - Microservices Architecture

A multi-service architecture for the Essencia school management platform built with NestJS monorepo.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│                    (apps/gateway - port 3000)                    │
│              - Request routing & authentication                  │
│              - Rate limiting & caching                          │
│              - API versioning & documentation                   │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
        ┌─────────────▼─────────────┐  ┌──────▼──────────────────┐
        │       Core Service        │  │   Engagement Service    │
        │   (apps/core - port 3001) │  │(apps/engagement - 3002) │
        │                           │  │                         │
        │  - Authentication         │  │  - Diary Entries        │
        │  - Users Management       │  │  - Messages & Chat      │
        │  - Tenants Management     │  │  - Announcements        │
        │  - Students Management    │  │  - Gallery              │
        │  - Classes Management     │  │  - Notifications        │
        └─────────────┬─────────────┘  └───────────┬─────────────┘
                      │                            │
        ┌─────────────▼────────────────────────────▼─────────────┐
        │                   Shared Libraries                      │
        │  @app/common   - Decorators, DTOs, Utils               │
        │  @app/database - Drizzle ORM, Schema, Tenant Context   │
        │  @app/cache    - Redis caching layer                   │
        │  @app/storage  - S3/MinIO file storage                 │
        └─────────────────────────────────────────────────────────┘
```

## Project Structure

```
essencia-api/
├── apps/
│   ├── gateway/           # API Gateway (port 3000)
│   ├── core/              # Core Service (port 3001)
│   └── engagement/        # Engagement Service (port 3002)
├── libs/
│   ├── common/            # Shared utilities
│   ├── database/          # Database layer
│   ├── cache/             # Redis caching
│   └── storage/           # S3/MinIO storage
├── docker/                # Dockerfiles
├── drizzle/               # Database migrations
└── scripts/               # Utility scripts
```

## Quick Start

### Development Setup

1. **Start infrastructure services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup database:**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

4. **Start all services:**
   ```bash
   npm run start:all
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build:all` | Build all microservices |
| `npm run start:all` | Start all services in watch mode |
| `npm run start:gateway:dev` | Start Gateway in watch mode |
| `npm run start:core:dev` | Start Core service in watch mode |
| `npm run start:engagement:dev` | Start Engagement service in watch mode |
| `npm run db:setup` | Push schema + apply RLS policies |
| `npm run db:seed` | Seed first tenant |

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 3000 | API Gateway / BFF |
| Core | 3001 | Auth, Users, Tenants, Students, Classes |
| Engagement | 3002 | Diary, Messages, Announcements, Gallery |
| PostgreSQL | 5433 | Database |
| Redis | 6379 | Caching |
| MinIO | 9000/9001 | S3-compatible storage |

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
