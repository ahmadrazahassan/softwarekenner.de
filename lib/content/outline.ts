/**
 * Outline helpers for long form MDX (Ratgeber, Kaufberatung): reading time and the table of contents.
 * Pure functions, shared by the pages (from the raw source) and the MDX h2 component (from the
 * rendered children), so both derive the same anchor ids.
 */
import type { ReactNode } from "react";

import { toSlug } from "@/lib/routes";

/** Reading time in minutes, 200 words per minute, at least one. */
export const readingMinutes = (text: string): number =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));

/** Plain text of rendered MDX children (strings, numbers and nested elements). */
export function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/** Anchor id for a heading text: the slug rule from Section 12. */
export const headingId = (text: string): string => toSlug(text);

/** Second level headings of an MDX source (outside code fences) as table of contents entries. */
export function outlineOf(source: string): { id: string; label: string }[] {
  const items: { id: string; label: string }[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const label = match[1]!
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    items.push({ id: headingId(label), label });
  }
  return items;
}
