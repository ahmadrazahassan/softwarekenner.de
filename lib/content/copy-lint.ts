/**
 * Copy lint (docs/BUILD_PROMPT.md Appendix B and Section 15.3). Pure functions, used by
 * scripts/lint-copy.ts (UI strings) and scripts/validate-content.ts (content).
 * Code blocks, URLs and data enum values are excluded by the callers.
 */

export type CopyRule = { id: string; pattern: RegExp; message: string };

export const COPY_RULES: CopyRule[] = [
  { id: "em-dash", pattern: /—/, message: "Gedankenstrich (em dash) entfernen" },
  { id: "en-dash", pattern: /–/, message: "Halbgeviertstrich (en dash) entfernen" },
  // Markdown list bullets at line start stay allowed: the rule needs a character before the space.
  { id: "spaced-hyphen", pattern: /\S[ \t]-[ \t]\S/, message: "Bindestrich als Satzzeichen ersetzen" },
  { id: "currency", pattern: /\$|\bUSD\b/, message: "Nur Euro verwenden" },
  { id: "placeholder", pattern: /\b(Lorem|ipsum)\b/i, message: "Platzhaltertext entfernen" },
  {
    id: "phrase",
    pattern:
      /(nahtlos|revolutionär|bahnbrechend|Game.?Changer|nächste[ns]? Level|schnelllebig|spielend leicht|im Handumdrehen|unschlagbar|In der heutigen digitalen Welt|Zusammenfassend lässt sich sagen|Es ist wichtig zu beachten|In diesem Artikel werden wir|Tauchen wir ein|\bein Muss\b|Rundum-sorglos|ganzheitliche Lösung|maßgeschneiderte Lösung|das A und O|last but not least)/i,
    message: "Floskel ersetzen (Section 15.3)",
  },
  {
    id: "english-ui",
    pattern: /\b(Read more|Submit|Learn more|Get started|Sign up|Click here)\b/,
    message: "Englischen UI-Text übersetzen",
  },
];

export type CopyIssue = { rule: string; message: string; excerpt: string };

/** Lint one piece of copy. */
export function lintText(text: string): CopyIssue[] {
  const issues: CopyIssue[] = [];
  for (const rule of COPY_RULES) {
    const match = rule.pattern.exec(text);
    if (match) {
      const start = Math.max(0, match.index - 25);
      issues.push({
        rule: rule.id,
        message: rule.message,
        excerpt: text
          .slice(start, match.index + match[0].length + 25)
          .replace(/\s+/g, " ")
          .trim(),
      });
    }
  }
  return issues;
}

/** Remove what is not copy from MDX: frontmatter, fenced and inline code, imports, URLs, JSX tags. */
export function stripMdxForLint(source: string): string {
  return source
    .replace(/^---[\s\S]*?\n---/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "")
    .replace(/^(import|export)\s.*$/gm, "")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ");
}

/** Keys whose values are data (slugs, enums, URLs, paths, colors), never copy. */
const DATA_KEYS = new Set([
  "slug",
  "id",
  "vendor",
  "categories",
  "primaryCategory",
  "alternatives",
  "related",
  "category",
  "softwareSlug",
  "a",
  "b",
  "author",
  "reviewer",
  "status",
  "verification",
  "unit",
  "serverLocation",
  "avv",
  "gobd",
  "xrechnung",
  "zugferd",
  "iso27001",
  "bsiC5",
  "platforms",
  "companySizes",
  "companySize",
  "icon",
  "brandColor",
  "logo",
  "photo",
  "file",
  "src",
  "url",
  "website",
  "source",
  "linkedin",
  "network",
  "method",
  "moderation",
  "usageDuration",
  "country",
  "supportLanguages",
  "currency",
  "basis",
  "content",
  "mdx",
  "_meta",
]);

/** Walk a content object and lint every copy string. Returns issues with their JSON path. */
export function lintContentValue(value: unknown, path = ""): (CopyIssue & { path: string })[] {
  if (typeof value === "string") {
    if (/^(https?:|\/|#)/.test(value)) return [];
    return lintText(value).map((issue) => ({ ...issue, path }));
  }
  if (Array.isArray(value)) return value.flatMap((item, i) => lintContentValue(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      DATA_KEYS.has(key) ? [] : lintContentValue(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
