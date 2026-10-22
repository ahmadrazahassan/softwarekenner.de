import type { ReactNode } from "react";

import { ChartFrame, CostLines, PriceBars } from "@/components/charts";
import { getAlternatives, getSoftware } from "@/lib/content";
import { entryPrice } from "@/lib/content/query";
import { chartPlan, costRows, USER_STEPS } from "@/lib/charts";
import { formatDate, formatNumber, formatPrice, PRICE_UNIT_LABEL } from "@/lib/format";

/**
 * Data driven MDX components for reviews. They read our own content only, so every number in a
 * chart comes from the verified profiles, never from the review text.
 */

/** Row of key figures with their source, e.g. vendor statements. */
export function Kennzahlen({ children, quelle }: { children: ReactNode; quelle?: string }) {
  return (
    <figure className="not-prose my-8 rounded-lg border border-line bg-white p-6">
      <div className="grid gap-6 sm:grid-cols-3">{children}</div>
      {quelle && <figcaption className="mt-4 type-small text-text-muted">Quelle: {quelle}</figcaption>}
    </figure>
  );
}

export function Kennzahl({ wert, label }: { wert: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-display text-h3 font-semibold text-ink tabular-nums">{wert}</p>
      <p className="type-small text-text-muted">{label}</p>
    </div>
  );
}

/**
 * Fact table for reviews, e.g. tariffs or add-ons from the vendor page. The first cell of a row is its
 * row header; wide tables scroll inside their frame instead of widening the page.
 */
export function Tabelle({
  titel,
  kopf,
  zeilen,
  quelle,
}: {
  titel: string;
  kopf: string[];
  zeilen: string[][];
  quelle?: string;
}) {
  return (
    <figure className="not-prose my-8 flex flex-col gap-3">
      <div
        role="region"
        aria-label={titel}
        tabIndex={0}
        className="overflow-x-auto rounded-md border border-line bg-white"
      >
        <table className="w-full border-collapse type-small text-ink tabular-nums">
          <caption className="border-b border-line px-4 py-3 text-left type-label text-ink">{titel}</caption>
          <thead>
            <tr>
              {kopf.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-b border-line bg-surface-tint px-4 py-2.5 text-left type-label"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((row, i) => (
              <tr key={i} className="border-b border-line align-top last:border-0">
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="px-4 py-2 text-left font-semibold">
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className="px-4 py-2">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {quelle && <figcaption className="type-small text-text-muted">Quelle: {quelle}</figcaption>}
    </figure>
  );
}

/** Entry price of the product next to its alternatives (horizontal bars). */
export function Preisvergleich({ slug }: { slug: string }) {
  const software = getSoftware(slug);
  if (!software) return null;
  const rows = [software, ...getAlternatives(slug).slice(0, 5)]
    .map((s) => ({ s, price: entryPrice(s) }))
    .filter((r) => r.price !== null)
    .map((r) => ({ name: r.s.name, cents: r.price!.cents, unit: r.price!.unit, own: r.s.slug === slug }))
    .sort((a, b) => a.cents - b.cents);
  if (rows.length < 2 || !rows.some((r) => r.own)) return null;
  const own = rows.find((r) => r.own)!;
  const rank = rows.indexOf(own) + 1;
  return (
    <div className="not-prose my-10 rounded-lg border border-line bg-white p-6">
      <ChartFrame
        title={`Einstiegspreis von ${software.name} im Vergleich`}
        takeaway={`${software.name} startet bei ${formatPrice(own.cents)} im Monat und liegt damit auf Platz ${rank} von ${rows.length} der verglichenen Programme.`}
        summary={`Balkendiagramm der Einstiegspreise: ${rows.map((r) => `${r.name} ${formatPrice(r.cents)}`).join(", ")}.`}
        footnote={`Günstigster kostenpflichtiger Tarif laut Anbieter, netto pro Monat, bei Preisen pro Nutzer für einen Nutzer. Stand ${formatDate(software.pricing.verifiedAt)}`}
        table={{
          columns: ["Programm", "Einstiegspreis", "Preisbasis"],
          rows: rows.map((r) => [r.name, formatPrice(r.cents), PRICE_UNIT_LABEL[r.unit]]),
        }}
        height={Math.max(200, rows.length * 44)}
      >
        <PriceBars
          data={rows.map((r) => ({
            label: r.name,
            cents: r.cents,
            highlight: r.own,
            note: PRICE_UNIT_LABEL[r.unit],
          }))}
        />
      </ChartFrame>
    </div>
  );
}

const TABLE_STEPS = [1, 5, 10, 25, 50];

/** Monthly cost by team size for the product and up to three alternatives (step lines). */
export function Kostenvergleich({ slug }: { slug: string }) {
  const software = getSoftware(slug);
  if (!software) return null;
  const series = [software, ...getAlternatives(slug).slice(0, 3)]
    .map((s, i) => ({ name: s.name, plan: chartPlan(s.pricing.plans, i === 0) }))
    .filter((s): s is { name: string; plan: NonNullable<typeof s.plan> } => s.plan !== null)
    // A flat monthly price without a stated user limit says nothing about larger teams: leave it out.
    .filter((s) => s.plan.unit === "pro-nutzer-monat" || s.plan.includedUsers !== null);
  if (series.length < 2 || series[0]!.name !== software.name) return null;
  const rows = costRows(
    series,
    "monatlich",
    USER_STEPS.filter((n) => n <= 50),
  );
  const at10 = rows.find((r) => r.users === 10)!;
  const priced = series
    .map((s) => ({ name: s.name, value: at10[s.name] }))
    .filter((s): s is { name: string; value: number } => typeof s.value === "number")
    .sort((a, b) => a.value - b.value);
  const takeaway = priced.length
    ? `Bei 10 Nutzern kostet ${priced[0]!.name} mit ${formatPrice(Math.round(priced[0]!.value * 100))} im Monat am wenigsten.`
    : "Für 10 Nutzer nennen die Anbieter keine festen Preise.";
  return (
    <div className="not-prose my-10 rounded-lg border border-line bg-white p-6">
      <ChartFrame
        title="Monatliche Kosten nach Teamgröße"
        takeaway={takeaway}
        summary={`Stufenlinien der Monatskosten für 1 bis 50 Nutzer: ${series.map((s) => s.name).join(", ")}.`}
        footnote={`Netto pro Monat, Tarife: ${series.map((s) => `${s.name} ${s.plan.name}`).join(", ")}. Lücken bedeuten: kein fester Preis laut Anbieter. Stand ${formatDate(software.pricing.verifiedAt)}`}
        table={{
          columns: ["Nutzer", ...series.map((s) => s.name)],
          rows: TABLE_STEPS.map((users) => {
            const row = rows.find((r) => r.users === users)!;
            return [
              formatNumber(users),
              ...series.map((s) => {
                const v = row[s.name];
                return typeof v === "number" ? formatPrice(Math.round(v * 100)) : "kein fester Preis";
              }),
            ];
          }),
        }}
        height={340}
      >
        <CostLines rows={rows} series={series.map((s) => s.name)} />
      </ChartFrame>
    </div>
  );
}
