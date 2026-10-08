import base, { boundaryRules } from "@linguaflow/config/eslint/base";

export default [
  ...base,
  {
    rules: boundaryRules.restrict(
      ["@linguaflow/database", "@linguaflow/learning-engine", "@linguaflow/web", "@linguaflow/api"],
      "@linguaflow/ai may depend only on @linguaflow/shared.",
    ),
  },
];
