import type { ApiError } from "@linguaflow/shared";
import type { FastifyInstance, FastifyReply } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

import { HttpError } from "../lib/http-error";

function send(reply: FastifyReply, statusCode: number, error: ApiError["error"]) {
  const body: ApiError = { error };
  return reply.status(statusCode).send(body);
}

/** Every failure leaves the API in the same `{ error: { code, message, details? } }` shape. */
export function registerErrorHandling(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) =>
    send(reply, 404, {
      code: "not_found",
      message: `Route ${request.method} ${request.url.split("?")[0]} not found`,
    }),
  );

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
      return send(reply, error.statusCode, {
        code: error.code,
        message: error.message,
        details: error.details,
      });
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
      return send(reply, 400, {
        code: "validation_error",
        message: "Request validation failed",
        details: error.validation.map((issue) => ({
          location: issue.instancePath,
          message: issue.message,
        })),
      });
    }

    const statusCode =
      typeof (error as { statusCode?: unknown }).statusCode === "number"
        ? (error as { statusCode: number }).statusCode
        : 500;

    if (statusCode >= 500 || isResponseSerializationError(error)) {
      // Log everything, reveal nothing.
      request.log.error({ err: error }, "unhandled error");
      return send(reply, 500, { code: "internal_error", message: "Internal server error" });
    }

    return send(reply, statusCode, {
      code: "bad_request",
      message: error instanceof Error ? error.message : "Bad request",
    });
  });
}
