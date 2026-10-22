import { describe, expect, it } from "vitest";

import { checkContent, hasOneDecimal, type ContentSet } from "@/lib/content/guards";

import { TODAY, author, category, software, validSet } from "./fixtures/content";

const errors = (set: ContentSet) => checkContent(set, TODAY).filter((i) => i.level === "error");
const warnings = (set: ContentSet) => checkContent(set, TODAY).filter((i) => i.level === "warning");
const messages = (set: ContentSet) => errors(set).map((i) => `${i.where}: ${i.message}`);

const mdx = (extra: Record<string, unknown>) => ({
  title: "Beispiel im Überblick",
  description:
    "Eine ausreichend lange Beschreibung für die Meta-Angabe dieser Beispielseite im Test der Guards.",
  author: "anna-beispiel",
  reviewer: "bernd-beispiel",
  publishedAt: "2026-09-01",
  updatedAt: "2026-10-01",
  sources: [
    { label: "Quelle eins", url: "https://example.com/1", accessedAt: "2026-10-01" },
    { label: "Quelle zwei", url: "https://example.com/2", accessedAt: "2026-10-01" },
  ],
  status: "entwurf" as const,
  content: "Ein kurzer Beispieltext.",
  ...extra,
});

describe("content guards", () => {
  it("accept a valid content set without errors or warnings", () => {
    expect(checkContent(validSet(), TODAY)).toEqual([]);
  });

  describe("published profiles (Section 10)", () => {
    it("require verification", () => {
      const set = validSet();
      set.software[0] = software("alpha", { verification: "pruefen" });
      expect(messages(set)).toEqual(["software/alpha: Veröffentlicht, aber nicht verifiziert."]);
    });

    it("allow unverified drafts", () => {
      const set = validSet();
      set.software[0] = software("alpha", { verification: "pruefen", status: "entwurf" });
      expect(errors(set)).toEqual([]);
    });

    it("require a verified vendor", () => {
      const set = validSet();
      set.vendors[0] = { ...set.vendors[0]!, verification: "pruefen" };
      expect(messages(set)).toEqual(["software/alpha: Anbieter „alpha-vendor“ ist nicht verifiziert."]);
    });

    it("fail on prices older than 180 days and warn after 90", () => {
      const old = validSet();
      old.software[0] = software("alpha", {
        pricing: { ...software("alpha").pricing, verifiedAt: "2026-04-01" },
      });
      expect(messages(old)[0]).toMatch(/Preise zuletzt vor 201 Tagen geprüft \(maximal 180\)/);

      const aging = validSet();
      aging.software[0] = software("alpha", {
        pricing: { ...software("alpha").pricing, verifiedAt: "2026-07-01" },
      });
      expect(errors(aging)).toEqual([]);
      expect(warnings(aging).map((w) => w.message)).toEqual([
        "Preise zuletzt vor 110 Tagen geprüft, bald erneut prüfen.",
      ]);
    });

    it("require German UI or German support (rule 3)", () => {
      const set = validSet();
      set.software[0] = software("alpha", { germanInterface: false, germanSupport: false });
      expect(messages(set)).toEqual([
        "software/alpha: Weder deutsche Oberfläche noch deutscher Support: nicht für Deutschland listbar.",
      ]);
      set.software[0] = software("alpha", { germanInterface: true, germanSupport: false });
      expect(errors(set)).toEqual([]);
    });
  });

  describe("references resolve", () => {
    it("vendor, categories, alternatives and authors", () => {
      const set = validSet();
      set.software[0] = software("alpha", {
        vendor: "unbekannt",
        categories: ["buchhaltung", "fehlt"],
        alternatives: ["beta", "gamma", "nicht-da"],
        editorial: { ...software("alpha").editorial, author: "niemand" },
      });
      expect(messages(set)).toEqual([
        "software/alpha: Anbieter „unbekannt“ existiert nicht in content/vendors.",
        "software/alpha: Kategorie „fehlt“ existiert nicht.",
        "software/alpha: Alternative „nicht-da“ existiert nicht.",
        "software/alpha: Autor „niemand“ existiert nicht in content/authors.",
      ]);
    });

    it("primary category must be one of the categories", () => {
      const set = validSet();
      set.software[0] = software("alpha", { primaryCategory: "hr-software" });
      expect(messages(set)).toEqual(["software/alpha: primaryCategory fehlt in categories."]);
    });

    it("alternatives may not point to the product itself or repeat", () => {
      const set = validSet();
      set.software[0] = software("alpha", { alternatives: ["alpha", "beta", "beta"] });
      expect(messages(set)).toEqual([
        "software/alpha: Alternative verweist auf das Produkt selbst.",
        "software/alpha: Alternative „beta“ ist doppelt.",
      ]);
    });

    it("related categories resolve", () => {
      const set = validSet();
      set.categories[0] = category("buchhaltung", { related: ["gibt-es-nicht"] });
      expect(messages(set)).toEqual([
        "categories/buchhaltung: Verwandte Kategorie „gibt-es-nicht“ existiert nicht.",
      ]);
    });

    it("user reviews point to existing software", () => {
      const set = validSet();
      set.userReviews.push({
        id: "r1",
        softwareSlug: "fehlt",
        author: { displayName: "K.", role: "Leitung", companySize: "10-49", industry: "Handwerk" },
        verification: { method: "geschaeftliche-email", date: "2026-10-01" },
        ratings: { overall: 4, usability: 4, support: 4, value: 4, features: 4 },
        title: "Beispiel",
        strengths: [],
        weaknesses: [],
        body: "x".repeat(200),
        usageDuration: "1-2-jahre",
        createdAt: "2026-10-01",
        vendorReply: null,
        helpfulCount: 0,
        moderation: "freigegeben",
        incentivized: false,
        _meta: { path: "r1" },
      });
      expect(messages(set)).toEqual(["user-reviews/r1: Software „fehlt“ existiert nicht."]);
    });

    it("warn when author and reviewer are the same person", () => {
      const set = validSet();
      set.software[0] = software("alpha", {
        editorial: { ...software("alpha").editorial, reviewer: "anna-beispiel" },
      });
      expect(warnings(set).map((w) => w.message)).toEqual([
        "Autor und fachliche Prüfung sind dieselbe Person.",
      ]);
    });
  });

  describe("slugs and files", () => {
    it("reject duplicate slugs", () => {
      const set = validSet();
      set.authors.push(author("anna-beispiel", "Anna Zwei"));
      expect(messages(set)).toEqual(["authors/anna-beispiel: Slug ist doppelt vergeben."]);
    });

    it("require the file name to equal the slug", () => {
      const set = validSet();
      set.software[0] = { ...software("alpha"), _meta: { path: "alpha-alt" } };
      expect(messages(set)).toEqual([
        "software/alpha-alt: Dateiname „alpha-alt“ entspricht nicht dem Slug „alpha“.",
      ]);
    });
  });

  describe("scores and weights", () => {
    it("have exactly one decimal", () => {
      expect(hasOneDecimal(4.6)).toBe(true);
      expect(hasOneDecimal(4)).toBe(true);
      expect(hasOneDecimal(4.65)).toBe(false);
      const set = validSet();
      set.software[0] = software("alpha", { scores: { ...software("alpha").scores, support: 4.25 } });
      expect(messages(set)).toEqual([
        "software/alpha: Wertung support = 4.25 hat mehr als eine Nachkommastelle.",
      ]);
    });

    it("category weights add up to 100 %", () => {
      const set = validSet();
      set.categories[0] = category("buchhaltung", {
        weights: {
          funktionsumfang: 0.3,
          bedienung: 0.2,
          preisLeistung: 0.2,
          datenschutz: 0.15,
          support: 0.1,
          integrationen: 0.1,
        },
      });
      expect(messages(set)).toEqual(["categories/buchhaltung: Gewichtung ergibt 105 % statt 100 %."]);
    });

    it("only one recommended plan", () => {
      const set = validSet();
      const base = software("alpha");
      set.software[0] = software("alpha", {
        pricing: {
          ...base.pricing,
          plans: [base.pricing.plans[0]!, { ...base.pricing.plans[0]!, name: "Plus" }],
        },
      });
      expect(messages(set)).toEqual(["software/alpha: Mehr als ein Tarif ist als empfohlen markiert."]);
    });
  });

  describe("honest wording (Section 11.4)", () => {
    it("forbids test wording without a hands on test", () => {
      const set = validSet();
      set.software[0] = software("alpha", {
        editorial: { ...software("alpha").editorial, verdict: "Im Test überzeugte die Belegerfassung." },
      });
      expect(messages(set)[0]).toMatch(/Test-Wortlaut ohne Praxistest/);

      const reviewed = validSet();
      reviewed.reviews.push({
        ...mdx({ title: "Alpha im Test: Preise und Funktionen" }),
        softwareSlug: "alpha",
        _meta: { path: "alpha" },
      });
      expect(messages(reviewed)).toEqual([
        "reviews/alpha: Titel oder Beschreibung sprechen von einem Test, aber handsOnTest ist false.",
      ]);
    });

    it("allows test wording after a hands on test and ignores words like Testphase", () => {
      const set = validSet();
      set.software[0] = software("alpha", {
        tagline: "Kostenlose Testphase von 14 Tagen",
        editorial: {
          ...software("alpha").editorial,
          handsOnTest: true,
          verdict: "Im Test überzeugte die Belegerfassung.",
        },
      });
      expect(errors(set)).toEqual([]);
    });
  });

  describe("copy rules on content (Appendix B)", () => {
    it("rejects dashes, dollar prices and phrases in data and MDX", () => {
      const set = validSet();
      set.software[0] = software("alpha", { tagline: "Buchhaltung – einfach" });
      set.guides.push({
        ...mdx({ content: "Wir arbeiten nahtlos mit allem zusammen." }),
        topic: "E-Rechnung",
        hero: null,
        categories: [],
        software: [],
        keyPoints: [],
        featured: false,
        _meta: { path: "e-rechnung" },
      });
      expect(messages(set)).toEqual([
        "software/alpha: Halbgeviertstrich (en dash) entfernen: „Buchhaltung – einfach“ (tagline)",
        "guides/e-rechnung: Floskel ersetzen (Section 15.3): „Wir arbeiten nahtlos mit allem zusammen.“",
      ]);
    });

    it("ignores code, URLs and data values", () => {
      const set = validSet();
      set.guides.push({
        ...mdx({ content: "Siehe `price: $5` und https://example.com/a-b und\n```\nconst x = a — b;\n```" }),
        topic: "Beispiel",
        hero: null,
        categories: [],
        software: [],
        keyPoints: [],
        featured: false,
        _meta: { path: "beispiel" },
      });
      expect(errors(set)).toEqual([]);
    });
  });

  describe("guides (Ratgeber)", () => {
    const guide = (extra: Record<string, unknown>) => ({
      ...mdx({}),
      topic: "Beispiel",
      hero: null,
      categories: [] as string[],
      software: [] as string[],
      keyPoints: [] as string[],
      featured: false,
      _meta: { path: "beispiel" },
      ...extra,
    });

    it("resolve categories and programs", () => {
      const set = validSet();
      set.guides.push(guide({ categories: ["buchhaltung", "gibt-es-nicht"], software: ["alpha", "fehlt"] }));
      expect(messages(set)).toEqual([
        "guides/beispiel: Kategorie „gibt-es-nicht“ existiert nicht.",
        "guides/beispiel: Software „fehlt“ existiert nicht.",
      ]);
    });

    it("warn when a published guide lists an unpublished program", () => {
      const set = validSet();
      set.software[1] = software("beta", { status: "entwurf" });
      set.guides.push(guide({ status: "veroeffentlicht", software: ["beta"] }));
      expect(errors(set)).toEqual([]);
      expect(warnings(set).map((w) => w.message)).toContain(
        "Software „beta“ ist noch nicht veröffentlicht und wird nicht angezeigt.",
      );
    });

    it("apply the copy rules to key points", () => {
      const set = validSet();
      set.guides.push(guide({ keyPoints: ["Die Einrichtung gelingt im Handumdrehen und ohne Aufwand."] }));
      expect(messages(set)).toEqual([
        "guides/beispiel: Floskel ersetzen (Section 15.3): „Die Einrichtung gelingt im Handumdrehen und ohne Aufwand.“",
      ]);
    });
  });

  describe("comparisons and buying guides", () => {
    it("check file name, both products and publishing state", () => {
      const set = validSet();
      set.software[1] = software("beta", { status: "entwurf" });
      set.comparisons.push({
        ...mdx({ status: "veroeffentlicht" }),
        a: "alpha",
        b: "beta",
        verdict: "Alpha passt besser zu kleinen Betrieben, Beta zu wachsenden Teams mit mehreren Standorten.",
        _meta: { path: "beta-vs-alpha" },
      });
      expect(messages(set)).toEqual([
        "comparisons/beta-vs-alpha: Dateiname muss „alpha-vs-beta“ lauten.",
        "comparisons/beta-vs-alpha: Vergleich ist veröffentlicht, aber nicht beide Produkte sind es.",
      ]);
    });

    it("allow one buying guide per category", () => {
      const set = validSet();
      set.buyingGuides.push({
        ...mdx({}),
        category: "buchhaltung",
        keyPoints: [],
        _meta: { path: "buchhaltung" },
      });
      set.buyingGuides.push({
        ...mdx({}),
        category: "buchhaltung",
        keyPoints: [],
        _meta: { path: "buchhaltung-2" },
      });
      expect(messages(set)).toEqual([
        "kaufberatung/buchhaltung-2: Für „buchhaltung“ gibt es schon eine Kaufberatung.",
      ]);
    });
  });

  it("rejects dates in the future", () => {
    const set = validSet();
    set.software[0] = software("alpha", {
      editorial: { ...software("alpha").editorial, updatedAt: "2026-12-01" },
    });
    expect(messages(set)).toEqual(["software/alpha: updatedAt (2026-12-01) liegt in der Zukunft."]);
  });
});
