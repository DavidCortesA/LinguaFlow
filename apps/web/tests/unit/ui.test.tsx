import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusMessage } from "@/components/shared/status-message";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

describe("Progress", () => {
  it("exposes progressbar semantics and clamps out-of-range values", () => {
    render(<Progress value={9} max={6} label="Nivel" />);
    const bar = screen.getByRole("progressbar", { name: "Nivel" });
    expect(bar).toHaveAttribute("aria-valuenow", "6");
    expect(bar).toHaveAttribute("aria-valuemax", "6");
  });
});

describe("StatusMessage", () => {
  it("announces errors assertively and other states politely", () => {
    const { rerender } = render(<StatusMessage variant="error">Fallo</StatusMessage>);
    expect(screen.getByRole("alert")).toHaveTextContent("Fallo");

    rerender(<StatusMessage variant="loading">Cargando</StatusMessage>);
    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });
});

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge variant="success">Listo</Badge>);
    expect(screen.getByText("Listo")).toBeInTheDocument();
  });
});

describe("cn", () => {
  it("resolves conflicting Tailwind classes", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
