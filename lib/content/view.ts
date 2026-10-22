/**
 * Maps parsed content onto the component props from Phase 1. Pure, unit tested.
 */
import type { CheckRow, SoftwareSummary } from "@/components/software/types";
import { goHref, routes, type GoSource } from "@/lib/routes";
import type { AwardKind } from "@/lib/scoring";

import { entryPrice, scoreOf } from "./query";
import type { CategoryData, SoftwareData, VendorData } from "./schemas";

export function toSoftwareSummary(
  software: SoftwareData,
  context: {
    vendor: Pick<VendorData, "brandName" | "legalName"> | undefined;
    category: Pick<CategoryData, "shortName" | "weights" | "updatedAt"> | undefined;
    userReviewCount: number;
    award?: AwardKind;
    from: GoSource;
    position?: number;
  },
): SoftwareSummary {
  const affiliate = !!software.affiliate?.active;
  return {
    slug: software.slug,
    name: software.name,
    vendorName: context.vendor?.legalName ?? software.vendor,
    categoryLabel: context.category?.shortName ?? software.primaryCategory,
    logo: software.logo,
    brandColor: software.brandColor,
    score: scoreOf(software, context.category?.weights ?? undefined),
    priceFrom: entryPrice(software),
    userReviewCount: context.userReviewCount,
    handsOnTest: software.editorial.handsOnTest,
    madeInGermany: software.madeInGermany,
    award:
      context.award && context.category
        ? { kind: context.award, year: Number(context.category.updatedAt.slice(0, 4)) }
        : undefined,
    href: routes.software(software.slug),
    outboundHref: affiliate ? goHref(software.slug, context.from, context.position) : software.website,
    affiliate,
  };
}

const SERVER_LABEL: Record<SoftwareData["hosting"]["serverLocation"], string> = {
  DE: "Rechenzentren in Deutschland",
  EU: "Rechenzentren in der EU",
  USA: "Rechenzentren in den USA",
  weltweit: "Rechenzentren weltweit",
  unbekannt: "Keine Angabe des Anbieters",
};

/**
 * Deutschland-Check rows (Section 2.5) from structured data. Notes describe the data, they never
 * invent claims; the per row source is the pricing or editorial source chosen by the editor in Phase 5.
 */
export function deutschlandCheckRows(software: SoftwareData): CheckRow[] {
  const loc = software.hosting.serverLocation;
  const serverStatus =
    loc === "DE" ? "ja" : loc === "EU" ? "teilweise" : loc === "unbekannt" ? "unbekannt" : "nein";
  const both = (a: string, b: string) =>
    a === "ja" && b === "ja"
      ? "ja"
      : a === "unbekannt" && b === "unbekannt"
        ? "unbekannt"
        : a === "nein" && b === "nein"
          ? "nein"
          : "teilweise";
  const datev = software.integrations.some((i) => i.toLocaleLowerCase("de").includes("datev"));
  const elster = software.integrations.some((i) => i.toLocaleLowerCase("de").includes("elster"));

  return [
    { label: "Serverstandort", status: serverStatus, note: SERVER_LABEL[loc] },
    { label: "Auftragsverarbeitung (AVV)", status: software.hosting.avv },
    { label: "GoBD", status: software.compliance.gobd },
    {
      label: "E-Rechnung (XRechnung, ZUGFeRD)",
      status: both(software.compliance.xrechnung, software.compliance.zugferd),
    },
    {
      label: "Schnittstellen zu DATEV und ELSTER",
      status: datev && elster ? "ja" : datev || elster ? "teilweise" : "unbekannt",
      note: [datev && "DATEV", elster && "ELSTER"].filter(Boolean).join(", ") || undefined,
    },
    { label: "Support auf Deutsch", status: software.germanSupport ? "ja" : "nein" },
  ];
}
