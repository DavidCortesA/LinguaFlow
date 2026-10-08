import { describe, expect, it } from "vitest";

import {
  cefrBand,
  compareCefr,
  evaluateAnswer,
  levelsToCover,
  nextCefrLevel,
  normalizeAnswer,
  summarizeProgress,
} from "./index";

describe("CEFR helpers", () => {
  it("compares levels", () => {
    expect(compareCefr("A1", "B2")).toBeLessThan(0);
    expect(compareCefr("C1", "C1")).toBe(0);
    expect(compareCefr("C2", "A2")).toBeGreaterThan(0);
  });

  it("returns the next level and stops at C2", () => {
    expect(nextCefrLevel("B1")).toBe("B2");
    expect(nextCefrLevel("C2")).toBeUndefined();
  });

  it("maps levels to bands", () => {
    expect(cefrBand("A2")).toBe("basic");
    expect(cefrBand("B2")).toBe("independent");
    expect(cefrBand("C1")).toBe("proficient");
  });

  it("lists levels between current and target, inclusive", () => {
    expect(levelsToCover("A2", "B1")).toEqual(["A2", "B1"]);
    expect(levelsToCover("B2", "A1")).toEqual([]);
  });
});

describe("normalizeAnswer", () => {
  it("ignores case, extra whitespace, curly apostrophes and trailing punctuation", () => {
    expect(normalizeAnswer("  I’M   Fine. ")).toBe("i'm fine");
  });
});

describe("evaluateAnswer", () => {
  const acceptedAnswers = ["went", "did go"];

  it("accepts any accepted answer, loosely normalised", () => {
    expect(evaluateAnswer({ acceptedAnswers, response: " Went. " }).isCorrect).toBe(true);
    expect(evaluateAnswer({ acceptedAnswers, response: "DID  GO" }).isCorrect).toBe(true);
  });

  it("rejects wrong answers and reports the canonical answer", () => {
    expect(evaluateAnswer({ acceptedAnswers, response: "goed" })).toEqual({
      isCorrect: false,
      correctAnswer: "went",
    });
  });

  it("never marks an empty response as correct", () => {
    expect(evaluateAnswer({ acceptedAnswers: [""], response: "   " }).isCorrect).toBe(false);
  });

  it("throws when no accepted answers are configured", () => {
    expect(() => evaluateAnswer({ acceptedAnswers: [], response: "x" })).toThrow();
  });
});

describe("summarizeProgress", () => {
  it("returns zeroes for no attempts", () => {
    expect(summarizeProgress([])).toEqual({ totalCompleted: 0, totalCorrect: 0, bySkill: {} });
  });

  it("aggregates by skill", () => {
    const progress = summarizeProgress([
      { skill: "grammar", isCorrect: true },
      { skill: "grammar", isCorrect: false },
      { skill: "vocabulary", isCorrect: true },
    ]);
    expect(progress.totalCompleted).toBe(3);
    expect(progress.totalCorrect).toBe(2);
    expect(progress.bySkill.grammar).toEqual({ completed: 2, correct: 1 });
    expect(progress.bySkill.vocabulary).toEqual({ completed: 1, correct: 1 });
  });
});
