# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Maintena API — maintenance management system (assets, work orders, preventive maintenance, inventory).

## Commands

```
bun run dev              # Start dev server with hot reload (port 8000)
bunx prisma generate     # Generate Prisma client after schema changes
bunx prisma migrate dev  # Run database migrations
bunx prisma studio       # Open Prisma Studio for DB inspection
```

## Architecture

**Stack**: Bun + Elysia + Prisma (PostgreSQL) + TypeDI (dependency injection)

**Module pattern** — each feature lives in `src/modules/<name>/`:

- `auth-route.ts` — Elysia route definitions
- `auth-module.ts` — TypeDI container exports
- `auth-schema.ts` — Elysia type schemas (request/response)
- `repository/` — database logic (TypeDI `@Service()` classes)
- `guard/` — auth guards (JWT verification)

**Shared layer** (`src/shared/`):

- `error/api-error.ts` — custom `ApiError(message, statusCode)` for business errors
- `schema/api-schema.ts` — `ok()` helper + `createApiResponseSchema()` for uniform responses
- `service/` — cross-cutting services (e.g., `PasswordService`)

**Core config** (`src/core/config/`) — all config reads from `process.env`:

- `app-config.ts` — port, name, env detection
- `jwt-config.ts` — access/refresh token secrets and algorithm
- `db-config.ts` — Prisma client singleton (`db`)

**Path alias**: `@/*` → `src/*` (configured in `tsconfig.json`)

**Response format**: All endpoints return `{ message, data, pagination? }` via `ok()` helper.

**Auth flow**: JWT access token (15min) + refresh token (7d) stored in httpOnly cookie. `authGuard()` middleware validates tokens and injects `user` into request context.

**Error handling**: `error-middleware.ts` catches `ApiError` and `ValidationError` globally. Throw `ApiError` for business logic errors — never set status codes manually.

**OpenAPI docs**: Available at `/docs` (Swagger UI) via `@elysia/openapi`.

## Environment Variables

Required (see `.env.example`):

- `APP_PORT`, `APP_NAME`, `APP_VERSION`, `APP_BASE_URL`
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ALGORITHM`
- `BCRYPT_SALT`

## Adding New Modules

1. Create `src/modules/<name>/` with route, module, schema files
2. Define TypeDI service in `repository/` with `@Service()` decorator
3. Export route function, register in `src/route.ts`
4. Use `ok()` for responses, `ApiError` for errors
5. Define Elysia schemas for request/response validation
