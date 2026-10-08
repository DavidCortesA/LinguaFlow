# API reference

Base URL (local): `http://localhost:4000`. All endpoints are under `/api/v1`.
Interactive documentation: `/docs` (Swagger UI); machine-readable OpenAPI 3.1: `/docs/json`.

Request and response shapes are defined once as Zod schemas in
[`packages/shared/src/api.ts`](../packages/shared/src/api.ts), used both to validate/serialize in the
API and to parse responses in the web app.

## Errors

Every error uses the same envelope:

```json
{ "error": { "code": "validation_error", "message": "Request validation failed", "details": [] } }
```

| HTTP | `code`                      | When                                                    |
| ---- | --------------------------- | ------------------------------------------------------- |
| 400  | `validation_error`          | Query, params or body fail schema validation            |
| 400  | `invalid_response`          | Answer is not a valid choice id / exceeds `maxLength`   |
| 400  | `unsupported_language_pair` | No content for the requested source/target languages    |
| 404  | `exercise_not_found`        | Unknown exercise id, or no exercise for that level      |
| 404  | `not_found`                 | Unknown route                                           |
| 500  | `internal_error`            | Unexpected failure (details are logged, never returned) |

## Endpoints

### `GET /api/v1/health`

Liveness. Does not touch dependencies.

```json
{ "status": "ok", "uptimeSeconds": 42 }
```

### `GET /api/v1/health/ready`

Readiness. `200` when PostgreSQL answers, otherwise `503`.

```json
{ "status": "ready", "checks": { "database": "up" } }
```

```json
{ "status": "unavailable", "checks": { "database": "down" } }
```

### `GET /api/v1/learning/exercises/sample`

Returns a deterministic sample exercise. The expected answer is **not** included.

| Query            | Type         | Default | Notes                        |
| ---------------- | ------------ | ------- | ---------------------------- |
| `level`          | `A1`…`C2`    | `A1`    |                              |
| `sourceLanguage` | ISO 639 code | `es`    | Language of the instructions |
| `targetLanguage` | ISO 639 code | `en`    | Language being learned       |

```bash
curl "http://localhost:4000/api/v1/learning/exercises/sample?level=B1"
```

```json
{
  "id": "es-en-b1-001",
  "type": "multiple_choice",
  "skill": "grammar",
  "prompt": "If I ___ more time, I would learn Italian.",
  "instructions": "Elige la opción correcta para el segundo condicional.",
  "targetLanguage": "en",
  "level": "B1",
  "responseFormat": {
    "kind": "single_choice",
    "options": [
      { "id": "had", "label": "had" },
      { "id": "have", "label": "have" },
      { "id": "will have", "label": "will have" }
    ]
  }
}
```

`responseFormat.kind` is either `single_choice` (send an option `id`) or `free_text` (send text up
to `maxLength`).

### `POST /api/v1/learning/exercises/{exerciseId}/attempts`

Validates the answer and returns deterministic feedback. Nothing is persisted yet.

Body: `{ "response": "had" }` (1–500 characters after trimming).
Free-text answers are compared ignoring case, extra whitespace, curly apostrophes and trailing
punctuation.

```bash
curl -X POST -H 'content-type: application/json' -d '{"response":"are"}' \
  http://localhost:4000/api/v1/learning/exercises/es-en-a1-001/attempts
```

```json
{
  "exerciseId": "es-en-a1-001",
  "response": "are",
  "feedback": {
    "isCorrect": false,
    "message": "Casi. Con she, he e it usamos «is».",
    "correctAnswer": "is"
  },
  "completedAt": "2026-10-08T22:52:04.213Z"
}
```

`correctAnswer` is present only when `isCorrect` is `false`.

## CORS

Only origins listed in `CORS_ORIGINS` receive CORS headers.
