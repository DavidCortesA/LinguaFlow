import { HealthResponseSchema, ReadinessResponseSchema } from "@linguaflow/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export interface HealthRoutesOptions {
  /** Resolves `true` when the database is reachable. Absent means "not configured". */
  checkDatabase?: () => Promise<boolean>;
}

export const healthRoutes: FastifyPluginAsyncZod<HealthRoutesOptions> = async (app, options) => {
  app.get(
    "/health",
    {
      schema: {
        tags: ["health"],
        summary: "Liveness probe",
        description: "Returns 200 while the process is running. Does not touch dependencies.",
        response: { 200: HealthResponseSchema },
      },
    },
    async () => ({ status: "ok" as const, uptimeSeconds: Math.round(process.uptime()) }),
  );

  app.get(
    "/health/ready",
    {
      schema: {
        tags: ["health"],
        summary: "Readiness probe",
        description: "Returns 200 when dependencies (PostgreSQL) are reachable, otherwise 503.",
        response: { 200: ReadinessResponseSchema, 503: ReadinessResponseSchema },
      },
    },
    async (_request, reply) => {
      const databaseUp = options.checkDatabase ? await options.checkDatabase() : false;
      const body = {
        status: databaseUp ? ("ready" as const) : ("unavailable" as const),
        checks: { database: databaseUp ? ("up" as const) : ("down" as const) },
      };
      return reply.status(databaseUp ? 200 : 503).send(body);
    },
  );
};
