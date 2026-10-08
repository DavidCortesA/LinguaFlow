import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LearningSession } from "@/features/learning-path/learning-session";

const choiceExercise = {
  id: "es-en-b1-001",
  type: "multiple_choice",
  skill: "grammar",
  prompt: "If I ___ more time, I would learn Italian.",
  instructions: "Elige la opción correcta para el segundo condicional.",
  targetLanguage: "en",
  level: "B1",
  responseFormat: {
    kind: "single_choice",
    options: [
      { id: "had", label: "had" },
      { id: "have", label: "have" },
    ],
  },
};

const freeTextExercise = {
  ...choiceExercise,
  id: "es-en-a2-001",
  type: "fill_in_the_blank",
  level: "A2",
  prompt: "Yesterday I ___ (go) to the market.",
  responseFormat: { kind: "free_text", maxLength: 50 },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function setup(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const fetchMock = vi.fn((url: string, init?: RequestInit) => Promise.resolve(handler(url, init)));
  vi.stubGlobal("fetch", fetchMock);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <LearningSession />
    </QueryClientProvider>,
  );
  return { fetchMock, user: userEvent.setup() };
}

describe("LearningSession", () => {
  it("starts with an empty state and the level picker", () => {
    setup(() => json(choiceExercise));
    expect(screen.getByRole("group", { name: "Elige tu nivel" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(6);
    expect(screen.getByRole("status")).toHaveTextContent("Elige un nivel");
  });

  it("loads the exercise for the chosen level and shows correct feedback", async () => {
    const { fetchMock, user } = setup((url) =>
      url.includes("/sample")
        ? json(choiceExercise)
        : json({
            exerciseId: "es-en-b1-001",
            response: "had",
            feedback: { isCorrect: true, message: "¡Correcto! Segundo condicional." },
            completedAt: "2026-01-01T00:00:00.000Z",
          }),
    );

    await user.click(screen.getByRole("radio", { name: /B1/ }));
    await user.click(screen.getByRole("button", { name: "Empezar ejercicio" }));

    expect(await screen.findByText("Ejercicio de nivel B1")).toBeInTheDocument();
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/learning/exercises/sample?level=B1");
    expect(screen.getByRole("progressbar", { name: "Nivel 3 de 6" })).toHaveAttribute(
      "aria-valuenow",
      "3",
    );

    await user.click(screen.getByRole("radio", { name: "had" }));
    await user.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByText("¡Correcto! Segundo condicional.")).toBeInTheDocument();
    const lastCall = fetchMock.mock.calls.at(-1);
    expect(lastCall?.[0]).toContain("/learning/exercises/es-en-b1-001/attempts");
    expect(JSON.parse(String(lastCall?.[1]?.body))).toEqual({ response: "had" });
  });

  it("shows the correct answer when the response is wrong", async () => {
    const { user } = setup((url) =>
      url.includes("/sample")
        ? json(freeTextExercise)
        : json({
            exerciseId: "es-en-a2-001",
            response: "goed",
            feedback: { isCorrect: false, message: "Casi.", correctAnswer: "went" },
            completedAt: "2026-01-01T00:00:00.000Z",
          }),
    );

    await user.click(screen.getByRole("radio", { name: /A2/ }));
    await user.click(screen.getByRole("button", { name: "Empezar ejercicio" }));
    await user.type(await screen.findByLabelText("Tu respuesta"), "goed");
    await user.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByText("Todavía no")).toBeInTheDocument();
    expect(screen.getByText("Respuesta correcta: went")).toBeInTheDocument();
  });

  it("does not call the API when the answer is empty", async () => {
    const { fetchMock, user } = setup(() => json(freeTextExercise));

    await user.click(screen.getByRole("button", { name: "Empezar ejercicio" }));
    await screen.findByLabelText("Tu respuesta");
    await user.click(screen.getByRole("button", { name: "Comprobar respuesta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Escribe o elige una respuesta");
    expect(fetchMock).toHaveBeenCalledTimes(1); // only the exercise request
  });

  it("shows an error state with retry when the API is unreachable", async () => {
    const { user } = setup(() => {
      throw new TypeError("fetch failed");
    });

    await user.click(screen.getByRole("button", { name: "Empezar ejercicio" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar el ejercicio");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("returns to the level picker with 'Probar otro ejercicio'", async () => {
    const { user } = setup(() => json(choiceExercise));

    await user.click(screen.getByRole("button", { name: "Empezar ejercicio" }));
    await screen.findByText("Ejercicio de nivel B1");
    await user.click(screen.getByRole("button", { name: "Probar otro ejercicio" }));

    expect(screen.getByRole("group", { name: "Elige tu nivel" })).toBeInTheDocument();
  });
});
