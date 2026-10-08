import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Workspace packages ship TypeScript source and must be compiled by Next.
  transpilePackages: ["@linguaflow/shared"],
  turbopack: {
    // The app lives in apps/web but imports workspace packages from the monorepo root.
    // Next is always started from apps/web (via the package scripts), so cwd is reliable.
    root: path.join(process.cwd(), "../.."),
  },
};

export default nextConfig;
