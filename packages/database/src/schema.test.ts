import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";

import { createDatabase, exerciseAttempts } from "./index";

describe("schema", () => {
  it("defines the exercise_attempts table", () => {
    const config = getTableConfig(exerciseAttempts);
    expect(config.name).toBe("exercise_attempts");
    expect(config.columns.map((column) => column.name)).toEqual([
      "id",
      "exercise_id",
      "level",
      "skill",
      "response",
      "is_correct",
      "completed_at",
    ]);
  });
});

describe("createDatabase", () => {
  it("does not connect eagerly and reports an unreachable database as down", async () => {
    // Port 1 is never a PostgreSQL server; this must resolve false rather than throw.
    const database = createDatabase("postgresql://nobody:nothing@127.0.0.1:1/none");
    await expect(database.ping()).resolves.toBe(false);
    await database.close();
  });
});
