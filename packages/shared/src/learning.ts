import { z } from "zod";

import { CefrLevelSchema, cefrIndex } from "./cefr";
import { LanguageCodeSchema } from "./language";

export const SKILLS = [
  "vocabulary",
  "grammar",
  "listening",
  "speaking",
  "reading",
  "writing",
] as const;
export const SkillSchema = z.enum(SKILLS);
export type Skill = z.infer<typeof SkillSchema>;

export const LEARNING_GOALS = ["travel", "work", "study", "conversation", "certification"] as const;
export const LearningGoalSchema = z.enum(LEARNING_GOALS);
export type LearningGoal = z.infer<typeof LearningGoalSchema>;

export const LearningProfileSchema = z
  .object({
    sourceLanguage: LanguageCodeSchema,
    targetLanguage: LanguageCodeSchema,
    currentLevel: CefrLevelSchema,
    targetLevel: CefrLevelSchema,
    goals: z.array(LearningGoalSchema).max(LEARNING_GOALS.length),
  })
  .refine((profile) => profile.sourceLanguage !== profile.targetLanguage, {
    message: "Source and target languages must differ",
    path: ["targetLanguage"],
  })
  .refine((profile) => cefrIndex(profile.targetLevel) >= cefrIndex(profile.currentLevel), {
    message: "Target level must not be below the current level",
    path: ["targetLevel"],
  });
export type LearningProfile = z.infer<typeof LearningProfileSchema>;

export const EXERCISE_TYPES = ["multiple_choice", "fill_in_the_blank"] as const;
export const ExerciseTypeSchema = z.enum(EXERCISE_TYPES);
export type ExerciseType = z.infer<typeof ExerciseTypeSchema>;

/** Describes the shape of the answer the learner must give. */
export const ResponseFormatSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("single_choice"),
    options: z
      .array(z.object({ id: z.string().min(1), label: z.string().min(1) }))
      .min(2)
      .refine((options) => new Set(options.map((o) => o.id)).size === options.length, {
        message: "Option ids must be unique",
      }),
  }),
  z.object({
    kind: z.literal("free_text"),
    maxLength: z.number().int().positive().max(500),
  }),
]);
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

/** What the API exposes to learners. Never contains the expected answer. */
export const LearningExerciseSchema = z.object({
  id: z.string().min(1),
  type: ExerciseTypeSchema,
  skill: SkillSchema,
  prompt: z.string().min(1),
  /** Written in the learner's interface (source) language. */
  instructions: z.string().min(1),
  targetLanguage: LanguageCodeSchema,
  level: CefrLevelSchema,
  responseFormat: ResponseFormatSchema,
});
export type LearningExercise = z.infer<typeof LearningExerciseSchema>;

export const ExerciseFeedbackSchema = z.object({
  isCorrect: z.boolean(),
  message: z.string().min(1),
  /** Present only when the answer was wrong. */
  correctAnswer: z.string().optional(),
});
export type ExerciseFeedback = z.infer<typeof ExerciseFeedbackSchema>;

export const ExerciseAttemptSchema = z.object({
  exerciseId: z.string().min(1),
  response: z.string(),
  feedback: ExerciseFeedbackSchema,
  completedAt: z.iso.datetime(),
});
export type ExerciseAttempt = z.infer<typeof ExerciseAttemptSchema>;

export const SkillProgressSchema = z.object({
  completed: z.number().int().nonnegative(),
  correct: z.number().int().nonnegative(),
});
export type SkillProgress = z.infer<typeof SkillProgressSchema>;

export const LearningProgressSchema = z.object({
  totalCompleted: z.number().int().nonnegative(),
  totalCorrect: z.number().int().nonnegative(),
  bySkill: z.partialRecord(SkillSchema, SkillProgressSchema),
});
export type LearningProgress = z.infer<typeof LearningProgressSchema>;
