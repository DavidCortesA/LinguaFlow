import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground h-10 w-full min-w-0 rounded-lg border px-3 py-2 text-base transition-colors outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-3",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
