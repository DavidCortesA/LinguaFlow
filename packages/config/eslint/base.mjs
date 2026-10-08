import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/**
 * Package boundaries (see docs/ARCHITECTURE.md). `pnpm` already prevents importing
 * undeclared dependencies; these rules make the intent explicit and fail early.
 */
export const boundaryRules = {
  /** Pass the specifiers a workspace must not import. */
  restrict: (patterns, message) => ({
    "no-restricted-imports": ["error", { patterns: [{ group: patterns, message }] }],
  }),
};

export default tseslint.config(
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/.turbo/**", "**/coverage/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  prettier,
);
