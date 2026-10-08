# LinguaFlow

Open-source platform for learning languages through structured CEFR learning paths, immediate
feedback and (in later milestones) AI-assisted explanations. The first target is **Spanish
speakers learning English**; the architecture keeps source and target languages configurable.

> **Status: early foundation.** One vertical slice works end to end (see below). Everything else
> in the roadmap is not built yet.

## Current capabilities

- Marketing homepage and a learning area (`/learn`) with a Spanish interface.
- Pick a CEFR level (A1–C2), get a sample exercise, submit an answer, receive deterministic
  feedback with an explanation. Multiple-choice and fill-in-the-blank exercises are supported.
- REST API under `/api/v1` with Zod validation, OpenAPI docs (`/docs`), structured logs, a uniform
  error envelope, and liveness/readiness probes.
- Provider-neutral AI interfaces with a deterministic **mock** provider (no AI key needed).
- PostgreSQL + Drizzle schema and migration (one table; not yet used by the learning flow).

The exercise content is local seed data (one exercise per level). **No AI model is called**, and
no data is persisted yet.

## Stack

| Area      | Technology                                                               |
| --------- | ------------------------------------------------------------------------ |
| Monorepo  | pnpm workspaces, Turborepo, strict TypeScript, ESLint, Prettier          |
| Web       | Next.js (App Router), React, Tailwind CSS v4, shadcn/ui, TanStack Query  |
| Forms     | React Hook Form + Zod                                                    |
| API       | Fastify 5, Zod type provider, OpenAPI (`@fastify/swagger`), pino logging |
| Database  | PostgreSQL 17, Drizzle ORM, Drizzle Kit                                  |
| Testing   | Vitest, React Testing Library, Playwright                                |
| Local dev | Docker Compose (PostgreSQL), GitHub Actions CI                           |

## Prerequisites

- Node.js **>= 22.12** (developed on 24)
- pnpm **11** (`corepack enable` will pick the version from `package.json`)
- Docker (only for PostgreSQL; the learning flow itself does not need a database)

## Setup

```bash
pnpm install
cp .env.example .env          # then review the values; never commit .env
docker compose up -d postgres # optional for the learning flow, needed for /health/ready
pnpm db:migrate               # applies migrations (requires PostgreSQL)
pnpm dev                      # web on :3000, API on :4000
```

Open <http://localhost:3000>, go to **Aprender**, choose a level and complete the exercise.
API docs: <http://localhost:4000/docs>.

## Commands

| Command                                         | What it does                                        |
| ----------------------------------------------- | --------------------------------------------------- |
| `pnpm dev`                                      | Start the web app and the API in parallel           |
| `pnpm build`                                    | Build every package and app                         |
| `pnpm lint` / `pnpm typecheck`                  | Lint / type-check every workspace                   |
| `pnpm test`                                     | Unit and integration tests (Vitest)                 |
| `pnpm test:e2e`                                 | Playwright smoke tests (starts its own servers)     |
| `pnpm format` / `pnpm format:check`             | Format / verify formatting                          |
| `pnpm db:generate` / `db:migrate` / `db:studio` | Generate and apply migrations / open Drizzle Studio |

First e2e run: `pnpm --filter @linguaflow/web exec playwright install chromium`.

## Documentation

- [Architecture](docs/ARCHITECTURE.md): decisions and package dependency direction
- [Development guide](docs/DEVELOPMENT.md): environment, database, troubleshooting
- [API reference](docs/API.md)
- [Contributing](docs/CONTRIBUTING.md)

## AI usage and cost

The project runs fully offline with the mock AI provider. When a real provider is added in a later
milestone, **calls to external AI services may incur costs** billed to whoever owns the API key.
Keys stay on the server and are never exposed to the browser.

## Roadmap

1. ✅ Foundation and first vertical slice (this repository state)
2. Persist attempts and learner progress; authentication
3. Learning paths and a larger exercise catalogue
4. First real AI provider for tutor explanations and writing feedback
5. Vocabulary and grammar modules; spaced repetition
6. Listening and speaking (pronunciation needs audio, not text)
7. Additional source and target languages

## English Challenge: de B1 a C1 en 12 semanas 🇬🇧

Plan de estudio en español que inspira la ruta de aprendizaje de LinguaFlow: un programa intensivo
de 12 semanas para pasar de B1 a un inglés profesional, orientado a trabajar como desarrollador
Full-Stack en un entorno internacional.

> **Aclaración importante:** pasar de un B1 real a un C1 sólido en 12 semanas es muy ambicioso. No
> hay garantía de alcanzarlo en ese tiempo, pero con unas **2–3 horas diarias** de práctica bien
> estructurada es posible lograr un progreso considerable y, según el nivel de partida y la
> constancia, acercarse a un B2 alto o empezar a desarrollar competencias de C1.

| Duración   | Dedicación    | Meta progresiva |
| ---------- | ------------- | --------------- |
| 12 semanas | 2–3 h por día | B2 → C1         |

### 1. Ruta de aprendizaje

El programa tiene cuatro fases, cada una con un propósito y resultados concretos.

**Fase 1 · Semanas 1–3 · Consolidar B1.** Corregir errores frecuentes y automatizar las
estructuras básicas.

- Present simple vs. present continuous.
- Past simple vs. present perfect.
- Future forms, modals y preguntas.
- Vocabulario cotidiano y profesional.
- Escuchar conversaciones a velocidad natural.

_Resultado esperado:_ hablar de tu vida, experiencias y trabajo con mayor fluidez.

**Fase 2 · Semanas 4–6 · Construir B2.** Expresarte con más detalle, precisión y espontaneidad.

- Conditionals y passive voice.
- Reported speech y relative clauses.
- Phrasal verbs y collocations.
- Conversaciones de 10–15 minutos.
- Correos, opiniones y explicaciones estructuradas.

_Resultado esperado:_ defender tus opiniones y explicar problemas complejos con claridad.

**Fase 3 · Semanas 7–9 · B2 alto y transición a C1.** Desarrollar un inglés profesional, flexible y
preciso.

- Inversiones y estructuras avanzadas.
- Conectores y discourse markers.
- Matices, registro formal e informal.
- Reuniones, entrevistas y negociación.
- Lectura de artículos técnicos y documentación.

_Resultado esperado:_ explicar decisiones técnicas, argumentar y participar activamente en
reuniones.

**Fase 4 · Semanas 10–12 · Rendimiento avanzado.** Mejorar precisión, comprensión y naturalidad
bajo presión.

- Speaking espontáneo y argumentación.
- Listening con distintos acentos.
- Ensayos, resúmenes y presentaciones.
- Entrevistas técnicas en inglés.
- Simulaciones de evaluación B2/C1.

_Resultado esperado:_ demostrar tus avances y detectar las competencias que aún necesitas
fortalecer para C1.

### 2. Rutina diaria

La clave no es solo estudiar inglés, sino **usarlo todos los días**. Distribución recomendada para
seis días de práctica y un día de repaso ligero:

| Actividad         | Tiempo | Qué hacer                                            |
| ----------------- | ------ | ---------------------------------------------------- |
| Vocabulary & Anki | 20 min | Aprende 10–15 expresiones en contexto.               |
| Grammar           | 30 min | Estudia una estructura y resuelve ejercicios.        |
| Listening         | 30 min | Escucha, transcribe fragmentos y repite en voz alta. |
| Speaking          | 30 min | Habla sin leer y grábate para detectar errores.      |
| Reading           | 20 min | Lee un artículo o documentación técnica.             |
| Writing & review  | 20 min | Escribe un texto breve y corrige tus errores.        |

**Tiempo total: 150 minutos al día.** Si algún día estás ocupado, haz una versión mínima de 45
minutos: 15 de listening, 15 de speaking y 15 de vocabulario.

### 3. Calendario de las 12 semanas

| Semana | Gramática y lenguaje                     | Misión práctica                          |
| ------ | ---------------------------------------- | ---------------------------------------- |
| 1      | Present simple/continuous, preguntas     | Grabar una presentación de 3 minutos     |
| 2      | Past simple, present perfect             | Contar tu trayectoria profesional        |
| 3      | Future forms, modals, comparatives       | Explicar tus planes y objetivos          |
| 4      | First/second conditionals, passive voice | Explicar cómo funciona una aplicación    |
| 5      | Reported speech, relative clauses        | Resumir una reunión o un video           |
| 6      | Phrasal verbs, collocations              | Mantener una conversación de 15 minutos  |
| 7      | Inversion, cleft sentences, emphasis     | Defender una decisión técnica            |
| 8      | Linking devices, hedging, register       | Escribir un correo profesional complejo  |
| 9      | Idiomatic language y precisión léxica    | Presentar la arquitectura de un proyecto |
| 10     | Síntesis, argumentación, matices         | Debatir un tema durante 10 minutos       |
| 11     | Listening avanzado y escritura formal    | Simular una entrevista en inglés         |
| 12     | Repaso y corrección de errores           | Presentación técnica y evaluación final  |

**Regla importante:** no avances solo porque terminó la semana. Avanza cuando puedas utilizar las
estructuras aprendidas hablando y escribiendo, no únicamente reconocerlas en un examen.

### 4. Aplicaciones recomendadas

No necesitas diez aplicaciones. Necesitas un sistema pequeño que puedas mantener durante 12
semanas.

- **[Anki](https://apps.ankiweb.net/)** — vocabulario y memoria (10–15 min al día). Guarda frases
  completas, no palabras aisladas. Por ejemplo: “I’m responsible for maintaining the frontend
  architecture.”
- **[BBC Learning English](https://www.bbc.co.uk/learningenglish)** — listening y pronunciación
  (15–30 min al día). Empieza con contenido intermedio y avanza hacia materiales más exigentes.
  Escucha una vez sin subtítulos, otra con transcripción y termina imitando frases.
- **[YouGlish](https://youglish.com/)** — pronunciación real (5–10 min al día). Busca expresiones
  que necesites para el trabajo y escucha cómo las pronuncian distintas personas en videos reales.
- **[Cambridge English](https://www.cambridgeenglish.org/learning-english/)** — evaluación (una vez
  por semana). Usa actividades de nivel B1, B2 y después C1 para medir tu progreso y localizar tus
  debilidades.

### 5. Método de speaking: hablar como desarrollador

Conviene aprender inglés general y, al mismo tiempo, practicar las situaciones de un equipo de
desarrollo internacional. Dedica al menos 15–20 minutos diarios a una de estas actividades:

- **Daily stand-up.** Explica qué hiciste ayer, qué harás hoy y qué bloqueos tienes.
  _“Yesterday, I worked on the authentication flow. Today, I’m going to finish the integration. I’m
  currently blocked by an API issue.”_
- **Explicación técnica.** Describe un componente React, un endpoint de Node.js o una consulta
  PostgreSQL.
  _“I chose this approach because it improves maintainability and makes the code easier to test.”_
- **Entrevistas laborales.** Practica preguntas sobre tu experiencia, decisiones técnicas,
  fortalezas y errores que hayas resuelto.
  _“One of the biggest challenges I faced was migrating a legacy application to a newer version of
  React.”_

Puedes usar un asistente de IA como compañero de conversación: pídele que hable contigo
exclusivamente en inglés, que no interrumpa cada frase y que al final te entregue una lista de
errores, correcciones naturales y expresiones nuevas.

### 6. Cómo medir tu progreso

No midas tu nivel solo por las horas que estudiaste. Cada domingo, califica de 1 a 5 cada habilidad
(1 = muy difícil, 5 = cómodo y consistente) y calcula el promedio de la semana:

| Habilidad            | Semana 1 (ejemplo) |
| -------------------- | ------------------ |
| Listening            | 3/5                |
| Speaking             | 3/5                |
| Reading              | 3/5                |
| Writing              | 3/5                |
| Grammar & vocabulary | 3/5                |
| **Promedio**         | **3.0/5**          |

Esta puntuación mide tu percepción personal, **no certifica un nivel CEFR**. Complementa el
resultado con pruebas de comprensión y muestras reales de speaking y writing.

Al finalizar la semana 12, intenta completar estas cuatro pruebas:

- Escuchar un video de 10–15 minutos y resumir sus ideas principales.
- Hablar durante 10 minutos sobre un tema sin preparar un guion completo.
- Escribir un texto argumentativo de 250–300 palabras.
- Resolver una prueba de nivel B2 y explorar ejercicios C1.

### 7. Primera semana, día por día

Para empezar el jueves 8 de octubre de 2026, una primera semana de diagnóstico y consolidación:

| Día    | Enfoque                       | Qué hacer                                                                                    |
| ------ | ----------------------------- | -------------------------------------------------------------------------------------------- |
| Jue 8  | Diagnóstico                   | Grábate hablando 3 minutos, haz una prueba de nivel y escribe 150 palabras sobre tu trabajo. |
| Vie 9  | Present simple y continuous   | Estudia los usos, escribe 15 frases y describe tu rutina laboral.                            |
| Sáb 10 | Past simple y present perfect | Cuenta tres experiencias profesionales y explica qué has aprendido.                          |
| Dom 11 | Repaso ligero                 | Escucha un video, repasa Anki y vuelve a escuchar tu grabación inicial.                      |
| Lun 12 | Preguntas y respuestas        | Practica preguntas de entrevista y respuestas completas en voz alta.                         |
| Mar 13 | Listening y shadowing         | Elige un audio de 5 minutos, imita frases y anota expresiones útiles.                        |
| Mié 14 | Writing y evaluación          | Escribe 180 palabras, corrige los errores y repite la presentación del jueves.               |

### Una nota final

No conviertas el C1 en una carrera por memorizar gramática. Tu objetivo diario debe ser **entender
más, comunicar más y repetir menos errores**. Esa combinación es mucho más útil para una carrera
como desarrollador que estudiar listas interminables de vocabulario.

## License

[MIT](LICENSE)
