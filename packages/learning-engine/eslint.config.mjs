import base, { boundaryRules } from "@linguaflow/config/eslint/base";

export default [
  ...base,
  {
    rules: boundaryRules.restrict(
      ["@linguaflow/database", "@linguaflow/ai", "@linguaflow/web", "@linguaflow/api"],
      "@linguaflow/learning-engine may depend only on @linguaflow/shared.",
    ),
  },
];
