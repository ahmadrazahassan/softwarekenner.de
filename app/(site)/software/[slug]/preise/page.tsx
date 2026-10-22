import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChartFrame, CostLines } from "@/components/charts";
import { DraftNotice, PageHeader } from "@/components/content/page-parts";
import { CostCalculator, PricingTable } from "@/components/software/pricing";
import { TextLink } from "@/components/ui/button";
import { getAlternatives, getCategory, getSoftware, listSoftware } from "@/lib/content";
import { costRows, chartPlan, type CostSeries } from "@/lib/charts";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata } from "@/lib/seo";

const TABLE_STEPS = [1, 5, 10, 25, 50, 100, 250];

export function generateStaticParams() {
  return staticParams(
    "slug",
    listSoftware().map((s) => s.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/software/[slug]/preise">): Promise<Metadata> {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) return {};
  return pageMetadata({
    title: `${software.name} Preise: Tarife und Kosten in Euro`,
    description:
      `Alle Tarife von ${software.name} mit Preisen in Euro, netto und brutto, Vertragsdetails und Kostenrechner. Stand ${formatDate(software.pricing.verifiedAt)}.`.slice(
        0,
        155,
      ),
    path: routes.softwarePrices(software.slug),
  });
}

export default async function PricesPage({ params }: PageProps<"/software/[slug]/preise">) {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) notFound();
  const category = getCategory(software.primaryCategory);
  const alternatives = getAlternatives(software.slug);
  // Cost over users: own recommended paid plan against the cheapest paid plan of two alternatives.
  const costSeries = [
    { name: software.name, plan: chartPlan(software.pricing.plans, true) },
    ...alternatives.slice(0, 2).map((a) => ({ name: a.name, plan: chartPlan(a.pricing.plans) })),
  ].filter((s): s is CostSeries & { plan: NonNullable<typeof s.plan> } => s.plan !== null);
  const costTable = costRows(costSeries, "monatlich");
  const at10 = costTable.find((r) => r.users === 10)!;
  const cheapest = costSeries
    .map((s) => ({ name: s.name, value: at10[s.name] }))
    .filter((s): s is { name: string; value: number } => typeof s.value === "number")
    .sort((a, b) => a.value - b.value)[0];
  const costTakeaway = cheapest
    ? `Bei 10 Nutzern ist ${cheapest.name} mit ${formatPrice(Math.round(cheapest.value * 100))} im Monat am günstigsten.`
    : "Für 10 Nutzer nennen die Anbieter keine festen Preise.";
  const calculable = software.pricing.plans.some(
    (p) => p.priceMonthlyNet !== null || p.priceYearlyNetPerMonth !== null,
  );

  return (
    <>
      <DraftNotice status={software.status} what="Dieses Profil" />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          ...(category ? [{ label: category.shortName, href: routes.category(category.slug) }] : []),
          { label: software.name, href: routes.software(software.slug) },
          { label: "Preise", href: routes.softwarePrices(software.slug) },
        ]}
        title={`${software.name}: Preise und Tarife`}
        lead="Alle Preise in Euro, standardmäßig netto zzgl. MwSt. Mit dem Rechner sehen Sie die Kosten für Ihre Nutzerzahl."
        meta={<>Preise geprüft am {formatDate(software.pricing.verifiedAt)}</>}
      />
      <div className="container-content flex flex-col gap-12 pb-20">
        <PricingTable plans={software.pricing.plans} verifiedAt={software.pricing.verifiedAt} />
        <section aria-labelledby="vertrag" className="rounded-lg border border-line bg-white p-6">
          <h2 id="vertrag" className="type-h4 text-ink">
            Vertrag und Hinweise
          </h2>
          <p className="mt-2 measure type-body text-ink">
            {software.pricing.contractNotes ??
              "Der Anbieter nennt auf der Preisseite keine weiteren Vertragsdetails."}
          </p>
          <p className="mt-3 type-small text-text-muted">
            Quelle:{" "}
            <a href={software.pricing.source} target="_blank" rel="noopener" className="link-inline">
              Preisseite des Anbieters
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
            , abgerufen am {formatDate(software.pricing.verifiedAt)}
          </p>
        </section>
        {calculable && (
          <section aria-labelledby="rechner" className="flex flex-col gap-6">
            <h2 id="rechner" className="type-h2 text-ink">
              Kostenrechner
            </h2>
            <CostCalculator
              product={{ name: software.name, plans: software.pricing.plans }}
              alternatives={alternatives.slice(0, 2).map((a) => ({ name: a.name, plans: a.pricing.plans }))}
              verifiedAt={software.pricing.verifiedAt}
            />
          </section>
        )}
        {costSeries.length > 1 && (
          <ChartFrame
            title="Kosten nach Nutzerzahl"
            takeaway={costTakeaway}
            summary={`Stufenlinien der monatlichen Kosten von 1 bis 250 Nutzern für ${costSeries.map((s) => s.name).join(", ")}.`}
            footnote={`Netto pro Monat, Tarife: ${costSeries.map((s) => `${s.name} ${s.plan.name}`).join(", ")}. Lücken: kein fester Preis laut Anbieter. Stand ${formatDate(software.pricing.verifiedAt)}`}
            table={{
              columns: ["Nutzer", ...costSeries.map((s) => s.name)],
              rows: TABLE_STEPS.map((users) => {
                const row = costTable.find((r) => r.users === users)!;
                return [
                  formatNumber(users),
                  ...costSeries.map((s) => {
                    const value = row[s.name];
                    return value === null || value === undefined
                      ? "kein fester Preis"
                      : formatPrice(Math.round(value * 100));
                  }),
                ];
              }),
            }}
            headingLevel={3}
          >
            <CostLines rows={costTable} series={costSeries.map((s) => s.name)} />
          </ChartFrame>
        )}
        <TextLink href={routes.software(software.slug)}>Zurück zum Profil von {software.name}</TextLink>
      </div>
    </>
  );
}
