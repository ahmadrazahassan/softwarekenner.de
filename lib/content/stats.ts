/**
 * Key figures computed from our own profiles (Section 14.1: data only from our content). Pure
 * functions over parsed content, unit tested with fixtures; lib/content/index.ts binds them.
 */
import { median } from "../charts/index.ts";
import { compareDe } from "../format/index.ts";
import { calculateCost } from "../pricing/index.ts";

import { entryPrice } from "./query.ts";
import type { PlanData, SoftwareData } from "./schemas.ts";

type Status = "ja" | "teilweise" | "nein" | "unbekannt";

export type Share = { label: string; count: number; percent: number };

const pct = (count: number, total: number) => (total ? Math.round((count / total) * 1000) / 10 : 0);

/** Counts per label in a fixed order, with percentages of the total. */
export function shares<T extends string>(values: T[], order: { key: T; label: string }[]): Share[] {
  return order.map(({ key, label }) => {
    const count = values.filter((v) => v === key).length;
    return { label, count, percent: pct(count, values.length) };
  });
}

const SERVER_ORDER = [
  { key: "DE", label: "Deutschland" },
  { key: "EU", label: "EU" },
  { key: "USA", label: "USA" },
  { key: "weltweit", label: "weltweit" },
  { key: "unbekannt", label: "keine Angabe" },
] as const;

const STATUS_ORDER = [
  { key: "ja", label: "ja" },
  { key: "teilweise", label: "teilweise" },
  { key: "nein", label: "nein" },
  { key: "unbekannt", label: "keine Angabe" },
] as const;

const hasIntegration = (s: Pick<SoftwareData, "integrations">, name: string) =>
  s.integrations.some((i) => i.toLocaleLowerCase("de").includes(name));

/** Portfolio figures for the home page. */
export function portfolioStats(software: SoftwareData[], scoreOf: (s: SoftwareData) => number) {
  const total = software.length;
  const withTrial = software.filter((s) => (s.pricing.trialDays ?? 0) > 0);
  const priced = software.filter((s) => entryPrice(s) !== null);
  return {
    total,
    vendors: new Set(software.map((s) => s.vendor)).size,
    priced: { count: priced.length, percent: pct(priced.length, total) },
    german: { count: software.filter((s) => s.madeInGermany).length },
    germanPercent: pct(software.filter((s) => s.madeInGermany).length, total),
    server: shares(
      software.map((s) => s.hosting.serverLocation),
      [...SERVER_ORDER],
    ),
    xrechnung: shares(
      software.map((s) => s.compliance.xrechnung as Status),
      [...STATUS_ORDER],
    ),
    datev: { count: software.filter((s) => hasIntegration(s, "datev")).length },
    datevPercent: pct(software.filter((s) => hasIntegration(s, "datev")).length, total),
    trial: {
      count: withTrial.length,
      percent: pct(withTrial.length, total),
      medianDays: median(withTrial.map((s) => s.pricing.trialDays!)),
    },
    freePlan: { count: software.filter((s) => s.pricing.freePlan).length },
    top: [...software]
      .map((s) => ({ slug: s.slug, name: s.name, logo: s.logo, score: scoreOf(s) }))
      .sort((a, b) => b.score - a.score || compareDe(a.name, b.name))
      .slice(0, 5),
  };
}

export type PortfolioStats = ReturnType<typeof portfolioStats>;

const logPosition = (value: number, min: number, max: number) =>
  max === min ? 50 : Math.round((Math.log(value / min) / Math.log(max / min)) * 100);

/** Where the entry price sits between the cheapest and the most expensive peer of the category. */
export function pricePosition(software: SoftwareData, peers: SoftwareData[]) {
  const own = entryPrice(software);
  if (!own) return null;
  // Only peers with the same price basis are comparable (per user vs. flat).
  const comparable = peers
    .map((p) => entryPrice(p))
    .filter((p): p is NonNullable<typeof p> => p !== null && p.unit === own.unit)
    .map((p) => p.cents);
  if (comparable.length < 3) return null;
  const min = Math.min(...comparable);
  const max = Math.max(...comparable);
  const mid = median(comparable)!;
  return {
    cents: own.cents,
    unit: own.unit,
    min,
    max,
    median: mid,
    peers: comparable.length,
    /** 0 at the cheapest, 100 at the most expensive, logarithmic scale. */
    position: logPosition(own.cents, min, max),
    medianPosition: logPosition(mid, min, max),
    /** Negative: cheaper than the median, in percent of the median. */
    deltaPercent: Math.round(((own.cents - mid) / mid) * 100),
  };
}

/** Paid plans with a fixed monthly price, in plan order. */
export function planLadder(plans: PlanData[]) {
  return plans
    .map((p) => ({
      name: p.name,
      cents: [p.priceYearlyNetPerMonth, p.priceMonthlyNet]
        .filter((v): v is number => v !== null && v > 0)
        .reduce<number | null>((a, b) => (a === null ? b : Math.min(a, b)), null),
      unit: p.unit,
      recommended: p.recommended,
    }))
    .filter((p): p is typeof p & { cents: number } => p.cents !== null);
}

/** Monthly cost of the recommended (else cheapest) fixed price plan for typical team sizes. */
export function teamCosts(plans: PlanData[], steps = [1, 5, 10, 25]) {
  const fixed = plans.filter(
    (p) =>
      (p.unit === "pro-nutzer-monat" || p.unit === "pro-monat") &&
      (p.priceMonthlyNet ?? p.priceYearlyNetPerMonth ?? 0) > 0,
  );
  const plan = fixed.find((p) => p.recommended) ?? fixed[0];
  if (!plan) return null;
  const rows = steps.map((users) => {
    for (const billing of ["jaehrlich", "monatlich"] as const) {
      const r = calculateCost({ plan, users, billing });
      if (r.available && !r.exceedsIncludedUsers) return { users, cents: r.monthlyNet };
    }
    return { users, cents: null };
  });
  return rows.filter((r) => r.cents !== null).length >= 2 ? { plan: plan.name, rows } : null;
}

/** Status counts of the Deutschland-Check rows. */
export function checkTally(rows: { status: Status }[]) {
  const count = (s: Status) => rows.filter((r) => r.status === s).length;
  return {
    total: rows.length,
    ja: count("ja"),
    teilweise: count("teilweise"),
    nein: count("nein"),
    unbekannt: count("unbekannt"),
  };
}

/** 1 based rank by score within a list, ties share the better rank. */
export function rankIn(slug: string, scored: { slug: string; score: number }[]) {
  const own = scored.find((s) => s.slug === slug);
  if (!own) return null;
  return { rank: scored.filter((s) => s.score > own.score).length + 1, of: scored.length };
}
