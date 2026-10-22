/**
 * Build time search index and umlaut aware search (docs/BUILD_PROMPT.md Sections 7.4 and 17).
 * Pure: the build script feeds it the content, the command palette (Phase 4) loads the JSON.
 */
import Fuse from "fuse.js";

import { routes } from "../routes.ts";

import { normalizeDe } from "./normalize.ts";

import type { SearchItem } from "./types.ts";

export { SEARCH_GROUPS, type SearchGroup, type SearchItem } from "./types.ts";

type Status = { status: "entwurf" | "veroeffentlicht" };

export type SearchSource = {
  software: ({
    slug: string;
    name: string;
    vendor: string;
    categories: string[];
    primaryCategory: string;
    integrations: string[];
  } & Status)[];
  categories: ({ slug: string; name: string; shortName: string } & Status)[];
  vendors: { slug: string; brandName: string; legalName: string }[];
  comparisons: ({ slug: string; a: string; b: string; title: string } & Status)[];
  guides: ({ slug: string; title: string; topic: string } & Status)[];
};

export function buildSearchIndex(source: SearchSource, options: { preview?: boolean } = {}): SearchItem[] {
  const show = (item: Status) => options.preview || item.status === "veroeffentlicht";
  const categories = new Map(source.categories.map((c) => [c.slug, c]));
  const vendors = new Map(source.vendors.map((v) => [v.slug, v]));
  const softwareName = new Map(source.software.map((s) => [s.slug, s.name]));

  const items: SearchItem[] = [];
  for (const s of source.software.filter(show)) {
    const vendor = vendors.get(s.vendor);
    items.push({
      id: `software:${s.slug}`,
      group: "Software",
      label: s.name,
      hint: categories.get(s.primaryCategory)?.shortName,
      href: routes.software(s.slug),
      keywords: [
        ...(vendor ? [vendor.brandName, vendor.legalName] : []),
        ...s.categories.flatMap((c) => {
          const cat = categories.get(c);
          return cat ? [cat.name, cat.shortName] : [];
        }),
        ...s.integrations,
      ],
    });
  }
  for (const c of source.categories.filter(show)) {
    items.push({
      id: `kategorie:${c.slug}`,
      group: "Kategorien",
      label: c.name,
      href: routes.category(c.slug),
      keywords: [c.shortName],
    });
  }
  for (const c of source.comparisons.filter(show)) {
    items.push({
      id: `vergleich:${c.slug}`,
      group: "Vergleiche",
      label: `${softwareName.get(c.a) ?? c.a} oder ${softwareName.get(c.b) ?? c.b}`,
      href: routes.comparison(c.a, c.b),
      keywords: [c.title],
    });
  }
  for (const g of source.guides.filter(show)) {
    items.push({
      id: `ratgeber:${g.slug}`,
      group: "Ratgeber",
      label: g.title,
      hint: g.topic,
      href: routes.guide(g.slug),
    });
  }
  return items;
}

/** Fuse searcher on normalized text: "Größe" finds "groesse" and the other way round. */
export function createSearcher(items: SearchItem[]) {
  // Normalize once at build: "Größe" and "groesse" become the same token on both sides.
  const docs = items.map((item) => ({
    item,
    label: normalizeDe(item.label),
    hint: item.hint ? normalizeDe(item.hint) : "",
    keywords: (item.keywords ?? []).map(normalizeDe),
  }));
  const fuse = new Fuse(docs, {
    keys: [
      { name: "label", weight: 3 },
      { name: "hint", weight: 1 },
      { name: "keywords", weight: 1.5 },
    ],
    ignoreLocation: true,
    threshold: 0.32,
    minMatchCharLength: 2,
  });

  return (query: string, limit = 20): SearchItem[] => {
    const q = normalizeDe(query);
    if (q.length < 2) return [];
    return fuse.search(q, { limit }).map((result) => result.item.item);
  };
}
