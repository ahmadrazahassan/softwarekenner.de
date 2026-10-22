/**
 * Content validation (docs/BUILD_PROMPT.md Section 10). Runs before every `next build`:
 * 1. Content Collections build with the Zod schemas. Any read, parse or validation error fails.
 * 2. Cross reference and publishing guards from lib/content/guards.ts, including the copy lint.
 * Exit code 1 on any error; warnings are printed but do not fail.
 *
 * Run: `pnpm content:validate`
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { createBuilder } from "@content-collections/core";

import { checkContent, type ContentSet, type Issue } from "../lib/content/guards.ts";

const root = process.cwd();
const failures: string[] = [];

const builder = await createBuilder(join(root, "content-collections.ts"));
const describe = (event: unknown) => {
  const e = event as {
    collection?: { name?: string; directory?: string } | string;
    file?: { path?: string };
    filePath?: string;
    error?: { message?: string };
  };
  const collection = typeof e.collection === "string" ? e.collection : e.collection?.name;
  const where = e.file?.path ? `${collection ?? "?"}/${e.file.path}` : (e.filePath ?? collection ?? "");
  return `${where}\n${e.error?.message ?? JSON.stringify(event)}`;
};
for (const key of [
  "collector:read-error",
  "collector:parse-error",
  "transformer:validation-error",
  "transformer:result-error",
  "transformer:error",
] as const) {
  builder.on(key, (event) => failures.push(`${key}: ${describe(event)}`));
}
await builder.build();

if (failures.length > 0) {
  console.error(`\n✗ Schemafehler in ${failures.length} Dokument(en):\n`);
  for (const failure of failures) console.error(`${failure}\n`);
  process.exit(1);
}

const generated = join(root, ".content-collections", "generated", "index.js");
const collections = (await import(pathToFileURL(generated).href)) as Record<string, unknown[]>;

const data: ContentSet = {
  software: collections.allSoftware as ContentSet["software"],
  categories: collections.allCategories as ContentSet["categories"],
  vendors: collections.allVendors as ContentSet["vendors"],
  authors: collections.allAuthors as ContentSet["authors"],
  userReviews: collections.allUserReviews as ContentSet["userReviews"],
  reviews: collections.allReviews as ContentSet["reviews"],
  comparisons: collections.allComparisons as ContentSet["comparisons"],
  guides: collections.allGuides as ContentSet["guides"],
  buyingGuides: collections.allBuyingGuides as ContentSet["buyingGuides"],
  downloads: collections.allDownloads as ContentSet["downloads"],
};

// Files the include pattern would silently skip (wrong extension) are reported too.
for (const dir of readdirSync(join(root, "content"))) {
  for (const file of readdirSync(join(root, "content", dir))) {
    if (file !== ".gitkeep" && !/\.(json|mdx)$/.test(file)) {
      failures.push(`content/${dir}/${file}: unbekannte Dateiendung, wird nicht geladen.`);
    }
  }
}

const issues: Issue[] = checkContent(data);
const errors = [
  ...failures,
  ...issues.filter((i) => i.level === "error").map((i) => `${i.where}: ${i.message}`),
];
const warnings = issues.filter((i) => i.level === "warning");

for (const w of warnings) console.warn(`⚠ ${w.where}: ${w.message}`);
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} Fehler:\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const counts = Object.entries(data)
  .map(([name, list]) => `${list.length} ${name}`)
  .join(", ");
console.log(`✓ Inhalte gültig: ${counts}. ${warnings.length} Warnung(en).`);
