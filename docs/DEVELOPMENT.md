# Development guide

## Prerequisites

- Node.js >= 22.12 (the repo is developed on Node 24)
- pnpm 11 (`corepack enable`, or install it yourself)
- Docker, for local PostgreSQL

## First-time setup

```bash
pnpm install
cp .env.example .env
```

Edit `.env` if you want a different database password or ports. `.env` is git-ignored; only
`.env.example` (placeholders) is committed.

### Environment variables

| Variable                                                             | Used by        | Default / notes                                                  |
| -------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Docker Compose | `POSTGRES_PASSWORD` is required by Compose                       |
| `DATABASE_URL`                                                       | API, Drizzle   | Must match the values above. Optional for the learning flow      |
| `API_HOST`, `API_PORT`                                               | API            | `127.0.0.1`, `4000`                                              |
| `LOG_LEVEL`                                                          | API            | `info`                                                           |
| `CORS_ORIGINS`                                                       | API            | Comma-separated browser origins. Default `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL`                                                | Web            | `http://localhost:4000`. **Inlined at build time**               |
| `AI_PROVIDER`, `AI_API_KEY`                                          | API (future)   | `mock` / empty. Not read yet. Never prefix with `NEXT_PUBLIC_`   |

The API loads `../../.env` automatically (`node --env-file-if-exists`). Next.js reads `apps/web/.env*`
files; `NEXT_PUBLIC_API_URL` has a working default, so you normally do not need one there.

## Running

```bash
docker compose up -d postgres   # wait for "healthy": docker compose ps
pnpm db:migrate                 # apply migrations
pnpm dev                        # web :3000, API :4000
```

Without Docker, `pnpm dev` still serves the whole learning flow; only
`GET /api/v1/health/ready` reports `503` (database down).

## Database workflow

The schema is `packages/database/src/schema.ts`. Migrations are SQL files in
`packages/database/drizzle/` and **are committed**.

```bash
pnpm db:generate   # after editing schema.ts: creates a new migration (no DB needed)
pnpm db:migrate    # applies pending migrations (needs PostgreSQL + DATABASE_URL)
pnpm db:studio     # browse data in Drizzle Studio
```

Never edit an applied migration; generate a new one.

## Quality checks

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e
```

Run one workspace: `pnpm --filter @linguaflow/api test`, or one file:
`pnpm --filter @linguaflow/api exec vitest run tests/learning.test.ts`.

End-to-end tests start their own API (port 4100) and a production build of the web app (port 3100),
so they do not collide with `pnpm dev`. First time only:
`pnpm --filter @linguaflow/web exec playwright install chromium`
(on Linux CI add `--with-deps`).

## Adding things

- **A shared schema or API contract:** add it to `packages/shared/src`, export it from `index.ts`,
  then use it in the API route (`schema:`) and the web `api-client`.
- **An exercise:** add it to `apps/api/src/modules/learning/seed-data.ts`; the seed test checks
  there is one valid exercise per CEFR level.
- **A UI primitive:** `apps/web/src/components/ui` (shadcn style). `components.json` is configured
  for the shadcn CLI (`pnpm --filter @linguaflow/web exec shadcn add <component>`).
- **A language pair:** add the language and pair in `packages/shared/src/languages.ts`, then content.

## Troubleshooting

| Symptom                                                    | Fix                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Learning page shows "No pudimos cargar el ejercicio"       | The API is not running or `CORS_ORIGINS` does not include the web origin.          |
| Changed `NEXT_PUBLIC_API_URL` but nothing happened         | It is inlined at build time: restart `pnpm dev` / rebuild.                         |
| `/api/v1/health/ready` returns 503                         | PostgreSQL is down or `DATABASE_URL` is unset. `docker compose ps`, check `.env`.  |
| `docker compose up` fails: "Set POSTGRES_PASSWORD in .env" | Copy `.env.example` to `.env`.                                                     |
| Port already in use (3000 / 4000 / 5432)                   | Stop the other process or change `API_PORT` / `POSTGRES_PORT`.                     |
| `db:migrate` cannot connect                                | Check `DATABASE_URL` matches the Compose credentials and the container is healthy. |
| Playwright: "Executable doesn't exist"                     | `pnpm --filter @linguaflow/web exec playwright install chromium`.                  |
| Stale Next build weirdness                                 | Delete `apps/web/.next` and `.turbo`, then rebuild.                                |
