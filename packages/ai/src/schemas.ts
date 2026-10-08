import {
  CefrLevelSchema,
  LanguageCodeSchema,
  LearningExerciseSchema,
  SkillSchema,
} from "@linguaflow/shared";
import { z } from "zod";

/** Shared context for every AI request. */
const LanguageContextSchema = z.object({
  /** Language being learned. */
  targetLanguage: LanguageCodeSchema,
  /** Language the learner reads explanations in. */
  explanationLanguage: LanguageCodeSchema,
  level: CefrLevelSchema,
});

export const TutorQuestionSchema = LanguageContextSchema.extend({
  question: z.string().trim().min(1).max(2000),
});
export type TutorQuestion = z.infer<typeof TutorQuestionSchema>;

export const TutorAnswerSchema = z.object({
  answer: z.string().min(1),
  /** Short example sentences in the target language. */
  examples: z.array(z.string()).default([]),
});
export type TutorAnswer = z.infer<typeof TutorAnswerSchema>;

export const ExerciseRequestSchema = LanguageContextSchema.extend({
  skill: SkillSchema,
  topic: z.string().trim().min(1).max(200).optional(),
});
export type ExerciseRequest = z.infer<typeof ExerciseRequestSchema>;

export const GeneratedExerciseSchema = z.object({
  exercise: LearningExerciseSchema,
  /** Kept server-side. Never forward to the browser. */
  acceptedAnswers: z.array(z.string().min(1)).min(1),
});
export type GeneratedExercise = z.infer<typeof GeneratedExerciseSchema>;

export const WritingReviewRequestSchema = LanguageContextSchema.extend({
  text: z.string().trim().min(1).max(5000),
});
export type WritingReviewRequest = z.infer<typeof WritingReviewRequestSchema>;

export const WritingSuggestionSchema = z.object({
  original: z.string(),
  suggestion: z.string(),
  explanation: z.string(),
});
export type WritingSuggestion = z.infer<typeof WritingSuggestionSchema>;

/**
 * Feedback on *written* text only. Pronunciation cannot be assessed from text, so nothing
 * in this contract claims to.
 */
export const WritingFeedbackSchema = z.object({
  summary: z.string().min(1),
  suggestions: z.array(WritingSuggestionSchema),
});
export type WritingFeedback = z.infer<typeof WritingFeedbackSchema>;
