import { HealthResponseSchema, ReadinessResponseSchema } from "@linguaflow/shared";
import { afterEach, describe, expect, it } from "vitest";

import { buildApp } from "../src/app";

type App = Awaited<ReturnType<typeof buildApp>>;
let app: App | undefined;

afterEach(async () => {
  await app?.close();
  app = undefined;
});

describe("GET /api/v1/health", () => {
  it("returns ok without touching dependencies", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/health" });
    expect(response.statusCode).toBe(200);
    expect(HealthResponseSchema.parse(response.json()).status).toBe("ok");
  });
});

describe("GET /api/v1/health/ready", () => {
  it("is ready when the database check passes", async () => {
    app = await buildApp({ checkDatabase: async () => true });
    const response = await app.inject({ method: "GET", url: "/api/v1/health/ready" });
    expect(response.statusCode).toBe(200);
    expect(ReadinessResponseSchema.parse(response.json())).toEqual({
      status: "ready",
      checks: { database: "up" },
    });
  });

  it("returns 503 when the database check fails", async () => {
    app = await buildApp({ checkDatabase: async () => false });
    const response = await app.inject({ method: "GET", url: "/api/v1/health/ready" });
    expect(response.statusCode).toBe(503);
    expect(response.json().checks.database).toBe("down");
  });

  it("returns 503 when no database is configured", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/health/ready" });
    expect(response.statusCode).toBe(503);
  });
});

describe("platform behaviour", () => {
  it("serves the OpenAPI document", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/docs/json" });
    expect(response.statusCode).toBe(200);
    const doc = response.json();
    expect(doc.openapi).toMatch(/^3\./);
    expect(Object.keys(doc.paths)).toEqual(
      expect.arrayContaining([
        "/api/v1/health",
        "/api/v1/learning/exercises/sample",
        "/api/v1/learning/exercises/{exerciseId}/attempts",
      ]),
    );
  });

  it("uses the standard error envelope for unknown routes", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/nope" });
    expect(response.statusCode).toBe(404);
    expect(response.json().error.code).toBe("not_found");
  });

  it("only allows configured CORS origins", async () => {
    app = await buildApp({ corsOrigins: ["http://localhost:3000"] });
    const allowed = await app.inject({
      method: "GET",
      url: "/api/v1/health",
      headers: { origin: "http://localhost:3000" },
    });
    expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    const denied = await app.inject({
      method: "GET",
      url: "/api/v1/health",
      headers: { origin: "http://evil.example" },
    });
    expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
