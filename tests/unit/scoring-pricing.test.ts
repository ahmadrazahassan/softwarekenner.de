import { describe, expect, it } from "vitest";

import { calculateCost, yearlySavingPercent, type PlanPrice } from "@/lib/pricing";
import { DEFAULT_WEIGHTS, overallScore, scoreLabel, starFill } from "@/lib/scoring";

describe("lib/scoring", () => {
  it("has weights that add up to 100 %", () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });

  it("computes the weighted overall score with one decimal", () => {
    expect(
      overallScore({
        funktionsumfang: 4.8,
        bedienung: 4.5,
        preisLeistung: 4.2,
        datenschutz: 4.6,
        support: 4.0,
        integrationen: 4.4,
      }),
    ).toBe(4.5);
  });

  it("maps scores to the labels of Section 11.2", () => {
    expect(scoreLabel(5)).toBe("Hervorragend");
    expect(scoreLabel(4.5)).toBe("Hervorragend");
    expect(scoreLabel(4.4)).toBe("Sehr gut");
    expect(scoreLabel(4.0)).toBe("Sehr gut");
    expect(scoreLabel(3.9)).toBe("Gut");
    expect(scoreLabel(3.4)).toBe("Befriedigend");
    expect(scoreLabel(2.0)).toBe("Ausreichend");
    expect(scoreLabel(1.9)).toBe("Mangelhaft");
  });

  it("clamps the star fill ratio", () => {
    expect(starFill(4.6)).toBeCloseTo(0.92);
    expect(starFill(7)).toBe(1);
    expect(starFill(-1)).toBe(0);
  });
});

const perUser: PlanPrice = {
  name: "Team",
  priceMonthlyNet: 1200,
  priceYearlyNetPerMonth: 1000,
  unit: "pro-nutzer-monat",
  includedUsers: null,
};
const flat: PlanPrice = {
  name: "Basis",
  priceMonthlyNet: 2900,
  priceYearlyNetPerMonth: null,
  unit: "pro-monat",
  includedUsers: 3,
};

describe("lib/pricing", () => {
  it("multiplies per user plans by the number of users", () => {
    const result = calculateCost({ plan: perUser, users: 10, billing: "jaehrlich" });
    expect(result).toMatchObject({
      available: true,
      monthlyNet: 10000,
      monthlyGross: 11900,
      yearlyNet: 120000,
      yearlyGross: 142800,
    });
  });

  it("keeps flat plans flat and flags users above the included seats", () => {
    expect(calculateCost({ plan: flat, users: 2, billing: "monatlich" })).toMatchObject({
      monthlyNet: 2900,
      exceedsIncludedUsers: false,
    });
    expect(calculateCost({ plan: flat, users: 5, billing: "monatlich" }).exceedsIncludedUsers).toBe(true);
  });

  it("reports plans without a price for the chosen billing as unavailable", () => {
    expect(calculateCost({ plan: flat, users: 1, billing: "jaehrlich" }).available).toBe(false);
  });

  it("rejects invalid user counts", () => {
    expect(() => calculateCost({ plan: perUser, users: 0, billing: "monatlich" })).toThrow(RangeError);
  });

  it("computes the yearly saving", () => {
    expect(yearlySavingPercent(perUser)).toBe(17);
    expect(yearlySavingPercent(flat)).toBeNull();
  });
});
