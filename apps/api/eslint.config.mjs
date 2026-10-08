import base from "@linguaflow/config/eslint/base";

// The API is the top of the dependency graph: it may use every shared package.
export default [...base];
