import {
  ApiErrorSchema,
  SampleExerciseQuerySchema,
  SampleExerciseResponseSchema,
  SubmitAttemptBodySchema,
  SubmitAttemptParamsSchema,
  SubmitAttemptResponseSchema,
} from "@linguaflow/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { getSampleExercise, submitAttempt } from "./service";

export const learningRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/learning/exercises/sample",
    {
      schema: {
        tags: ["learning"],
        summary: "Get a sample exercise for a CEFR level",
        description:
          "Deterministic seed content. Defaults to Spanish interface language and English target.",
        querystring: SampleExerciseQuerySchema,
        response: {
          200: SampleExerciseResponseSchema,
          400: ApiErrorSchema,
          404: ApiErrorSchema,
        },
      },
    },
    async (request) => getSampleExercise(request.query),
  );

  app.post(
    "/learning/exercises/:exerciseId/attempts",
    {
      schema: {
        tags: ["learning"],
        summary: "Submit an answer and receive deterministic feedback",
        params: SubmitAttemptParamsSchema,
        body: SubmitAttemptBodySchema,
        response: {
          200: SubmitAttemptResponseSchema,
          400: ApiErrorSchema,
          404: ApiErrorSchema,
        },
      },
    },
    async (request) => submitAttempt(request.params.exerciseId, request.body.response),
  );
};
