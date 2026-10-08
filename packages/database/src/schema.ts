import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * One row per submitted exercise answer.
 *
 * Intentionally minimal: there is no users table yet. A learner reference is added in the
 * milestone that introduces authentication. Values such as `level` and `skill` are validated
 * by the API (see @linguaflow/shared) rather than duplicated as database enums, so adding a
 * language, skill or exercise type never requires a migration.
 */
export const exerciseAttempts = pgTable("exercise_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: text("exercise_id").notNull(),
  level: text("level").notNull(),
  skill: text("skill").notNull(),
  response: text("response").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ExerciseAttemptRow = typeof exerciseAttempts.$inferSelect;
export type NewExerciseAttemptRow = typeof exerciseAttempts.$inferInsert;
