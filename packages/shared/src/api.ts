import { z } from "zod";

import { CefrLevelSchema } from "./cefr";
import { LanguageCodeSchema } from "./language";
import { ExerciseAttemptSchema, LearningExerciseSchema } from "./learning";

/** Base path of every versioned REST endpoint. */
export const API_PREFIX = "/api/v1";

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  uptimeSeconds: z.number().nonnegative(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ReadinessResponseSchema = z.object({
  status: z.enum(["ready", "unavailable"]),
  checks: z.object({ database: z.enum(["up", "down"]) }),
});
export type ReadinessResponse = z.infer<typeof ReadinessResponseSchema>;

/** GET /learning/exercises/sample */
export const SampleExerciseQuerySchema = z.object({
  level: CefrLevelSchema.default("A1"),
  sourceLanguage: LanguageCodeSchema.optional(),
  targetLanguage: LanguageCodeSchema.optional(),
});
export type SampleExerciseQuery = z.input<typeof SampleExerciseQuerySchema>;
export const SampleExerciseResponseSchema = LearningExerciseSchema;
export type SampleExerciseResponse = z.infer<typeof SampleExerciseResponseSchema>;

/** POST /learning/exercises/:exerciseId/attempts */
export const SubmitAttemptParamsSchema = z.object({ exerciseId: z.string().min(1).max(100) });
export const SubmitAttemptBodySchema = z.object({
  response: z.string().trim().min(1, "Response must not be empty").max(500),
});
export type SubmitAttemptBody = z.infer<typeof SubmitAttemptBodySchema>;
export const SubmitAttemptResponseSchema = ExerciseAttemptSchema;
export type SubmitAttemptResponse = z.infer<typeof SubmitAttemptResponseSchema>;
