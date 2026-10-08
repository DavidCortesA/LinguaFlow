import { type Language, type LanguageCode } from "./language";

/**
 * Language *configuration*. Deliberately free of any learning logic: adding a language
 * or a supported pair is a data change here plus content, never an engine change.
 */
export const LANGUAGES = {
  en: { code: "en", name: "English", nativeName: "English", locale: "en-US" },
  es: { code: "es", name: "Spanish", nativeName: "Español", locale: "es-ES" },
} as const satisfies Record<string, Language>;

export const DEFAULT_SOURCE_LANGUAGE: LanguageCode = "es";
export const DEFAULT_TARGET_LANGUAGE: LanguageCode = "en";

/** (learner interface language, language being learned) pairs that have content. */
export const SUPPORTED_LANGUAGE_PAIRS: ReadonlyArray<{
  source: LanguageCode;
  target: LanguageCode;
}> = [{ source: "es", target: "en" }];

export function getLanguage(code: LanguageCode): Language | undefined {
  return (LANGUAGES as Record<string, Language>)[code];
}

export function isSupportedLanguagePair(source: LanguageCode, target: LanguageCode): boolean {
  return SUPPORTED_LANGUAGE_PAIRS.some((pair) => pair.source === source && pair.target === target);
}
