# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

LinguaFlow: open-source language-learning platform (first target: Spanish speakers learning English). pnpm + Turborepo monorepo. Read `AGENTS.md` first: this Next.js version (16.4, React 19.3) has breaking changes, so consult `node_modules/next/dist/docs/` before writing Next.js code. See `docs/ARCHITECTURE.md` for the full rationale.

## Commands

Run from the repo root (pnpm 11, Node >= 22.12):

- `pnpm dev` — web (:3000) + API (:4000). `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`
- `pnpm format` / `pnpm format:check` (Prettier; CI fails on unformatted code)
- `pnpm db:generate` / `db:migrate` / `db:studio` (Drizzle; `generate` needs no database, `migrate` needs PostgreSQL via `docker compose up -d postgres` and a `.env` copied from `.env.example`)
- One workspace: `pnpm --filter @linguaflow/api test`. One test file: `pnpm --filter @linguaflow/api exec vitest run tests/learning.test.ts`
- e2e starts its own API (:4100) and a production web build (:3100); first run needs `pnpm --filter @linguaflow/web exec playwright install chromium`

## Architecture

Modular monolith: `apps/web` (Next.js) → HTTP → `apps/api` (Fastify) → PostgreSQL. Internal packages ship **TypeScript source** (`exports` → `src/index.ts`, no build step): Next uses `transpilePackages`, the API bundles them with tsup (`noExternal`), Vitest/tsx run them directly. When adding a workspace package consumed by the web app, add it to `transpilePackages` in `apps/web/next.config.ts`.

Dependency direction (enforced by ESLint `no-restricted-imports` in `packages/config/eslint` plus pnpm strictness): `web → shared`; `api → shared, learning-engine, ai, database`; `learning-engine → shared`; `ai → shared`; `shared` and `database` are leaves. The web app must never import `@linguaflow/database`, `drizzle-orm` or `postgres`.

- `packages/shared`: Zod schemas are the single source of truth for domain types and API contracts (`src/api.ts`), used by the API for validation/serialization and by the web `api-client` to parse responses. Language _configuration_ (`languages.ts`) is data, kept separate from learning _logic_.
- `packages/learning-engine`: language-independent (CEFR helpers, `evaluateAnswer`, `summarizeProgress`).
- `packages/ai`: provider-neutral interfaces + deterministic mock; server-side only, text only (no pronunciation claims).
- `apps/api`: `buildApp()` in `src/app.ts` returns an un-listened Fastify instance (tests use `app.inject()`); `server.ts` wires config, DB and shutdown. Routes live under `/api/v1`; every error uses the `{ error: { code, message, details? } }` envelope via `plugins/error-handler.ts` (throw `HttpError` for expected failures). Expected answers and explanations exist only in `modules/learning/seed-data.ts` and are never returned to clients. Learning endpoints do not need the DB; `/health/ready` does.
- `apps/web`: App Router under `src/`; route groups `(marketing)` (home) and `(dashboard)` (`/learn`). `cacheComponents` + `partialPrefetching` are on. Learner-facing copy is Spanish and lives in `src/config/messages.ts`. shadcn/ui style `base-vega` (`components.json`).
- `packages/database`: Drizzle schema + committed SQL migrations in `drizzle/`. `level`/`skill` are plain `text` (validated by shared schemas), not DB enums.

Tests that touch the UI: unit tests in `apps/web/tests/unit` (jsdom), Playwright in `apps/web/tests/e2e`. Note Next's route announcer is also `role="alert"`, so scope e2e alert locators by text.
