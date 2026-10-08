export interface BuildAppOptions {
  /** Pino level, or `false` to silence logs (tests). */
  logger?: false | { level: string };
  /** Browser origins allowed to call the API. */
  corsOrigins?: string[];
  /** Readiness dependency. Omit when no database is configured. */
  checkDatabase?: (() => Promise<boolean>) | undefined;
}
