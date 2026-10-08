import { createDatabase, type Database } from "@linguaflow/database";

import { buildApp } from "./app";
import { loadConfig } from "./config/env";

async function main() {
  const config = loadConfig();
  const database: Database | undefined = config.DATABASE_URL
    ? createDatabase(config.DATABASE_URL)
    : undefined;

  const app = await buildApp({
    logger: { level: config.LOG_LEVEL },
    corsOrigins: config.CORS_ORIGINS,
    checkDatabase: database ? () => database.ping() : undefined,
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    app.log.info({ signal }, "shutting down");
    try {
      await app.close();
      await database?.close();
      process.exit(0);
    } catch (error) {
      app.log.error({ err: error }, "error during shutdown");
      process.exit(1);
    }
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  if (!database) {
    app.log.warn("DATABASE_URL is not set: /api/v1/health/ready will report the database as down");
  }

  await app.listen({ host: config.API_HOST, port: config.API_PORT });
}

main().catch((error: unknown) => {
  // The logger may not exist yet (e.g. invalid configuration), so write to stderr directly.
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
