import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Drafts are visible in preview mode. `next dev` previews by default, so the local site shows all
 * content while it is being written; `CONTENT_PREVIEW=0 pnpm dev` shows the public view. Builds stay
 * public unless CONTENT_PREVIEW=1 is set explicitly.
 */
const previewFor = (phase: string) =>
  process.env.CONTENT_PREVIEW === "1" ||
  (phase === PHASE_DEVELOPMENT_SERVER && process.env.CONTENT_PREVIEW !== "0");

const nextConfig = (phase: string): NextConfig => ({
  // Fixed at build time: the static shell and request time renders must see the same content set.
  env: { CONTENT_PREVIEW: previewFor(phase) ? "1" : "0" },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
});

// Builds the content collections before `next build`, `next typegen` and in dev (with watch).
const config = (phase: string) => withContentCollections(nextConfig(phase));

export default config;
