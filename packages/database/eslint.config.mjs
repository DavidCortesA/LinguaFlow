import base, { boundaryRules } from "@linguaflow/config/eslint/base";

export default [
  ...base,
  {
    rules: boundaryRules.restrict(
      ["@linguaflow/*", "!@linguaflow/config", "!@linguaflow/config/*"],
      "@linguaflow/database is a leaf package and must not depend on other workspace packages.",
    ),
  },
];
