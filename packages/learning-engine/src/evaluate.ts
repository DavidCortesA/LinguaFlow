/**
 * Language-independent answer evaluation. The engine knows nothing about English or Spanish:
 * callers supply the accepted answers, and user-facing messages are produced by the caller
 * (so they can be localised) from the structured result.
 */

export interface EvaluationInput {
  /** Every answer that should be marked correct. At least one is required. */
  acceptedAnswers: readonly string[];
  /** The learner's raw response. */
  response: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  /** The canonical answer to show when the learner got it wrong. */
  correctAnswer: string;
}

/**
 * Normalises text for comparison: Unicode NFC, curly apostrophes/quotes to ASCII,
 * collapsed whitespace, lowercase, and trailing sentence punctuation removed.
 */
export function normalizeAnswer(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/u, "")
    .trim();
}

export function evaluateAnswer({ acceptedAnswers, response }: EvaluationInput): EvaluationResult {
  const [canonical] = acceptedAnswers;
  if (canonical === undefined) {
    throw new Error("evaluateAnswer requires at least one accepted answer");
  }
  const normalizedResponse = normalizeAnswer(response);
  const isCorrect =
    normalizedResponse.length > 0 &&
    acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalizedResponse);
  return { isCorrect, correctAnswer: canonical };
}
