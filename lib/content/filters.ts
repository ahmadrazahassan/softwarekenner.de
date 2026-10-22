/**
 * Category filters (docs/BUILD_PROMPT.md Section 7.4). Pure and client safe: the server turns each
 * profile into small facets, the browser filters those. `filterSoftware` in query.ts uses the same
 * `matchesFilters`, so server and client can never disagree.
 */
import { COMPANY_SIZE_LABEL, type CompanySize } from "../format/index.ts";
import type { Weights } from "../scoring/index.ts";

import { entryPrice, scoreOf } from "./query.ts";
import type { SoftwareData } from "./schemas.ts";

export const COMPLIANCE_KEYS = ["gobd", "xrechnung", "zugferd", "iso27001", "bsiC5"] as const;
export type ComplianceKey = (typeof COMPLIANCE_KEYS)[number];
export const DEPLOYMENTS = ["cloud", "desktop", "mobil"] as const;
export type Deployment = (typeof DEPLOYMENTS)[number];

export type SoftwareFilters = {
  /** "Nur Anbieter aus Deutschland" */
  madeInGermany?: boolean;
  serverLocations?: ("DE" | "EU")[];
  /** Entry price per month net, inclusive. Products on request are excluded. */
  maxPriceCents?: number;
  companySizes?: string[];
  deployment?: Deployment[];
  freePlan?: boolean;
  trial?: boolean;
  /** Every listed integration must exist (lowercase names). */
  integrations?: string[];
  /** Every listed requirement must be "ja". */
  compliance?: ComplianceKey[];
  minScore?: number;
};

/** What the filters need from a profile. Small enough to send to the browser. */
export type Facets = {
  slug: string;
  madeInGermany: boolean;
  server: SoftwareData["hosting"]["serverLocation"];
  entryCents: number | null;
  sizes: string[];
  deployment: Deployment[];
  freePlan: boolean;
  trial: boolean;
  integrations: string[];
  compliance: ComplianceKey[];
  score: number;
};

export function facetsOf(software: SoftwareData, weights?: Weights): Facets {
  const p = new Set(software.platforms);
  const deployment: Deployment[] = [];
  if (p.has("web")) deployment.push("cloud");
  if (p.has("windows") || p.has("macos") || p.has("linux")) deployment.push("desktop");
  if (p.has("ios") || p.has("android")) deployment.push("mobil");
  return {
    slug: software.slug,
    madeInGermany: software.madeInGermany,
    server: software.hosting.serverLocation,
    entryCents: entryPrice(software)?.cents ?? null,
    sizes: [...software.companySizes],
    deployment,
    freePlan: software.pricing.freePlan,
    trial: software.pricing.trialDays !== null,
    integrations: [...software.integrations],
    compliance: COMPLIANCE_KEYS.filter((k) => software.compliance[k] === "ja"),
    score: scoreOf(software, weights),
  };
}

const lower = (s: string) => s.toLocaleLowerCase("de");

export function matchesFilters(f: Facets, filters: SoftwareFilters): boolean {
  if (filters.madeInGermany && !f.madeInGermany) return false;
  // EU includes Germany: a DE hosted product also satisfies "EU".
  if (
    filters.serverLocations?.length &&
    !filters.serverLocations.some((loc) =>
      loc === "DE" ? f.server === "DE" : ["DE", "EU"].includes(f.server),
    )
  ) {
    return false;
  }
  if (
    filters.maxPriceCents !== undefined &&
    (f.entryCents === null || f.entryCents > filters.maxPriceCents)
  ) {
    return false;
  }
  if (filters.companySizes?.length && !filters.companySizes.some((s) => f.sizes.includes(s))) return false;
  if (filters.deployment?.length && !filters.deployment.some((d) => f.deployment.includes(d))) return false;
  if (filters.freePlan && !f.freePlan) return false;
  if (filters.trial && !f.trial) return false;
  if (filters.integrations?.length) {
    const have = new Set(f.integrations.map(lower));
    if (filters.integrations.some((i) => !have.has(lower(i)))) return false;
  }
  if (filters.compliance?.some((c) => !f.compliance.includes(c))) return false;
  if (filters.minScore !== undefined && f.score < filters.minScore) return false;
  return true;
}

/* ---------- UI state (URL) to filters ---------- */

/** Filter bar state: group id to selected option values. Keys double as URL parameters. */
export type FilterSelection = Record<string, string[]>;

export const FILTER_KEYS = [
  "preis",
  "groesse",
  "bereitstellung",
  "server",
  "compliance",
  "schnittstellen",
  "testphase",
  "kostenlos",
  "wertung",
] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

const PRICE_OPTIONS = ["10", "25", "50", "100"];
const SCORE_OPTIONS = ["4.0", "4.5"];
const COMPLIANCE_LABEL: Record<ComplianceKey, string> = {
  gobd: "GoBD",
  xrechnung: "XRechnung",
  zugferd: "ZUGFeRD",
  iso27001: "ISO 27001",
  bsiC5: "BSI C5",
};
const DEPLOYMENT_LABEL: Record<Deployment, string> = {
  cloud: "Im Browser (Cloud)",
  desktop: "Desktop-Programm",
  mobil: "Mobile App",
};

const pick = <T extends string>(values: string[] | undefined, allowed: readonly T[]) =>
  (values ?? []).filter((v): v is T => (allowed as readonly string[]).includes(v));

/**
 * Within a group the options are alternatives (OR): several price caps mean the highest one,
 * several minimum scores the lowest one. Compliance and integrations are requirements (AND).
 */
export function toFilters(selection: FilterSelection, onlyGerman = false): SoftwareFilters {
  const prices = pick(selection.preis, PRICE_OPTIONS).map(Number);
  const scores = pick(selection.wertung, SCORE_OPTIONS).map(Number);
  const filters: SoftwareFilters = {
    madeInGermany: onlyGerman || undefined,
    maxPriceCents: prices.length ? Math.max(...prices) * 100 : undefined,
    companySizes: pick(selection.groesse, Object.keys(COMPANY_SIZE_LABEL)),
    deployment: pick(selection.bereitstellung, DEPLOYMENTS),
    serverLocations: pick(selection.server, ["DE", "EU"] as const),
    compliance: pick(selection.compliance, COMPLIANCE_KEYS),
    integrations: selection.schnittstellen ?? [],
    trial: selection.testphase?.includes("ja") || undefined,
    freePlan: selection.kostenlos?.includes("ja") || undefined,
    minScore: scores.length ? Math.min(...scores) : undefined,
  };
  return filters;
}

export type FilterOption = { value: string; label: string };
export type FilterGroupDef = { id: FilterKey; label: string; options: FilterOption[] };

const formatEuro = (n: number) => `bis ${n} €`;
const formatScore = (s: string) => `ab ${s.replace(".", ",")}`;

/**
 * The groups from Section 7.4 that our data supports, in the order of the spec. An option appears
 * only if at least one product matches it on its own, so no choice leads to an empty list.
 */
export function filterGroupsFor(facets: Facets[]): FilterGroupDef[] {
  const integrationCounts = new Map<string, { label: string; count: number }>();
  for (const f of facets) {
    for (const name of new Set(f.integrations)) {
      const entry = integrationCounts.get(lower(name)) ?? { label: name, count: 0 };
      integrationCounts.set(lower(name), { ...entry, count: entry.count + 1 });
    }
  }
  const raw: FilterGroupDef[] = [
    {
      id: "preis",
      label: "Preis",
      options: PRICE_OPTIONS.map((v) => ({ value: v, label: formatEuro(Number(v)) })),
    },
    {
      id: "groesse",
      label: "Unternehmensgröße",
      options: (Object.keys(COMPANY_SIZE_LABEL) as CompanySize[]).map((v) => ({
        value: v,
        label: COMPANY_SIZE_LABEL[v],
      })),
    },
    {
      id: "bereitstellung",
      label: "Bereitstellung",
      options: DEPLOYMENTS.map((v) => ({ value: v, label: DEPLOYMENT_LABEL[v] })),
    },
    {
      id: "server",
      label: "Serverstandort",
      options: [
        { value: "DE", label: "Deutschland" },
        { value: "EU", label: "EU (inklusive Deutschland)" },
      ],
    },
    {
      id: "compliance",
      label: "Compliance",
      options: COMPLIANCE_KEYS.map((v) => ({ value: v, label: COMPLIANCE_LABEL[v] })),
    },
    {
      id: "schnittstellen",
      label: "Schnittstellen",
      // Integrations at least two products share, most common first.
      options: [...integrationCounts.entries()]
        .filter(([, e]) => e.count >= 2)
        .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0], "de"))
        .slice(0, 8)
        .map(([value, e]) => ({ value, label: e.label })),
    },
    { id: "testphase", label: "Testphase", options: [{ value: "ja", label: "Kostenlose Testphase" }] },
    { id: "kostenlos", label: "Kostenlose Version", options: [{ value: "ja", label: "Kostenlose Version" }] },
    {
      id: "wertung",
      label: "Mindestwertung",
      options: SCORE_OPTIONS.map((v) => ({ value: v, label: formatScore(v) })),
    },
  ];
  return raw
    .map((group) => ({
      ...group,
      options: group.options.filter((o) =>
        facets.some((f) => matchesFilters(f, toFilters({ [group.id]: [o.value] }))),
      ),
    }))
    .filter((group) => group.options.length > 0);
}
