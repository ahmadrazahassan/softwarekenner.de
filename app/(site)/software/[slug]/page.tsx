import { PenLine } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChartFrame, CriteriaRadar } from "@/components/charts";
import { EditorialList } from "@/components/content/editorial";
import { buyingGuideLink, guideLink } from "@/components/content/guide-links";
import { Mdx } from "@/components/content/mdx";
import { DraftNotice, JsonLd } from "@/components/content/page-parts";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StickySubNav } from "@/components/layout/page-nav";
import { SoftwareCard } from "@/components/software/cards";
import { AddToCompareButton } from "@/components/software/compare";
import { CriterionBars, DeutschlandCheck, ProsCons, ScoreCard } from "@/components/software/data-display";
import { CostCalculator, PricingTable } from "@/components/software/pricing";
import { AdvisorCta, InlineCta, NextStepCta, type CtaSoftware } from "@/components/software/profile-cta";
import { SoftwareStats } from "@/components/stats/software";
import {
  AuthorBox,
  FitLists,
  KeyFacts,
  Kurzfazit,
  ProfileChips,
  ReviewTransparency,
  SourcesList,
  profileTitle,
} from "@/components/software/profile-parts";
import { AffiliateButton } from "@/components/ui/affiliate-button";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { LogoTile } from "@/components/ui/logo-tile";
import {
  getAlternatives,
  getAuthor,
  getBuyingGuide,
  getCategory,
  getMarket,
  getReview,
  getScore,
  getSoftware,
  getSoftwareStats,
  listComparisonsFor,
  listGuides,
  listSoftware,
  summaryOf,
} from "@/lib/content";
import { deutschlandCheckRows } from "@/lib/content/view";
import { formatDate, formatRating } from "@/lib/format";
import { CRITERIA, CRITERION_LABEL, CRITERION_SHORT_LABEL } from "@/lib/scoring";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { pageMetadata, softwareJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listSoftware().map((s) => s.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/software/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) return {};
  const word = software.editorial.handsOnTest ? "im Test" : "im Überblick";
  return pageMetadata({
    title: `${software.name} ${word}: Preise, Funktionen und Alternativen`,
    description: software.editorial.verdict.slice(0, 155),
    path: routes.software(software.slug),
  });
}

const SECTIONS = [
  { id: "ueberblick", label: "Überblick" },
  { id: "zahlen", label: "Zahlen" },
  { id: "bewertung", label: "Bewertung" },
  { id: "deutschland-check", label: "Deutschland-Check" },
  { id: "preise", label: "Preise" },
  { id: "funktionen", label: "Funktionen" },
  { id: "nutzerbewertungen", label: "Nutzerbewertungen" },
  { id: "alternativen", label: "Alternativen" },
];

export default async function SoftwarePage({ params }: PageProps<"/software/[slug]">) {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) notFound();

  const category = getCategory(software.primaryCategory);
  const author = getAuthor(software.editorial.author);
  const reviewer = getAuthor(software.editorial.reviewer);
  const score = getScore(software.slug) ?? 0;
  const summary = summaryOf(software, { from: "profil" });
  const alternatives = getAlternatives(software.slug);
  const review = getReview(software.slug);
  const strongest = [...CRITERIA].sort((a, b) => software.scores[b] - software.scores[a])[0]!;
  const criteriaText = CRITERIA.map((c) => `${CRITERION_LABEL[c]} ${formatRating(software.scores[c])}`).join(
    ", ",
  );
  const comparisons = listComparisonsFor(software.slug);
  // Reading for the next step: guides that discuss this program, then guides of its categories.
  const allGuides = listGuides();
  const guides = [
    ...allGuides.filter((g) => g.software.includes(software.slug)),
    ...allGuides.filter(
      (g) => !g.software.includes(software.slug) && g.categories.some((c) => software.categories.includes(c)),
    ),
  ].slice(0, 3);
  const buyingGuide = getBuyingGuide(software.primaryCategory);
  const stats = getSoftwareStats(software);
  const ctaSoftware: CtaSoftware = {
    slug: software.slug,
    name: software.name,
    trialDays: software.pricing.trialDays,
    freePlan: software.pricing.freePlan,
    outboundHref: summary.outboundHref,
    sponsored: summary.affiliate,
    alternatives: alternatives.map((a) => a.slug),
  };
  const compareHref = routes.compareTool([software.slug, ...alternatives.slice(0, 2).map((a) => a.slug)]);
  const calculable = software.pricing.plans.some(
    (p) => p.priceMonthlyNet !== null || p.priceYearlyNetPerMonth !== null,
  );

  const cta = (
    <AffiliateButton
      href={summary.outboundHref}
      label="Website besuchen"
      sponsored={summary.affiliate}
      adLabel="inline"
      size="sm"
    />
  );

  return (
    <>
      <DraftNotice status={software.status} what="Dieses Profil" />
      <JsonLd data={softwareJsonLd(software, { score, authorName: author?.name ?? "Redaktion", category })} />

      <header id="profilkopf" className="border-b border-line bg-white">
        <div className="container-content flex flex-col gap-8 pt-8 pb-10">
          <Breadcrumbs
            items={[
              { label: "Startseite", href: routes.home() },
              ...(category ? [{ label: category.shortName, href: routes.category(category.slug) }] : []),
              { label: software.name, href: routes.software(software.slug) },
            ]}
          />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-5">
                <LogoTile name={software.name} logo={software.logo} size={96} />
                <div className="flex min-w-0 flex-col gap-2">
                  <h1 className="type-h1 [overflow-wrap:anywhere] text-ink sm:[overflow-wrap:normal]">
                    {profileTitle(software)}
                  </h1>
                  <p className="type-lead text-text-muted">{software.tagline}</p>
                </div>
              </div>
              <ProfileChips software={software} />
              <div className="flex flex-wrap items-center gap-3">
                <AffiliateButton
                  href={summary.outboundHref}
                  label="Website besuchen"
                  sponsored={summary.affiliate}
                  adLabel="inline"
                />
                <AddToCompareButton
                  item={{ slug: software.slug, name: software.name, logo: software.logo }}
                />
              </div>
              {summary.affiliate && (
                <p className="type-small text-text-muted">
                  Anzeige: Wir erhalten ggf. eine Provision. Für Sie ändert sich der Preis nicht.
                </p>
              )}
            </div>
            <ScoreCard score={score} methodHref={routes.methodology()} />
          </div>
          <KeyFacts software={software} className="border-t border-line pt-6" />
        </div>
      </header>

      <StickySubNav sentinelId="profilkopf" items={SECTIONS} score={score} cta={cta} />

      <div className="container-content flex flex-col gap-16 py-12">
        <section
          id="ueberblick"
          aria-labelledby="ueberblick-titel"
          className="flex scroll-mt-32 flex-col gap-8"
        >
          <h2 id="ueberblick-titel" className="type-h2 text-ink">
            Überblick
          </h2>
          <Kurzfazit software={software} author={author} />
          <ProsCons pros={software.editorial.pros} cons={software.editorial.cons} />
          <FitLists software={software} />
        </section>

        <section id="zahlen" aria-labelledby="zahlen-titel" className="flex scroll-mt-32 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 id="zahlen-titel" className="type-h2 text-ink">
              {software.name} in Zahlen
            </h2>
            <p className="measure type-body text-text-muted">
              Berechnet aus unserem Profil und den Programmen der Kategorie, ergänzt um Marktdaten aus
              Deutschland. Stand der Preise {formatDate(software.pricing.verifiedAt)}.
            </p>
          </div>
          <SoftwareStats
            software={software}
            score={score}
            stats={stats}
            market={{ origin: getMarket("cloud-anbieter-herkunft"), apps: getMarket("cloud-anwendungen") }}
          />
        </section>

        <NextStepCta software={ctaSoftware} />

        <section
          id="bewertung"
          aria-labelledby="bewertung-titel"
          className="grid scroll-mt-32 gap-8 lg:grid-cols-[1fr_20rem]"
        >
          <div>
            <h2 id="bewertung-titel" className="type-h2 text-ink">
              Bewertung im Detail
            </h2>
            <p className="mt-3 measure type-body text-text-muted">
              Sechs Kriterien mit fester Gewichtung ergeben die Redaktionswertung.{" "}
              {software.editorial.handsOnTest
                ? "Die Wertung beruht auf einem eigenen Praxistest."
                : "Die Wertung beruht auf Herstellerangaben und öffentlichen Quellen, ein eigener Praxistest steht noch aus."}
            </p>
            <CriterionBars scores={software.scores} className="mt-8 max-w-2xl" />
          </div>
          <div className="flex flex-col gap-6 self-start">
            <ChartFrame
              title="Stärken auf einen Blick"
              takeaway={`Am stärksten bewertet: ${CRITERION_LABEL[strongest]} mit ${formatRating(software.scores[strongest])} von 5.`}
              summary={`Netzdiagramm der sechs Kriterien von ${software.name}: ${criteriaText}.`}
              footnote={`Redaktionswertung, Skala 0 bis 5, Stand ${formatDate(software.editorial.updatedAt)}`}
              table={{
                columns: ["Kriterium", "Wertung"],
                rows: CRITERIA.map((c) => [CRITERION_LABEL[c], formatRating(software.scores[c])]),
              }}
              height={280}
              headingLevel={3}
              className="rounded-lg border border-line bg-white p-6"
            >
              <CriteriaRadar
                data={CRITERIA.map((c) => ({ label: CRITERION_SHORT_LABEL[c], value: software.scores[c] }))}
              />
            </ChartFrame>
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-6">
              <p className="type-label font-semibold text-ink">Wie die Wertung entsteht</p>
              <p className="type-small text-text-muted">
                Gewichtung, Kriterien und Bewertungsskala erklären wir offen auf der Methodikseite.
              </p>
              <TextLink href={routes.methodology()}>So bewerten wir</TextLink>
            </div>
          </div>
        </section>

        {review && (
          <section aria-label={software.editorial.handsOnTest ? "Testbericht" : "Bewertung"}>
            <Mdx code={review.mdx} />
          </section>
        )}

        <InlineCta
          software={ctaSoftware}
          title={`Passt ${software.name} zu Ihrem Unternehmen?`}
          text="Vergleichen Sie Preise, Deutschland-Check und Wertung mit den stärksten Alternativen, oder prüfen Sie das Programm direkt beim Anbieter."
          secondary={
            alternatives.length > 0 ? { href: compareHref, label: "Mit Alternativen vergleichen" } : undefined
          }
        />

        <section
          id="deutschland-check"
          aria-labelledby="dc-titel"
          className="flex scroll-mt-32 flex-col gap-6"
        >
          <h2 id="dc-titel" className="type-h2 text-ink">
            Deutschland-Check
          </h2>
          <p className="measure type-body text-text-muted">
            Angaben laut Anbieter, geprüft anhand der unten genannten Quellen. „Keine Angabe“ heißt: Wir haben
            dazu keine belastbare Information gefunden.
          </p>
          <DeutschlandCheck rows={deutschlandCheckRows(software)} />
          <SourcesList software={software} />
        </section>

        <section id="preise" aria-labelledby="preise-titel" className="flex scroll-mt-32 flex-col gap-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="preise-titel" className="type-h2 text-ink">
              Preise
            </h2>
            <TextLink href={routes.softwarePrices(software.slug)}>Alle Preisdetails</TextLink>
          </div>
          <PricingTable plans={software.pricing.plans} verifiedAt={software.pricing.verifiedAt} />
          {software.pricing.contractNotes && (
            <p className="measure type-small text-text-muted">
              <strong className="text-ink">Vertrag und Hinweise:</strong> {software.pricing.contractNotes}
            </p>
          )}
          {calculable && alternatives.length > 0 && (
            <CostCalculator
              product={{ name: software.name, plans: software.pricing.plans }}
              alternatives={alternatives.slice(0, 2).map((a) => ({ name: a.name, plans: a.pricing.plans }))}
              verifiedAt={software.pricing.verifiedAt}
            />
          )}
          <InlineCta
            software={ctaSoftware}
            title="Aktuelle Konditionen beim Anbieter prüfen"
            text={`Preise und Aktionen ändern sich. Unsere Angaben haben wir am ${formatDate(software.pricing.verifiedAt)} geprüft.`}
            secondary={{ href: routes.softwarePrices(software.slug), label: "Alle Preisdetails" }}
          />
        </section>

        <section
          id="funktionen"
          aria-labelledby="funktionen-titel"
          className="grid scroll-mt-32 gap-8 md:grid-cols-3"
        >
          <h2 id="funktionen-titel" className="type-h2 text-ink md:col-span-3">
            Funktionen und Schnittstellen
          </h2>
          <div>
            <h3 className="type-h4 text-ink">Schnittstellen</h3>
            <p className="mt-2 type-body text-ink">
              {software.integrations.length
                ? software.integrations.join(", ")
                : "Keine Angabe in unseren Quellen"}
            </p>
          </div>
          <div>
            <h3 className="type-h4 text-ink">Plattformen</h3>
            <p className="mt-2 type-body text-ink">
              {software.platforms
                .map(
                  (p) =>
                    ({
                      web: "Browser",
                      windows: "Windows",
                      macos: "macOS",
                      linux: "Linux",
                      ios: "iOS-App",
                      android: "Android-App",
                    })[p],
                )
                .join(", ")}
            </p>
          </div>
          <div>
            <h3 className="type-h4 text-ink">Unternehmensgröße</h3>
            <p className="mt-2 type-body text-ink">
              {software.companySizes
                .map(
                  (c) =>
                    ({
                      solo: "Selbstständige",
                      "1-9": "1 bis 9",
                      "10-49": "10 bis 49",
                      "50-249": "50 bis 249",
                      "250+": "ab 250",
                    })[c],
                )
                .join(", ")}
            </p>
          </div>
        </section>

        <section
          id="nutzerbewertungen"
          aria-labelledby="nutzer-titel"
          className="flex scroll-mt-32 flex-col gap-6"
        >
          <h2 id="nutzer-titel" className="type-h2 text-ink">
            Nutzerbewertungen
          </h2>
          <EmptyState
            seed={software.slug}
            icon={PenLine}
            title={`Wie bewährt sich ${software.name} in Ihrem Unternehmen?`}
            text="Wir veröffentlichen ausschließlich verifizierte Erfahrungen aus Unternehmen. Ihre Bewertung hilft anderen bei der Entscheidung und fließt getrennt von der Redaktionswertung ein."
            action={
              <ButtonLink href={routes.writeReview()} variant="ink">
                Bewertung schreiben
              </ButtonLink>
            }
          />
          <ReviewTransparency />
        </section>

        {alternatives.length > 0 && (
          <section id="alternativen" aria-labelledby="alt-titel" className="flex scroll-mt-32 flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="alt-titel" className="type-h2 text-ink">
                Alternativen zu {software.name}
              </h2>
              <TextLink href={routes.softwareAlternatives(software.slug)}>
                Alle Alternativen im Vergleich
              </TextLink>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-5">
              {alternatives.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <SoftwareCard software={summaryOf(a, { from: "profil" })} />
                </li>
              ))}
            </ul>
            {comparisons.length > 0 && (
              <ul className="flex flex-wrap gap-4">
                {comparisons.map((c) => (
                  <li key={c.slug}>
                    <TextLink href={routes.comparison(c.a, c.b)}>{c.title}</TextLink>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {(guides.length > 0 || buyingGuide) && (
          <section aria-labelledby="ratgeber-titel" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="ratgeber-titel" className="type-h2 text-ink">
                Wissen für Ihre Entscheidung
              </h2>
              <TextLink href={routes.guides()}>Alle Ratgeber</TextLink>
            </div>
            <EditorialList
              compact
              items={[
                ...(buyingGuide && category ? [buyingGuideLink(buyingGuide, category.name)] : []),
                ...guides.map(guideLink),
              ]}
            />
          </section>
        )}

        <AdvisorCta name={software.name} />

        <AuthorBox software={software} author={author} reviewer={reviewer} />
      </div>
    </>
  );
}
