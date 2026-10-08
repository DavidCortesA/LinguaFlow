import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig } from "drizzle-kit";

// Load the repository-level .env when present (drizzle-kit does not read it by itself).
// Scripts run from packages/database, so the repo root is two levels up.
const rootEnv = resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // `generate` does not connect, so a missing URL only matters for migrate/studio.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/linguaflow",
  },
});
