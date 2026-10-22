/**
 * Builds the self hosted web fonts from the OFL source files in assets/fonts/source.
 * Output: assets/fonts/web/*.woff2, loaded through next/font/local (docs/DECISIONS.md).
 *
 * - Subset: Google Fonts "latin" plus "latin-ext" ranges, plus ⌘ for the shortcut hint.
 * - Axes: wght limited to the weights we use, every other axis pinned to its default,
 *   so each style is one small variable file.
 *
 * Run: `pnpm fonts:build` (only needed when a source file or a range changes).
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import subsetFont from "subset-font";

type Range = [number, number];

// Google Fonts unicode-range for the "latin" and "latin-ext" subsets.
const LATIN: Range[] = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
];
const LATIN_EXT: Range[] = [
  [0x0100, 0x02ba],
  [0x02bd, 0x02c5],
  [0x02c7, 0x02cc],
  [0x02ce, 0x02d7],
  [0x02dd, 0x02ff],
  [0x1d00, 0x1dbf],
  [0x1e00, 0x1e9f],
  [0x1ef2, 0x1eff],
  [0x2020, 0x2020],
  [0x20a0, 0x20ab],
  [0x20ad, 0x20c0],
  [0x2113, 0x2113],
  [0x2c60, 0x2c7f],
  [0xa720, 0xa7ff],
];
const EXTRA: Range[] = [[0x2318, 0x2318]]; // ⌘ in "⌘ K"

const text = [...LATIN, ...LATIN_EXT, ...EXTRA]
  .flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)))
  .join("");

type FontJob = {
  source: string;
  out: string;
  axes: Record<string, number | { min: number; max: number; default?: number }>;
};

const FONTS: FontJob[] = [
  {
    source: "Outfit-Variable.ttf",
    out: "outfit.woff2",
    axes: { wght: { min: 400, max: 800, default: 400 } },
  },
  {
    source: "WorkSans-Variable.ttf",
    out: "work-sans.woff2",
    axes: { wght: { min: 400, max: 600, default: 400 } },
  },
  {
    source: "NunitoSans-Variable.ttf",
    out: "nunito-sans.woff2",
    axes: { wght: { min: 400, max: 700, default: 400 }, wdth: 100, opsz: 12, YTLC: 500 },
  },
  {
    source: "NunitoSans-Italic-Variable.ttf",
    out: "nunito-sans-italic.woff2",
    axes: { wght: { min: 400, max: 700, default: 400 }, wdth: 100, opsz: 12, YTLC: 500 },
  },
];

const root = process.cwd();
const sourceDir = join(root, "assets", "fonts", "source");
const outDir = join(root, "assets", "fonts", "web");
mkdirSync(outDir, { recursive: true });

for (const font of FONTS) {
  const input = readFileSync(join(sourceDir, font.source));
  const output = await subsetFont(input, text, { targetFormat: "woff2", variationAxes: font.axes });
  const target = join(outDir, font.out);
  writeFileSync(target, output);
  console.log(`${font.out}: ${(statSync(target).size / 1024).toFixed(1)} KB`);
}
