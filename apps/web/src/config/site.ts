export const siteConfig = {
  name: "LinguaFlow",
  /** Language of the learner-facing interface. */
  locale: "es",
  /** Base URL of the LinguaFlow API. Inlined at build time (NEXT_PUBLIC_*). */
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, ""),
} as const;
