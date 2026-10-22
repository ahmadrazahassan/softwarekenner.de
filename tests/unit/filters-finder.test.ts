import { describe, expect, it } from "vitest";

import { facetsOf, filterGroupsFor, matchesFilters, toFilters } from "@/lib/content/filters";
import { findMatches, requirementsFor, type FinderProduct } from "@/lib/finder";

import { software } from "./fixtures/content";

const alpha = software("alpha");
const beta = software("beta", {
  madeInGermany: false,
  hosting: { serverLocation: "EU", avv: "ja" },
  platforms: ["web", "ios"],
  companySizes: ["50-249", "250+"],
  integrations: ["DATEV", "Personio"],
  pricing: { ...alpha.pricing, freePlan: true, trialDays: null },
});
const gamma = software("gamma", {
  compliance: { gobd: "ja", xrechnung: "nein", zugferd: "nein", iso27001: "ja", bsiC5: "nein" },
  integrations: ["Personio"],
  pricing: {
    ...alpha.pricing,
    plans: [{ ...alpha.pricing.plans[0]!, priceMonthlyNet: 4900, priceYearlyNetPerMonth: null }],
  },
});
const facets = [alpha, beta, gamma].map((s) => facetsOf(s));
const slugsFor = (selection: Record<string, string[]>, german = false) =>
  facets.filter((f) => matchesFilters(f, toFilters(selection, german))).map((f) => f.slug);

describe("lib/content/filters", () => {
  it("reduces a profile to the facts the filters need", () => {
    expect(facetsOf(beta)).toMatchObject({
      slug: "beta",
      server: "EU",
      entryCents: 790,
      deployment: ["cloud", "mobil"],
      freePlan: true,
      trial: false,
      compliance: ["gobd", "xrechnung", "zugferd"],
    });
  });

  it("treats options within a group as alternatives", () => {
    expect(slugsFor({ groesse: ["1-9", "250+"] })).toEqual(["alpha", "beta", "gamma"]);
    expect(slugsFor({ groesse: ["250+"] })).toEqual(["beta"]);
    // Several price caps mean the highest one.
    expect(slugsFor({ preis: ["10"] })).toEqual(["alpha", "beta"]);
    expect(slugsFor({ preis: ["10", "50"] })).toEqual(["alpha", "beta", "gamma"]);
  });

  it("requires every compliance item and every integration", () => {
    expect(slugsFor({ compliance: ["xrechnung"] })).toEqual(["alpha", "beta"]);
    expect(slugsFor({ compliance: ["gobd", "iso27001"] })).toEqual(["gamma"]);
    expect(slugsFor({ schnittstellen: ["datev", "personio"] })).toEqual(["beta"]);
  });

  it("combines groups, the Germany toggle and ignores unknown values", () => {
    expect(slugsFor({ server: ["DE"], kostenlos: ["ja"] })).toEqual([]);
    expect(slugsFor({}, true)).toEqual(["alpha", "gamma"]);
    expect(slugsFor({ testphase: ["ja"] })).toEqual(["alpha", "gamma"]);
    expect(slugsFor({ compliance: ["erfunden"], preis: ["7"] })).toEqual(["alpha", "beta", "gamma"]);
  });

  it("offers only options at least one product matches", () => {
    const groups = filterGroupsFor(facets);
    const ids = groups.map((g) => g.id);
    expect(ids).toEqual([
      "preis",
      "groesse",
      "bereitstellung",
      "server",
      "compliance",
      "schnittstellen",
      "testphase",
      "kostenlos",
      "wertung",
    ]);
    const options = (id: string) => groups.find((g) => g.id === id)!.options.map((o) => o.value);
    expect(options("groesse")).not.toContain("solo");
    expect(options("bereitstellung")).toEqual(["cloud", "mobil"]);
    expect(options("compliance")).not.toContain("bsiC5");
    // Shared by at least two products, original spelling as label.
    expect(groups.find((g) => g.id === "schnittstellen")!.options).toEqual([
      { value: "datev", label: "DATEV" },
      { value: "personio", label: "Personio" },
    ]);
  });
});

describe("lib/finder", () => {
  const product = (s: typeof alpha): FinderProduct => ({
    slug: s.slug,
    name: s.name,
    logo: null,
    href: `/software/${s.slug}`,
    categories: s.categories,
    scoreByCategory: { buchhaltung: facetsOf(s).score },
    facets: facetsOf(s),
  });
  const products = [alpha, beta, gamma].map(product);

  it("returns at most three matches from the chosen category", () => {
    expect(findMatches(products, { category: "buchhaltung", size: null, requirements: [] })).toHaveLength(3);
    expect(findMatches(products, { category: "crm", size: null, requirements: [] })).toEqual([]);
  });

  it("ranks by size fit and requirements before the editorial score", () => {
    const [first] = findMatches(products, {
      category: "buchhaltung",
      size: "250+",
      requirements: ["kostenlos"],
    });
    expect(first!.product.slug).toBe("beta");
    expect(first!.reason).toBe(
      "Zielgruppe laut Anbieter: ab 250 Mitarbeitende. Erfüllt: Kostenlose Version. Redaktionswertung 4,4 von 5.",
    );
  });

  it("names what a match does not meet", () => {
    const matches = findMatches(products, {
      category: "buchhaltung",
      size: "1-9",
      requirements: ["e-rechnung", "app"],
    });
    const g = matches.find((m) => m.product.slug === "gamma")!;
    expect(g.met).toEqual([]);
    expect(g.reason).toContain("Nicht erfüllt: E-Rechnung (XRechnung) und Mobile App.");
    const b = matches.find((m) => m.product.slug === "beta")!;
    expect(b.reason).toContain("Der Anbieter nennt „1 bis 9 Mitarbeitende“ nicht als Zielgruppe.");
  });

  it("is deterministic: ties go to the score, then the name", () => {
    const twins = [product(software("zeta")), product(software("eta"))];
    const names = findMatches(twins, { category: "buchhaltung", size: null, requirements: [] }).map(
      (m) => m.product.slug,
    );
    expect(names).toEqual(["eta", "zeta"]);
  });

  it("offers only requirements a product of the category meets", () => {
    const ids = requirementsFor(products, "buchhaltung").map((r) => r.id);
    expect(ids).toContain("datev");
    expect(ids).toContain("app");
    expect(requirementsFor(products, "crm")).toEqual([]);
  });
});
