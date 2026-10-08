import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

/** OpenAPI document at `/docs/json`, interactive UI at `/docs`. */
export async function registerOpenApi(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "LinguaFlow API",
        description: "REST API for the LinguaFlow language-learning platform.",
        version: "0.1.0",
      },
      tags: [
        { name: "health", description: "Liveness and readiness probes" },
        { name: "learning", description: "Exercises and answers" },
      ],
    },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });
}
