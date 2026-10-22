/**
 * Copy lint for UI strings (docs/BUILD_PROMPT.md Appendix B). Walks the TypeScript AST of
 * app/, components/ and lib/ and checks JSX text, copy carrying JSX attributes and copy carrying
 * object properties. Content files are linted by validate-content.
 *
 * Run: `pnpm lint:copy`
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import ts from "typescript";

import { lintText } from "../lib/content/copy-lint.ts";

const ROOTS = ["app", "components", "lib"];
const SKIP = [/\.test\.tsx?$/, /[\\/]lib[\\/]content[\\/]copy-lint\.ts$/];

/** JSX attributes and object keys that carry visible or announced copy. */
const COPY_KEYS = new Set([
  "aria-label",
  "aria-valuetext",
  "title",
  "placeholder",
  "label",
  "openLabel",
  "alt",
  "description",
  "text",
  "caption",
  "hint",
  "error",
  "question",
  "answer",
  "teaser",
  "intro",
  "eyebrow",
  "summary",
  "verdict",
  "content",
  "name",
  "shortName",
  "use",
  "sample",
  "valueText",
  "message",
]);

const files: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|mts)$/.test(name) && !SKIP.some((re) => re.test(path))) files.push(path);
  }
};
for (const root of ROOTS) walk(join(process.cwd(), root));

type Finding = { file: string; line: number; message: string; excerpt: string };
const findings: Finding[] = [];

const keyName = (name: ts.PropertyName | ts.JsxAttributeName) =>
  ts.isIdentifier(name) || ts.isStringLiteral(name)
    ? name.text
    : ts.isJsxNamespacedName(name)
      ? name.name.text
      : name.getText();

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const check = (node: ts.Node, text: string) => {
    for (const issue of lintText(text)) {
      const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
      findings.push({ file: relative(process.cwd(), file), line: line + 1, ...issue });
    }
  };
  const strings = (node: ts.Node): string[] => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text];
    if (ts.isTemplateExpression(node))
      return [node.head.text, ...node.templateSpans.map((s) => s.literal.text)];
    if (ts.isJsxExpression(node) && node.expression) return strings(node.expression);
    if (ts.isConditionalExpression(node)) return [...strings(node.whenTrue), ...strings(node.whenFalse)];
    if (ts.isBinaryExpression(node)) return [...strings(node.left), ...strings(node.right)];
    return [];
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim();
      if (text) check(node, text);
    } else if (ts.isJsxAttribute(node) && node.initializer && COPY_KEYS.has(keyName(node.name))) {
      for (const text of strings(node.initializer)) check(node, text);
    } else if (ts.isPropertyAssignment(node) && COPY_KEYS.has(keyName(node.name))) {
      for (const text of strings(node.initializer)) check(node, text);
    } else if (ts.isJsxExpression(node) && node.expression && ts.isJsxElement(node.parent)) {
      // {"Text"} and {`Text ${x}`} as JSX children.
      for (const text of strings(node.expression)) check(node, text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (findings.length > 0) {
  console.error(`\n✗ ${findings.length} Copy-Fehler:\n`);
  for (const f of findings) console.error(`  ${f.file}:${f.line}  ${f.message}: „${f.excerpt}“`);
  process.exit(1);
}
console.log(`✓ Copy-Lint: ${files.length} Dateien geprüft, keine Fehler.`);
