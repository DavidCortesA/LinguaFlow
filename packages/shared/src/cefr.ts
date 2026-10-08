import { z } from "zod";

/** Common European Framework of Reference levels, ordered from lowest to highest. */
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const CefrLevelSchema = z.enum(CEFR_LEVELS);
export type CefrLevel = z.infer<typeof CefrLevelSchema>;

/** Position of a level in the CEFR scale (A1 = 0 ... C2 = 5). */
export function cefrIndex(level: CefrLevel): number {
  return CEFR_LEVELS.indexOf(level);
}
