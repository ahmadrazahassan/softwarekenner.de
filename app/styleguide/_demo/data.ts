/**
 * Fictitious demo data for the internal /styleguide only. Every name, score, price and review
 * here is invented to show component states. None of it may appear on a public page.
 */
import type { UserReview } from "@/components/review/review-card";
import type { RankedDetails } from "@/components/software/cards";
import type { ComparisonGroup, ComparisonProduct } from "@/components/software/comparison-table";
import type { CheckRow, Plan, SoftwareSummary } from "@/components/software/types";

export const DEMO_NOTE =
  "Interne Komponentenübersicht. Alle Namen, Wertungen, Preise und Bewertungen auf dieser Seite sind erfundene Beispieldaten zur Darstellung der Zustände.";

const base = { categoryLabel: "Buchhaltung", userReviewCount: 0, logo: null, affiliate: false } as const;

export const DEMO_SOFTWARE: SoftwareSummary[] = [
  {
    ...base,
    slug: "musterbuch",
    name: "Musterbuch",
    vendorName: "Musterfirma GmbH",
    brandColor: "#2f6fde",
    score: 4.6,
    priceFrom: { cents: 990, unit: "pro-monat" },
    handsOnTest: true,
    madeInGermany: true,
    award: { kind: "redaktion", year: 2026 },
    href: "/styleguide#karten",
    outboundHref: "/styleguide#karten",
    affiliate: true,
  },
  {
    ...base,
    slug: "belegwerk-beispiel",
    name: "Belegwerk Beispiel",
    vendorName: "Beispiel Software AG",
    brandColor: "#1d9a6c",
    score: 4.3,
    priceFrom: { cents: 1490, unit: "pro-nutzer-monat" },
    userReviewCount: 87,
    handsOnTest: false,
    madeInGermany: true,
    href: "/styleguide#karten",
    outboundHref: "/styleguide#karten",
  },
  {
    ...base,
    slug: "kontoklar-demo",
    name: "Kontoklar Demo",
    vendorName: "Demo Ltd.",
    brandColor: "#8a3ffc",
    score: 3.8,
    priceFrom: null,
    handsOnTest: false,
    madeInGermany: false,
    award: { kind: "preisLeistung", year: 2026 },
    href: "/styleguide#karten",
    outboundHref: "/styleguide#karten",
  },
  {
    ...base,
    slug: "zahlenwerk-muster",
    name: "Zahlenwerk Muster",
    vendorName: "Muster und Partner GmbH",
    brandColor: "#e0457b",
    score: 4.1,
    priceFrom: { cents: 2900, unit: "pro-monat" },
    handsOnTest: true,
    madeInGermany: true,
    href: "/styleguide#karten",
    outboundHref: "/styleguide#karten",
  },
  {
    ...base,
    slug: "personalakte-probe",
    name: "Personalakte Probe",
    categoryLabel: "HR-Software",
    vendorName: "Probe HR GmbH",
    brandColor: "#f2b705",
    score: 4.4,
    priceFrom: { cents: 450, unit: "pro-nutzer-monat" },
    handsOnTest: false,
    madeInGermany: true,
    href: "/styleguide#karten",
    outboundHref: "/styleguide#karten",
  },
];

export const DEMO_CHECK: CheckRow[] = [
  {
    label: "Serverstandort",
    status: "ja",
    note: "Rechenzentren in Frankfurt am Main",
    source: { label: "Sicherheitsseite", href: "https://example.com" },
  },
  {
    label: "Auftragsverarbeitung (AVV)",
    status: "ja",
    note: "Muster-AVV zum Download",
    source: { label: "Rechtliches", href: "https://example.com" },
  },
  {
    label: "GoBD",
    status: "teilweise",
    note: "Verfahrensdokumentation nur als Vorlage",
    source: { label: "Hilfecenter", href: "https://example.com" },
  },
  { label: "E-Rechnung (XRechnung, ZUGFeRD)", status: "ja", note: "Empfangen und Erstellen" },
  { label: "DATEV-Schnittstelle", status: "nein", note: "Nur CSV-Export" },
  { label: "Support auf Deutsch", status: "unbekannt" },
];

export const DEMO_DETAILS: RankedDetails = {
  verdict: "Solide Buchhaltung für kleine Betriebe mit guter Belegerfassung, aber schwacher Lohnanbindung.",
  idealFor: "Selbstständige und kleine Unternehmen bis 10 Beschäftigte",
  keyFacts: [
    { label: "Preis ab", value: "9,90 € pro Monat" },
    { label: "Testphase", value: "14 Tage" },
    { label: "Serverstandort", value: "Deutschland" },
  ],
  pros: [
    "Belegerfassung per App mit Texterkennung",
    "Umsatzsteuervoranmeldung direkt über ELSTER",
    "Klare Oberfläche",
  ],
  cons: ["Keine eigene Lohnabrechnung", "DATEV nur per CSV-Export"],
  check: DEMO_CHECK,
};

export const DEMO_PLANS: Plan[] = [
  {
    name: "Start",
    priceMonthlyNet: 990,
    priceYearlyNetPerMonth: 790,
    unit: "pro-monat",
    includedUsers: 1,
    highlights: ["1 Nutzer", "Belege und Rechnungen", "E-Rechnung empfangen"],
  },
  {
    name: "Team",
    priceMonthlyNet: 1490,
    priceYearlyNetPerMonth: 1190,
    unit: "pro-nutzer-monat",
    includedUsers: null,
    recommended: true,
    highlights: ["Unbegrenzt Belege", "ELSTER-Übermittlung", "DATEV-Export", "Rollen und Rechte"],
  },
  {
    name: "Unternehmen",
    priceMonthlyNet: null,
    priceYearlyNetPerMonth: null,
    unit: "pro-monat",
    includedUsers: null,
    highlights: ["Mehrere Mandanten", "Eigener Ansprechpartner"],
  },
];

export const DEMO_ALTERNATIVES = [
  {
    name: "Belegwerk Beispiel",
    plans: [
      {
        name: "Standard",
        priceMonthlyNet: 1290,
        priceYearlyNetPerMonth: 1090,
        unit: "pro-nutzer-monat" as const,
        includedUsers: null,
        highlights: [],
      },
    ],
  },
  {
    name: "Zahlenwerk Muster",
    plans: [
      {
        name: "Pauschal",
        priceMonthlyNet: 2900,
        priceYearlyNetPerMonth: 2500,
        unit: "pro-monat" as const,
        includedUsers: 25,
        highlights: [],
      },
    ],
  },
];

export const DEMO_COMPARISON_PRODUCTS: ComparisonProduct[] = DEMO_SOFTWARE.slice(0, 3).map((s) => ({
  slug: s.slug,
  name: s.name,
  logo: s.logo,
  score: s.score,
}));

export const DEMO_COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    title: "Preise",
    rows: [
      {
        label: "Einstiegspreis",
        cells: [
          { kind: "price", cents: 990, unit: "pro-monat" },
          { kind: "price", cents: 1490, unit: "pro-nutzer-monat" },
          { kind: "price", cents: null },
        ],
      },
      {
        label: "Kostenlose Testphase",
        cells: [
          { kind: "text", text: "14 Tage" },
          { kind: "text", text: "14 Tage" },
          { kind: "text", text: "30 Tage" },
        ],
      },
    ],
  },
  {
    title: "Funktionen",
    rows: [
      {
        label: "Belegerfassung per App",
        cells: [
          { kind: "status", status: "ja" },
          { kind: "status", status: "ja" },
          { kind: "status", status: "teilweise", note: "nur Android" },
        ],
      },
      {
        label: "Mahnwesen",
        cells: [
          { kind: "status", status: "ja" },
          { kind: "status", status: "ja" },
          { kind: "status", status: "ja" },
        ],
      },
    ],
  },
  {
    title: "Deutschland-Check",
    rows: [
      {
        label: "Server in Deutschland",
        cells: [
          { kind: "status", status: "ja" },
          { kind: "status", status: "ja" },
          { kind: "status", status: "nein" },
        ],
      },
      {
        label: "DATEV-Schnittstelle",
        cells: [
          { kind: "status", status: "nein" },
          { kind: "status", status: "ja" },
          { kind: "status", status: "unbekannt" },
        ],
      },
    ],
  },
  {
    title: "Support",
    rows: [
      {
        label: "Telefonsupport",
        cells: [
          { kind: "text", text: "Mo bis Fr, 9 bis 17 Uhr" },
          { kind: "text", text: "Mo bis Fr, 8 bis 18 Uhr" },
          { kind: "text", text: "Nur E-Mail" },
        ],
      },
    ],
  },
];

export const DEMO_REVIEW: UserReview = {
  id: "demo-1",
  displayName: "Beispielnutzerin K.",
  role: "Leitung Buchhaltung",
  companySize: "50 bis 249 Mitarbeitende",
  date: "2026-09-28",
  rating: 4,
  verified: true,
  incentivized: false,
  title: "Belegerfassung spart uns jede Woche Zeit",
  body: "Dieser Text ist ein erfundenes Beispiel, um die Darstellung einer längeren Bewertung zu zeigen. Er beschreibt keinen echten Eindruck. Nach dem sechsten Absatzumbruch wird der Text abgeschnitten und lässt sich über „Mehr anzeigen“ vollständig öffnen. Die Karte zeigt außerdem Stärken, Schwächen, die Antwort des Anbieters und die Aktionen Hilfreich, Teilen und Melden. Damit der Umbruch sichtbar wird, folgt noch etwas mehr Beispieltext, der ebenfalls keine echte Erfahrung wiedergibt, sondern nur Platz belegt, bis die Begrenzung auf sechs Zeilen greift und der Rest verborgen bleibt.",
  strengths: ["Belegerfassung", "Bankabgleich"],
  weaknesses: ["Export an die Steuerberatung"],
  helpfulCount: 2,
  vendorReply: {
    vendorName: "Musterfirma GmbH",
    date: "2026-10-02",
    text: "Erfundene Beispielantwort des Anbieters zur Darstellung.",
  },
};

/* ---------- Charts (fictitious) ---------- */

export const DEMO_PRICE_BARS = [
  { label: "Musterbuch", cents: 990, highlight: true },
  { label: "Belegwerk Beispiel", cents: 1490 },
  { label: "Kontor Muster", cents: 2900 },
];

export const DEMO_SCATTER = [
  { name: "Musterbuch", euros: 9.9, score: 4.6 },
  { name: "Belegwerk Beispiel", euros: 14.9, score: 4.3 },
  { name: "Kontor Muster", euros: 29, score: 4.1 },
];

export const DEMO_RADAR = [
  { label: "Funktionsumfang", value: 4.5 },
  { label: "Bedienung", value: 4.4 },
  { label: "Preis-Leistung", value: 4.2 },
  { label: "Datenschutz", value: 4.7 },
  { label: "Support", value: 4.0 },
  { label: "Integrationen", value: 4.3 },
];

export const DEMO_WEIGHTS = [25, 20, 20, 15, 10, 10];

export const DEMO_COST_ROWS = [1, 2, 3, 5, 10, 15, 20, 25].map((users) => ({
  users,
  Musterbuch: 29,
  "Belegwerk Beispiel": 7 * users,
}));

/* ---------- Consent (fictitious services) ---------- */

export const DEMO_CONSENT_SERVICES = [
  {
    id: "videoplattform",
    name: "Beispiel-Video",
    purpose: "Zeigt eingebettete Erklärvideos.",
    provider: "Beispiel Video GmbH",
    location: "EU",
  },
  {
    id: "kartendienst",
    name: "Beispiel-Karten",
    purpose: "Zeigt den Standort auf einer Karte.",
    provider: "Beispiel Karten AG",
    location: "EU",
  },
];
