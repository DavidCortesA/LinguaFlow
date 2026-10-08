import type { AiProvider } from "./interfaces";
import {
  ExerciseRequestSchema,
  GeneratedExerciseSchema,
  TutorAnswerSchema,
  TutorQuestionSchema,
  WritingFeedbackSchema,
  WritingReviewRequestSchema,
  type WritingSuggestion,
} from "./schemas";

/**
 * Deterministic provider for tests and offline development. It makes no network calls,
 * needs no credentials and returns the same output for the same input. It is *not* a
 * language model: the responses are canned and intentionally simple.
 */
export function createMockAiProvider(): AiProvider {
  return {
    name: "mock",

    tutor: {
      async explain(raw) {
        const input = TutorQuestionSchema.parse(raw);
        return TutorAnswerSchema.parse({
          answer: `[mock tutor] Placeholder explanation for a ${input.level} learner: "${input.question}"`,
          examples: [],
        });
      },
    },

    exerciseGenerator: {
      async generate(raw) {
        const input = ExerciseRequestSchema.parse(raw);
        return GeneratedExerciseSchema.parse({
          exercise: {
            id: `mock-${input.explanationLanguage}-${input.targetLanguage}-${input.level.toLowerCase()}-${input.skill}`,
            type: "fill_in_the_blank",
            skill: input.skill,
            prompt: "[mock] Complete the sentence: I ___ a student.",
            instructions: "[mock] Escribe la palabra que falta.",
            targetLanguage: input.targetLanguage,
            level: input.level,
            responseFormat: { kind: "free_text", maxLength: 100 },
          },
          acceptedAnswers: ["am"],
        });
      },
    },

    writingFeedback: {
      async review(raw) {
        const input = WritingReviewRequestSchema.parse(raw);
        const suggestions: WritingSuggestion[] = [];

        if (/\s{2,}/.test(input.text)) {
          suggestions.push({
            original: "  ",
            suggestion: " ",
            explanation: "[mock] Use a single space between words.",
          });
        }
        if (/\bi\b/.test(input.text) && input.targetLanguage === "en") {
          suggestions.push({
            original: "i",
            suggestion: "I",
            explanation: "[mock] The English pronoun 'I' is always capitalised.",
          });
        }
        if (!/[.!?]["')\]]*$/.test(input.text.trim())) {
          suggestions.push({
            original: input.text.trim().slice(-20),
            suggestion: `${input.text.trim().slice(-20)}.`,
            explanation: "[mock] End the sentence with punctuation.",
          });
        }

        return WritingFeedbackSchema.parse({
          summary:
            suggestions.length === 0
              ? "[mock] No issues found by the basic checks."
              : `[mock] ${suggestions.length} basic issue(s) found.`,
          suggestions,
        });
      },
    },
  };
}
