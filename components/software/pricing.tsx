"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { Field } from "@/components/ui/field";
import { Select, Slider } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatDate, formatNumber, formatPrice, grossFromNet, PRICE_UNIT_LABEL } from "@/lib/format";
import { calculateCost, yearlySavingPercent, type Billing } from "@/lib/pricing";
import { cn } from "@/lib/utils/cn";

import type { Plan } from "./types";

type Basis = "netto" | "brutto";

const BILLING_OPTIONS: { value: Billing; label: string }[] = [
  { value: "monatlich", label: "Monatlich" },
  { value: "jaehrlich", label: "Jährlich" },
];
const BASIS_OPTIONS: { value: Basis; label: string }[] = [
  { value: "netto", label: "Netto" },
  { value: "brutto", label: "Brutto" },
];

const vatNote = (basis: Basis) => (basis === "netto" ? "zzgl. MwSt." : "inkl. 19 % MwSt.");

/* ---------- PricingTable (Section 7.3) ---------- */

export function PricingTable({
  plans,
  verifiedAt,
  sourceLabel = "Website des Anbieters",
  className,
}: {
  plans: Plan[];
  /** ISO date of the last price check ("Stand"). */
  verifiedAt: string;
  sourceLabel?: string;
  className?: string;
}) {
  const hasYearly = plans.some((p) => p.priceYearlyNetPerMonth !== null);
  const [billing, setBilling] = useState<Billing>(hasYearly ? "jaehrlich" : "monatlich");
  const [basis, setBasis] = useState<Basis>("netto");

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-center gap-3">
        {hasYearly && (
          <SegmentedControl
            label="Abrechnung"
            options={BILLING_OPTIONS}
            value={billing}
            onValueChange={setBilling}
          />
        )}
        <SegmentedControl
          label="Preisangabe"
          options={BASIS_OPTIONS}
          value={basis}
          onValueChange={setBasis}
        />
      </div>

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {plans.map((plan) => {
          const net =
            billing === "jaehrlich"
              ? (plan.priceYearlyNetPerMonth ?? plan.priceMonthlyNet)
              : plan.priceMonthlyNet;
          const fallbackToMonthly = billing === "jaehrlich" && plan.priceYearlyNetPerMonth === null;
          const shown = net === null ? null : basis === "netto" ? net : grossFromNet(net);
          const saving = yearlySavingPercent(plan);
          return (
            <li
              key={plan.name}
              className={cn(
                "relative flex flex-col gap-5 rounded-lg border bg-white p-6",
                plan.recommended ? "border-2 border-brand-500 shadow-md" : "border-line shadow-sm",
              )}
            >
              {plan.recommended && (
                <p className="absolute -top-3 left-6 rounded-xs bg-brand-500 px-2 py-1 type-micro text-ink">
                  Empfohlen
                </p>
              )}
              <h3 className="type-h4 text-ink">{plan.name}</h3>
              <div>
                {shown === null ? (
                  <p className="type-h3 text-ink">Preis auf Anfrage</p>
                ) : (
                  <>
                    <p className="flex items-baseline gap-2">
                      <span className="font-display text-[2.5rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
                        {formatPrice(shown, { compact: true })}
                      </span>
                    </p>
                    <p className="mt-2 type-small text-text-muted">
                      {PRICE_UNIT_LABEL[plan.unit]}, {vatNote(basis)}
                      {billing === "jaehrlich" && !fallbackToMonthly && ", bei jährlicher Zahlung"}
                      {fallbackToMonthly && ", nur monatliche Zahlung"}
                    </p>
                    {billing === "jaehrlich" && saving !== null && (
                      <p className="mt-1 type-small font-semibold text-positive">
                        {formatNumber(saving)}&nbsp;% günstiger als monatlich
                      </p>
                    )}
                  </>
                )}
              </div>
              {plan.includedUsers !== null && (
                <p className="type-small text-text-muted">
                  {plan.includedUsers === 1
                    ? "1 Nutzer inklusive"
                    : `${formatNumber(plan.includedUsers)} Nutzer inklusive`}
                </p>
              )}
              <ul className="flex flex-col gap-2.5 border-t border-line pt-5">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5 type-small text-ink">
                    <Icon icon={Check} size={16} className="mt-0.5 flex-none text-positive" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="type-small text-text-muted">
        Stand: {formatDate(verifiedAt)} · Quelle: {sourceLabel}
      </p>
    </div>
  );
}

/* ---------- CostCalculator (Section 7.3) ---------- */

export type CalculatorProduct = { name: string; plans: Plan[] };

export function CostCalculator({
  product,
  alternatives,
  verifiedAt,
  className,
}: {
  product: CalculatorProduct;
  /** Up to two alternatives, compared with their first calculable plan. */
  alternatives: CalculatorProduct[];
  verifiedAt: string;
  className?: string;
}) {
  const isPaid = (p: Plan) => (p.priceMonthlyNet ?? p.priceYearlyNetPerMonth ?? 0) > 0;
  const initialPlan =
    product.plans.find((p) => p.recommended && isPaid(p)) ?? product.plans.find(isPaid) ?? product.plans[0]!;
  const [users, setUsers] = useState(10);
  const [planName, setPlanName] = useState(initialPlan.name);
  const [billing, setBilling] = useState<Billing>(
    initialPlan.priceYearlyNetPerMonth !== null ? "jaehrlich" : "monatlich",
  );
  const plan = product.plans.find((p) => p.name === planName) ?? product.plans[0]!;
  const other: Billing = billing === "jaehrlich" ? "monatlich" : "jaehrlich";

  /** Cost with the chosen billing, falling back to the other billing when a plan only offers one. */
  const costOf = (p: Plan) => {
    const chosen = calculateCost({ plan: p, users, billing });
    if (chosen.available) return { result: chosen, billing };
    return { result: calculateCost({ plan: p, users, billing: other }), billing: other };
  };
  const own = costOf(plan);
  const result = own.result;

  const comparison = [
    { name: product.name, planName: plan.name, result, own: true },
    ...alternatives.slice(0, 2).map((alt) => {
      // Compare against paid plans only: a free plan is a different offer, not a cheaper price.
      const candidates = alt.plans
        .filter(isPaid)
        .map((p) => ({ p, r: costOf(p).result }))
        .filter((c) => c.r.available)
        .sort((a, b) => a.r.monthlyNet - b.r.monthlyNet);
      const pick = candidates.find((c) => !c.r.exceedsIncludedUsers) ?? candidates[0];
      return { name: alt.name, planName: pick?.p.name ?? "", result: pick?.r ?? null, own: false };
    }),
  ];
  const max = Math.max(1, ...comparison.map((c) => (c.result?.available ? c.result.monthlyNet : 0)));
  const userLabel = users === 1 ? "1 Nutzer" : `${formatNumber(users)} Nutzer`;

  return (
    <div
      className={cn(
        "grid gap-8 rounded-xl border border-line bg-white p-6 shadow-sm lg:grid-cols-[1fr_1.1fr] lg:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="type-label text-ink">Nutzerzahl</span>
            <span className="font-display text-h3 font-semibold text-ink tabular-nums">
              {formatNumber(users)}
            </span>
          </div>
          <Slider
            label="Nutzerzahl"
            valueText={userLabel}
            min={1}
            max={250}
            step={1}
            value={[users]}
            onValueChange={([v]) => setUsers(v ?? 1)}
          />
          <div className="flex justify-between type-small text-text-subtle" aria-hidden="true">
            <span>1</span>
            <span>250</span>
          </div>
        </div>
        <Field label="Tarif">
          {(a11y) => (
            <Select
              options={product.plans.map((p) => ({ value: p.name, label: p.name }))}
              value={planName}
              onValueChange={setPlanName}
              triggerProps={a11y}
            />
          )}
        </Field>
        <div className="flex flex-col gap-2">
          <span className="type-label text-ink">Abrechnung</span>
          <SegmentedControl
            label="Abrechnung"
            options={BILLING_OPTIONS}
            value={billing}
            onValueChange={setBilling}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div aria-live="polite" className="grid grid-cols-2 gap-4 rounded-lg bg-surface-tint p-5">
          {result.available ? (
            <>
              <div>
                <p className="type-small text-text-muted">Pro Monat</p>
                <p className="font-display text-h3 font-semibold text-ink tabular-nums">
                  {formatPrice(result.monthlyNet)}
                </p>
                <p className="type-small text-text-muted">{formatPrice(result.monthlyGross)} brutto</p>
              </div>
              <div>
                <p className="type-small text-text-muted">Pro Jahr</p>
                <p className="font-display text-h3 font-semibold text-ink tabular-nums">
                  {formatPrice(result.yearlyNet)}
                </p>
                <p className="type-small text-text-muted">{formatPrice(result.yearlyGross)} brutto</p>
              </div>
              <p className="col-span-2 type-small text-text-muted">
                {product.name} {plan.name}, {userLabel}, netto zzgl. MwSt.
                {own.billing !== billing &&
                  (own.billing === "monatlich"
                    ? " Dieser Tarif ist nur mit monatlicher Zahlung ausgewiesen."
                    : " Dieser Tarif ist nur mit jährlicher Zahlung ausgewiesen.")}
                {result.exceedsIncludedUsers &&
                  ` Achtung: Der Tarif enthält ${formatNumber(plan.includedUsers ?? 0)} Nutzer. Für weitere Nutzer nennt der Anbieter keinen festen Preis.`}
              </p>
            </>
          ) : (
            <p className="col-span-2 type-body text-text-muted">
              Für diesen Tarif nennt der Anbieter keinen festen Preis.
            </p>
          )}
        </div>

        <div>
          <h3 className="type-h4 text-ink">Im Vergleich, pro Monat netto</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {comparison.map((row) => (
              <li key={row.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between gap-3 type-small">
                  <span className={cn("text-ink", row.own && "font-semibold")}>
                    {row.name} <span className="text-text-muted">{row.planName}</span>
                  </span>
                  <span className="font-display font-semibold text-ink tabular-nums">
                    {row.result?.available ? formatPrice(row.result.monthlyNet) : "Preis auf Anfrage"}
                  </span>
                </div>
                <span className="h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <span
                    className={cn("block h-full rounded-full", row.own ? "bg-brand-700" : "bg-brand-500")}
                    style={{
                      width: row.result?.available ? `${(row.result.monthlyNet / max) * 100}%` : "0%",
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 type-small text-text-muted">
            Stand: {formatDate(verifiedAt)} · Quelle: Websites der Anbieter
          </p>
        </div>
      </div>
    </div>
  );
}
