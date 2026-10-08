import type { CefrLevel } from "@linguaflow/shared";

/**
 * Learner-facing copy (Spanish interface). Kept in one place so an i18n library can replace it
 * later without touching components.
 */
export const messages = {
  siteDescription:
    "LinguaFlow es una plataforma de código abierto para aprender idiomas con rutas estructuradas por niveles MCER (A1–C2).",
  nav: {
    home: "Inicio",
    learn: "Aprender",
    main: "Navegación principal",
    skipToContent: "Saltar al contenido",
  },
  theme: {
    toggle: "Cambiar tema",
    light: "Claro",
    dark: "Oscuro",
  },
  home: {
    badge: "Inglés para hispanohablantes",
    title: "Aprende inglés con práctica clara y retroalimentación inmediata",
    description:
      "LinguaFlow es una plataforma de código abierto para aprender idiomas con rutas estructuradas por niveles MCER (A1–C2). Elige tu nivel y practica con ejercicios que te explican cada respuesta.",
    cta: "Ir al área de aprendizaje",
    features: [
      {
        title: "Niveles MCER",
        body: "De A1 a C2: practica al nivel que realmente tienes.",
      },
      {
        title: "Retroalimentación inmediata",
        body: "Cada respuesta incluye una explicación en español.",
      },
      {
        title: "Código abierto",
        body: "Construido en público, para que cualquiera pueda contribuir.",
      },
    ],
    footer: "Proyecto de código abierto con licencia MIT.",
  },
  learn: {
    title: "Área de aprendizaje",
    description: "Elige un nivel y practica con un ejercicio de muestra.",
    levelLegend: "Elige tu nivel",
    start: "Empezar ejercicio",
    levelProgress: (position: number, total: number) => `Nivel ${position} de ${total}`,
    exerciseTitle: (level: CefrLevel) => `Ejercicio de nivel ${level}`,
    loading: "Cargando ejercicio…",
    loadError:
      "No pudimos cargar el ejercicio. Comprueba que la API esté en marcha e inténtalo de nuevo.",
    retry: "Reintentar",
    answerLabel: "Tu respuesta",
    answerPlaceholder: "Escribe tu respuesta",
    choiceLegend: "Elige una opción",
    submit: "Comprobar respuesta",
    submitting: "Comprobando…",
    submitError: "No pudimos comprobar tu respuesta. Inténtalo de nuevo.",
    emptyAnswer: "Escribe o elige una respuesta antes de comprobarla.",
    correct: "¡Correcto!",
    incorrect: "Todavía no",
    correctAnswer: (answer: string) => `Respuesta correcta: ${answer}`,
    another: "Probar otro ejercicio",
    empty: "Elige un nivel y pulsa «Empezar ejercicio» para comenzar.",
  },
  levels: {
    A1: "Principiante",
    A2: "Elemental",
    B1: "Intermedio",
    B2: "Intermedio alto",
    C1: "Avanzado",
    C2: "Maestría",
  } satisfies Record<CefrLevel, string>,
} as const;
