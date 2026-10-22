/**
 * Build guards (docs/BUILD_PROMPT.md Sections 10, 11.4, 15.5 and 3). Pure functions over the
 * parsed collections, so every rule is proven by unit tests. Messages are German for the editors.
 */
import { lintContentValue, lintText, stripMdxForLint } from "./copy-lint.ts";
import type {
  AuthorData,
  BuyingGuideData,
  CategoryData,
  ComparisonData,
  DownloadData,
  GuideData,
  ReviewData,
  SoftwareData,
  UserReviewData,
  VendorData,
} from "./schemas.ts";

export type Meta = { _meta?: { path: string } };

export type ContentSet = {
  software: (SoftwareData & Meta)[];
  categories: (CategoryData & Meta)[];
  vendors: (VendorData & Meta)[];
  authors: (AuthorData & Meta)[];
  userReviews: (UserReviewData & Meta)[];
  reviews: (ReviewData & Meta)[];
  comparisons: (ComparisonData & Meta)[];
  guides: (GuideData & Meta)[];
  buyingGuides: (BuyingGuideData & Meta)[];
  downloads: (DownloadData & Meta)[];
};

export type Issue = { level: "error" | "warning"; where: string; message: string };

export const PRICE_MAX_AGE_DAYS = 180;
export const PRICE_WARN_AGE_DAYS = 90;

/** "Test", "Testbericht", "im Test", "getestet" are only allowed after a hands on test (Section 11.4). */
export const TEST_WORDING = /\b(test|testbericht|getestet|testsieger)\b|\bim test\b/i;

const daysBetween = (fromIso: string, to: Date) =>
  Math.floor((to.getTime() - new Date(`${fromIso}T00:00:00Z`).getTime()) / 86_400_000);

/** True when the number has at most one decimal place (4,6 yes, 4,65 no). */
export const hasOneDecimal = (n: number) => Math.abs(Math.round(n * 10) / 10 - n) < 1e-9;

export function checkContent(data: ContentSet, today: Date = new Date()): Issue[] {
  const issues: Issue[] = [];
  const error = (where: string, message: string) => issues.push({ level: "error", where, message });
  const warn = (where: string, message: string) => issues.push({ level: "warning", where, message });
  const todayIso = today.toISOString().slice(0, 10);

  const softwareBySlug = new Map(data.software.map((s) => [s.slug, s]));
  const categoryBySlug = new Map(data.categories.map((c) => [c.slug, c]));
  const vendorBySlug = new Map(data.vendors.map((v) => [v.slug, v]));
  const authorSlugs = new Set(data.authors.map((a) => a.slug));

  /* ---- Unique slugs and file names ---- */
  const uniqueAndNamed = (name: string, items: ({ slug?: string; id?: string } & Meta)[]) => {
    const seen = new Set<string>();
    for (const item of items) {
      const key = item.slug ?? item.id ?? "";
      if (seen.has(key)) error(`${name}/${key}`, "Slug ist doppelt vergeben.");
      seen.add(key);
      if (item._meta && item.slug && item._meta.path !== item.slug) {
        error(
          `${name}/${item._meta.path}`,
          `Dateiname „${item._meta.path}“ entspricht nicht dem Slug „${item.slug}“.`,
        );
      }
      if (item._meta && item.id && item._meta.path !== item.id) {
        error(
          `${name}/${item._meta.path}`,
          `Dateiname „${item._meta.path}“ entspricht nicht der ID „${item.id}“.`,
        );
      }
    }
  };
  uniqueAndNamed("software", data.software);
  uniqueAndNamed("categories", data.categories);
  uniqueAndNamed("vendors", data.vendors);
  uniqueAndNamed("authors", data.authors);
  uniqueAndNamed("user-reviews", data.userReviews);

  const authorRef = (where: string, slug: string, role: string) => {
    if (!authorSlugs.has(slug)) error(where, `${role} „${slug}“ existiert nicht in content/authors.`);
  };
  const noFutureDate = (where: string, iso: string, label: string) => {
    if (iso > todayIso) error(where, `${label} (${iso}) liegt in der Zukunft.`);
  };

  /* ---- Categories ---- */
  for (const category of data.categories) {
    const where = `categories/${category.slug}`;
    for (const related of category.related) {
      if (!categoryBySlug.has(related)) error(where, `Verwandte Kategorie „${related}“ existiert nicht.`);
      if (related === category.slug) error(where, "Kategorie verweist auf sich selbst.");
    }
    if (category.weights) {
      const sum = Object.values(category.weights).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - 1) > 1e-6) error(where, `Gewichtung ergibt ${Math.round(sum * 100)} % statt 100 %.`);
    }
    noFutureDate(where, category.updatedAt, "updatedAt");
  }

  /* ---- Software ---- */
  for (const s of data.software) {
    const where = `software/${s.slug}`;
    const published = s.status === "veroeffentlicht";
    const vendor = vendorBySlug.get(s.vendor);

    if (!vendor) error(where, `Anbieter „${s.vendor}“ existiert nicht in content/vendors.`);
    for (const c of s.categories)
      if (!categoryBySlug.has(c)) error(where, `Kategorie „${c}“ existiert nicht.`);
    if (!s.categories.includes(s.primaryCategory)) error(where, "primaryCategory fehlt in categories.");

    const seenAlt = new Set<string>();
    for (const alt of s.alternatives) {
      if (alt === s.slug) error(where, "Alternative verweist auf das Produkt selbst.");
      if (seenAlt.has(alt)) error(where, `Alternative „${alt}“ ist doppelt.`);
      seenAlt.add(alt);
      const target = softwareBySlug.get(alt);
      if (!target) error(where, `Alternative „${alt}“ existiert nicht.`);
      else if (published && target.status !== "veroeffentlicht") {
        warn(where, `Alternative „${alt}“ ist nicht veröffentlicht und wird ausgeblendet.`);
      }
    }

    authorRef(where, s.editorial.author, "Autor");
    authorRef(where, s.editorial.reviewer, "Prüfer");
    if (s.editorial.author === s.editorial.reviewer) {
      warn(where, "Autor und fachliche Prüfung sind dieselbe Person.");
    }

    for (const [criterion, value] of Object.entries(s.scores)) {
      if (!hasOneDecimal(value))
        error(where, `Wertung ${criterion} = ${value} hat mehr als eine Nachkommastelle.`);
    }

    if (s.pricing.plans.filter((p) => p.recommended).length > 1) {
      error(where, "Mehr als ein Tarif ist als empfohlen markiert.");
    }
    if (s.editorial.updatedAt < s.editorial.publishedAt) error(where, "updatedAt liegt vor publishedAt.");
    noFutureDate(where, s.editorial.updatedAt, "updatedAt");
    noFutureDate(where, s.pricing.verifiedAt, "pricing.verifiedAt");

    if (!s.editorial.handsOnTest && TEST_WORDING.test(`${s.tagline} ${s.editorial.verdict}`)) {
      error(
        where,
        "Test-Wortlaut ohne Praxistest (handsOnTest: false). „Bewertung“ oder „im Überblick“ verwenden.",
      );
    }

    // Rule 3: German UI or German support (EUR pricing is enforced by the schema).
    if (!s.germanInterface && !s.germanSupport) {
      (published ? error : warn)(
        where,
        "Weder deutsche Oberfläche noch deutscher Support: nicht für Deutschland listbar.",
      );
    }

    if (published) {
      if (s.verification !== "verifiziert") error(where, "Veröffentlicht, aber nicht verifiziert.");
      if (vendor && vendor.verification !== "verifiziert")
        error(where, `Anbieter „${vendor.slug}“ ist nicht verifiziert.`);
      const age = daysBetween(s.pricing.verifiedAt, today);
      if (age > PRICE_MAX_AGE_DAYS)
        error(where, `Preise zuletzt vor ${age} Tagen geprüft (maximal ${PRICE_MAX_AGE_DAYS}).`);
      else if (age > PRICE_WARN_AGE_DAYS)
        warn(where, `Preise zuletzt vor ${age} Tagen geprüft, bald erneut prüfen.`);
      for (const c of s.categories) {
        if (categoryBySlug.get(c)?.status !== "veroeffentlicht") {
          warn(where, `Kategorie „${c}“ ist noch nicht veröffentlicht.`);
        }
      }
    }

    for (const issue of lintContentValue(s))
      error(where, `${issue.message}: „${issue.excerpt}“ (${issue.path})`);
  }

  /* ---- Vendors ---- */
  for (const v of data.vendors) noFutureDate(`vendors/${v.slug}`, v.verifiedAt, "verifiedAt");

  /* ---- User reviews ---- */
  for (const r of data.userReviews) {
    const where = `user-reviews/${r.id}`;
    if (!softwareBySlug.has(r.softwareSlug)) error(where, `Software „${r.softwareSlug}“ existiert nicht.`);
    noFutureDate(where, r.createdAt, "createdAt");
  }

  /* ---- MDX collections ---- */
  type Editorial = {
    title: string;
    description: string;
    author: string;
    reviewer: string;
    publishedAt: string;
    updatedAt: string;
    status: string;
    content: string;
  } & Meta;
  const editorial = (name: string, doc: Editorial) => {
    const where = `${name}/${doc._meta?.path ?? doc.title}`;
    authorRef(where, doc.author, "Autor");
    authorRef(where, doc.reviewer, "Prüfer");
    if (doc.updatedAt < doc.publishedAt) error(where, "updatedAt liegt vor publishedAt.");
    noFutureDate(where, doc.updatedAt, "updatedAt");
    for (const issue of [
      ...lintText(doc.title),
      ...lintText(doc.description),
      ...lintText(stripMdxForLint(doc.content)),
    ]) {
      error(where, `${issue.message}: „${issue.excerpt}“`);
    }
    return where;
  };

  const keyPointsLint = (where: string, points: string[]) => {
    for (const issue of points.flatMap((p) => lintText(p)))
      error(where, `${issue.message}: „${issue.excerpt}“`);
  };

  const buyingGuideCategories = new Set<string>();
  for (const doc of data.buyingGuides) {
    const where = editorial("kaufberatung", doc);
    keyPointsLint(where, doc.keyPoints);
    if (!categoryBySlug.has(doc.category)) error(where, `Kategorie „${doc.category}“ existiert nicht.`);
    if (buyingGuideCategories.has(doc.category))
      error(where, `Für „${doc.category}“ gibt es schon eine Kaufberatung.`);
    buyingGuideCategories.add(doc.category);
  }

  for (const doc of data.reviews) {
    const where = editorial("reviews", doc);
    const target = softwareBySlug.get(doc.softwareSlug);
    if (!target) error(where, `Software „${doc.softwareSlug}“ existiert nicht.`);
    else if (!target.editorial.handsOnTest && TEST_WORDING.test(`${doc.title} ${doc.description}`)) {
      error(where, "Titel oder Beschreibung sprechen von einem Test, aber handsOnTest ist false.");
    }
  }

  for (const doc of data.comparisons) {
    const where = editorial("comparisons", doc);
    const a = softwareBySlug.get(doc.a);
    const b = softwareBySlug.get(doc.b);
    if (!a) error(where, `Software „${doc.a}“ existiert nicht.`);
    if (!b) error(where, `Software „${doc.b}“ existiert nicht.`);
    if (doc.a === doc.b) error(where, "Ein Produkt wird mit sich selbst verglichen.");
    if (doc._meta && doc._meta.path !== `${doc.a}-vs-${doc.b}`) {
      error(where, `Dateiname muss „${doc.a}-vs-${doc.b}“ lauten.`);
    }
    if (
      doc.status === "veroeffentlicht" &&
      (a?.status !== "veroeffentlicht" || b?.status !== "veroeffentlicht")
    ) {
      error(where, "Vergleich ist veröffentlicht, aber nicht beide Produkte sind es.");
    }
  }

  for (const doc of data.guides) {
    const where = editorial("guides", doc);
    keyPointsLint(where, [
      ...doc.keyPoints,
      ...(doc.navTitle ? [doc.navTitle] : []),
      ...(doc.seoTitle ? [doc.seoTitle] : []),
    ]);
    for (const c of doc.categories) {
      if (!categoryBySlug.has(c)) error(where, `Kategorie „${c}“ existiert nicht.`);
    }
    for (const s of doc.software) {
      const target = softwareBySlug.get(s);
      if (!target) error(where, `Software „${s}“ existiert nicht.`);
      else if (doc.status === "veroeffentlicht" && target.status !== "veroeffentlicht") {
        warn(where, `Software „${s}“ ist noch nicht veröffentlicht und wird nicht angezeigt.`);
      }
    }
  }

  for (const doc of data.downloads) {
    const where = `downloads/${doc._meta?.path ?? doc.title}`;
    if (doc.category && !categoryBySlug.has(doc.category))
      error(where, `Kategorie „${doc.category}“ existiert nicht.`);
    for (const issue of [
      ...lintText(doc.title),
      ...lintText(doc.description),
      ...lintText(stripMdxForLint(doc.content)),
    ]) {
      error(where, `${issue.message}: „${issue.excerpt}“`);
    }
  }

  /* ---- Copy lint on structured data ---- */
  for (const c of data.categories) {
    for (const issue of lintContentValue(c))
      error(`categories/${c.slug}`, `${issue.message}: „${issue.excerpt}“ (${issue.path})`);
  }
  for (const v of data.vendors) {
    for (const issue of lintContentValue(v))
      error(`vendors/${v.slug}`, `${issue.message}: „${issue.excerpt}“ (${issue.path})`);
  }

  return issues;
}
