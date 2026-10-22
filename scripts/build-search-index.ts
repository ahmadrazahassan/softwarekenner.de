/**
 * Writes public/search-index.json from the content collections (docs/BUILD_PROMPT.md Section 7.4).
 * Runs after validate-content as part of `pnpm build`. Only published content unless CONTENT_PREVIEW=1.
 * `pnpm dev` passes --dev: drafts are included like in the dev server, unless CONTENT_PREVIEW=0.
 *
 * Run: `pnpm search:index`
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { buildSearchIndex, type SearchSource } from "../lib/search/index.ts";

const root = process.cwd();
const generated = join(root, ".content-collections", "generated", "index.js");
if (!existsSync(generated)) {
  console.error("Content Collections fehlen. Zuerst `pnpm content:validate` ausführen.");
  process.exit(1);
}

const c = (await import(pathToFileURL(generated).href)) as Record<string, unknown[]>;
const source = {
  software: c.allSoftware,
  categories: c.allCategories,
  vendors: c.allVendors,
  comparisons: c.allComparisons,
  guides: c.allGuides,
} as unknown as SearchSource;

const preview =
  process.env.CONTENT_PREVIEW === "1" ||
  (process.argv.includes("--dev") && process.env.CONTENT_PREVIEW !== "0");
const items = buildSearchIndex(source, { preview });
mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public", "search-index.json"), JSON.stringify({ version: 1, items }));
console.log(`✓ Suchindex: ${items.length} Einträge in public/search-index.json`);
