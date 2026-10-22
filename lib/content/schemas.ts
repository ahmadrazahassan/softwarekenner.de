/**
 * Content schemas (docs/BUILD_PROMPT.md Section 10). All content is validated at build time and
 * the build fails on any error. Money is integer cents in EUR. Enum values may contain hyphens:
 * they are data, not copy.
 */
import { z } from "zod";

/* ---------- Shared building blocks ---------- */

export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: nur a bis z, 0 bis 9 und Bindestriche, Umlaute transliteriert");
export const IsoDate = z.iso.date();
export const Cents = z.number().int().nonnegative();
export const Status = z.enum(["ja", "teilweise", "nein", "unbekannt"]);
/** One decimal is enforced by the guards (validate-content), the schema checks the range. */
export const Score = z.number().min(0).max(5);
export const PublishStatus = z.enum(["entwurf", "veroeffentlicht"]);
export const Verification = z.enum(["verifiziert", "pruefen"]);

export const Source = z.object({
  label: z.string().min(2),
  url: z.url(),
  accessedAt: IsoDate,
});

/* ---------- Market data (Section 14): official statistics and association studies, sourced ---------- */

export const MarketUnit = z.enum(["prozent", "mrd-eur", "mio"]);
export const MarketChart = z.enum(["umsatz", "kennzahlen", "balken", "saeulen", "ring", "vergleich"]);

export const MarketPoint = z.object({
  label: z.string().min(1),
  value: z.number().nonnegative(),
  unit: MarketUnit,
  /** Change against the previous year in percent ("+9,9 %"). */
  change: z.number().optional(),
  /** Second value of a pair, e.g. "bevorzugt" next to "genutzt". */
  compare: z.number().nonnegative().optional(),
  /** Highlight this point (orange) in bars and columns. */
  highlight: z.boolean().default(false),
});

export const MarketDataset = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  kicker: z.string().min(2),
  title: z.string().min(5).max(90),
  /** One sentence takeaway (Section 14.1). */
  takeaway: z.string().min(20).max(220),
  chart: MarketChart,
  /** Legend for pairs: [value label, compare label]. */
  legend: z.array(z.string()).length(2).optional(),
  basis: z.string().min(5),
  period: z.string().min(4),
  points: z.array(MarketPoint).min(1).max(8),
  source: Source.extend({ publisher: z.string().min(2), publishedAt: IsoDate.optional() }),
});
export type MarketDatasetData = z.infer<typeof MarketDataset>;

export const CompanySize = z.enum(["solo", "1-9", "10-49", "50-249", "250+"]);
export const Platform = z.enum(["web", "windows", "macos", "linux", "ios", "android"]);
export const PriceUnit = z.enum(["pro-monat", "pro-nutzer-monat", "einmalig", "nutzungsbasiert"]);
export const Language = z.enum(["de", "en", "fr", "es", "it", "nl", "pl"]);

/** Category icons from the approved concept map (Section 5.7). Resolved to lucide in lib/content/icons. */
export const CategoryIcon = z.enum([
  "Calculator",
  "ReceiptText",
  "Banknote",
  "Users",
  "Clock",
  "SquareKanban",
  "Handshake",
  "Boxes",
  "ShoppingBag",
  "MessagesSquare",
  "FolderOpen",
  "Mail",
  "CreditCard",
  "Signature",
]);

const criteria = {
  funktionsumfang: Score,
  bedienung: Score,
  preisLeistung: Score,
  datenschutz: Score,
  support: Score,
  integrationen: Score,
};
export const Scores = z.object(criteria);

/** Category weight overrides: all six criteria, summing to 1 (checked by the guards). */
export const Weights = z.object(
  Object.fromEntries(Object.keys(criteria).map((k) => [k, z.number().min(0).max(1)])) as Record<
    keyof typeof criteria,
    z.ZodNumber
  >,
);

/* ---------- Software (Section 10) ---------- */

export const Plan = z.object({
  name: z.string().min(1),
  /** Monthly billing, net per month. */
  priceMonthlyNet: Cents.nullable(),
  /** Annual billing, net per month equivalent. */
  priceYearlyNetPerMonth: Cents.nullable(),
  unit: PriceUnit,
  includedUsers: z.number().int().positive().nullable(),
  highlights: z.array(z.string()).max(6),
  recommended: z.boolean().default(false),
});

export const Software = z.object({
  slug: Slug,
  name: z.string().min(1),
  /** Vendor slug. */
  vendor: Slug,
  categories: z.array(Slug).min(1),
  primaryCategory: Slug,
  tagline: z.string().max(90),
  logo: z
    .string()
    .regex(/^\/logos\/[a-z0-9-]+\.(svg|png|webp)$/)
    .nullable(),
  brandColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  website: z.url(),
  affiliate: z.object({ url: z.url(), network: z.string(), active: z.boolean() }).nullable(),
  pricing: z.object({
    currency: z.literal("EUR"),
    basis: z.literal("netto"),
    freePlan: z.boolean(),
    trialDays: z.number().int().positive().nullable(),
    plans: z.array(Plan),
    /** Laufzeit, Kündigungsfrist. */
    contractNotes: z.string().optional(),
    source: z.url(),
    verifiedAt: IsoDate,
  }),
  hosting: z.object({
    serverLocation: z.enum(["DE", "EU", "USA", "weltweit", "unbekannt"]),
    avv: Status,
  }),
  compliance: z.object({
    gobd: Status,
    xrechnung: Status,
    zugferd: Status,
    iso27001: Status,
    bsiC5: Status,
  }),
  madeInGermany: z.boolean(),
  /** German user interface. Rule 3: German UI or German support is required to be listed. */
  germanInterface: z.boolean(),
  germanSupport: z.boolean(),
  /** "DATEV", "ELSTER", "Shopware" … */
  integrations: z.array(z.string()),
  platforms: z.array(Platform),
  companySizes: z.array(CompanySize),
  scores: Scores,
  editorial: z.object({
    verdict: z.string().max(240),
    bestFor: z.array(z.string()).min(2).max(4),
    notFor: z.array(z.string()).min(1).max(3),
    pros: z.array(z.string()).min(3).max(6),
    cons: z.array(z.string()).min(2).max(5),
    author: Slug,
    /** Fachliche Prüfung. */
    reviewer: Slug,
    publishedAt: IsoDate,
    updatedAt: IsoDate,
    /** True only after a real test account was used (Section 11.4). */
    handsOnTest: z.boolean(),
    sources: z.array(Source).min(2),
    changelog: z.array(z.object({ date: IsoDate, note: z.string() })),
  }),
  alternatives: z.array(Slug).min(3).max(8),
  verification: Verification,
  status: PublishStatus,
});

/* ---------- Category ---------- */

export const Category = z.object({
  slug: Slug,
  /** "Buchhaltungssoftware" */
  name: z.string().min(2),
  /** "Buchhaltung" */
  shortName: z.string().min(2),
  icon: CategoryIcon,
  /** One or two sentences for tiles, menus and meta fallbacks. */
  description: z.string().min(40).max(320),
  /** Launch batch from Section 16.3. */
  batch: z.number().int().min(1).max(4),
  /** Optional overrides of the default weights (Section 11.1), documented on the category page. */
  weights: Weights.nullable(),
  faq: z.array(z.object({ question: z.string().min(5), answer: z.string().min(10) })),
  related: z.array(Slug),
  seo: z.object({
    title: z.string().max(60),
    description: z.string().max(155),
  }),
  status: PublishStatus,
  updatedAt: IsoDate,
});

/* ---------- Vendor ---------- */

export const Vendor = z.object({
  slug: Slug,
  /** Legal entity as stated in the Impressum. */
  legalName: z.string().min(2),
  brandName: z.string().min(1),
  headquarters: z.object({
    city: z.string().min(2),
    /** ISO 3166-1 alpha-2 */
    country: z.string().regex(/^[A-Z]{2}$/),
  }),
  /** Founding year, only when a source states it. */
  founded: z.number().int().min(1800).max(2100).nullable(),
  website: z.url(),
  /** The provider named in the German Impressum is a German legal entity. Null: not clear from the sources. */
  germanEntity: z.boolean().nullable(),
  /** What the sources say beyond the fields, e.g. branch or ownership details. */
  notes: z.string().max(300).nullable(),
  /** Support languages, only when the vendor states them. Null means not verified. */
  supportLanguages: z.array(Language).nullable(),
  sources: z.array(Source).min(1),
  verification: Verification,
  verifiedAt: IsoDate,
});

/* ---------- Author (must be a real person) ---------- */

export const Author = z.object({
  slug: Slug,
  name: z.string().min(3),
  role: z.string().min(2),
  bio: z.string().min(40),
  expertise: z.array(z.string()).min(1),
  /** Path below /public; real photo only, never AI generated (Section 5.9). */
  photo: z
    .string()
    .regex(/^\/authors\/[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/)
    .nullable(),
  linkedin: z.url().nullable(),
  /** Explicit confirmation that this is a real, consenting person (Sections 10 and 19). */
  realPerson: z.literal(true),
});

/* ---------- User review (empty at launch) ---------- */

export const UserReview = z.object({
  id: Slug,
  softwareSlug: Slug,
  author: z.object({
    displayName: z.string().min(2),
    role: z.string().min(2),
    companySize: CompanySize,
    industry: z.string().min(2),
  }),
  verification: z.object({
    method: z.enum(["geschaeftliche-email", "linkedin", "rechnung"]),
    date: IsoDate,
  }),
  ratings: z.object({
    overall: z.number().int().min(1).max(5),
    usability: z.number().int().min(1).max(5),
    support: z.number().int().min(1).max(5),
    value: z.number().int().min(1).max(5),
    features: z.number().int().min(1).max(5),
  }),
  title: z.string().min(5).max(120),
  strengths: z.array(z.string()).max(5),
  weaknesses: z.array(z.string()).max(5),
  body: z.string().min(200),
  usageDuration: z.enum(["unter-6-monate", "6-12-monate", "1-2-jahre", "ueber-2-jahre"]),
  createdAt: IsoDate,
  vendorReply: z.object({ text: z.string().min(10), date: IsoDate }).nullable(),
  helpfulCount: z.number().int().nonnegative(),
  moderation: z.enum(["offen", "freigegeben", "abgelehnt"]),
  /** Written in exchange for an incentive; must be labeled (Section 19). */
  incentivized: z.boolean(),
});

/* ---------- MDX collections (frontmatter plus body) ---------- */

const editorialFrontmatter = {
  title: z.string().min(5).max(110),
  /** Meta description (Section 15.7). */
  description: z.string().min(50).max(155),
  author: Slug,
  reviewer: Slug,
  publishedAt: IsoDate,
  updatedAt: IsoDate,
  sources: z.array(Source).min(2),
  status: PublishStatus,
  content: z.string(),
};

/** Long form review of one product (Testbericht or Bewertung). */
export const Review = z.object({ ...editorialFrontmatter, softwareSlug: Slug });

/** Head to head comparison. Only published with unique editorial content. */
export const Comparison = z.object({
  ...editorialFrontmatter,
  a: Slug,
  b: Slug,
  /** "Das Wichtigste in 30 Sekunden". */
  verdict: z.string().min(40).max(400),
});

/** "Das Wichtigste in Kürze": three to five quotable sentences above the body (Section 20). */
const KeyPoints = z.array(z.string().min(20).max(220)).max(5).default([]);

/** Ratgeber article. */
export const Guide = z.object({
  ...editorialFrontmatter,
  topic: z.string().min(2),
  hero: z
    .object({
      src: z.string().regex(/^\/images\/[a-z0-9/-]+\.(jpg|jpeg|png|webp|avif)$/),
      alt: z.string().min(10),
    })
    .nullable(),
  /** Categories the article belongs to: it is listed on their pages and links back to them. */
  categories: z.array(Slug).default([]),
  /** Programs the article discusses, shown as cards after the body. */
  software: z.array(Slug).max(6).default([]),
  keyPoints: KeyPoints,
  /** Search result title (Section 15.7, max 60 characters); the page keeps the longer `title` as H1. */
  seoTitle: z.string().min(10).max(60).optional(),
  /** Short label for menus and the footer, e.g. "E-Rechnungspflicht". Falls back to the title. */
  navTitle: z.string().min(3).max(24).optional(),
  /** Lead article on /ratgeber and first on the home page. */
  featured: z.boolean().default(false),
});

/** Buyer guide (Kaufberatung) for a category page. */
export const BuyingGuide = z.object({ ...editorialFrontmatter, category: Slug, keyPoints: KeyPoints });

/** Downloadable guide (Leitfaden). */
export const Download = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(50).max(155),
  /** Cover stickers, one or two words, e.g. ["Social", "Intranet"] (Section 5.8). */
  stickers: z.array(z.string().min(2).max(20)).min(1).max(2),
  category: Slug.nullable(),
  pages: z.number().int().positive(),
  /** Path below /public/downloads. */
  file: z.string().regex(/^\/downloads\/[a-z0-9-]+\.pdf$/),
  chapters: z.array(z.string().min(3)).min(1),
  gated: z.boolean(),
  status: PublishStatus,
  updatedAt: IsoDate,
  content: z.string(),
});

export type SoftwareData = z.infer<typeof Software>;
export type PlanData = z.infer<typeof Plan>;
export type CategoryData = z.infer<typeof Category>;
export type VendorData = z.infer<typeof Vendor>;
export type AuthorData = z.infer<typeof Author>;
export type UserReviewData = z.infer<typeof UserReview>;
export type ReviewData = z.infer<typeof Review>;
export type ComparisonData = z.infer<typeof Comparison>;
export type GuideData = z.infer<typeof Guide>;
export type BuyingGuideData = z.infer<typeof BuyingGuide>;
export type DownloadData = z.infer<typeof Download>;
export type WeightsData = z.infer<typeof Weights>;
export type ScoresData = z.infer<typeof Scores>;
