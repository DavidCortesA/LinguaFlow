import {
  API_PREFIX,
  ApiErrorSchema,
  SampleExerciseResponseSchema,
  SubmitAttemptResponseSchema,
  type CefrLevel,
  type SampleExerciseResponse,
  type SubmitAttemptResponse,
} from "@linguaflow/shared";
import type { z } from "zod";

import { siteConfig } from "@/config/site";

export class ApiRequestError extends Error {
  constructor(
    /** HTTP status, or 0 when the server could not be reached. */
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/** Typed HTTP call: the response body is validated against the shared contract. */
async function request<S extends z.ZodType>(
  path: string,
  schema: S,
  init?: RequestInit,
): Promise<z.output<S>> {
  let response: Response;
  try {
    response = await fetch(`${siteConfig.apiUrl}${API_PREFIX}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiRequestError(0, "network_error", "Could not reach the API");
  }

  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(body);
    throw new ApiRequestError(
      response.status,
      parsed.success ? parsed.data.error.code : "http_error",
      parsed.success ? parsed.data.error.message : `Request failed with status ${response.status}`,
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiRequestError(response.status, "invalid_response", "Unexpected API response shape");
  }
  return parsed.data;
}

export function fetchSampleExercise(level: CefrLevel): Promise<SampleExerciseResponse> {
  return request(
    `/learning/exercises/sample?level=${encodeURIComponent(level)}`,
    SampleExerciseResponseSchema,
  );
}

export function submitAttempt(
  exerciseId: string,
  response: string,
): Promise<SubmitAttemptResponse> {
  return request(
    `/learning/exercises/${encodeURIComponent(exerciseId)}/attempts`,
    SubmitAttemptResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    },
  );
}
