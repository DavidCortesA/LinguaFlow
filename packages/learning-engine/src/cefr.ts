import { CEFR_LEVELS, type CefrLevel, cefrIndex } from "@linguaflow/shared";

/** Negative when `a` is below `b`, zero when equal, positive when above. */
export function compareCefr(a: CefrLevel, b: CefrLevel): number {
  return cefrIndex(a) - cefrIndex(b);
}

/** The next level up, or `undefined` at C2. */
export function nextCefrLevel(level: CefrLevel): CefrLevel | undefined {
  return CEFR_LEVELS[cefrIndex(level) + 1];
}

/** CEFR "bands": A = basic user, B = independent user, C = proficient user. */
export function cefrBand(level: CefrLevel): "basic" | "independent" | "proficient" {
  const letter = level.charAt(0);
  if (letter === "A") return "basic";
  if (letter === "B") return "independent";
  return "proficient";
}

/** Levels the learner still has to cover, from `current` (inclusive) up to `target` (inclusive). */
export function levelsToCover(current: CefrLevel, target: CefrLevel): CefrLevel[] {
  if (compareCefr(target, current) < 0) return [];
  return CEFR_LEVELS.slice(cefrIndex(current), cefrIndex(target) + 1);
}
