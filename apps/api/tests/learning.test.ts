import {
  CEFR_LEVELS,
  LearningExerciseSchema,
  SubmitAttemptResponseSchema,
} from "@linguaflow/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { buildApp } from "../src/app";
import { SEED_EXERCISES } from "../src/modules/learning/seed-data";

type App = Awaited<ReturnType<typeof buildApp>>;
let app: App;

beforeAll(async () => {
  app = await buildApp();
});
afterAll(async () => {
  await app.close();
});

const sample = (query = "") =>
  app.inject({ method: "GET", url: `/api/v1/learning/exercises/sample${query}` });
const attempt = (exerciseId: string, payload: unknown) =>
  app.inject({
    method: "POST",
    url: `/api/v1/learning/exercises/${exerciseId}/attempts`,
    payload: payload as object,
  });

describe("seed data", () => {
  it("has exactly one valid exercise per CEFR level, with unique ids", () => {
    const seeds = SEED_EXERCISES["es:en"] ?? [];
    expect(seeds.map((seed) => seed.exercise.level)).toEqual([...CEFR_LEVELS]);
    expect(new Set(seeds.map((seed) => seed.exercise.id)).size).toBe(seeds.length);
    for (const seed of seeds) {
      expect(LearningExerciseSchema.safeParse(seed.exercise).success).toBe(true);
      expect(seed.acceptedAnswers.length).toBeGreaterThan(0);
    }
  });
});

describe("GET /api/v1/learning/exercises/sample", () => {
  it("defaults to A1", async () => {
    const response = await sample();
    expect(response.statusCode).toBe(200);
    const exercise = LearningExerciseSchema.parse(response.json());
    expect(exercise.level).toBe("A1");
    expect(exercise.targetLanguage).toBe("en");
  });

  it.each(CEFR_LEVELS)("returns a valid exercise for %s", async (level) => {
    const response = await sample(`?level=${level}`);
    expect(response.statusCode).toBe(200);
    expect(LearningExerciseSchema.parse(response.json()).level).toBe(level);
  });

  it("is deterministic", async () => {
    expect((await sample("?level=B1")).json()).toEqual((await sample("?level=B1")).json());
  });

  it("never leaks the expected answer or explanation", async () => {
    const body = (await sample("?level=A2")).body;
    expect(body).not.toContain("acceptedAnswers");
    expect(body).not.toContain("explanation");
    expect(body).not.toContain("went");
  });

  it("rejects an invalid level with the error envelope", async () => {
    const response = await sample("?level=Z9");
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("validation_error");
  });

  it("rejects unsupported language pairs", async () => {
    const response = await sample("?sourceLanguage=fr&targetLanguage=de");
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("unsupported_language_pair");
  });
});

describe("POST /api/v1/learning/exercises/:exerciseId/attempts", () => {
  it("marks a correct multiple-choice answer", async () => {
    const response = await attempt("es-en-a1-001", { response: "is" });
    expect(response.statusCode).toBe(200);
    const result = SubmitAttemptResponseSchema.parse(response.json());
    expect(result.feedback.isCorrect).toBe(true);
    expect(result.feedback.correctAnswer).toBeUndefined();
    expect(result.exerciseId).toBe("es-en-a1-001");
  });

  it("marks a wrong answer and reveals the correct one", async () => {
    const response = await attempt("es-en-a1-001", { response: "are" });
    expect(response.statusCode).toBe(200);
    const { feedback } = SubmitAttemptResponseSchema.parse(response.json());
    expect(feedback.isCorrect).toBe(false);
    expect(feedback.correctAnswer).toBe("is");
  });

  it("normalises free-text answers (case, spacing, punctuation)", async () => {
    const response = await attempt("es-en-b2-001", { response: "  Had   ALREADY started. " });
    expect(response.json().feedback.isCorrect).toBe(true);
  });

  it("is deterministic for the same input", async () => {
    const a = (await attempt("es-en-a2-001", { response: "goed" })).json();
    const b = (await attempt("es-en-a2-001", { response: "goed" })).json();
    expect({ ...a, completedAt: null }).toEqual({ ...b, completedAt: null });
  });

  it("rejects an empty answer", async () => {
    const response = await attempt("es-en-a1-001", { response: "   " });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("validation_error");
  });

  it("rejects a missing or non-string body field", async () => {
    expect((await attempt("es-en-a1-001", {})).statusCode).toBe(400);
    expect((await attempt("es-en-a1-001", { response: 42 })).statusCode).toBe(400);
  });

  it("rejects a choice that is not one of the options", async () => {
    const response = await attempt("es-en-a1-001", { response: "banana" });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("invalid_response");
  });

  it("rejects free text longer than the format allows", async () => {
    const response = await attempt("es-en-a2-001", { response: "x".repeat(60) });
    expect(response.statusCode).toBe(400);
    expect(response.json().error.code).toBe("invalid_response");
  });

  it("returns 404 for an unknown exercise", async () => {
    const response = await attempt("does-not-exist", { response: "is" });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe("exercise_not_found");
  });
});
