/**
 * Chart data helpers (docs/BUILD_PROMPT.md Section 14). Pure; charts only show our own data.
 */
import { calculateCost, type Billing, type PlanPrice } from "../pricing/index.ts";

/** Section 14.2. Hex values mirror the brand tokens in styles/globals.css. */
export const CHART_COLORS = {
  single: "#ffa028",
  highlight: "#e06601",
  reference: "#0a0e09",
  series: ["#e06601", "#0a0e09", "#4a4fc4", "#ffa028", "#9aa0c8"],
  onDark: ["#ffa028", "#ffffff", "#b9bccb"],
  track: "#dfe2fb",
} as const;

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : Math.round((sorted[mid - 1]! + sorted[mid]!) / 2);
}

/** User counts on the x axis of the cost chart. */
export const USER_STEPS = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250];

export type CostSeries = { name: string; plan: PlanPrice };
export type CostRow = { users: number } & Record<string, number | null>;

/**
 * Monthly net cost in euros per user count and product. Null where the vendor names no fixed price
 * (usage based, on request, or above the users a flat plan includes): the line breaks instead of
 * guessing.
 */
export function costRows(series: CostSeries[], billing: Billing, steps = USER_STEPS): CostRow[] {
  return steps.map((users) => {
    const row: CostRow = { users };
    for (const s of series) {
      const own = calculateCost({ plan: s.plan, users, billing });
      const result = own.available
        ? own
        : calculateCost({
            plan: s.plan,
            users,
            billing: billing === "monatlich" ? "jaehrlich" : "monatlich",
          });
      row[s.name] = result.available && !result.exceedsIncludedUsers ? result.monthlyNet / 100 : null;
    }
    return row;
  });
}

const isPaid = (p: PlanPrice) => (p.priceMonthlyNet ?? p.priceYearlyNetPerMonth ?? 0) > 0;
const fixedPrice = (p: PlanPrice) => p.unit === "pro-monat" || p.unit === "pro-nutzer-monat";

/**
 * The plan a product is charted with: the recommended paid plan if asked for, else the cheapest
 * paid plan with a fixed price. Null when the vendor publishes none.
 */
export function chartPlan<T extends PlanPrice & { recommended?: boolean }>(
  plans: T[],
  preferRecommended = false,
): T | null {
  const candidates = plans.filter((p) => isPaid(p) && fixedPrice(p));
  if (preferRecommended) {
    const recommended = candidates.find((p) => p.recommended);
    if (recommended) return recommended;
  }
  const entry = (p: PlanPrice) =>
    Math.min(
      ...([p.priceMonthlyNet, p.priceYearlyNetPerMonth].filter((v) => v !== null && v > 0) as number[]),
    );
  return [...candidates].sort((a, b) => entry(a) - entry(b))[0] ?? null;
}
