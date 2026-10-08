import { describe, expect, it } from "vitest";

import { createMockAiProvider } from "./index";

const context = { targetLanguage: "en", explanationLanguage: "es", level: "A2" } as const;

describe("mock AI provider", () => {
  const provider = createMockAiProvider();

  it("is named and deterministic", async () => {
    expect(provider.name).toBe("mock");
    const a = await provider.tutor.explain({ ...context, question: "When do I use 'a' or 'an'?" });
    const b = await provider.tutor.explain({ ...context, question: "When do I use 'a' or 'an'?" });
    expect(a).toEqual(b);
  });

  it("rejects invalid input", async () => {
    await expect(provider.tutor.explain({ ...context, question: "   " })).rejects.toThrow();
  });

  it("generates a schema-valid exercise whose answers stay separate from the exercise", async () => {
    const generated = await provider.exerciseGenerator.generate({ ...context, skill: "grammar" });
    expect(generated.exercise.level).toBe("A2");
    expect(generated.acceptedAnswers.length).toBeGreaterThan(0);
    expect(JSON.stringify(generated.exercise)).not.toContain("acceptedAnswers");
  });

  it("flags basic writing issues", async () => {
    const feedback = await provider.writingFeedback.review({ ...context, text: "i like tea" });
    expect(feedback.suggestions.length).toBeGreaterThanOrEqual(2);
    const clean = await provider.writingFeedback.review({ ...context, text: "I like tea." });
    expect(clean.suggestions).toEqual([]);
  });
});
