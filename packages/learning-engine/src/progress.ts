import type { LearningProgress, Skill } from "@linguaflow/shared";

export interface CompletedAttempt {
  skill: Skill;
  isCorrect: boolean;
}

/** Aggregates completed attempts into overall and per-skill counts. */
export function summarizeProgress(attempts: readonly CompletedAttempt[]): LearningProgress {
  const bySkill: LearningProgress["bySkill"] = {};
  let totalCorrect = 0;

  for (const { skill, isCorrect } of attempts) {
    const entry = bySkill[skill] ?? { completed: 0, correct: 0 };
    entry.completed += 1;
    if (isCorrect) {
      entry.correct += 1;
      totalCorrect += 1;
    }
    bySkill[skill] = entry;
  }

  return { totalCompleted: attempts.length, totalCorrect, bySkill };
}
