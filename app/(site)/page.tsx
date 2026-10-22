import { ArrowRight, Headset, Plug, ReceiptText, Server, ShieldCheck, FileCheck2 } from "lucide-react";
import type { Metadata } from "next";

import { ChartFrame, WeightsDonut } from "@/components/charts";
import { JsonLd } from "@/components/content/page-parts";
import { PopularSoftware, type PopularTab } from "@/components/home/popular-software";
import { CategoryTile, ComparisonCard, SectionHeading } from "@/components/software/cards";
import { FinderBlock } from "@/components/software/finder-block";
import { MarketReport } from "@/components/stats/market";
import { PortfolioReport } from "@/components/stats/portfolio";
import { CountUp } from "@/components/ui/animated";
import { BlockPattern } from "@/components/ui/block-pattern";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ScoreChip } from "@/components/ui/score-chip";
import {
  finderData,
  getPortfolioStats,
  getStats,
  listCategories,
  listMarket,
  listComparisons,
  listSoftware,
  listSoftwareByCategory,
  rankedSummaries,
} from "@/lib/content";
import { CATEGORY_ICONS } from "@/lib/content/icons";
import { median } from "@/lib/charts";
import { entryPrice } from "@/lib/content/query";
import { formatMonthYear, formatNumber, formatPercent } from "@/lib/format";
import { routes } from "@/lib/routes";
import { CRITERIA, CRITERION_LABEL, DEFAULT_WEIGHTS } from "@/lib/scoring";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Software für Unternehmen in Deutschland im Vergleich",
    description:
      "Unabhängige Bewertungen von Unternehmenssoftware für den deutschen Markt: Preise in Euro, offene Methodik, Datenschutz, GoBD und E-Rechnung im Blick.",
    path: "/",
  }),
  title: { absolute: `${siteConfig.brand.name}: Software für Unternehmen im Vergleich` },
};

const CHECK_ITEMS = [
  {
    icon: Server,
    title: "Serverstandort",
    text: "Wo liegen Ihre Daten: in Deutschland, in der EU oder anderswo?",
  },
  {
    icon: ShieldCheck,
    title: "Auftragsverarbeitung (AVV)",
    text: "Bietet der Anbieter einen Vertrag zur Auftragsverarbeitung nach DSGVO an?",
  },
  {
    icon: FileCheck2,
    title: "GoBD",
    text: "Werden Belege und Buchungen unveränderbar und nachvollziehbar archiviert?",
  },
  {
    icon: ReceiptText,
    title: "E-Rechnung",
    text: "Kann die Software XRechnung und ZUGFeRD empfangen und erstellen?",
  },
  {
    icon: Plug,
    title: "DATEV und ELSTER",
    text: "Gibt es Schnittstellen zur Steuerberatung und zum Finanzamt?",
  },
  { icon: Headset, title: "Support auf Deutsch", text: "Erreichen Sie den Support in Ihrer Sprache?" },
];

const POPULAR_SEARCHES = [
  { label: "Buchhaltung", href: routes.category("buchhaltung") },
  { label: "Zeiterfassung", href: routes.category("zeiterfassung") },
  { label: "HR-Software", href: routes.category("hr-software") },
  { label: "E-Rechnung", href: `${routes.search()}?q=E-Rechnung` },
];

export default function HomePage() {
  const categories = listCategories();
  const software = listSoftware();
  const stats = getStats();
  const comparisons = listComparisons().slice(0, 3);
  const finder = finderData();
  const market = listMarket();
  const portfolio = getPortfolioStats();
  const medians = categories
    .map((c) => {
      const prices = listSoftwareByCategory(c.slug)
        .map((s) => entryPrice(s)?.cents)
        .filter((v): v is number => v !== undefined);
      return { label: c.shortName, cents: median(prices), count: prices.length };
    })
    .filter((m): m is { label: string; cents: number; count: number } => m.cents !== null)
    .sort((a, b) => a.cents - b.cents);
  const heaviest = [...CRITERIA].sort((a, b) => DEFAULT_WEIGHTS[b] - DEFAULT_WEIGHTS[a])[0]!;
  const weightsText = CRITERIA.map(
    (c) => `${CRITERION_LABEL[c]} ${formatPercent(DEFAULT_WEIGHTS[c] * 100)}`,
  ).join(", ");

  const tabs: PopularTab[] = categories
    .map((c) => ({
      slug: c.slug,
      label: c.shortName,
      href: routes.category(c.slug),
      items: rankedSummaries(c.slug, "start").slice(0, 8),
    }))
    .filter((t) => t.items.length > 0);

  // Hero data card: the highest rated product overall, from our data only.
  const top = tabs.flatMap((t) => t.items).sort((a, b) => b.score - a.score)[0];
  const eInvoice = software.filter((s) => s.compliance.xrechnung === "ja");

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-canvas-light">
        <BlockPattern
          seed="start"
          cols={60}
          rows={40}
          corners={["tr"]}
          className="absolute top-0 right-0 -z-10 h-full w-1/2 opacity-60 max-lg:hidden"
          tone="canvas"
        />
        <div className="container-wide grid gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="type-eyebrow text-brand-ink">Softwarevergleich für Unternehmen in Deutschland</p>
            <h1 className="max-w-[16ch] type-display text-ink">
              Die Software, die zu Ihrem Unternehmen passt.
            </h1>
            <p className="measure type-lead text-text-muted">
              Wir bewerten Unternehmenssoftware für den deutschen Markt: mit Preisen in Euro, einer offenen
              Methodik und einem genauen Blick auf Datenschutz, GoBD und E-Rechnung.
            </p>
            <form
              action={routes.search()}
              method="get"
              role="search"
              className="flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="hero-suche" className="sr-only">
                Welche Software suchen Sie?
              </label>
              <input
                id="hero-suche"
                name="q"
                type="search"
                placeholder="Welche Software suchen Sie? Zum Beispiel Buchhaltung oder Zeiterfassung"
                className="h-16 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-6 font-body text-body text-ink shadow-sm outline-none placeholder:text-text-subtle focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
              <button type="submit" className="btn btn-primary btn-lg">
                <span>Suchen</span>
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2">
              <span className="type-small text-text-muted">Direkt zu:</span>
              {POPULAR_SEARCHES.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-white px-4 type-label text-ink transition-colors hover:border-ink"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <p className="type-small text-text-muted">
              Unabhängige Redaktion · Offene Methodik · Kostenlos für Sie
            </p>
          </div>

          <div className="relative flex min-h-80 flex-col justify-center gap-5 overflow-hidden rounded-xl bg-brand-500 p-6 sm:p-10">
            <BlockPattern seed="hero" cols={40} rows={36} className="absolute inset-0 -z-0 size-full" />
            {top && (
              <div className="relative ml-auto w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
                <p className="type-micro text-text-muted">Höchste Redaktionswertung</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="type-h4 text-ink">{top.name}</p>
                  <ScoreChip score={top.score} />
                </div>
                <p className="mt-1 type-small text-text-muted">{top.categoryLabel}</p>
                <TextLink href={top.href} className="mt-1 text-small">
                  Zur Bewertung
                </TextLink>
              </div>
            )}
            <div className="relative w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
              <p className="type-micro text-text-muted">Deutschland-Check</p>
              <p className="mt-2 type-label font-semibold text-ink">Server in Deutschland · AVV · GoBD</p>
              <p className="mt-1 type-small text-text-muted">Sechs Fragen, die wir jeder Software stellen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip, computed from content */}
      <section aria-label="Kennzahlen" className="border-y border-line bg-white">
        <p className="container-wide flex flex-wrap gap-x-6 gap-y-1 py-4 type-label text-text-muted">
          <span>
            <strong className="font-display text-ink tabular-nums">
              <CountUp value={stats.softwareCount} />
            </strong>{" "}
            Softwareprofile
          </span>
          <span>
            <strong className="font-display text-ink tabular-nums">
              <CountUp value={stats.categoryCount} />
            </strong>{" "}
            Kategorien
          </span>
          {stats.reviewCount > 0 && (
            <span>
              <strong className="font-display text-ink tabular-nums">
                <CountUp value={stats.reviewCount} />
              </strong>{" "}
              ausführliche Bewertungen
            </span>
          )}
          {stats.guideCount > 0 && (
            <span>
              <strong className="font-display text-ink tabular-nums">{formatNumber(stats.guideCount)}</strong>{" "}
              Ratgeber
            </span>
          )}
          {stats.lastUpdated && <span>Stand {formatMonthYear(stats.lastUpdated)}</span>}
        </p>
      </section>

      {tabs.length > 0 && (
        <section className="section-y">
          <div className="container-content">
            <PopularSoftware tabs={tabs} />
          </div>
        </section>
      )}

      {market.length > 0 && (
        <section aria-labelledby="markt-titel" className="bg-surface-tint section-y">
          <div className="container-wide flex flex-col gap-12">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
              <div className="flex flex-col items-start gap-5">
                <span className="inline-flex items-center rounded-full border border-line-strong px-3 py-1 type-small font-medium text-text-muted">
                  Marktdaten 2026
                </span>
                <h2
                  id="markt-titel"
                  className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-semibold tracking-tight text-ink"
                >
                  Der deutsche Softwaremarkt in Zahlen
                </h2>
              </div>
              <div className="flex flex-col items-start gap-4">
                <p className="type-lead text-text-muted">
                  Software wächst, Cloud ist Alltag, KI kommt in der Breite an. Und die Unternehmen wollen
                  ihre Daten in Deutschland wissen. Die wichtigsten Zahlen aus amtlicher Statistik und
                  Verbandsstudien, jede mit Quelle.
                </p>
                <TextLink href={`${routes.methodology()}#marktdaten`}>Wie wir Daten auswählen</TextLink>
              </div>
            </div>
            <MarketReport datasets={market} />
          </div>
        </section>
      )}

      {finder.products.length > 0 && (
        <section aria-labelledby="finder-titel" className="section-y">
          <div className="container-content grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start">
            <div className="flex flex-col gap-5">
              <p className="type-eyebrow text-text-muted">Softwarefinder</p>
              <h2 id="finder-titel" className="type-h2 text-ink">
                In drei Schritten zur passenden Software
              </h2>
              <p className="type-body text-text-muted">
                Drei Fragen, drei Vorschläge aus unseren Profilen, jeweils mit Begründung. Die Auswertung
                läuft in Ihrem Browser, Ihre Antworten werden nicht gespeichert.
              </p>
              <ol className="flex flex-col gap-3">
                {["Kategorie wählen", "Unternehmensgröße angeben", "Anforderungen festlegen"].map(
                  (step, i) => (
                    <li key={step} className="flex items-center gap-3 type-label text-ink">
                      <span className="flex size-8 flex-none items-center justify-center rounded-full border border-ink font-display font-semibold tabular-nums">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ),
                )}
              </ol>
            </div>
            <FinderBlock categories={finder.categories} products={finder.products} />
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-white section-y">
          <div className="container-content">
            <SectionHeading
              title="Alle Kategorien im Überblick"
              action={
                <ButtonLink href={routes.categories()} variant="outline">
                  Alle Kategorien
                </ButtonLink>
              }
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
              {categories.map((c) => (
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
          </div>
        </section>
      )}

      {software.length > 0 && (
        <section className="section-y text-white bg-ink-glow">
          <div className="container-wide">
            <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
              <div className="flex flex-col items-start gap-5">
                <span className="inline-flex items-center rounded-full border border-ink-700 px-3 py-1 type-small font-medium text-on-dark-muted">
                  Unsere Daten
                </span>
                <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-semibold tracking-tight">
                  Was {formatNumber(software.length)} Profile verraten
                </h2>
              </div>
              <p className="type-lead text-on-dark-muted">
                Ausgewertet aus allen Profilen, die wir bisher erfasst haben. Keine Hochrechnung, keine
                fremden Studien.
              </p>
            </div>
            <PortfolioReport
              stats={portfolio}
              categoryCount={stats.categoryCount}
              reviewCount={stats.reviewCount}
              medians={medians}
              updatedAt={stats.lastUpdated}
            />
            <p className="mt-10 type-small text-on-dark-muted">
              Basis: {formatNumber(software.length)} Softwareprofile, Preise netto
              {stats.lastUpdated && `, Stand ${formatMonthYear(stats.lastUpdated)}`}.
            </p>
          </div>
        </section>
      )}

      {comparisons.length > 0 && (
        <section className="section-y">
          <div className="container-content">
            <SectionHeading title="Beliebte Vergleiche" />
            <div className="grid gap-4 md:grid-cols-3">
              {comparisons.map((c) => (
                <ComparisonCard
                  key={c.slug}
                  a={{ name: software.find((s) => s.slug === c.a)?.name ?? c.a }}
                  b={{ name: software.find((s) => s.slug === c.b)?.name ?? c.b }}
                  teaser={c.description}
                  href={routes.comparison(c.a, c.b)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-content">
          <SectionHeading
            eyebrow="Der Deutschland-Check"
            title="Sechs Fragen, die wir jeder Software stellen, bevor wir sie empfehlen."
          />
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {CHECK_ITEMS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <Icon icon={item.icon} size={28} className="flex-none text-ink" />
                <div>
                  <h3 className="type-h4 text-ink">{item.title}</h3>
                  <p className="mt-1 type-body text-text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white section-y">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="type-eyebrow text-brand-ink">E-Rechnung</p>
            <h2 className="type-h2 text-ink">Was die E-Rechnung für Ihre Software bedeutet</h2>
            <p className="measure type-body-lg text-ink">
              Seit dem 1. Januar 2025 müssen Unternehmen in Deutschland E-Rechnungen empfangen können. Beim
              Ausstellen gelten Übergangsfristen: Wer im Vorjahr mehr als 800.000&nbsp;€ umgesetzt hat, darf
              andere Rechnungsformate wie PDF per E-Mail nur noch bis Ende 2026 nutzen. Für alle anderen endet
              die Übergangszeit mit Ablauf des Jahres 2027.
            </p>
            <p className="type-small text-text-muted">
              Quelle:{" "}
              <a
                href="https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html"
                className="link-inline"
                target="_blank"
                rel="noopener"
              >
                Fragen und Antworten des Bundesfinanzministeriums zur E-Rechnung
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
              , abgerufen am 19. Oktober 2026.
            </p>
          </div>
          {eInvoice.length > 0 && (
            <div className="rounded-lg border border-line bg-canvas p-6">
              <h3 className="type-h4 text-ink">XRechnung laut Anbieter unterstützt</h3>
              <ul className="mt-4 divide-y divide-line">
                {eInvoice.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={routes.software(s.slug)}
                      className="group flex min-h-12 items-center justify-between gap-3 type-label text-ink hover:text-brand-ink"
                    >
                      {s.name}
                      <Icon
                        icon={ArrowRight}
                        size={16}
                        className="text-text-muted transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section-y">
        <div className="container-content grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="flex flex-col gap-4">
            <h2 className="type-h2 text-ink">So bewerten wir</h2>
            <p className="measure type-body-lg text-ink">
              Jede Software erhält eine Redaktionswertung von 0 bis 5 aus sechs Kriterien. Die Gewichtung ist
              öffentlich und für alle Programme einer Kategorie gleich. Provisionen und bezahlte Platzierungen
              haben keinen Einfluss auf die Wertung.
            </p>
            <TextLink href={routes.methodology()}>Zur Methodik</TextLink>
          </div>
          <ChartFrame
            title="Gewichtung der Kriterien"
            takeaway={`Am stärksten zählt ${CRITERION_LABEL[heaviest]} mit ${formatPercent(DEFAULT_WEIGHTS[heaviest] * 100)}.`}
            summary={`Ringdiagramm der Gewichtung: ${weightsText}.`}
            footnote="Standardgewichtung, Kategorien können sie begründet anpassen."
            table={{
              columns: ["Kriterium", "Gewichtung"],
              rows: CRITERIA.map((c) => [CRITERION_LABEL[c], formatPercent(DEFAULT_WEIGHTS[c] * 100)]),
            }}
            height={260}
            className="rounded-lg border border-line bg-white p-6"
          >
            <WeightsDonut
              data={CRITERIA.map((c) => ({ label: CRITERION_LABEL[c], percent: DEFAULT_WEIGHTS[c] * 100 }))}
            />
          </ChartFrame>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-content">
          <div className="flex flex-col gap-6 rounded-xl p-8 text-white bg-ink-glow sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl flex-col gap-3">
              <p className="type-eyebrow text-brand-500">Kostenlose Softwareberatung</p>
              <h2 className="type-h2">Unsicher, welche Software passt?</h2>
              <p className="type-body text-on-dark-muted">
                Beschreiben Sie uns Ihre Anforderungen. Wir helfen Ihnen, die Auswahl einzugrenzen,
                unverbindlich und ohne Verkaufsdruck.
              </p>
            </div>
            <ButtonLink href={routes.advisory()} size="lg">
              Beratung anfordern
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
