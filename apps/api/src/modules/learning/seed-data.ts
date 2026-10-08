import type { CefrLevel, LanguageCode, LearningExercise } from "@linguaflow/shared";

/**
 * Deterministic local seed content. Replaced by database-backed or AI-generated content in a
 * later milestone; the rest of the module only depends on this shape.
 */
export interface SeedExercise {
  /** The learner-facing exercise (never contains the answers). */
  exercise: LearningExercise;
  /** Server-side only. For single_choice exercises these are option ids. */
  acceptedAnswers: readonly string[];
  /** Shown after answering, in the learner's interface language. */
  explanation: string;
}

type PairKey = `${LanguageCode}:${LanguageCode}`;

export const pairKey = (source: LanguageCode, target: LanguageCode): PairKey =>
  `${source}:${target}`;

const choice = (id: string) => ({ id, label: id });

/** Exercises keyed by `<interface language>:<target language>`. */
export const SEED_EXERCISES: Readonly<Record<PairKey, readonly SeedExercise[]>> = {
  "es:en": [
    {
      exercise: {
        id: "es-en-a1-001",
        type: "multiple_choice",
        skill: "grammar",
        prompt: "She ___ a student.",
        instructions: "Elige la forma correcta del verbo «to be».",
        targetLanguage: "en",
        level: "A1",
        responseFormat: {
          kind: "single_choice",
          options: [choice("am"), choice("is"), choice("are")],
        },
      },
      acceptedAnswers: ["is"],
      explanation: "Con she, he e it usamos «is».",
    },
    {
      exercise: {
        id: "es-en-a2-001",
        type: "fill_in_the_blank",
        skill: "grammar",
        prompt: "Yesterday I ___ (go) to the market.",
        instructions: "Escribe el verbo entre paréntesis en pasado simple.",
        targetLanguage: "en",
        level: "A2",
        responseFormat: { kind: "free_text", maxLength: 50 },
      },
      acceptedAnswers: ["went"],
      explanation: "«Go» es un verbo irregular: su pasado simple es «went».",
    },
    {
      exercise: {
        id: "es-en-b1-001",
        type: "multiple_choice",
        skill: "grammar",
        prompt: "If I ___ more time, I would learn Italian.",
        instructions: "Elige la opción correcta para el segundo condicional.",
        targetLanguage: "en",
        level: "B1",
        responseFormat: {
          kind: "single_choice",
          options: [choice("had"), choice("have"), choice("will have")],
        },
      },
      acceptedAnswers: ["had"],
      explanation:
        "En el segundo condicional usamos el pasado simple tras «if» y «would» en la otra cláusula.",
    },
    {
      exercise: {
        id: "es-en-b2-001",
        type: "fill_in_the_blank",
        skill: "grammar",
        prompt: "By the time we arrived, the film ___ (already / start).",
        instructions: "Completa con el past perfect de los verbos entre paréntesis.",
        targetLanguage: "en",
        level: "B2",
        responseFormat: { kind: "free_text", maxLength: 50 },
      },
      acceptedAnswers: ["had already started", "had started already"],
      explanation:
        "El past perfect («had» + participio) indica una acción anterior a otro momento del pasado.",
    },
    {
      exercise: {
        id: "es-en-c1-001",
        type: "fill_in_the_blank",
        skill: "grammar",
        prompt: "Rarely ___ I seen such dedication.",
        instructions: "Completa la oración. Fíjate en la inversión tras el adverbio negativo.",
        targetLanguage: "en",
        level: "C1",
        responseFormat: { kind: "free_text", maxLength: 50 },
      },
      acceptedAnswers: ["have"],
      explanation:
        "Tras adverbios negativos como «rarely» el auxiliar va antes del sujeto: «Rarely have I seen…».",
    },
    {
      exercise: {
        id: "es-en-c2-001",
        type: "multiple_choice",
        skill: "vocabulary",
        prompt: "Her ___ reply left the audience unsure of her position.",
        instructions: "Elige la palabra que mejor completa la oración.",
        targetLanguage: "en",
        level: "C2",
        responseFormat: {
          kind: "single_choice",
          options: [choice("equivocal"), choice("unequivocal"), choice("emphatic")],
        },
      },
      acceptedAnswers: ["equivocal"],
      explanation: "«Equivocal» significa ambiguo o poco claro; «unequivocal» es lo contrario.",
    },
  ],
};

export function findSeedExercise(
  source: LanguageCode,
  target: LanguageCode,
  level: CefrLevel,
): SeedExercise | undefined {
  return SEED_EXERCISES[pairKey(source, target)]?.find((seed) => seed.exercise.level === level);
}

export interface SeedMatch {
  seed: SeedExercise;
  /** The learner interface language the exercise was written for. */
  sourceLanguage: LanguageCode;
}

export function findSeedExerciseById(exerciseId: string): SeedMatch | undefined {
  for (const [key, exercises] of Object.entries(SEED_EXERCISES)) {
    const seed = exercises.find((candidate) => candidate.exercise.id === exerciseId);
    const sourceLanguage = key.split(":")[0];
    if (seed && sourceLanguage) return { seed, sourceLanguage };
  }
  return undefined;
}
