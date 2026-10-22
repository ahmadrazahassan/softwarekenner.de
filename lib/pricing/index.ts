/**
 * Cost calculator (docs/BUILD_PROMPT.md Section 7.3). Pure functions, all money in integer cents.
 */
import { grossFromNet, VAT_RATE, type PriceUnit } from "@/lib/format";

export type Billing = "monatlich" | "jaehrlich";

export interface PlanPrice {
  name: string;
  /** Net price per month with monthly billing, or null if not offered. */
  priceMonthlyNet: number | null;
  /** Net price per month (equivalent) with annual billing, or null if not offered. */
  priceYearlyNetPerMonth: number | null;
  unit: PriceUnit;
  /** Users included in a flat monthly price. Null means unlimited or not applicable. */
  includedUsers: number | null;
}

export interface CostInput {
  plan: PlanPrice;
  users: number;
  billing: Billing;
  vatRate?: number;
}

export interface CostResult {
  /** False when the plan cannot be calculated (no price for this billing, or usage based). */
  available: boolean;
  monthlyNet: number;
  monthlyGross: number;
  yearlyNet: number;
  yearlyGross: number;
  /** Users above `includedUsers` on a flat plan: the calculator shows a note instead of guessing. */
  exceedsIncludedUsers: boolean;
}

const UNAVAILABLE: CostResult = {
  available: false,
  monthlyNet: 0,
  monthlyGross: 0,
  yearlyNet: 0,
  yearlyGross: 0,
  exceedsIncludedUsers: false,
};

export function calculateCost({ plan, users, billing, vatRate = VAT_RATE }: CostInput): CostResult {
  if (!Number.isInteger(users) || users < 1) throw new RangeError("users must be a positive integer");
  const base = billing === "monatlich" ? plan.priceMonthlyNet : plan.priceYearlyNetPerMonth;
  if (base === null || plan.unit === "nutzungsbasiert" || plan.unit === "einmalig") return UNAVAILABLE;

  const monthlyNet = plan.unit === "pro-nutzer-monat" ? base * users : base;
  const exceedsIncludedUsers =
    plan.unit === "pro-monat" && plan.includedUsers !== null && users > plan.includedUsers;

  return {
    available: true,
    monthlyNet,
    monthlyGross: grossFromNet(monthlyNet, vatRate),
    yearlyNet: monthlyNet * 12,
    yearlyGross: grossFromNet(monthlyNet * 12, vatRate),
    exceedsIncludedUsers,
  };
}

/** Saving of annual over monthly billing in percent (rounded), or null if not comparable. */
export function yearlySavingPercent(plan: PlanPrice): number | null {
  const { priceMonthlyNet: monthly, priceYearlyNetPerMonth: yearly } = plan;
  if (monthly === null || yearly === null || monthly === 0 || yearly >= monthly) return null;
  return Math.round(((monthly - yearly) / monthly) * 100);
}
