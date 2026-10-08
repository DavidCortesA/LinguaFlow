# Contributing to LinguaFlow

Thanks for helping. This is an early-stage project, so small, focused pull requests are easiest to
review.

## Getting started

1. Fork and clone the repository.
2. Follow [DEVELOPMENT.md](DEVELOPMENT.md) to install and run everything locally.
3. Create a branch from `main`: `feat/…`, `fix/…` or `docs/…`.

## Before opening a pull request

Run the same checks CI runs:

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e   # if you touched the UI or the learning flow
```

Run `pnpm format` to fix formatting.

## Guidelines

- **Respect the architecture.** Read the dependency direction in
  [ARCHITECTURE.md](ARCHITECTURE.md). ESLint enforces it; do not disable those rules to make an
  import work. If a boundary is wrong, open an issue to discuss it.
- **Strict TypeScript, no `any`.** If a justified exception is unavoidable, add a comment saying
  why.
- **Validate at the boundary.** New request/response shapes are Zod schemas in `packages/shared`.
- **Test what you change.** Unit tests next to the code (or in `tests/`), integration tests for API
  routes via `app.inject()`, Playwright for user-visible flows. Bug fixes should include a test that
  fails without the fix.
- **No speculative abstractions.** Add a layer when a concrete use case needs it.
- **Accessibility is part of "done":** semantic HTML, keyboard operation, visible focus, sufficient
  contrast, labelled controls.
- **Never commit secrets.** Only placeholders belong in `.env.example`. API keys must stay on the
  server and must not be prefixed `NEXT_PUBLIC_`.
- **Copy:** learner-facing text lives in `apps/web/src/config/messages.ts` (Spanish today).
- **Database changes** need a generated migration (`pnpm db:generate`) committed with the schema
  change.

## Commit messages and pull requests

Use short imperative commit messages (`Add B2 sample exercise`). In the pull request, explain what
changed and why, and how you verified it (commands run, screenshots for UI changes).

## AI features and cost

Features that call external AI providers must go through the interfaces in `@linguaflow/ai`, work
with the mock provider for tests and offline development, and document that real usage may incur
costs for the key owner.

## Code of conduct

Be respectful and constructive. Harassment or discrimination is not tolerated.

## License

By contributing you agree that your contributions are licensed under the [MIT License](../LICENSE).
