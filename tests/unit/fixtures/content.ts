/**
 * A small, fully valid content set. Each guard test changes exactly one thing and expects
 * exactly the matching error. Names are fictitious.
 */
import type { ContentSet } from "@/lib/content/guards";
import type { AuthorData, CategoryData, SoftwareData, VendorData } from "@/lib/content/schemas";

export const TODAY = new Date("2026-10-19T12:00:00Z");

export const author = (slug: string, name: string): AuthorData & { _meta: { path: string } } => ({
  slug,
  name,
  role: "Redaktion",
  bio: "Schreibt seit vielen Jahren über Unternehmenssoftware für den Mittelstand in Deutschland.",
  expertise: ["Buchhaltung"],
  photo: null,
  linkedin: null,
  realPerson: true,
  _meta: { path: slug },
});

export const category = (
  slug: string,
  overrides: Partial<CategoryData> = {},
): CategoryData & { _meta: { path: string } } => ({
  slug,
  name: `${slug} Kategorie`,
  shortName: slug,
  icon: "Calculator",
  description: "Eine Beispielkategorie mit ausreichend langer Beschreibung für die Validierung.",
  batch: 1,
  weights: null,
  faq: [],
  related: [],
  seo: { title: "Beispiel", description: "Beispielbeschreibung" },
  status: "veroeffentlicht",
  updatedAt: "2026-10-01",
  _meta: { path: slug },
  ...overrides,
});

export const vendor = (
  slug: string,
  overrides: Partial<VendorData> = {},
): VendorData & { _meta: { path: string } } => ({
  slug,
  legalName: `${slug} GmbH`,
  brandName: slug,
  headquarters: { city: "Berlin", country: "DE" },
  founded: null,
  website: "https://example.com",
  germanEntity: true,
  supportLanguages: null,
  notes: null,
  sources: [{ label: "Impressum", url: "https://example.com/impressum", accessedAt: "2026-10-01" }],
  verification: "verifiziert",
  verifiedAt: "2026-10-01",
  _meta: { path: slug },
  ...overrides,
});

export function software(
  slug: string,
  overrides: Partial<SoftwareData> = {},
): SoftwareData & { _meta: { path: string } } {
  const all = ["alpha", "beta", "gamma", "delta"];
  return {
    slug,
    name: slug[0]!.toUpperCase() + slug.slice(1),
    vendor: `${slug}-vendor`,
    categories: ["buchhaltung"],
    primaryCategory: "buchhaltung",
    tagline: "Beispielprogramm für die Buchhaltung",
    logo: null,
    brandColor: "#336699",
    website: "https://example.com",
    affiliate: null,
    pricing: {
      currency: "EUR",
      basis: "netto",
      freePlan: false,
      trialDays: 14,
      plans: [
        {
          name: "Start",
          priceMonthlyNet: 990,
          priceYearlyNetPerMonth: 790,
          unit: "pro-monat",
          includedUsers: 1,
          highlights: ["Belege"],
          recommended: true,
        },
      ],
      source: "https://example.com/preise",
      verifiedAt: "2026-10-01",
    },
    hosting: { serverLocation: "DE", avv: "ja" },
    compliance: { gobd: "ja", xrechnung: "ja", zugferd: "ja", iso27001: "unbekannt", bsiC5: "nein" },
    madeInGermany: true,
    germanInterface: true,
    germanSupport: true,
    integrations: ["DATEV", "ELSTER"],
    platforms: ["web"],
    companySizes: ["1-9", "10-49"],
    scores: {
      funktionsumfang: 4.5,
      bedienung: 4.4,
      preisLeistung: 4.2,
      datenschutz: 4.6,
      support: 4.0,
      integrationen: 4.3,
    },
    editorial: {
      verdict: "Solides Beispielprogramm für kleine Betriebe.",
      bestFor: ["Selbstständige", "Kleine Unternehmen"],
      notFor: ["Konzerne"],
      pros: ["Klare Oberfläche", "Gute Belegerfassung", "ELSTER-Anbindung"],
      cons: ["Keine Lohnabrechnung", "Wenige Berichte"],
      author: "anna-beispiel",
      reviewer: "bernd-beispiel",
      publishedAt: "2026-09-01",
      updatedAt: "2026-10-01",
      handsOnTest: false,
      sources: [
        { label: "Preisseite", url: "https://example.com/preise", accessedAt: "2026-10-01" },
        { label: "Hilfecenter", url: "https://example.com/hilfe", accessedAt: "2026-10-01" },
      ],
      changelog: [],
    },
    alternatives: all.filter((s) => s !== slug),
    verification: "verifiziert",
    status: "veroeffentlicht",
    _meta: { path: slug },
    ...overrides,
  };
}

export function validSet(): ContentSet {
  const slugs = ["alpha", "beta", "gamma", "delta"];
  return {
    software: slugs.map((s) => software(s)),
    categories: [
      category("buchhaltung", { related: ["hr-software"] }),
      category("hr-software", { icon: "Users" }),
    ],
    vendors: slugs.map((s) => vendor(`${s}-vendor`)),
    authors: [author("anna-beispiel", "Anna Beispiel"), author("bernd-beispiel", "Bernd Beispiel")],
    userReviews: [],
    reviews: [],
    comparisons: [],
    guides: [],
    buyingGuides: [],
    downloads: [],
  };
}
