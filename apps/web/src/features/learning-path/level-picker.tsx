"use client";

import { CEFR_LEVELS, type CefrLevel } from "@linguaflow/shared";

import { messages } from "@/config/messages";
import { cn } from "@/lib/utils";

interface LevelPickerProps {
  value: CefrLevel;
  onChange: (level: CefrLevel) => void;
}

/** Radio group (arrow-key navigable natively) presented as selectable cards. */
export function LevelPicker({ value, onChange }: LevelPickerProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-medium">{messages.learn.levelLegend}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CEFR_LEVELS.map((level) => (
          <label
            key={level}
            className={cn(
              "bg-card hover:border-ring/60 has-focus-visible:ring-ring/40 flex cursor-pointer flex-col gap-0.5 rounded-lg border p-3 transition-colors has-focus-visible:ring-3",
              value === level && "border-primary bg-secondary",
            )}
          >
            <input
              type="radio"
              name="cefr-level"
              value={level}
              checked={value === level}
              onChange={() => onChange(level)}
              className="sr-only"
            />
            <span className="text-base font-semibold">{level}</span>
            <span className="text-muted-foreground text-xs">{messages.levels[level]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
