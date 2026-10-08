import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("shows branding, description and a link to the learning area", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/LinguaFlow/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("LinguaFlow");
    await expect(page.getByText("niveles MCER (A1–C2)").first()).toBeVisible();

    const cta = page.getByRole("link", { name: "Ir al área de aprendizaje" });
    await expect(cta).toHaveAttribute("href", "/learn");
    await cta.click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Área de aprendizaje" }),
    ).toBeVisible();
  });
});

test.describe("learning flow", () => {
  test("completes a multiple-choice exercise and shows feedback", async ({ page }) => {
    await page.goto("/learn");

    await page.getByRole("radio", { name: /B1/ }).check({ force: true });
    await page.getByRole("button", { name: "Empezar ejercicio" }).click();

    await expect(page.getByText("Ejercicio de nivel B1")).toBeVisible();
    await expect(page.getByText("If I ___ more time, I would learn Italian.")).toBeVisible();

    // Wrong answer first: feedback reveals the correct one.
    await page.getByRole("radio", { name: "have", exact: true }).check();
    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await expect(page.getByText("Todavía no")).toBeVisible();
    await expect(page.getByText("Respuesta correcta: had")).toBeVisible();

    // Then the right one.
    await page.getByRole("radio", { name: "had", exact: true }).check();
    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await expect(page.getByText("¡Correcto!", { exact: true }).first()).toBeVisible();
  });

  test("completes a free-text exercise and validates empty input", async ({ page }) => {
    await page.goto("/learn");

    await page.getByRole("radio", { name: /A2/ }).check({ force: true });
    await page.getByRole("button", { name: "Empezar ejercicio" }).click();
    await expect(page.getByText("Ejercicio de nivel A2")).toBeVisible();

    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Escribe o elige una respuesta" }),
    ).toBeVisible();

    await page.getByLabel("Tu respuesta").fill("Went");
    await page.getByRole("button", { name: "Comprobar respuesta" }).click();
    await expect(page.getByText("¡Correcto!", { exact: true }).first()).toBeVisible();
  });
});

test("the API health endpoint is reachable", async ({ request }) => {
  const response = await request.get("http://localhost:4100/api/v1/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ status: "ok" });
});
