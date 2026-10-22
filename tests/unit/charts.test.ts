import { describe, expect, it } from "vitest";

import { chartPlan, costRows, median } from "@/lib/charts";
import type { PlanPrice } from "@/lib/pricing";

const flat: PlanPrice = {
  name: "Pauschal",
  priceMonthlyNet: 2900,
  priceYearlyNetPerMonth: null,
  unit: "pro-monat",
  includedUsers: 5,
};
const perUser: PlanPrice = {
  name: "Pro Kopf",
  priceMonthlyNet: 700,
  priceYearlyNetPerMonth: 600,
  unit: "pro-nutzer-monat",
  includedUsers: null,
};

describe("lib/charts", () => {
  it("computes the median in whole cents", () => {
    expect(median([])).toBeNull();
    expect(median([500, 100, 300])).toBe(300);
    expect(median([100, 200, 300, 401])).toBe(250);
    expect(median([100, 201])).toBe(151);
  });

  it("charts monthly cost per user count and breaks where no fixed price exists", () => {
    const rows = costRows(
      [
        { name: "A", plan: flat },
        { name: "B", plan: perUser },
      ],
      "monatlich",
      [1, 5, 6],
    );
    expect(rows).toEqual([
      { users: 1, A: 29, B: 7 },
      { users: 5, A: 29, B: 35 },
      // Above the five users the flat plan includes, the vendor names no price.
      { users: 6, A: null, B: 42 },
    ]);
  });

  it("falls back to the other billing when a plan offers only one", () => {
    const yearlyOnly = { ...perUser, priceMonthlyNet: null };
    expect(costRows([{ name: "C", plan: yearlyOnly }], "monatlich", [2])).toEqual([{ users: 2, C: 12 }]);
  });

  it("picks the recommended or the cheapest paid plan with a fixed price", () => {
    const free = { ...flat, name: "Frei", priceMonthlyNet: 0 };
    const usage = { ...flat, name: "Nutzung", unit: "nutzungsbasiert" as const, priceMonthlyNet: 100 };
    const recommended = { ...flat, name: "Empfohlen", priceMonthlyNet: 4900, recommended: true };
    expect(chartPlan([free, usage, flat, perUser])?.name).toBe("Pro Kopf");
    expect(chartPlan([flat, recommended], true)?.name).toBe("Empfohlen");
    expect(chartPlan([flat, recommended])?.name).toBe("Pauschal");
    expect(chartPlan([free, usage])).toBeNull();
  });
});
