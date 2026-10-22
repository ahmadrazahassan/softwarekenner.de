/**
 * Softwarefinder (docs/BUILD_PROMPT.md Section 7.4): three answers, top three matches from our data,
 * a reason for each. Deterministic, no AI. Pure, so every rule is unit tested.
 */
import { matchesFilters, type Facets, type SoftwareFilters } from "../content/filters.ts";
import { COMPANY_SIZE_LABEL, type CompanySize } from "../format/index.ts";

export type FinderProduct = {
  slug: string;
  name: string;
  logo: string | null;
  href: string;
  categories: string[];
  /** Editorial score with each category's weights. */
  scoreByCategory: Record<string, number>;
  facets: Facets;
};

export type Requirement = { id: string; label: string; filter: SoftwareFilters };

/** Requirements a buyer can pick in step 3. Each maps to facts in our data. */
export const REQUIREMENTS: Requirement[] = [
  { id: "server-de", label: "Server in Deutschland", filter: { serverLocations: ["DE"] } },
  { id: "anbieter-de", label: "Anbieter aus Deutschland", filter: { madeInGermany: true } },
  { id: "datev", label: "DATEV-Schnittstelle", filter: { integrations: ["DATEV"] } },
  { id: "e-rechnung", label: "E-Rechnung (XRechnung)", filter: { compliance: ["xrechnung"] } },
  { id: "gobd", label: "GoBD-konform", filter: { compliance: ["gobd"] } },
  { id: "kostenlos", label: "Kostenlose Version", filter: { freePlan: true } },
  { id: "guenstig", label: "Einstieg bis 15 € im Monat", filter: { maxPriceCents: 1500 } },
  { id: "testphase", label: "Kostenlose Testphase", filter: { trial: true } },
  { id: "app", label: "Mobile App", filter: { deployment: ["mobil"] } },
];

/** Requirements that at least one product of the category meets, so no option is a dead end. */
export const requirementsFor = (products: FinderProduct[], category: string) =>
  REQUIREMENTS.filter((r) =>
    products.some((p) => p.categories.includes(category) && matchesFilters(p.facets, r.filter)),
  );

export type FinderAnswers = { category: string; size: CompanySize | null; requirements: string[] };

export type FinderMatch = {
  product: FinderProduct;
  score: number;
  fitsSize: boolean;
  met: string[];
  missing: string[];
  reason: string;
};

const POINTS_SIZE = 1.5;
const POINTS_REQUIREMENT = 1;

const formatScore = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function joinDe(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} und ${items.at(-1)}`;
}

/**
 * Points: editorial score (0 to 5), plus 1,5 if the company size fits, plus 1 per requirement met.
 * Ties go to the higher editorial score, then the name. Returns at most three matches.
 */
export function findMatches(products: FinderProduct[], answers: FinderAnswers, limit = 3): FinderMatch[] {
  const chosen = REQUIREMENTS.filter((r) => answers.requirements.includes(r.id));
  return products
    .filter((p) => p.categories.includes(answers.category))
    .map((product) => {
      const score = product.scoreByCategory[answers.category] ?? product.facets.score;
      const fitsSize = answers.size === null || product.facets.sizes.includes(answers.size);
      const met = chosen.filter((r) => matchesFilters(product.facets, r.filter)).map((r) => r.label);
      const missing = chosen.filter((r) => !met.includes(r.label)).map((r) => r.label);
      const points = score + (fitsSize && answers.size ? POINTS_SIZE : 0) + met.length * POINTS_REQUIREMENT;
      return { product, score, fitsSize, met, missing, points };
    })
    .sort(
      (a, b) =>
        b.points - a.points || b.score - a.score || a.product.name.localeCompare(b.product.name, "de"),
    )
    .slice(0, limit)
    .map(({ product, score, fitsSize, met, missing }) => {
      const match = { product, score, fitsSize, met, missing };
      return { ...match, reason: reasonOf(match, answers) };
    });
}

function reasonOf(match: Omit<FinderMatch, "reason">, answers: FinderAnswers) {
  const parts: string[] = [];
  const size = answers.size ? COMPANY_SIZE_LABEL[answers.size] : null;
  if (size) {
    parts.push(
      match.fitsSize
        ? `Zielgruppe laut Anbieter: ${size}.`
        : `Der Anbieter nennt „${size}“ nicht als Zielgruppe.`,
    );
  }
  if (match.met.length) parts.push(`Erfüllt: ${joinDe(match.met)}.`);
  if (match.missing.length) parts.push(`Nicht erfüllt: ${joinDe(match.missing)}.`);
  parts.push(`Redaktionswertung ${formatScore(match.score)} von 5.`);
  return parts.join(" ");
}
