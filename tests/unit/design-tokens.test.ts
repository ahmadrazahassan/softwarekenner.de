import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = join(import.meta.dirname, "..", "..");
const css = readFileSync(join(root, "styles", "globals.css"), "utf8");
const fontsTs = readFileSync(join(root, "app", "fonts.ts"), "utf8");

// docs/BUILD_PROMPT.md Section 5.2 and Section 9.
const EXPECTED_COLORS: Record<string, string> = {
  white: "#ffffff",
  "brand-50": "#fff6ea",
  "brand-100": "#ffe6c4",
  "brand-200": "#ffd08f",
  "brand-500": "#ffa028",
  "brand-700": "#e06601",
  "brand-ink": "#a84800",
  ink: "#0a0e09",
  "ink-800": "#151a14",
  "ink-700": "#23291f",
  canvas: "#eceefe",
  surface: "#ffffff",
  "surface-tint": "#f6f7ff",
  line: "#dfe2fb",
  "line-strong": "#c9cdf3",
  text: "#0a0e09",
  "text-muted": "#4b5068",
  "text-subtle": "#6b7088",
  "on-dark-muted": "#b9bccb",
  positive: "#1d7a4c",
  negative: "#b42318",
  info: "#4a4fc4",
};

const ALLOWED_FONT_VARS = ["--font-outfit", "--font-nunito-sans", "--font-work-sans"];

describe("Tailwind theme tokens", () => {
  it("removes the default color palette, shadows and font families", () => {
    expect(css).toMatch(/--color-\*:\s*initial;/);
    expect(css).toMatch(/--shadow-\*:\s*initial;/);
    expect(css).toMatch(/--font-\*:\s*initial;/);
  });

  it("defines exactly the brand color tokens", () => {
    const defined = Object.fromEntries(
      [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [
        m[1],
        m[2].toLowerCase(),
      ]),
    );
    expect(defined).toEqual(EXPECTED_COLORS);
  });

  it("uses no hex color outside the brand set", () => {
    const allowed = new Set(Object.values(EXPECTED_COLORS));
    const used = [...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
    expect(used.filter((hex) => !allowed.has(hex))).toEqual([]);
  });

  it("maps every font token to one of the three self hosted families", () => {
    const fontDecls = [...css.matchAll(/--(font-[a-z-]+|default-[a-z-]*font-family):\s*([^;]+);/g)];
    expect(fontDecls.length).toBeGreaterThan(0);
    for (const [, name, value] of fontDecls) {
      if (value.trim() === "initial") continue;
      expect(value.trim(), name).toMatch(new RegExp(`^var\\((${ALLOWED_FONT_VARS.join("|")})\\)$`));
    }
  });

  it("names no font family literally in CSS", () => {
    const literal = [...css.matchAll(/font-family:\s*([^;]+);/g)].map((m) => m[1].trim());
    expect(literal.every((value) => value.startsWith("var("))).toBe(true);
  });
});

describe("next/font/local setup", () => {
  it("loads only the self hosted Outfit, Nunito Sans and Work Sans files", () => {
    expect(fontsTs).not.toMatch(/from\s+"next\/font\/google"/);
    const paths = [...fontsTs.matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]).sort();
    expect(paths).toEqual([
      "../assets/fonts/web/nunito-sans-italic.woff2",
      "../assets/fonts/web/nunito-sans.woff2",
      "../assets/fonts/web/outfit.woff2",
      "../assets/fonts/web/work-sans.woff2",
    ]);
    for (const path of paths) expect(existsSync(join(root, "app", path)), path).toBe(true);
  });

  it("keeps the OFL source files and licenses next to the web fonts", () => {
    for (const file of [
      "source/Outfit-Variable.ttf",
      "source/NunitoSans-Variable.ttf",
      "source/NunitoSans-Italic-Variable.ttf",
      "source/WorkSans-Variable.ttf",
      "licenses/Outfit-OFL.txt",
      "licenses/NunitoSans-OFL.txt",
      "licenses/WorkSans-OFL.txt",
    ]) {
      expect(existsSync(join(root, "assets", "fonts", file)), file).toBe(true);
    }
  });

  it("disables generated fallback faces and sets no fallback list", () => {
    expect(fontsTs.match(/adjustFontFallback:\s*false,/g)).toHaveLength(3);
    expect(fontsTs).not.toMatch(/fallback:\s*\[/);
  });

  it("exposes the CSS variables the theme expects", () => {
    for (const v of ALLOWED_FONT_VARS) expect(fontsTs).toContain(`variable: "${v}"`);
  });
});
