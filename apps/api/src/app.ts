import cors from "@fastify/cors";
import { API_PREFIX } from "@linguaflow/shared";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { healthRoutes } from "./modules/health/routes";
import { learningRoutes } from "./modules/learning/routes";
import { registerErrorHandling } from "./plugins/error-handler";
import { registerOpenApi } from "./plugins/openapi";
import type { BuildAppOptions } from "./types/app-options";

/** Builds the Fastify instance without listening, so tests can use `app.inject()`. */
export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger
      ? {
          level: options.logger.level,
          // Never log credentials, even by accident.
          redact: ["req.headers.authorization", "req.headers.cookie"],
        }
      : false,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandling(app);
  await app.register(cors, {
    origin: options.corsOrigins ?? [],
    methods: ["GET", "POST", "OPTIONS"],
  });
  await registerOpenApi(app);

  await app.register(
    async (v1) => {
      await v1.register(healthRoutes, { checkDatabase: options.checkDatabase });
      await v1.register(learningRoutes);
    },
    { prefix: API_PREFIX },
  );

  return app;
}
