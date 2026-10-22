/**
 * Pure query helpers over parsed content. No file or collection access here, so everything
 * is unit tested with fixtures; lib/content/index.ts binds them to the collections.
 */
import { compareDe, type PriceUnit } from "../format/index.ts";
import { DEFAULT_WEIGHTS, overallScore, type Weights } from "../scoring/index.ts";

import { facetsOf, matchesFilters, type SoftwareFilters } from "./filters.ts";
import type { CategoryData, PlanData, SoftwareData } from "./schemas.ts";

export type { SoftwareFilters };

type Visible = { status: "entwurf" | "veroeffentlicht" };

/** Published content always; drafts only in preview (CONTENT_PREVIEW=1). */
export const isVisible = (item: Visible, preview: boolean) => preview || item.status === "veroeffentlicht";

export const weightsFor = (category?: Pick<CategoryData, "weights"> | null): Weights =>
  category?.weights ?? DEFAULT_WEIGHTS;

/** Overall editorial score with the category's weights (Section 11.1). */
export const scoreOf = (software: Pick<SoftwareData, "scores">, weights: Weights = DEFAULT_WEIGHTS) =>
  overallScore(software.scores, weights);

const planEntry = (plan: PlanData): number | null => {
  const candidates = [plan.priceYearlyNetPerMonth, plan.priceMonthlyNet].filter(
    (v): v is number => v !== null && v > 0,
  );
  return candidates.length ? Math.min(...candidates) : null;
};

/**
 * Lowest paid net price per month across plans ("ab 9,90 € pro Monat"). Free plans are shown
 * separately as "Kostenlose Version". Null means "Preis auf Anfrage".
 */
export function entryPrice(
  software: Pick<SoftwareData, "pricing">,
): { cents: number; unit: PriceUnit } | null {
  let best: { cents: number; unit: PriceUnit } | null = null;
  for (const plan of software.pricing.plans) {
    if (plan.unit === "einmalig" || plan.unit === "nutzungsbasiert") continue;
    const cents = planEntry(plan);
    if (cents !== null && (best === null || cents < best.cents)) best = { cents, unit: plan.unit };
  }
  return best;
}

/**
 * Filters with the same logic the browser uses (filters.ts), so server and client agree.
 */
export function filterSoftware<T extends SoftwareData>(
  items: T[],
  filters: SoftwareFilters,
  weights?: Weights,
): T[] {
  return items.filter((s) => matchesFilters(facetsOf(s, weights), filters));
}

export type SoftwareSort = "empfohlen" | "wertung" | "preis" | "name";

/**
 * Sort orders from the results header (Section 13.2). Ranking is always the editorial score:
 * "empfohlen" equals "wertung" with name as tie breaker; paid placements never change it (Section 18).
 */
export function sortSoftware<T extends SoftwareData>(items: T[], sort: SoftwareSort, weights?: Weights): T[] {
  const byName = (a: T, b: T) => compareDe(a.name, b.name);
  const byScore = (a: T, b: T) => scoreOf(b, weights) - scoreOf(a, weights) || byName(a, b);
  const copy = [...items];
  switch (sort) {
    case "empfohlen":
    case "wertung":
      return copy.sort(byScore);
    case "preis":
      return copy.sort((a, b) => {
        const pa = entryPrice(a)?.cents ?? Number.POSITIVE_INFINITY;
        const pb = entryPrice(b)?.cents ?? Number.POSITIVE_INFINITY;
        return pa - pb || byScore(a, b);
      });
    case "name":
      return copy.sort(byName);
  }
}

/** Alternatives in editorial order, skipping missing or hidden ones. */
export function alternativesOf<T extends SoftwareData>(
  software: T,
  all: T[],
  visible: (s: T) => boolean,
): T[] {
  const bySlug = new Map(all.map((s) => [s.slug, s]));
  return software.alternatives.map((slug) => bySlug.get(slug)).filter((s): s is T => !!s && visible(s));
}

/** Software of a category, by primary or secondary assignment. */
export const inCategory = <T extends Pick<SoftwareData, "categories">>(items: T[], categorySlug: string) =>
  items.filter((s) => s.categories.includes(categorySlug));
