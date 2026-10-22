import { Headset } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requestAdvice } from "@/app/actions/forms";
import { AdvisorPanel } from "@/components/content/advisor-panel";
import { ChartFrame, PriceBars, ScoreScatter } from "@/components/charts";
import { MethodologyBar } from "@/components/content/methodology-bar";
import { Mdx } from "@/components/content/mdx";
import { DraftNotice, JsonLd, PageHeader } from "@/components/content/page-parts";
import { AwardCard } from "@/components/software/award-card";
import { CategoryTile, RankedListItem, SectionHeading } from "@/components/software/cards";
import {
  FilterControls,
  FilterCount,
  FilterEmpty,
  FilterItem,
  FilterScope,
} from "@/components/software/category-filters";
import { ComparisonTable } from "@/components/software/comparison-table";
import { AppLink } from "@/components/ui/app-link";
import { Icon } from "@/components/ui/icon";
import { Accordion } from "@/components/ui/overlay";
import {
  getAuthor,
  getAwards,
  getBuyingGuide,
  getCategory,
  listCategories,
  listSoftwareByCategory,
  rankedDetailsOf,
  rankedSummaries,
} from "@/lib/content";
import { comparisonGroups, comparisonProducts } from "@/lib/content/comparison";
import { facetsOf, filterGroupsFor } from "@/lib/content/filters";
import { entryPrice, scoreOf, weightsFor } from "@/lib/content/query";
import { CATEGORY_ICONS } from "@/lib/content/icons";
import { formatDate, formatNumber, formatPrice, formatRating, PRICE_UNIT_LABEL } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import type { AwardKind } from "@/lib/scoring";
import { itemListJsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "kategorie",
    listCategories().map((c) => c.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/kategorien/[kategorie]">): Promise<Metadata> {
  const { kategorie } = await params;
  const category = getCategory(kategorie);
  if (!category) return {};
  return pageMetadata({
    title: category.seo.title,
    description: category.seo.description,
    path: routes.category(category.slug),
  });
}

const AWARD_ORDER: AwardKind[] = [
  "redaktion",
  "preisLeistung",
  "selbststaendige",
  "mittelstand",
  "datenschutz",
];

export default async function CategoryPage({ params }: PageProps<"/kategorien/[kategorie]">) {
  const { kategorie } = await params;
  const category = getCategory(kategorie);
  if (!category) notFound();

  const software = listSoftwareByCategory(category.slug);
  if (software.length === 0) notFound();
  const summaries = rankedSummaries(category.slug, "kategorie");
  const awards = getAwards(category.slug);
  const guide = getBuyingGuide(category.slug);
  const guideAuthor = guide ? getAuthor(guide.author) : undefined;
  const guideReviewer = guide ? getAuthor(guide.reviewer) : undefined;
  const year = category.updatedAt.slice(0, 4);
  const top = software.slice(0, 6);
  const priced = software
    .map((s) => ({ name: s.name, price: entryPrice(s), score: scoreOf(s, weightsFor(category)) }))
    .filter((p) => p.price !== null)
    .map((p) => ({ name: p.name, cents: p.price!.cents, unit: p.price!.unit, score: p.score }))
    .sort((a, b) => a.cents - b.cents);
  const unpriced = software.length - priced.length;
  const wideRange = priced.length > 1 && priced.at(-1)!.cents / priced[0]!.cents > 10;
  const bestRated = [...priced].sort((a, b) => b.score - a.score)[0]!;
  const facets = software.map((s) => facetsOf(s, weightsFor(category)));
  // Only related categories that already have programs; empty ones would be dead ends.
  const related = category.related
    .map((slug) => getCategory(slug))
    .filter((c) => c !== undefined && listSoftwareByCategory(c.slug).length > 0)
    .map((c) => c!);

  const awardCards = AWARD_ORDER.flatMap((kind) => {
    const winner = [...awards.entries()].find(([, kinds]) => kinds.includes(kind))?.[0];
    const summary = summaries.find((s) => s.slug === winner);
    return summary ? [{ kind, summary }] : [];
  }).slice(0, 3);

  const anchors = [
    { id: "programme", label: "Alle Programme" },
    ...(top.length > 1 ? [{ id: "vergleichstabelle", label: "Vergleichstabelle" }] : []),
    ...(guide ? [{ id: "kaufberatung", label: "Kaufberatung" }] : []),
    ...(category.faq.length ? [{ id: "faq", label: "Häufige Fragen" }] : []),
  ];

  return (
    <>
      <DraftNotice status={category.status} what="Diese Kategorie" />
      <JsonLd
        data={itemListJsonLd(
          `${category.name} im Vergleich`,
          summaries.map((s) => ({ name: s.name, path: s.href })),
        )}
      />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Kategorien", href: routes.categories() },
          { label: category.shortName, href: routes.category(category.slug) },
        ]}
        title={`${category.name} im Vergleich: die besten Programme ${year}`}
        lead={category.description}
        meta={
          <>
            {guideAuthor && <>Von {guideAuthor.name} · </>}
            {guideReviewer && <>Fachlich geprüft von {guideReviewer.name} · </>}
            Zuletzt aktualisiert am {formatDate(category.updatedAt)} · {formatNumber(software.length)}{" "}
            Programme bewertet
          </>
        }
        aside={
          <AppLink
            href={routes.advisory()}
            className="flex items-center gap-3 rounded-full border border-line bg-white py-2 pr-5 pl-3 shadow-sm transition-colors hover:border-ink"
          >
            <Icon icon={Headset} size={24} className="text-ink" />
            <span className="flex flex-col">
              <span className="type-label font-semibold text-ink">Kostenlose Beratung</span>
              <span className="type-small text-text-muted">Persönlich, kostenlos, unverbindlich</span>
            </span>
          </AppLink>
        }
      />

      <nav aria-label="Abschnitte" className="border-y border-line bg-white">
        <ul className="scroll-fade-x container-content flex gap-7">
          {anchors.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="flex min-h-12 items-center type-eyebrow whitespace-nowrap text-text-muted hover:text-ink"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-content flex flex-col gap-14 py-12">
        {awardCards.length > 0 && (
          <section aria-labelledby="empfehlungen">
            <h2 id="empfehlungen" className="mb-6 type-h3 text-ink">
              Unsere Empfehlungen
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {awardCards.map(({ kind, summary }) => (
                <AwardCard key={kind} kind={kind} year={Number(year)} software={summary} />
              ))}
            </div>
          </section>
        )}

        <MethodologyBar methodHref={routes.methodology()} />

        <section id="programme" aria-labelledby="programme-titel" className="scroll-mt-24">
          <FilterScope facets={facets} groups={filterGroupsFor(facets)}>
            <div className="mb-6 flex flex-col gap-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="programme-titel" className="type-h3 text-ink">
                  <FilterCount />
                </h2>
                <p className="type-small text-text-muted">Sortiert nach Redaktionswertung</p>
              </div>
              <FilterControls />
            </div>
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
              <div className="flex flex-col gap-6">
                <ol className="flex flex-col gap-6">
                  {software.map((s, i) => (
                    <FilterItem key={s.slug} slug={s.slug}>
                      <RankedListItem rank={i + 1} software={summaries[i]!} details={rankedDetailsOf(s)} />
                    </FilterItem>
                  ))}
                </ol>
                <FilterEmpty />
              </div>
              <AdvisorPanel
                privacyHref={routes.legal.privacy()}
                categories={listCategories().map((c) => ({ value: c.slug, label: c.shortName }))}
                defaultCategory={category.slug}
                onSubmit={requestAdvice}
              />
            </div>
          </FilterScope>
        </section>

        {top.length > 1 && (
          <section id="vergleichstabelle" className="scroll-mt-24">
            <SectionHeading title={`Die ${formatNumber(top.length)} bestbewerteten Programme im Vergleich`} />
            <ComparisonTable
              caption={`${category.name}: Vergleich der ${top.length} bestbewerteten Programme`}
              products={comparisonProducts(top, category.weights)}
              groups={comparisonGroups(top)}
            />
          </section>
        )}

        {priced.length > 1 && (
          <section aria-labelledby="preise-wertungen" className="flex flex-col gap-10">
            <SectionHeading
              title="Preise und Wertungen im Überblick"
              id="preise-wertungen"
              className="mb-0 lg:mb-0"
            />
            <div className="grid gap-10 lg:grid-cols-2">
              <ChartFrame
                title="Einstiegspreise"
                takeaway={`Am günstigsten startet ${priced[0]!.name} mit ${formatPrice(priced[0]!.cents)} im Monat.`}
                summary={`Balkendiagramm der Einstiegspreise: ${priced.map((p) => `${p.name} ${formatPrice(p.cents)}`).join(", ")}.`}
                footnote={`Günstigster kostenpflichtiger Tarif, netto pro Monat, bei Preisen pro Nutzer für einen Nutzer.${unpriced ? ` Ohne festen Preis: ${formatNumber(unpriced)}.` : ""} Stand ${formatDate(category.updatedAt)}`}
                table={{
                  columns: ["Programm", "Einstiegspreis", "Preisbasis"],
                  rows: priced.map((p) => [p.name, formatPrice(p.cents), PRICE_UNIT_LABEL[p.unit]]),
                }}
                height={Math.max(220, priced.length * 40)}
              >
                <PriceBars
                  data={priced.map((p, i) => ({
                    label: p.name,
                    cents: p.cents,
                    highlight: i === 0,
                    note: PRICE_UNIT_LABEL[p.unit],
                  }))}
                />
              </ChartFrame>
              <ChartFrame
                title="Preis und Wertung"
                takeaway={
                  bestRated.name === priced[0]!.name
                    ? `${bestRated.name} hat die höchste Wertung (${formatRating(bestRated.score)}) und zugleich den günstigsten Einstieg.`
                    : `Die höchste Wertung hat ${bestRated.name} mit ${formatRating(bestRated.score)}, den günstigsten Einstieg ${priced[0]!.name}.`
                }
                summary={`Streudiagramm aus Einstiegspreis und Redaktionswertung für ${formatNumber(priced.length)} Programme.`}
                footnote={`Je weiter links und oben, desto mehr Wertung für weniger Geld.${wideRange ? " Preisachse logarithmisch, weil die Preise weit auseinanderliegen." : ""} Stand ${formatDate(category.updatedAt)}`}
                table={{
                  columns: ["Programm", "Einstiegspreis", "Wertung"],
                  rows: priced.map((p) => [p.name, formatPrice(p.cents), formatRating(p.score)]),
                }}
                height={Math.max(260, priced.length * 40)}
              >
                <ScoreScatter
                  logX={wideRange}
                  data={priced.map((p) => ({ name: p.name, euros: p.cents / 100, score: p.score }))}
                />
              </ChartFrame>
            </div>
          </section>
        )}

        {guide && (
          <section id="kaufberatung" className="scroll-mt-24">
            <SectionHeading title="Kaufberatung" />
            <Mdx code={guide.mdx} />
          </section>
        )}

        {category.faq.length > 0 && (
          <section id="faq" className="scroll-mt-24">
            <SectionHeading title="Häufige Fragen" />
            <Accordion
              items={category.faq.map((f, i) => ({ id: `faq-${i}`, title: f.question, content: f.answer }))}
            />
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="verwandt">
            <h2 id="verwandt" className="mb-6 type-h3 text-ink">
              Verwandte Kategorien
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
              {related.map((c) => (
                <CategoryTile
                  key={c.slug}
                  name={c.name}
                  href={routes.category(c.slug)}
                  icon={CATEGORY_ICONS[c.icon]}
                  count={listSoftwareByCategory(c.slug).length}
                  logos={listSoftwareByCategory(c.slug).slice(0, 3)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
