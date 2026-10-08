# Architecture

LinguaFlow is a **modular monolith**: one web app, one API, a set of internal packages. There are
no microservices.

```
 Browser ──HTTP/JSON──▶ apps/web (Next.js) ──HTTP/JSON──▶ apps/api (Fastify) ──▶ PostgreSQL
                                                              │
                                                    packages: shared · learning-engine · ai · database
```

- The web app talks to the API over a typed HTTP contract (Zod schemas in `@linguaflow/shared`).
- The API owns business rules and all database access. It validates every external input itself.
- The frontend never touches the database. AI provider credentials stay on the server.

## Package dependency direction

Arrows mean "may import". Anything not shown is forbidden.

```
apps/web ───────────▶ shared
apps/api ──▶ learning-engine ──▶ shared
        ├──▶ ai ───────────────▶ shared
        ├──▶ database            (leaf)
        └──▶ shared              (leaf)

config  (ESLint / TypeScript / Prettier presets; dev tooling only, imported by every workspace)
```

| Package                       | Responsibility                                                                    | May depend on    |
| ----------------------------- | --------------------------------------------------------------------------------- | ---------------- |
| `@linguaflow/shared`          | Domain types, Zod schemas, API contracts, language configuration                  | nothing          |
| `@linguaflow/learning-engine` | Language-independent rules: CEFR helpers, answer evaluation, progress aggregation | `shared`         |
| `@linguaflow/ai`              | Provider-neutral interfaces + deterministic mock provider (server-side only)      | `shared`         |
| `@linguaflow/database`        | Drizzle schema, migrations, PostgreSQL client                                     | nothing          |
| `@linguaflow/config`          | Shared tooling configuration                                                      | nothing          |
| `apps/api`                    | HTTP layer, orchestration, seed content                                           | all of the above |
| `apps/web`                    | UI. Imports only `shared` (types/schemas) and talks to the API                    | `shared`         |

**How it is enforced** (not just documented):

1. `package.json` dependencies: pnpm's strict `node_modules` makes undeclared imports fail.
2. ESLint `no-restricted-imports` per workspace (`packages/config/eslint`). For example the web app
   cannot import `@linguaflow/database`, `drizzle-orm` or `postgres`; `shared` and `database` cannot
   import any other workspace package; `learning-engine` and `ai` may import only `shared`.
3. No package imports `apps/*`.

There are no circular dependencies by construction: the graph above is a DAG.

## Decisions

### Internal packages ship TypeScript source

Packages export `./src/index.ts` instead of a compiled `dist/`. There is no per-package build step
and no stale-build class of bugs. Next compiles them via `transpilePackages`; the API bundles them
with tsup (`noExternal: [/^@linguaflow\//]`); Vitest and `tsx` run them directly. Trade-off: the
packages are not publishable as-is, which is fine while they are private.

### Language configuration is separate from learning logic

`shared/src/languages.ts` is _data_ (languages, supported source→target pairs). `learning-engine` is
_logic_ and knows nothing about English or Spanish: it compares normalised strings and CEFR
indices. Adding a language is a data and content change, not an engine change. The sample endpoint
already takes `sourceLanguage`/`targetLanguage` and rejects unsupported pairs.

### Expected answers never leave the server

`LearningExercise` (what the API returns) has no answer field. Accepted answers and explanations
live in the API's seed data. Feedback is computed server-side.

### Uniform error envelope

Every failure is `{ "error": { "code", "message", "details?" } }`: validation errors, 404s, domain
errors and unexpected 500s (which never leak internals). The web client parses this shape.

### Database values are validated by the API, not duplicated as enums

`level` and `skill` are `text` columns validated by the shared Zod schemas, so adding a skill or
language never needs a migration. There is no users table yet; learner ownership arrives with
authentication.

### AI boundary

`@linguaflow/ai` defines `LanguageTutor`, `ExerciseGenerator` and `WritingFeedbackProvider` with Zod
input/output schemas. Only a deterministic mock exists. Contracts only cover **text**; nothing claims
to assess pronunciation. Real vendors are a later milestone.

### Next.js configuration

`cacheComponents` and `partialPrefetching` are enabled (they were already set in the project). The
current pages are static shells; the learning UI fetches from the API on the client with TanStack
Query. Zustand is intentionally not installed: there is no shared client state yet.

### Readiness vs liveness

`/api/v1/health` never touches dependencies. `/api/v1/health/ready` pings PostgreSQL and returns 503
when it is unreachable (or not configured). The learning endpoints do not need the database, so the
API starts and serves them even when PostgreSQL is down.

## Known limitations

- Seed content: one exercise per level, Spanish→English only.
- Attempts are not persisted; the `exercise_attempts` table exists for the next milestone.
- No authentication, rate limiting or caching layer yet.
- `shared` and `learning-engine` are loaded from source, so they cannot be consumed outside the
  monorepo without adding a build step.
