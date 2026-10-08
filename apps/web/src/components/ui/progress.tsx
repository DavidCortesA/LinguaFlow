import type * as React from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends Omit<React.ComponentProps<"div">, "children"> {
  value: number;
  max?: number;
  /** Accessible name; required because the bar has no visible text of its own. */
  label: string;
}

function Progress({ value, max = 100, label, className, ...props }: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      data-slot="progress"
      className={cn("bg-muted h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <div
        className="bg-primary h-full rounded-full transition-[width] duration-300"
        style={{ width: `${(clamped / max) * 100}%` }}
      />
    </div>
  );
}

export { Progress };
