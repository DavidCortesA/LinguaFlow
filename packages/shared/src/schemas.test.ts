import { describe, expect, it } from "vitest";

import {
  CefrLevelSchema,
  LearningExerciseSchema,
  LearningProfileSchema,
  SampleExerciseQuerySchema,
  SubmitAttemptBodySchema,
  cefrIndex,
  isSupportedLanguagePair,
} from "./index";

describe("CefrLevelSchema", () => {
  it("accepts the six CEFR levels and rejects anything else", () => {
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      expect(CefrLevelSchema.safeParse(level).success).toBe(true);
    }
    expect(CefrLevelSchema.safeParse("D1").success).toBe(false);
    expect(CefrLevelSchema.safeParse("a1").success).toBe(false);
  });

  it("orders levels from lowest to highest", () => {
    expect(cefrIndex("A1")).toBeLessThan(cefrIndex("C2"));
  });
});

describe("LearningProfileSchema", () => {
  const valid = {
    sourceLanguage: "es",
    targetLanguage: "en",
    currentLevel: "A2",
    targetLevel: "B2",
    goals: ["work", "travel"],
  };

  it("accepts a valid profile", () => {
    expect(LearningProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a target level below the current level", () => {
    expect(LearningProfileSchema.safeParse({ ...valid, targetLevel: "A1" }).success).toBe(false);
  });

  it("rejects identical source and target languages", () => {
    expect(LearningProfileSchema.safeParse({ ...valid, targetLanguage: "es" }).success).toBe(false);
  });
});

describe("LearningExerciseSchema", () => {
  it("rejects duplicate option ids", () => {
    const result = LearningExerciseSchema.safeParse({
      id: "x",
      type: "multiple_choice",
      skill: "grammar",
      prompt: "p",
      instructions: "i",
      targetLanguage: "en",
      level: "A1",
      responseFormat: {
        kind: "single_choice",
        options: [
          { id: "a", label: "A" },
          { id: "a", label: "B" },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("API contracts", () => {
  it("defaults the sample exercise level to A1", () => {
    expect(SampleExerciseQuerySchema.parse({}).level).toBe("A1");
  });

  it("rejects blank answers", () => {
    expect(SubmitAttemptBodySchema.safeParse({ response: "   " }).success).toBe(false);
  });
});

describe("language configuration", () => {
  it("supports es -> en only", () => {
    expect(isSupportedLanguagePair("es", "en")).toBe(true);
    expect(isSupportedLanguagePair("en", "es")).toBe(false);
  });
});
