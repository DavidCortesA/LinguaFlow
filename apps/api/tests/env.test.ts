import { describe, expect, it } from "vitest";

import { loadConfig } from "../src/config/env";

describe("loadConfig", () => {
  it("applies safe defaults", () => {
    const config = loadConfig({});
    expect(config.API_HOST).toBe("127.0.0.1");
    expect(config.API_PORT).toBe(4000);
    expect(config.CORS_ORIGINS).toEqual(["http://localhost:3000"]);
    expect(config.DATABASE_URL).toBeUndefined();
  });

  it("parses comma-separated origins and coerces the port", () => {
    const config = loadConfig({ API_PORT: "5000", CORS_ORIGINS: "http://a.test, http://b.test" });
    expect(config.API_PORT).toBe(5000);
    expect(config.CORS_ORIGINS).toEqual(["http://a.test", "http://b.test"]);
  });

  it("treats an empty DATABASE_URL as unset", () => {
    expect(loadConfig({ DATABASE_URL: "" }).DATABASE_URL).toBeUndefined();
  });

  it("fails with a readable message on invalid values", () => {
    expect(() => loadConfig({ API_PORT: "not-a-port" })).toThrow(/API_PORT/);
  });
});
