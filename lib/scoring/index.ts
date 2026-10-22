/**
 * Editorial score helpers (docs/BUILD_PROMPT.md Section 11).
 * Scale 0 to 5, one decimal, displayed with a decimal comma. Never call it "Note".
 */

export const CRITERIA = [
  "funktionsumfang",
  "bedienung",
  "preisLeistung",
  "datenschutz",
  "support",
  "integrationen",
] as const;

export type Criterion = (typeof CRITERIA)[number];
export type Scores = Record<Criterion, number>;
export type Weights = Record<Criterion, number>;

export const CRITERION_LABEL: Record<Criterion, string> = {
  funktionsumfang: "Funktionsumfang",
  bedienung: "Bedienung und Einrichtung",
  preisLeistung: "Preis-Leistung",
  datenschutz: "Datenschutz und Compliance",
  support: "Support und Service",
  integrationen: "Integrationen und Schnittstellen",
};

/** Short labels where space is tight (radar axes). */
export const CRITERION_SHORT_LABEL: Record<Criterion, string> = {
  funktionsumfang: "Funktionen",
  bedienung: "Bedienung",
  preisLeistung: "Preis-Leistung",
  datenschutz: "Datenschutz",
  support: "Support",
  integrationen: "Integrationen",
};

export const DEFAULT_WEIGHTS: Weights = {
  funktionsumfang: 0.25,
  bedienung: 0.2,
  preisLeistung: 0.2,
  datenschutz: 0.15,
  support: 0.1,
  integrationen: 0.1,
};

export function overallScore(scores: Scores, weights: Weights = DEFAULT_WEIGHTS): number {
  const raw = CRITERIA.reduce((sum, key) => sum + scores[key] * weights[key], 0);
  return Math.round(raw * 10) / 10;
}

const LABELS: [min: number, label: string][] = [
  [4.5, "Hervorragend"],
  [4.0, "Sehr gut"],
  [3.5, "Gut"],
  [3.0, "Befriedigend"],
  [2.0, "Ausreichend"],
];

/** Label for a score with one decimal (Section 11.2). */
export function scoreLabel(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return LABELS.find(([min]) => rounded >= min)?.[1] ?? "Mangelhaft";
}

/** Fill ratio for star rendering: 4,6 of 5 is 0.92. */
export const starFill = (score: number, max = 5): number => Math.min(1, Math.max(0, score / max));

/* ---------- Awards (Section 11.3): computed per category, never sold ---------- */

export type AwardKind = "redaktion" | "preisLeistung" | "selbststaendige" | "mittelstand" | "datenschutz";

export type AwardCandidate = {
  slug: string;
  name: string;
  scores: Scores;
  companySizes: readonly string[];
  serverLocation: string;
};

/** Ties: higher overall score wins, then alphabetical (German collation). */
function best<T extends AwardCandidate>(items: T[], key: (item: T) => number, overall: (item: T) => number) {
  return [...items].sort(
    (a, b) => key(b) - key(a) || overall(b) - overall(a) || a.name.localeCompare(b.name, "de"),
  )[0];
}

/**
 * Awards of one category. Returns the winner slug per award (or nothing when no product qualifies).
 * - Empfehlung der Redaktion: highest overall score, minimum 4,3
 * - Preis-Leistungs-Tipp: highest Preis-Leistung among products with overall 4,0 or more
 * - Beste Wahl für Selbstständige: highest overall among products serving solo or 1 to 9
 * - Beste Wahl für den Mittelstand: highest overall among products serving 50 to 249
 * - Datenschutz-Tipp: highest Datenschutz among products hosted in Germany
 */
export function computeAwards<T extends AwardCandidate>(
  items: T[],
  weights: Weights = DEFAULT_WEIGHTS,
): Partial<Record<AwardKind, string>> {
  const overall = (item: T) => overallScore(item.scores, weights);
  const result: Partial<Record<AwardKind, string>> = {};

  const top = best(items, overall, overall);
  if (top && overall(top) >= 4.3) result.redaktion = top.slug;

  const value = best(
    items.filter((i) => overall(i) >= 4.0),
    (i) => i.scores.preisLeistung,
    overall,
  );
  if (value) result.preisLeistung = value.slug;

  const small = best(
    items.filter((i) => i.companySizes.includes("solo") || i.companySizes.includes("1-9")),
    overall,
    overall,
  );
  if (small) result.selbststaendige = small.slug;

  const mid = best(
    items.filter((i) => i.companySizes.includes("50-249")),
    overall,
    overall,
  );
  if (mid) result.mittelstand = mid.slug;

  const privacy = best(
    items.filter((i) => i.serverLocation === "DE"),
    (i) => i.scores.datenschutz,
    overall,
  );
  if (privacy) result.datenschutz = privacy.slug;

  return result;
}
