/**
 * Data access layer (docs/BUILD_PROMPT.md Section 9). Pages call these functions and never read
 * content files directly, so a headless CMS can replace the files later without touching pages.
 * Drafts are visible only with CONTENT_PREVIEW=1.
 */
import "server-only";

import {
  allAuthors,
  allBuyingGuides,
  allCategories,
  allComparisons,
  allDownloads,
  allGuides,
  allMarkets,
  allReviews,
  allSoftware,
  allUserReviews,
  allVendors,
} from "content-collections";

import type { RankedDetails } from "@/components/software/cards";
import type { SoftwareSummary } from "@/components/software/types";
import { compareDe, formatPrice, PRICE_UNIT_LABEL } from "@/lib/format";
import { MAIN_NAV } from "@/lib/navigation";
import { routes, type GoSource } from "@/lib/routes";
import type { FinderProduct } from "@/lib/finder";
import { buildSearchIndex } from "@/lib/search";
import { computeAwards, type AwardKind } from "@/lib/scoring";

import { facetsOf } from "./filters";
import {
  alternativesOf,
  entryPrice,
  filterSoftware,
  inCategory,
  isVisible,
  scoreOf,
  sortSoftware,
  weightsFor,
  type SoftwareFilters,
  type SoftwareSort,
} from "./query";
import type { SoftwareData } from "./schemas";
import { checkTally, planLadder, portfolioStats, pricePosition, rankIn, teamCosts } from "./stats";
import { deutschlandCheckRows, toSoftwareSummary } from "./view";

export const isPreview = () => process.env.CONTENT_PREVIEW === "1";
const visible = (item: { status: "entwurf" | "veroeffentlicht" }) => isVisible(item, isPreview());

/* ---------- Categories ---------- */

/** Visible categories that contain at least one visible program. Empty ones stay out of menus and lists. */
export const listCategories = () =>
  allCategories
    .filter(visible)
    .filter((c) => allSoftware.some((s) => visible(s) && s.categories.includes(c.slug)))
    .sort((a, b) => a.batch - b.batch || compareDe(a.name, b.name));

export const getCategory = (slug: string) => allCategories.find((c) => c.slug === slug && visible(c));

/* ---------- Software ---------- */

export const listSoftware = () => allSoftware.filter(visible).sort((a, b) => compareDe(a.name, b.name));

export const getSoftware = (slug: string) => allSoftware.find((s) => s.slug === slug && visible(s));

export function listSoftwareByCategory(
  categorySlug: string,
  options: { filters?: SoftwareFilters; sort?: SoftwareSort } = {},
) {
  const weights = weightsFor(getCategory(categorySlug));
  const items = filterSoftware(
    inCategory(allSoftware.filter(visible), categorySlug),
    options.filters ?? {},
    weights,
  );
  return sortSoftware(items, options.sort ?? "empfohlen", weights);
}

export const getAlternatives = (slug: string) => {
  const software = getSoftware(slug);
  return software ? alternativesOf(software, allSoftware, visible) : [];
};

/** Overall score in the context of a category (its weights), else the default weights. */
export const getScore = (slug: string, categorySlug?: string) => {
  const software = getSoftware(slug);
  if (!software) return undefined;
  return scoreOf(software, weightsFor(getCategory(categorySlug ?? software.primaryCategory)));
};

/** Input for the Softwarefinder (lib/finder): facts and per category scores, nothing else. */
export function finderData() {
  const categories = listCategories();
  const products: FinderProduct[] = listSoftware().map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.logo,
    href: routes.software(s.slug),
    categories: s.categories,
    scoreByCategory: Object.fromEntries(
      categories.filter((c) => s.categories.includes(c.slug)).map((c) => [c.slug, scoreOf(s, weightsFor(c))]),
    ),
    facets: facetsOf(s, weightsFor(getCategory(s.primaryCategory))),
  }));
  return {
    categories: categories.map((c) => ({ slug: c.slug, label: c.shortName, icon: c.icon })),
    products,
  };
}

/** Awards per category (Section 11.3), keyed by product slug. */
export function getAwards(categorySlug: string): Map<string, AwardKind[]> {
  const category = getCategory(categorySlug);
  const candidates = inCategory(allSoftware.filter(visible), categorySlug).map((s) => ({
    slug: s.slug,
    name: s.name,
    scores: s.scores,
    companySizes: s.companySizes,
    serverLocation: s.hosting.serverLocation,
  }));
  const winners = computeAwards(candidates, weightsFor(category));
  const bySlug = new Map<string, AwardKind[]>();
  for (const [kind, slug] of Object.entries(winners) as [AwardKind, string][]) {
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), kind]);
  }
  return bySlug;
}

/* ---------- Vendors, authors ---------- */

export const getVendor = (slug: string) => allVendors.find((v) => v.slug === slug);
export const listVendors = () => [...allVendors].sort((a, b) => compareDe(a.brandName, b.brandName));
export const getAuthor = (slug: string) => allAuthors.find((a) => a.slug === slug);
export const listAuthors = () => [...allAuthors].sort((a, b) => compareDe(a.name, b.name));

/* ---------- User reviews: only approved ones, empty at launch ---------- */

export const listUserReviews = (softwareSlug: string) =>
  allUserReviews
    .filter((r) => r.softwareSlug === softwareSlug && r.moderation === "freigegeben")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/* ---------- Editorial MDX ---------- */

export const getReview = (softwareSlug: string) =>
  allReviews.find((r) => r.softwareSlug === softwareSlug && visible(r));

/** Visible long form reviews of visible profiles, newest first. */
export const listReviews = () =>
  allReviews
    .filter((r) => visible(r) && getSoftware(r.softwareSlug))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || compareDe(a.title, b.title));

export const getBuyingGuide = (categorySlug: string) =>
  allBuyingGuides.find((g) => g.category === categorySlug && visible(g));

/** Buying guides of visible categories, in category order. */
export const listBuyingGuides = () => {
  const order = listCategories().map((c) => c.slug);
  return allBuyingGuides
    .filter((g) => visible(g) && order.includes(g.category))
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
};

export const listComparisons = () => allComparisons.filter(visible);
export const getComparison = (slug: string) => allComparisons.find((c) => c.slug === slug && visible(c));
export const listComparisonsFor = (softwareSlug: string) =>
  listComparisons().filter((c) => c.a === softwareSlug || c.b === softwareSlug);

/** Visible guides, newest first; on the same day the featured one leads, then by title. */
export const listGuides = () =>
  allGuides
    .filter(visible)
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        Number(b.featured) - Number(a.featured) ||
        compareDe(a.title, b.title),
    );
export const getGuide = (slug: string) => allGuides.find((g) => g.slug === slug && visible(g));

/** Guides that belong to a category, newest first (category pages, profiles). */
export const listGuidesForCategory = (categorySlug: string) =>
  listGuides().filter((g) => g.categories.includes(categorySlug));

/** Other guides for the end of an article: shared categories first, then the newest. */
export function relatedGuides(slug: string, limit = 3) {
  const guide = getGuide(slug);
  const others = listGuides().filter((g) => g.slug !== slug);
  if (!guide) return others.slice(0, limit);
  const shared = (g: (typeof others)[number]) =>
    g.categories.filter((c) => guide.categories.includes(c)).length;
  return [...others].sort((a, b) => shared(b) - shared(a)).slice(0, limit);
}

/** Card props for the programs a guide discusses; unpublished ones are left out. */
export const guideSoftware = (slugs: string[]) =>
  slugs.flatMap((slug) => {
    const software = getSoftware(slug);
    return software ? [summaryOf(software, { from: "ratgeber" })] : [];
  });

export const listDownloads = () => allDownloads.filter(visible);
export const getDownload = (slug: string) => allDownloads.find((d) => d.slug === slug && visible(d));

/* ---------- Market data: official statistics and studies with sources ---------- */

export const listMarket = () => [...allMarkets].sort((a, b) => a.order - b.order);
export const getMarket = (slug: string) => allMarkets.find((m) => m.slug === slug);

/* ---------- Key figures from our profiles ---------- */

export const getPortfolioStats = () => portfolioStats(listSoftware(), (s) => getScore(s.slug) ?? 0);

/** Everything the "In Zahlen" section of a profile shows, computed from our content. */
export function getSoftwareStats(software: SoftwareData) {
  const category = getCategory(software.primaryCategory);
  const peers = listSoftwareByCategory(software.primaryCategory);
  const scored = peers.map((s) => ({ slug: s.slug, score: getScore(s.slug, software.primaryCategory) ?? 0 }));
  return {
    category,
    rank: rankIn(software.slug, scored),
    price: pricePosition(software, peers),
    plans: planLadder(software.pricing.plans),
    team: teamCosts(software.pricing.plans),
    check: checkTally(deutschlandCheckRows(software)),
  };
}

/* ---------- Site stats (computed from content only) ---------- */

export function getStats() {
  const software = listSoftware();
  const dates = [
    ...software.map((s) => s.editorial.updatedAt),
    ...listCategories().map((c) => c.updatedAt),
  ].sort();
  return {
    softwareCount: software.length,
    categoryCount: listCategories().length,
    guideCount: listGuides().length,
    reviewCount: listReviews().length,
    lastUpdated: dates.at(-1) ?? null,
  };
}

/* ---------- Site chrome: navigation, footer and search items ---------- */

export function getSiteChrome() {
  const categories = listCategories();
  const softwareName = new Map(allSoftware.map((s) => [s.slug, s.name]));
  const comparisons = listComparisons()
    .slice(0, 4)
    .map((c) => ({
      label: `${softwareName.get(c.a) ?? c.a} oder ${softwareName.get(c.b) ?? c.b}`,
      href: routes.comparison(c.a, c.b),
    }));
  const download = listDownloads()[0];
  const emptyHubs = new Set([
    ...(listGuides().length === 0 ? [routes.guides()] : []),
    ...(listDownloads().length === 0 ? [routes.downloads()] : []),
  ]);
  return {
    mainNav: MAIN_NAV.filter((item) => !emptyHubs.has(item.href)),
    categorySlugs: categories.map((c) => c.slug),
    categoryCounts: Object.fromEntries(
      categories.map((c) => [c.slug, listSoftwareByCategory(c.slug).length]),
    ),
    popularComparisons: comparisons,
    guideTeaser: download ? { title: download.title, href: routes.download(download.slug) } : undefined,
    latestGuides: listGuides()
      .slice(0, 5)
      .map((g) => ({ label: g.navTitle ?? g.title, href: routes.guide(g.slug) })),
    searchItems: buildSearchIndex(
      {
        software: allSoftware,
        categories: allCategories,
        vendors: allVendors,
        comparisons: allComparisons,
        guides: allGuides,
      },
      { preview: isPreview() },
    ),
  };
}

/* ---------- View models for pages ---------- */

const SERVER_SHORT: Record<string, string> = {
  DE: "Deutschland",
  EU: "EU",
  USA: "USA",
  weltweit: "weltweit",
  unbekannt: "Keine Angabe",
};

/** Card props for one product in the context of a category (weights, awards). */
export function summaryOf(
  software: SoftwareData,
  options: { categorySlug?: string; from: GoSource; position?: number; awards?: Map<string, AwardKind[]> },
): SoftwareSummary {
  const categorySlug = options.categorySlug ?? software.primaryCategory;
  return toSoftwareSummary(software, {
    vendor: getVendor(software.vendor),
    category: getCategory(categorySlug) ?? allCategories.find((c) => c.slug === categorySlug),
    userReviewCount: listUserReviews(software.slug).length,
    award: options.awards?.get(software.slug)?.[0],
    from: options.from,
    position: options.position,
  });
}

/** Ranked category list with awards, as card props (Section 13.2). */
export function rankedSummaries(categorySlug: string, from: GoSource) {
  const awards = getAwards(categorySlug);
  return listSoftwareByCategory(categorySlug).map((s, i) =>
    summaryOf(s, { categorySlug, from, position: i + 1, awards }),
  );
}

/**
 * Products with an active affiliate deal for the labeled partner block on the home page. Sorted by
 * name, never by score or commission, so the block cannot be read as a ranking.
 */
export function partnerOffers(from: GoSource) {
  return listSoftware()
    .filter((s) => s.affiliate?.active)
    .map((s, i) => ({
      summary: summaryOf(s, { from, position: i + 1 }),
      strength: s.editorial.pros[0]!,
      bestFor: s.editorial.bestFor[0]!,
      trialDays: s.pricing.trialDays,
      freePlan: s.pricing.freePlan,
    }));
}

/** Details for RankedListItem (Section 7.2 C). */
export function rankedDetailsOf(software: SoftwareData): RankedDetails {
  const price = entryPrice(software);
  return {
    verdict: software.editorial.verdict,
    idealFor: software.editorial.bestFor.join(", "),
    keyFacts: [
      {
        label: "Preis ab",
        value: price ? `${formatPrice(price.cents)} ${PRICE_UNIT_LABEL[price.unit]}` : "Preis auf Anfrage",
      },
      {
        label: "Testphase",
        value: software.pricing.trialDays ? `${software.pricing.trialDays}\u00a0Tage` : "Keine Angabe",
      },
      { label: "Serverstandort", value: SERVER_SHORT[software.hosting.serverLocation] ?? "Keine Angabe" },
    ],
    pros: software.editorial.pros,
    cons: software.editorial.cons,
    check: deutschlandCheckRows(software),
  };
}

export const serverLabel = (location: string) => SERVER_SHORT[location] ?? "Keine Angabe";
