/**
 * Comparison table rows from structured data (Section 7.3). Shared by category pages, the
 * comparison tool and comparison pages.
 */
import type { ComparisonGroup, ComparisonProduct } from "@/components/software/comparison-table";
import { formatNumber } from "@/lib/format";

import { entryPrice, scoreOf } from "./query";
import type { SoftwareData, WeightsData } from "./schemas";

const SERVER: Record<string, string> = {
  DE: "Deutschland",
  EU: "EU",
  USA: "USA",
  weltweit: "weltweit",
  unbekannt: "Keine Angabe",
};
const has = (s: SoftwareData, name: string) =>
  s.integrations.some((i) => i.toLocaleLowerCase("de").includes(name))
    ? ("ja" as const)
    : ("unbekannt" as const);

export function comparisonProducts(items: SoftwareData[], weights?: WeightsData | null): ComparisonProduct[] {
  return items.map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.logo,
    score: scoreOf(s, weights ?? undefined),
  }));
}

export function comparisonGroups(items: SoftwareData[]): ComparisonGroup[] {
  return [
    {
      title: "Preise",
      rows: [
        {
          label: "Einstiegspreis",
          cells: items.map((s) => {
            const p = entryPrice(s);
            return { kind: "price" as const, cents: p?.cents ?? null, unit: p?.unit };
          }),
        },
        {
          label: "Kostenlose Version",
          cells: items.map((s) => ({
            kind: "status" as const,
            status: s.pricing.freePlan ? ("ja" as const) : ("nein" as const),
          })),
        },
        {
          label: "Kostenlose Testphase",
          cells: items.map((s) => ({
            kind: "text" as const,
            text: s.pricing.trialDays ? `${formatNumber(s.pricing.trialDays)} Tage` : "Keine Angabe",
          })),
        },
      ],
    },
    {
      title: "Deutschland-Check",
      rows: [
        {
          label: "Serverstandort",
          cells: items.map((s) => ({
            kind: "text" as const,
            text: SERVER[s.hosting.serverLocation] ?? "Keine Angabe",
          })),
        },
        {
          label: "Auftragsverarbeitung (AVV)",
          cells: items.map((s) => ({ kind: "status" as const, status: s.hosting.avv })),
        },
        { label: "GoBD", cells: items.map((s) => ({ kind: "status" as const, status: s.compliance.gobd })) },
        {
          label: "XRechnung",
          cells: items.map((s) => ({ kind: "status" as const, status: s.compliance.xrechnung })),
        },
        {
          label: "ZUGFeRD",
          cells: items.map((s) => ({ kind: "status" as const, status: s.compliance.zugferd })),
        },
        {
          label: "ISO 27001",
          cells: items.map((s) => ({ kind: "status" as const, status: s.compliance.iso27001 })),
        },
      ],
    },
    {
      title: "Schnittstellen",
      rows: [
        { label: "DATEV", cells: items.map((s) => ({ kind: "status" as const, status: has(s, "datev") })) },
        { label: "ELSTER", cells: items.map((s) => ({ kind: "status" as const, status: has(s, "elster") })) },
      ],
    },
    {
      title: "Support und Nutzung",
      rows: [
        {
          label: "Support auf Deutsch",
          cells: items.map((s) => ({
            kind: "status" as const,
            status: s.germanSupport ? ("ja" as const) : ("nein" as const),
          })),
        },
        {
          label: "Mobile App",
          cells: items.map((s) => ({
            kind: "status" as const,
            status:
              s.platforms.includes("ios") || s.platforms.includes("android")
                ? ("ja" as const)
                : ("unbekannt" as const),
          })),
        },
      ],
    },
  ];
}
