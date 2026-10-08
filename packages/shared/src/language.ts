import { z } from "zod";

/** ISO 639 style language code, lowercase (e.g. `en`, `es`, `fil`). */
export const LanguageCodeSchema = z
  .string()
  .regex(/^[a-z]{2,3}$/, "Expected a lowercase ISO 639 language code");
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const LanguageSchema = z.object({
  code: LanguageCodeSchema,
  /** Display name in English, e.g. "Spanish". */
  name: z.string().min(1),
  /** Display name in the language itself, e.g. "Espanol". */
  nativeName: z.string().min(1),
  /** BCP 47 locale tag used for formatting and speech, e.g. "es-ES". */
  locale: z.string().regex(/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/),
});
export type Language = z.infer<typeof LanguageSchema>;
