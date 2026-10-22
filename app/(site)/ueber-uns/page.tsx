import { ArrowRight, History } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LogoMark } from "@/components/layout/logo-mark";
import { CountUp } from "@/components/ui/animated";
import { AppLink } from "@/components/ui/app-link";
import { TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { getPortfolioStats, getStats, listAuthors, listSoftware } from "@/lib/content";
import { formatMonthYear, formatRating, initials } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Über uns",
  description: `Warum es ${siteConfig.brand.name} gibt und wie wir Unternehmen bei der Softwareauswahl helfen.`,
  path: "/ueber-uns",
});

/** How we work. The same rules as on /redaktion, each one checkable on the site. */
const PRINCIPLES = [
  {
    title: "Jede Angabe hat eine Quelle",
    text: "Preise, Funktionen und Angaben zum Datenschutz stammen von den Seiten der Anbieter. Jede Quelle steht mit Abrufdatum im Profil.",
  },
  {
    title: "Jedes Programm hat Schwächen",
    text: "Wir nennen sie konkret, auch bei Programmen mit hoher Wertung. Keine Software passt zu jedem Unternehmen.",
  },
  {
    title: "Test heißt Test",
    text: "Von einem Test sprechen wir nur, wenn wir die Software selbst genutzt haben. Sonst steht im Titel „im Überblick“.",
  },
  {
    title: "Provisionen ohne Einfluss",
    text: "Über mit * gekennzeichnete Links erhalten wir unter Umständen eine Provision. Wertung und Reihenfolge bleiben davon unberührt.",
  },
  {
    title: "Nichts ist erfunden",
    text: "Keine ausgedachten Bewertungen, Zitate oder Zahlen. Nutzerbewertungen zeigen wir erst, wenn sie echt und geprüft sind.",
  },
] as const;

/** Section heading in the reference style: an outlined number pill and an ink label pill. */
function PillHeading({ id, number, children }: { id: string; number: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-1.5">
      <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-full border border-ink px-3 font-ui text-caption font-semibold text-ink tabular-nums">
        {number}
      </span>
      <span className="inline-flex h-8 items-center rounded-full bg-ink px-5 font-ui text-caption font-semibold tracking-[0.08em] text-white uppercase">
        {children}
      </span>
    </h2>
  );
}

/** Thin ink rule with a micro label on the left, as in an editorial spec sheet. */
function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-ink pt-2.5 font-ui text-micro tracking-[0.08em] text-ink uppercase">
      <span>{label}</span>
      <span aria-hidden="true">{siteConfig.brand.name}</span>
    </div>
  );
}

/**
 * The logo mark as a tonal super graphic in the brand band (Section 5.8). Drawn on the 22 unit grid
 * of LogoMark, bottom aligned and cropped by the band.
 */
function BandGraphic() {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <g transform="translate(330 4) scale(14)">
        <rect x="0" y="14" width="8" height="8" fill="var(--color-brand-200)" />
        <rect x="7" y="7" width="8" height="15" fill="var(--color-brand-200)" />
        <rect x="14" y="0" width="8" height="22" fill="var(--color-brand-700)" />
      </g>
    </svg>
  );
}

/**
 * Über uns in the editorial style of the owner's reference (a product case study sheet): spec header,
 * a giant staggered headline, a brand band with floating data cards, numbered pill sections and a
 * giant closing link. Every figure is computed from our content.
 */
export default function AboutPage() {
  const brand = siteConfig.brand.name;
  const stats = getStats();
  const portfolio = getPortfolioStats();
  const sourceCount = listSoftware().reduce((sum, s) => sum + s.editorial.sources.length, 0);
  const founder = listAuthors().find((a) => a.realPerson);
  const best = portfolio.top[0];
  const updated = stats.lastUpdated ? formatMonthYear(stats.lastUpdated) : null;
  const crumbs = [
    { label: "Startseite", href: routes.home() },
    { label: "Über uns", href: "/ueber-uns" },
  ];
  const figures = [
    { value: stats.softwareCount, label: "Softwareprofile" },
    { value: stats.categoryCount, label: "Kategorien" },
    { value: portfolio.vendors, label: "Anbieter" },
    { value: sourceCount, label: "Quellen mit Abrufdatum" },
  ].filter((f) => f.value > 0);

  return (
    <div className="overflow-x-clip pb-24 lg:pb-32">
      {/* Spec header */}
      <header className="container-content pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 border-y border-ink">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 py-2.5 font-ui text-micro tracking-[0.08em] text-ink uppercase lg:grid-cols-12">
            <span className="lg:col-span-3">Über uns · 01</span>
            <span className="text-right lg:col-span-3 lg:text-left">Marke</span>
            <span className="lg:col-span-4">Unabhängige Redaktion</span>
            {updated && <span className="text-right lg:col-span-2">Stand {updated}</span>}
          </div>
          <div className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-5 pt-2 pb-6 lg:grid-cols-12">
            <p className="font-display text-[1.375rem] leading-[1.02] font-medium tracking-[-0.01em] text-ink uppercase lg:col-span-3">
              Bewertung
              <br />
              Vergleich
              <br />
              Beratung
            </p>
            <span className="flex size-14 items-center justify-center rounded-full bg-ink lg:col-span-3 lg:size-16">
              <LogoMark size={24} />
            </span>
            <p className="col-span-2 font-display text-[1.125rem] leading-[1.1] font-medium text-ink uppercase lg:col-span-4">
              {brand}
              <br />
              Frankfurt am Main
            </p>
          </div>
        </div>
      </header>

      {/* Headline */}
      <section aria-labelledby="ueber-uns-titel" className="container-content pt-12 lg:pt-16">
        <div className="font-ui text-ink uppercase lg:grid lg:grid-cols-12">
          <div className="lg:col-span-4 lg:col-start-4">
            <p className="text-eyebrow leading-tight font-semibold tracking-[0.04em]">
              {brand}
              <br />
              für Unternehmen in Deutschland
            </p>
            <p className="mt-3 text-micro leading-tight tracking-[0.08em]">
              Über uns
              <br />
              {siteConfig.brand.copyrightYear}
            </p>
          </div>
        </div>
        <h1
          id="ueber-uns-titel"
          className="mt-8 font-display text-[clamp(2.25rem,7vw,6rem)] leading-[0.92] font-medium tracking-[-0.035em] text-ink uppercase lg:mt-10"
        >
          <span className="block lg:pl-[25%]">Unabhängig</span>
          <span className="block lg:pl-[25%]">bewertet. Ehrlich</span>
          <span className="block lg:pl-[25%]">verglichen.</span>
          <span className="block text-right">{brand}</span>
        </h1>
      </section>

      {/* Brand band with floating data cards */}
      <section aria-labelledby="ueber-uns-01" className="container-content mt-10 lg:mt-14">
        <div className="relative h-44 overflow-hidden rounded-xl bg-brand-500 sm:h-56 lg:ml-[16.666%] lg:h-72 lg:rounded-full">
          <BandGraphic />
          {portfolio.top.length >= 4 && (
            <ul className="absolute top-4 right-4 grid grid-cols-2 gap-2 sm:top-1/2 sm:right-6 sm:-translate-y-1/2 lg:right-[7%] lg:gap-2.5">
              {portfolio.top.slice(0, 4).map((p) => (
                <li key={p.slug}>
                  <AppLink
                    href={routes.software(p.slug)}
                    aria-label={`${p.name}, Profil ansehen`}
                    className="block rounded-full transition-transform duration-200 ease-soft hover:-translate-y-0.5 focus-visible:outline-offset-2"
                  >
                    <LogoTile
                      name={p.name}
                      logo={p.logo}
                      size={48}
                      className="size-10 rounded-full border-0 shadow-md sm:size-12"
                    />
                  </AppLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="relative z-10 -mt-14 grid grid-cols-2 gap-3 px-3 sm:-mt-16 sm:flex sm:gap-4 lg:col-span-3 lg:col-start-3 lg:-mt-20 lg:flex-col lg:gap-5 lg:px-0">
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-lg sm:w-56">
              <div className="flex items-center justify-between">
                <LogoMark size={16} />
                <span className="font-ui text-micro tracking-[0.08em] text-text-subtle uppercase">
                  Profile
                </span>
              </div>
              <p className="font-display text-[1.125rem] leading-[1.15] font-medium tracking-[-0.02em] text-ink tabular-nums sm:text-[1.625rem] sm:leading-[1.12]">
                {stats.softwareCount} Profile
                <br />
                {stats.categoryCount} Kategorien
                <br />
                {sourceCount} Quellen
              </p>
              {updated && (
                <p className="flex items-center gap-1.5 font-ui text-caption text-text-muted">
                  <Icon icon={History} size={14} className="flex-none" />
                  Stand {updated}
                </p>
              )}
            </div>
            {best && (
              <AppLink
                href={routes.software(best.slug)}
                className="group flex flex-col gap-3 rounded-lg border border-line bg-white p-4 shadow-lg transition-shadow duration-200 ease-soft hover:shadow-md sm:w-56"
              >
                <div className="flex items-center justify-between">
                  <LogoMark size={16} />
                  <Icon
                    icon={ArrowRight}
                    size={16}
                    className="text-ink transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
                  />
                </div>
                <div>
                  <p className="font-ui text-micro tracking-[0.08em] text-text-subtle uppercase">
                    Bestbewertet
                  </p>
                  <p className="mt-1 font-display text-[1.125rem] leading-tight font-semibold text-ink sm:text-[1.25rem]">
                    {best.name}
                  </p>
                </div>
                <div>
                  <span aria-hidden="true" className="block h-1.5 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full rounded-full bg-brand-500"
                      style={{ width: `${(best.score / 5) * 100}%` }}
                    />
                  </span>
                  <p className="mt-2 font-ui text-caption text-text-muted tabular-nums">
                    {formatRating(best.score)} von 5
                  </p>
                </div>
              </AppLink>
            )}
          </div>

          <div className="lg:col-span-5 lg:col-start-7 lg:pt-10">
            <PillHeading id="ueber-uns-01" number="01">
              Über uns
            </PillHeading>
            <p className="mt-5 font-display text-[1.25rem] leading-[1.18] font-medium tracking-[-0.01em] text-ink uppercase lg:text-[1.375rem]">
              {brand} hilft Unternehmen in Deutschland, die passende Software zu finden. Mit einer offenen
              Methodik, Preisen in Euro und einem genauen Blick auf Datenschutz, GoBD und E-Rechnung.
            </p>
            <p className="mt-5 measure type-body text-text-muted">
              Wir bewerten Programme für Buchhaltung, Personal, Zeiterfassung, ERP und weitere Bereiche. Jede
              Bewertung nennt, für wen ein Programm passt, was es kostet und wo seine Grenzen liegen.
            </p>
          </div>
        </div>
      </section>

      {/* 02 Principles */}
      <section aria-labelledby="ueber-uns-02" className="container-content mt-24 lg:mt-32">
        <SectionRule label="Grundsätze" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-3">
            <PillHeading id="ueber-uns-02" number="02">
              So arbeiten wir
            </PillHeading>
          </div>
          <ol className="border-t border-ink lg:col-span-9">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                className="grid grid-cols-[2.75rem_1fr] gap-x-4 gap-y-2 border-b border-ink py-6 sm:grid-cols-[4rem_1fr] lg:grid-cols-9 lg:gap-x-8 lg:py-7"
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 font-display text-h3 leading-none font-medium text-ink tabular-nums lg:col-span-1 lg:row-span-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-[1.25rem] leading-tight font-semibold text-ink uppercase lg:col-span-4">
                  {p.title}
                </h3>
                <p className="type-body text-text-muted lg:col-span-4">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 Figures */}
      {figures.length > 0 && (
        <section aria-labelledby="ueber-uns-03" className="container-content mt-24 lg:mt-32">
          <SectionRule label="In Zahlen" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <PillHeading id="ueber-uns-03" number="03">
                In Zahlen
              </PillHeading>
            </div>
            <div className="lg:col-span-9">
              <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-4">
                {figures.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col-reverse justify-end gap-3 border-b border-ink py-6 pr-4 sm:border-r sm:border-b-0 sm:pl-5 sm:first:pl-0 sm:last:border-r-0"
                  >
                    <dt className="font-ui text-micro tracking-[0.08em] text-ink uppercase">{f.label}</dt>
                    <dd className="font-display text-[clamp(2.75rem,5.5vw,4.5rem)] leading-none font-medium tracking-[-0.04em] text-ink tabular-nums">
                      <CountUp value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 type-small text-text-muted">
                Berechnet aus unseren veröffentlichten Profilen{updated && `, Stand ${updated}`}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 04 Founder */}
      {founder && (
        <section aria-labelledby="ueber-uns-04" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Redaktion" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <PillHeading id="ueber-uns-04" number="04">
                Wer dahintersteht
              </PillHeading>
            </div>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start lg:col-span-9">
              <span
                aria-hidden="true"
                className="flex size-28 flex-none items-center justify-center rounded-full bg-ink font-display text-[2.5rem] font-medium tracking-[-0.03em] text-brand-500 lg:size-36 lg:text-[3rem]"
              >
                {initials(founder.name)}
              </span>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-h3 leading-tight font-semibold text-ink uppercase">
                    {founder.name}
                  </h3>
                  <p className="mt-1 font-ui text-label text-text-muted">{founder.role}</p>
                </div>
                <p className="measure type-body-lg text-ink">{founder.bio}</p>
                {founder.expertise.length > 0 && (
                  <ul aria-label="Schwerpunkte" className="flex flex-wrap gap-2">
                    {founder.expertise.map((e) => (
                      <li
                        key={e}
                        className="rounded-full border border-ink px-3.5 py-1.5 font-ui text-caption font-medium text-ink"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <TextLink href={routes.author(founder.slug)}>Zum Autorenprofil</TextLink>
                  <TextLink href={routes.legal.transparency()}>Wie wir uns finanzieren</TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Closing link */}
      <section aria-label="Weiter" className="container-content mt-28 lg:mt-40">
        <div className="flex flex-col gap-10 border-t border-ink pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-14">
          <AppLink
            href={routes.softwareIndex()}
            className="group flex items-end gap-4 font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink uppercase focus-visible:outline-offset-8"
          >
            <span>
              <span className="block">Alle {stats.softwareCount}</span>
              <span className="block">Programme</span>
            </span>
            <Icon
              icon={ArrowRight}
              size={28}
              className="mb-[0.12em] size-[0.45em] flex-none transition-transform duration-200 ease-soft group-hover:-rotate-45"
            />
          </AppLink>
          <nav aria-label="Weiterlesen" className="font-ui text-ink lg:pb-3">
            <p className="text-small font-semibold">Weiterlesen</p>
            <ul className="mt-1.5 flex flex-col text-micro tracking-[0.08em] uppercase">
              <li>
                <AppLink
                  href={routes.methodology()}
                  className="inline-flex min-h-7 items-center hover:underline"
                >
                  Methodik
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={routes.editorialTeam()}
                  className="inline-flex min-h-7 items-center hover:underline"
                >
                  Redaktion
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={routes.legal.transparency()}
                  className="inline-flex min-h-7 items-center hover:underline"
                >
                  Transparenz
                </AppLink>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}
