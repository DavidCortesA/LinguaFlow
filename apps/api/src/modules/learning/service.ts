import { evaluateAnswer } from "@linguaflow/learning-engine";
import {
  DEFAULT_SOURCE_LANGUAGE,
  DEFAULT_TARGET_LANGUAGE,
  isSupportedLanguagePair,
  type CefrLevel,
  type ExerciseAttempt,
  type LanguageCode,
  type LearningExercise,
} from "@linguaflow/shared";

import { HttpError } from "../../lib/http-error";
import { findSeedExercise, findSeedExerciseById, type SeedExercise } from "./seed-data";

/** Short feedback phrases per learner interface language. Falls back to English. */
const FEEDBACK_PHRASES: Record<string, { correct: string; incorrect: string }> = {
  es: { correct: "¡Correcto!", incorrect: "Casi." },
  en: { correct: "Correct!", incorrect: "Not quite." },
};

function phrasesFor(language: LanguageCode) {
  return FEEDBACK_PHRASES[language] ?? FEEDBACK_PHRASES["en"]!;
}

export function getSampleExercise(params: {
  level: CefrLevel;
  sourceLanguage?: LanguageCode | undefined;
  targetLanguage?: LanguageCode | undefined;
}): LearningExercise {
  const source = params.sourceLanguage ?? DEFAULT_SOURCE_LANGUAGE;
  const target = params.targetLanguage ?? DEFAULT_TARGET_LANGUAGE;

  if (!isSupportedLanguagePair(source, target)) {
    throw new HttpError(
      400,
      "unsupported_language_pair",
      `No content is available yet for ${source} -> ${target}`,
    );
  }

  const seed = findSeedExercise(source, target, params.level);
  if (!seed) {
    throw new HttpError(404, "exercise_not_found", `No sample exercise for level ${params.level}`);
  }
  return seed.exercise;
}

/** Throws unless `response` is a well-formed answer for the exercise's response format. */
function assertResponseMatchesFormat(seed: SeedExercise, response: string): void {
  const { responseFormat } = seed.exercise;

  if (responseFormat.kind === "single_choice") {
    const validIds = responseFormat.options.map((option) => option.id);
    if (!validIds.includes(response)) {
      throw new HttpError(
        400,
        "invalid_response",
        "Response must be one of the offered option ids",
        { allowed: validIds },
      );
    }
    return;
  }

  if (response.length > responseFormat.maxLength) {
    throw new HttpError(
      400,
      "invalid_response",
      `Response must be at most ${responseFormat.maxLength} characters`,
    );
  }
}

export function submitAttempt(
  exerciseId: string,
  response: string,
  now: () => Date = () => new Date(),
): ExerciseAttempt {
  const match = findSeedExerciseById(exerciseId);
  if (!match) {
    throw new HttpError(404, "exercise_not_found", `Exercise ${exerciseId} does not exist`);
  }
  const { seed, sourceLanguage } = match;

  assertResponseMatchesFormat(seed, response);

  const result = evaluateAnswer({ acceptedAnswers: seed.acceptedAnswers, response });
  const phrases = phrasesFor(sourceLanguage);
  const message = `${result.isCorrect ? phrases.correct : phrases.incorrect} ${seed.explanation}`;

  return {
    exerciseId,
    response,
    feedback: result.isCorrect
      ? { isCorrect: true, message }
      : { isCorrect: false, message, correctAnswer: result.correctAnswer },
    completedAt: now().toISOString(),
  };
}
