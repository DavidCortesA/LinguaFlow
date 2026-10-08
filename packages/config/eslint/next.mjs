import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

import { boundaryRules } from "./base.mjs";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      ...boundaryRules.restrict(
        [
          "@linguaflow/database",
          "@linguaflow/database/*",
          "drizzle-orm",
          "drizzle-orm/*",
          "postgres",
        ],
        "The web app must never access the database. Call the API instead.",
      ),
    },
  },
  prettier,
]);
