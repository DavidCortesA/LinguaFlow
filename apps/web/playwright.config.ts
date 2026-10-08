import { defineConfig, devices } from "@playwright/test";

// Dedicated ports so e2e never collides with a developer's running `pnpm dev`.
const WEB_PORT = 3100;
const API_PORT = 4100;
const WEB_URL = `http://localhost:${WEB_PORT}`;
const API_URL = `http://localhost:${API_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      // The API needs no database for the learning flow.
      command: "pnpm --filter @linguaflow/api exec tsx src/server.ts",
      url: `${API_URL}/api/v1/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        API_PORT: String(API_PORT),
        CORS_ORIGINS: WEB_URL,
        LOG_LEVEL: "warn",
      },
    },
    {
      // A production build is closer to what users get and avoids the dev-server lock.
      command: `pnpm build && pnpm exec next start -p ${WEB_PORT}`,
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: { NEXT_PUBLIC_API_URL: API_URL },
    },
  ],
});
