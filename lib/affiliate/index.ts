/**
 * Affiliate redirect logic (docs/BUILD_PROMPT.md Section 18). Pure, so the route handler stays thin
 * and every branch is unit tested. Only whitelisted values reach the vendor: no personal data.
 */
import { GO_SOURCES, routes, type GoSource } from "@/lib/routes";

type AffiliateProduct = {
  slug: string;
  affiliate: { url: string; network: string; active: boolean } | null;
};

/** Query parameter each network reads as its sub id. Unknown networks use "subid". */
const SUBID_PARAM: Record<string, string> = {
  awin: "clickref",
  financeads: "subid",
  digistore24: "sid1",
  partnerstack: "sid",
  impact: "subId1",
};

/** Direct partner links (UTM only, no network): the URL is used as given, without a sub id. */
const WITHOUT_SUBID = new Set(["direkt"]);

export type GoTarget =
  | { kind: "affiliate"; url: string; from: GoSource | null; position: number | null }
  | { kind: "profile"; path: string }
  | { kind: "index"; path: string };

export const parseGoSource = (value: string | null): GoSource | null =>
  value && (GO_SOURCES as readonly string[]).includes(value) ? (value as GoSource) : null;

/** Positions 1 to 50 only; anything else is dropped. */
export const parseGoPosition = (value: string | null): number | null => {
  if (!value || !/^\d{1,2}$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= 50 ? n : null;
};

/** Sub id from whitelisted parts only, e.g. "kategorie-3". */
export const subidOf = (from: GoSource | null, position: number | null) =>
  [from ?? "direkt", position].filter((part) => part !== null).join("-");

export function resolveGoTarget(
  product: AffiliateProduct | undefined,
  query: { from: string | null; pos: string | null },
): GoTarget {
  if (!product) return { kind: "index", path: routes.softwareIndex() };
  if (!product.affiliate?.active) return { kind: "profile", path: routes.software(product.slug) };

  const from = parseGoSource(query.from);
  const position = parseGoPosition(query.pos);
  const url = new URL(product.affiliate.url);
  if (!WITHOUT_SUBID.has(product.affiliate.network)) {
    url.searchParams.set(SUBID_PARAM[product.affiliate.network] ?? "subid", subidOf(from, position));
  }
  return { kind: "affiliate", url: url.toString(), from, position };
}

export type PartnerEntry<T> =
  { kind: "product"; product: T } | { kind: "vendor"; vendor: string; products: T[] };

/**
 * Entries for the home partner block. Several programs of one vendor behind the same partner link
 * (the Sage portfolio) become one vendor entry, so a portfolio cannot fill the block. Order is kept.
 */
export function groupByPartnerLink<T extends { vendor: string; affiliate: { url: string } | null }>(
  products: T[],
): PartnerEntry<T>[] {
  const key = (p: T) => `${p.vendor} ${p.affiliate?.url}`;
  const counts = new Map<string, number>();
  for (const p of products) counts.set(key(p), (counts.get(key(p)) ?? 0) + 1);

  const entries: PartnerEntry<T>[] = [];
  const vendorEntries = new Map<string, { kind: "vendor"; vendor: string; products: T[] }>();
  for (const p of products) {
    if (counts.get(key(p))! < 2) {
      entries.push({ kind: "product", product: p });
      continue;
    }
    const existing = vendorEntries.get(key(p));
    if (existing) existing.products.push(p);
    else {
      const entry = { kind: "vendor" as const, vendor: p.vendor, products: [p] };
      vendorEntries.set(key(p), entry);
      entries.push(entry);
    }
  }
  return entries;
}

/** Headers for every `/go` response (Section 18). */
export const GO_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
  "Referrer-Policy": "strict-origin-when-cross-origin",
} as const;
