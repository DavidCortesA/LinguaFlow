import { describe, expect, it, vi } from "vitest";

import { ApiRequestError, fetchSampleExercise, submitAttempt } from "@/lib/api-client";

const exercise = {
  id: "es-en-a1-001",
  type: "multiple_choice",
  skill: "grammar",
  prompt: "She ___ a student.",
  instructions: "Elige la forma correcta.",
  targetLanguage: "en",
  level: "A1",
  responseFormat: {
    kind: "single_choice",
    options: [
      { id: "is", label: "is" },
      { id: "are", label: "are" },
    ],
  },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("api client", () => {
  it("returns a validated exercise", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(exercise));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchSampleExercise("A1")).resolves.toMatchObject({ id: "es-en-a1-001" });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "http://localhost:4000/api/v1/learning/exercises/sample?level=A1",
    );
  });

  it("posts the answer as JSON", async () => {
    const attempt = {
      exerciseId: "es-en-a1-001",
      response: "is",
      feedback: { isCorrect: true, message: "Correcto" },
      completedAt: "2026-01-01T00:00:00.000Z",
    };
    const fetchMock = vi.fn().mockResolvedValue(json(attempt));
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitAttempt("es-en-a1-001", "is")).resolves.toEqual(attempt);
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ response: "is" }));
  });

  it("surfaces the API error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(json({ error: { code: "exercise_not_found", message: "nope" } }, 404)),
    );

    await expect(submitAttempt("x", "y")).rejects.toMatchObject({
      status: 404,
      code: "exercise_not_found",
    });
  });

  it("reports an unreachable server as a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const error = await fetchSampleExercise("A1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({ status: 0, code: "network_error" });
  });

  it("rejects a response that does not match the contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ id: 1 })));

    await expect(fetchSampleExercise("A1")).rejects.toMatchObject({ code: "invalid_response" });
  });
});
