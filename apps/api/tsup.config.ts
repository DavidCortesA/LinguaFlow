import { defineConfig } from "tsup";

// Workspace packages ship TypeScript source, so they are bundled into the output.
// Third-party dependencies stay external and are resolved from node_modules at runtime.
export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node22",
  platform: "node",
  clean: true,
  sourcemap: true,
  noExternal: [/^@linguaflow\//],
});
