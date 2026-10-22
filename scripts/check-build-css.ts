/**
 * Post build guard (docs/BUILD_PROMPT.md Sections 3 and 23):
 * the compiled CSS may contain only brand color tokens and only our three font families.
 * Run after `pnpm build`: `pnpm check:css`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ALLOWED_COLOR_TOKENS = new Set([
  "white",
  "brand-50",
  "brand-100",
  "brand-200",
  "brand-500",
  "brand-700",
  "brand-ink",
  "ink",
  "ink-800",
  "ink-700",
  "canvas",
  "surface",
  "surface-tint",
  "line",
  "line-strong",
  "text",
  "text-muted",
  "text-subtle",
  "on-dark-muted",
  "positive",
  "negative",
  "info",
]);

// next/font/local names each family after the export in app/fonts.ts.
// outfit = Outfit, nunitoSans = Nunito Sans, workSans = Work Sans.
const ALLOWED_FAMILIES = new Set(["outfit", "nunitoSans", "workSans"]);
const ALLOWED_FONT_FILES =
  /^url\(\.\.\/media\/(outfit|nunito_sans|nunito_sans_italic|work_sans)\.[^)]+\.woff2\)/;

const SYSTEM_FONT_NAMES =
  /\b(ui-sans-serif|ui-serif|ui-monospace|system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Helvetica|Arial|Menlo|Monaco|Consolas|Courier New|Georgia|Times New Roman|Fallback)\b/;

const cssDir = join(process.cwd(), ".next", "static");

function listCss(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listCss(path);
    return path.endsWith(".css") ? [path] : [];
  });
}

const files = listCss(cssDir);
if (files.length === 0) {
  console.error("Keine CSS-Dateien in .next/static gefunden. Zuerst `pnpm build` ausführen.");
  process.exit(1);
}

const problems: string[] = [];
let faces = 0;
for (const file of files) {
  const css = readFileSync(file, "utf8");

  for (const [, token] of css.matchAll(/--color-([a-z0-9-]+)\s*:/g)) {
    if (!ALLOWED_COLOR_TOKENS.has(token)) problems.push(`${file}: fremdes Farbtoken --color-${token}`);
  }

  for (const [face] of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
    faces++;
    const family = face
      .match(/font-family:\s*([^;}]+)/)?.[1]
      ?.trim()
      .replace(/^["']|["']$/g, "");
    if (!family || !ALLOWED_FAMILIES.has(family)) problems.push(`${file}: fremde Schriftfamilie ${family}`);
    const src = face.match(/src:\s*([^;}]+)/)?.[1]?.trim() ?? "";
    if (!ALLOWED_FONT_FILES.test(src)) problems.push(`${file}: fremde Schriftquelle ${src}`);
  }

  for (const [, stack] of css.matchAll(/font-family:\s*([^;}]+)/g)) {
    const families = stack.split(",").map((f) => f.trim().replace(/^["']|["']$/g, ""));
    for (const family of families) {
      if (family === "inherit" || family.startsWith("var(--font-")) continue;
      if (!ALLOWED_FAMILIES.has(family)) problems.push(`${file}: fremde Schrift im Stack ${stack}`);
    }
  }

  const system = css.match(SYSTEM_FONT_NAMES);
  if (system) problems.push(`${file}: Systemschrift ${system[0]} im CSS`);
}

if (faces !== 4)
  problems.push(`Erwartet 4 @font-face Regeln (3 Familien, Nunito Sans kursiv), gefunden ${faces}`);

if (problems.length > 0) {
  console.error([...new Set(problems)].join("\n"));
  process.exit(1);
}
console.log(`Build-CSS geprüft: ${files.length} Datei(en), nur Markenfarben und die drei Markenschriften.`);
