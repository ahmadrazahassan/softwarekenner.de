import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { lintContentValue, lintText, stripMdxForLint } from "@/lib/content/copy-lint";
import { alternativesOf, entryPrice, filterSoftware, isVisible, sortSoftware } from "@/lib/content/query";
import * as S from "@/lib/content/schemas";
import { deutschlandCheckRows, toSoftwareSummary } from "@/lib/content/view";
import { CATEGORIES } from "@/lib/navigation";
import { goHref, routes, toSlug } from "@/lib/routes";
import { computeAwards } from "@/lib/scoring";
import { buildSearchIndex, createSearcher } from "@/lib/search";

import { category, software, vendor } from "./fixtures/content";

const root = join(import.meta.dirname, "..", "..");
const readDir = (dir: string) =>
  readdirSync(join(root, "content", dir))
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      file: f.replace(/\.json$/, ""),
      data: JSON.parse(readFileSync(join(root, "content", dir, f), "utf8")),
    }));

describe("schemas", () => {
  it("accept the fixture software and reject broken fields", () => {
    const { _meta: _ignored, ...valid } = software("alpha");
    expect(S.Software.safeParse(valid).success).toBe(true);
    expect(S.Software.safeParse({ ...valid, slug: "Alpha Ä" }).success).toBe(false);
    expect(S.Software.safeParse({ ...valid, pricing: { ...valid.pricing, currency: "USD" } }).success).toBe(
      false,
    );
    expect(S.Software.safeParse({ ...valid, brandColor: "blue" }).success).toBe(false);
    expect(S.Software.safeParse({ ...valid, tagline: "x".repeat(91) }).success).toBe(false);
    expect(S.Software.safeParse({ ...valid, alternatives: ["beta"] }).success).toBe(false);
    expect(
      S.Software.safeParse({
        ...valid,
        editorial: { ...valid.editorial, sources: valid.editorial.sources.slice(0, 1) },
      }).success,
    ).toBe(false);
    expect(
      S.Software.safeParse({
        ...valid,
        pricing: { ...valid.pricing, plans: [{ ...valid.pricing.plans[0], priceMonthlyNet: 9.9 }] },
      }).success,
    ).toBe(false);
  });

  it("only allow approved category icons and real authors", () => {
    const { _meta: _c, ...cat } = category("buchhaltung");
    expect(S.Category.safeParse(cat).success).toBe(true);
    expect(S.Category.safeParse({ ...cat, icon: "Sparkles" }).success).toBe(false);
    expect(
      S.Author.safeParse({
        slug: "a-b",
        name: "A B C",
        role: "R",
        bio: "x".repeat(40),
        expertise: ["x"],
        photo: null,
        linkedin: null,
        realPerson: false,
      }).success,
    ).toBe(false);
  });
});

describe("content files", () => {
  const categories = readDir("categories");
  const vendors = readDir("vendors");

  it("all parse, and file names equal slugs", () => {
    for (const { file, data } of categories) {
      expect(S.Category.parse(data).slug, file).toBe(file);
    }
    for (const { file, data } of vendors) {
      expect(S.Vendor.parse(data).slug, file).toBe(file);
    }
  });

  it("cover all 14 launch categories with batch 1 = Buchhaltung, Zeiterfassung, HR-Software", () => {
    expect(categories).toHaveLength(14);
    const batch1 = categories
      .filter((c) => c.data.batch === 1)
      .map((c) => c.file)
      .sort();
    expect(batch1).toEqual(["buchhaltung", "hr-software", "zeiterfassung"]);
  });

  it("match the navigation (slug, name, short name, icon)", () => {
    const fromContent = categories
      .map((c) => ({ slug: c.data.slug, name: c.data.name, shortName: c.data.shortName, icon: c.data.icon }))
      .sort((a, b) => a.slug.localeCompare(b.slug));
    const fromNav = CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      shortName: c.shortName,
      icon: c.icon.displayName,
    })).sort((a, b) => a.slug.localeCompare(b.slug));
    expect(fromNav).toEqual(fromContent);
  });

  it("have every vendor sourced and verified", () => {
    expect(vendors.length).toBeGreaterThanOrEqual(22);
    for (const { file, data } of vendors) {
      expect(data.sources.length, file).toBeGreaterThan(0);
      expect(data.verification, file).toBe("verifiziert");
    }
  });
});

describe("copy lint", () => {
  it("flags every Appendix B rule", () => {
    expect(lintText("A — B").map((i) => i.rule)).toEqual(["em-dash"]);
    expect(lintText("A – B").map((i) => i.rule)).toEqual(["en-dash"]);
    expect(lintText("schnell - einfach").map((i) => i.rule)).toEqual(["spaced-hyphen"]);
    expect(lintText("ab 9 USD").map((i) => i.rule)).toEqual(["currency"]);
    expect(lintText("Lorem ipsum").map((i) => i.rule)).toEqual(["placeholder"]);
    expect(lintText("spielend leicht").map((i) => i.rule)).toEqual(["phrase"]);
    expect(lintText("Read more").map((i) => i.rule)).toEqual(["english-ui"]);
  });

  it("accepts correct German copy", () => {
    expect(lintText("E-Rechnung, 10 bis 49 Mitarbeitende, 29,00 € zzgl. MwSt.")).toEqual([]);
    expect(lintText("- Listenpunkt am Zeilenanfang")).toEqual([]);
  });

  it("skips code, links and data keys", () => {
    expect(stripMdxForLint("Text `a — b` [Link](https://x.de/a-b)")).not.toMatch(/—|https/);
    expect(
      lintContentValue({ slug: "a-b", url: "https://x.de/$", tagline: "Gut – schnell" }).map((i) => i.path),
    ).toEqual(["tagline"]);
  });
});

describe("query helpers", () => {
  const perUser = software("beta", {
    pricing: {
      ...software("beta").pricing,
      plans: [
        {
          name: "Team",
          priceMonthlyNet: 1500,
          priceYearlyNetPerMonth: 1200,
          unit: "pro-nutzer-monat",
          includedUsers: null,
          highlights: [],
          recommended: false,
        },
      ],
    },
  });
  const onRequest = software("gamma", {
    pricing: {
      ...software("gamma").pricing,
      plans: [
        {
          name: "Enterprise",
          priceMonthlyNet: null,
          priceYearlyNetPerMonth: null,
          unit: "pro-monat",
          includedUsers: null,
          highlights: [],
          recommended: false,
        },
      ],
    },
  });

  it("entry price is the lowest paid monthly equivalent, null on request", () => {
    expect(entryPrice(software("alpha"))).toEqual({ cents: 790, unit: "pro-monat" });
    expect(entryPrice(perUser)).toEqual({ cents: 1200, unit: "pro-nutzer-monat" });
    expect(entryPrice(onRequest)).toBeNull();
  });

  it("filters by origin, server, price and compliance", () => {
    const eu = software("delta", { madeInGermany: false, hosting: { serverLocation: "EU", avv: "ja" } });
    const list = [software("alpha"), perUser, onRequest, eu];
    expect(filterSoftware(list, { madeInGermany: true }).map((s) => s.slug)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
    expect(filterSoftware(list, { serverLocations: ["EU"] }).map((s) => s.slug)).toEqual([
      "alpha",
      "beta",
      "gamma",
      "delta",
    ]);
    expect(filterSoftware(list, { serverLocations: ["DE"] }).map((s) => s.slug)).not.toContain("delta");
    expect(filterSoftware(list, { maxPriceCents: 1000 }).map((s) => s.slug)).toEqual(["alpha", "delta"]);
    expect(filterSoftware(list, { integrations: ["datev"] })).toHaveLength(4);
  });

  it("sorts by score, price and German names", () => {
    const low = software("beta", { scores: { ...software("beta").scores, funktionsumfang: 2.0 } });
    const umlaut = software("delta", { name: "Ärztebuch" });
    expect(sortSoftware([low, software("alpha")], "wertung").map((s) => s.slug)).toEqual(["alpha", "beta"]);
    expect(sortSoftware([onRequest, perUser, software("alpha")], "preis").map((s) => s.slug)).toEqual([
      "alpha",
      "beta",
      "gamma",
    ]);
    expect(sortSoftware([software("beta"), umlaut, software("alpha")], "name").map((s) => s.name)).toEqual([
      "Alpha",
      "Ärztebuch",
      "Beta",
    ]);
  });

  it("returns visible alternatives in editorial order", () => {
    const all = [
      software("alpha"),
      software("beta"),
      software("gamma", { status: "entwurf" }),
      software("delta"),
    ];
    expect(alternativesOf(all[0]!, all, (s) => isVisible(s, false)).map((s) => s.slug)).toEqual([
      "beta",
      "delta",
    ]);
    expect(alternativesOf(all[0]!, all, (s) => isVisible(s, true)).map((s) => s.slug)).toEqual([
      "beta",
      "gamma",
      "delta",
    ]);
  });
});

describe("awards (Section 11.3)", () => {
  const scored = (
    slug: string,
    overall: number,
    extra: Partial<Parameters<typeof computeAwards>[0][number]> = {},
  ) => ({
    slug,
    name: slug,
    scores: {
      funktionsumfang: overall,
      bedienung: overall,
      preisLeistung: overall,
      datenschutz: overall,
      support: overall,
      integrationen: overall,
    },
    companySizes: ["10-49"],
    serverLocation: "EU",
    ...extra,
  });

  it("gives the editorial award only from 4,3", () => {
    expect(computeAwards([scored("a", 4.2)]).redaktion).toBeUndefined();
    expect(computeAwards([scored("a", 4.2), scored("b", 4.3)]).redaktion).toBe("b");
  });

  it("picks value, size and privacy winners by their rules", () => {
    const awards = computeAwards([
      scored("a", 4.6),
      scored("b", 4.1, { scores: { ...scored("b", 4.1).scores, preisLeistung: 4.9 } }),
      // c: 3.6 everywhere and 5.0 Preis-Leistung = 3.88 overall, below the 4.0 threshold for the value award.
      scored("c", 3.6, {
        scores: { ...scored("c", 3.6).scores, preisLeistung: 5.0 },
        companySizes: ["solo"],
      }),
      scored("d", 4.0, { companySizes: ["50-249"], serverLocation: "DE" }),
    ]);
    expect(awards).toEqual({
      redaktion: "a",
      preisLeistung: "b",
      selbststaendige: "c",
      mittelstand: "d",
      datenschutz: "d",
    });
  });

  it("breaks ties by overall score, then alphabetically", () => {
    expect(computeAwards([scored("zeta", 4.5), scored("alpha", 4.5)]).redaktion).toBe("alpha");
  });
});

describe("search index", () => {
  const source = {
    software: [software("alpha", { name: "Größenwerk" }), software("beta", { status: "entwurf" })],
    categories: [category("buchhaltung", { name: "Buchhaltungssoftware", shortName: "Buchhaltung" })],
    vendors: [vendor("alpha-vendor", { brandName: "Musterhaus" })],
    comparisons: [],
    guides: [],
  };

  it("contains only published items unless previewing", () => {
    expect(buildSearchIndex(source).map((i) => i.id)).toEqual(["software:alpha", "kategorie:buchhaltung"]);
    expect(buildSearchIndex(source, { preview: true }).map((i) => i.id)).toContain("software:beta");
  });

  it("finds umlaut words with transliteration, vendors and categories", () => {
    const search = createSearcher(buildSearchIndex(source));
    expect(search("groessenwerk").map((i) => i.id)).toEqual(["software:alpha"]);
    expect(search("musterhaus")[0]?.id).toBe("software:alpha");
    expect(search("Buchhaltung").map((i) => i.id)).toContain("kategorie:buchhaltung");
    expect(search("x")).toEqual([]);
  });
});

describe("view mapping and routes", () => {
  it("maps software to card props with honest outbound links", () => {
    const base = {
      vendor: { brandName: "Muster", legalName: "Muster GmbH" },
      category: { shortName: "Buchhaltung", weights: null, updatedAt: "2026-10-01" },
      userReviewCount: 0,
      from: "kategorie" as const,
      position: 2,
    };
    const direct = toSoftwareSummary(software("alpha"), base);
    expect(direct).toMatchObject({
      outboundHref: "https://example.com",
      affiliate: false,
      href: "/software/alpha",
      priceFrom: { cents: 790 },
    });
    const paid = toSoftwareSummary(
      software("alpha", { affiliate: { url: "https://partner.example", network: "x", active: true } }),
      { ...base, award: "redaktion" },
    );
    expect(paid).toMatchObject({
      outboundHref: "/go/alpha?from=kategorie&pos=2",
      affiliate: true,
      award: { kind: "redaktion", year: 2026 },
    });
  });

  it("derives the Deutschland-Check from structured data", () => {
    const rows = deutschlandCheckRows(software("alpha"));
    expect(rows.map((r) => [r.label, r.status])).toEqual([
      ["Serverstandort", "ja"],
      ["Auftragsverarbeitung (AVV)", "ja"],
      ["GoBD", "ja"],
      ["E-Rechnung (XRechnung, ZUGFeRD)", "ja"],
      ["Schnittstellen zu DATEV und ELSTER", "ja"],
      ["Support auf Deutsch", "ja"],
    ]);
  });

  it("builds German URLs", () => {
    expect(routes.comparison("lexware-office", "sevdesk")).toBe("/vergleich/lexware-office-vs-sevdesk");
    expect(goHref("alpha", "profil")).toBe("/go/alpha?from=profil");
    expect(toSlug("Größe & Übersicht")).toBe("groesse-uebersicht");
  });
});
