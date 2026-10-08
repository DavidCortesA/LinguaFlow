import type {
  ExerciseRequest,
  GeneratedExercise,
  TutorAnswer,
  TutorQuestion,
  WritingFeedback,
  WritingReviewRequest,
} from "./schemas";

/** Explains vocabulary, grammar and usage questions. */
export interface LanguageTutor {
  explain(input: TutorQuestion): Promise<TutorAnswer>;
}

/** Produces new practice exercises. */
export interface ExerciseGenerator {
  generate(input: ExerciseRequest): Promise<GeneratedExercise>;
}

/** Reviews written text (not speech or pronunciation). */
export interface WritingFeedbackProvider {
  review(input: WritingReviewRequest): Promise<WritingFeedback>;
}

/**
 * A bundle of capabilities. Real vendors may implement only some of them; the API composes
 * whichever providers it is configured with. Implementations run on the server only.
 */
export interface AiProvider {
  readonly name: string;
  readonly tutor: LanguageTutor;
  readonly exerciseGenerator: ExerciseGenerator;
  readonly writingFeedback: WritingFeedbackProvider;
}
