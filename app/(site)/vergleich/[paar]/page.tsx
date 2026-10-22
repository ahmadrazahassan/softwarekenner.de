import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Butterfly, ChartFrame } from "@/components/charts";
import { Mdx } from "@/components/content/mdx";
import { DraftNotice, PageHeader } from "@/components/content/page-parts";
import { SectionHeading } from "@/components/software/cards";
import { ComparisonTable } from "@/components/software/comparison-table";
import { AffiliateButton } from "@/components/ui/affiliate-button";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { getComparison, getScore, getSoftware, listComparisons, summaryOf } from "@/lib/content";
import { comparisonGroups, comparisonProducts } from "@/lib/content/comparison";
import { formatDate, formatNumber, formatRating } from "@/lib/format";
import { CRITERIA, CRITERION_LABEL } from "@/lib/scoring";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata } from "@/lib/seo";

/** Comparison pages exist only for pairs with unique editorial content (Section 13.4). */
export function generateStaticParams() {
  return staticParams(
    "paar",
    listComparisons().map((c) => c.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/vergleich/[paar]">): Promise<Metadata> {
  const { paar } = await params;
  const comparison = getComparison(paar);
  if (!comparison) return {};
  return pageMetadata({
    title: comparison.title,
    description: comparison.description,
    path: routes.comparison(comparison.a, comparison.b),
  });
}

export default async function ComparisonPage({ params }: PageProps<"/vergleich/[paar]">) {
  const { paar } = await params;
  const comparison = getComparison(paar);
  if (!comparison) notFound();
  const a = getSoftware(comparison.a);
  const b = getSoftware(comparison.b);
  if (!a || !b) notFound();

  const aAhead = CRITERIA.filter((c) => a.scores[c] > b.scores[c]).length;
  const bAhead = CRITERIA.filter((c) => b.scores[c] > a.scores[c]).length;

  return (
    <>
      <DraftNotice status={comparison.status} what="Dieser Vergleich" />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Vergleiche", href: routes.compareTool() },
          { label: `${a.name} oder ${b.name}`, href: routes.comparison(a.slug, b.slug) },
        ]}
        title={`${a.name} oder ${b.name}: Welche Software passt besser zu Ihrem Unternehmen?`}
        meta={<>Zuletzt aktualisiert am {formatDate(comparison.updatedAt)}</>}
      />
      <div className="container-content flex flex-col gap-14 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {[a, b].map((s) => {
            const summary = summaryOf(s, { from: "vergleich" });
            return (
              <div
                key={s.slug}
                className="flex flex-col items-start gap-4 rounded-lg border border-line bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <LogoTile name={s.name} logo={s.logo} size={72} />
                  <div className="flex flex-col gap-2">
                    <p className="type-h3 text-ink">{s.name}</p>
                    <ScoreChip score={getScore(s.slug) ?? 0} />
                  </div>
                </div>
                <AffiliateButton
                  href={summary.outboundHref}
                  label="Website besuchen"
                  sponsored={summary.affiliate}
                  adLabel="inline"
                  size="sm"
                />
              </div>
            );
          })}
        </div>
        <aside className="rounded-lg bg-brand-50 p-6">
          <p className="type-eyebrow text-brand-ink">Das Wichtigste in 30 Sekunden</p>
          <p className="mt-2 type-body-lg text-ink">{comparison.verdict}</p>
        </aside>
        <ChartFrame
          title="Die Kriterien im direkten Vergleich"
          takeaway={`${a.name} liegt in ${formatNumber(aAhead)} von 6 Kriterien vorn, ${b.name} in ${formatNumber(bAhead)}.`}
          summary={`Gegenüberstellung der sechs Kriterien: ${CRITERIA.map((c) => `${CRITERION_LABEL[c]} ${formatRating(a.scores[c])} zu ${formatRating(b.scores[c])}`).join(", ")}.`}
          footnote={`Redaktionswertung, Skala 0 bis 5, Stand ${formatDate(comparison.updatedAt)}`}
          table={{
            columns: ["Kriterium", a.name, b.name],
            rows: CRITERIA.map((c) => [
              CRITERION_LABEL[c],
              formatRating(a.scores[c]),
              formatRating(b.scores[c]),
            ]),
          }}
          height={300}
          className="rounded-lg border border-line bg-white p-6"
        >
          <Butterfly
            nameA={a.name}
            nameB={b.name}
            rows={CRITERIA.map((c) => ({ label: CRITERION_LABEL[c], a: a.scores[c], b: b.scores[c] }))}
          />
        </ChartFrame>
        <Mdx code={comparison.mdx} />
        <section>
          <SectionHeading title="Alle Fakten im Vergleich" />
          <ComparisonTable
            caption={`${a.name} und ${b.name} im Vergleich`}
            products={comparisonProducts([a, b])}
            groups={comparisonGroups([a, b])}
          />
        </section>
      </div>
    </>
  );
}
