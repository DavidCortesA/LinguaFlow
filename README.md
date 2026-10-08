# LinguaFlow

Open-source platform for learning languages through structured CEFR learning paths, immediate
feedback and (in later milestones) AI-assisted explanations. The first target is **Spanish
speakers learning English**; the architecture keeps source and target languages configurable.

> **Status: early foundation.** One vertical slice works end to end (see below). Everything else
> in the roadmap is not built yet.

## Current capabilities

- Marketing homepage and a learning area (`/learn`) with a Spanish interface.
- Pick a CEFR level (A1–C2), get a sample exercise, submit an answer, receive deterministic
  feedback with an explanation. Multiple-choice and fill-in-the-blank exercises are supported.
- REST API under `/api/v1` with Zod validation, OpenAPI docs (`/docs`), structured logs, a uniform
  error envelope, and liveness/readiness probes.
- Provider-neutral AI interfaces with a deterministic **mock** provider (no AI key needed).
- PostgreSQL + Drizzle schema and migration (one table; not yet used by the learning flow).

The exercise content is local seed data (one exercise per level). **No AI model is called**, and
no data is persisted yet.

## Stack

| Area      | Technology                                                               |
| --------- | ------------------------------------------------------------------------ |
| Monorepo  | pnpm workspaces, Turborepo, strict TypeScript, ESLint, Prettier          |
| Web       | Next.js (App Router), React, Tailwind CSS v4, shadcn/ui, TanStack Query  |
| Forms     | React Hook Form + Zod                                                    |
| API       | Fastify 5, Zod type provider, OpenAPI (`@fastify/swagger`), pino logging |
| Database  | PostgreSQL 17, Drizzle ORM, Drizzle Kit                                  |
| Testing   | Vitest, React Testing Library, Playwright                                |
| Local dev | Docker Compose (PostgreSQL), GitHub Actions CI                           |

## Prerequisites

- Node.js **>= 22.12** (developed on 24)
- pnpm **11** (`corepack enable` will pick the version from `package.json`)
- Docker (only for PostgreSQL; the learning flow itself does not need a database)

## Setup

```bash
pnpm install
cp .env.example .env          # then review the values; never commit .env
docker compose up -d postgres # optional for the learning flow, needed for /health/ready
pnpm db:migrate               # applies migrations (requires PostgreSQL)
pnpm dev                      # web on :3000, API on :4000
```

Open <http://localhost:3000>, go to **Aprender**, choose a level and complete the exercise.
API docs: <http://localhost:4000/docs>.

## Commands

| Command                                         | What it does                                        |
| ----------------------------------------------- | --------------------------------------------------- |
| `pnpm dev`                                      | Start the web app and the API in parallel           |
| `pnpm build`                                    | Build every package and app                         |
| `pnpm lint` / `pnpm typecheck`                  | Lint / type-check every workspace                   |
| `pnpm test`                                     | Unit and integration tests (Vitest)                 |
| `pnpm test:e2e`                                 | Playwright smoke tests (starts its own servers)     |
| `pnpm format` / `pnpm format:check`             | Format / verify formatting                          |
| `pnpm db:generate` / `db:migrate` / `db:studio` | Generate and apply migrations / open Drizzle Studio |

First e2e run: `pnpm --filter @linguaflow/web exec playwright install chromium`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): decisions and package dependency direction
- [Development guide](docs/DEVELOPMENT.md): environment, database, troubleshooting
- [API reference](docs/API.md)
- [Contributing](docs/CONTRIBUTING.md)

## AI usage and cost

The project runs fully offline with the mock AI provider. When a real provider is added in a later
milestone, **calls to external AI services may incur costs** billed to whoever owns the API key.
Keys stay on the server and are never exposed to the browser.

## Roadmap

1. ✅ Foundation and first vertical slice (this repository state)
2. Persist attempts and learner progress; authentication
3. Learning paths and a larger exercise catalogue
4. First real AI provider for tutor explanations and writing feedback
5. Vocabulary and grammar modules; spaced repetition
6. Listening and speaking (pronunciation needs audio, not text)
7. Additional source and target languages

## License

[MIT](LICENSE)
