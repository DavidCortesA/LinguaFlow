import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export interface Database {
  db: ReturnType<typeof drizzle<typeof schema>>;
  /** Resolves `true` when the database answers a trivial query, `false` otherwise. Never throws. */
  ping(): Promise<boolean>;
  close(): Promise<void>;
}

/**
 * Creates a client. postgres.js connects lazily, so building one never fails or blocks when
 * PostgreSQL is down; errors surface on the first query (and `ping()` reports them as `false`).
 */
export function createDatabase(connectionString: string): Database {
  const client = postgres(connectionString, {
    max: 10,
    connect_timeout: 3,
    idle_timeout: 30,
  });
  const db = drizzle(client, { schema });

  return {
    db,
    async ping() {
      try {
        await db.execute(sql`select 1`);
        return true;
      } catch {
        return false;
      }
    },
    async close() {
      await client.end({ timeout: 5 });
    },
  };
}
