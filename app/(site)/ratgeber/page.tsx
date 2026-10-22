import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import {
  BandGraphic,
  EditorialList,
  NumberedPoints,
  PillHeading,
  SectionRule,
  SpecBar,
  sectionNumber,
} from "@/components/content/editorial";
import { buyingGuideLink, guideLink } from "@/components/content/guide-links";
import { PageHeader } from "@/components/content/page-parts";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LogoMark } from "@/components/layout/logo-mark";
import { AppLink } from "@/components/ui/app-link";
import { TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import {
  getAuthor,
  getCategory,
  getSoftware,
  getStats,
  listBuyingGuides,
  listGuides,
  listReviews,
} from "@/lib/content";
import { readingMinutes } from "@/lib/content/outline";
import { formatDate, formatMonthYear } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Ratgeber",
  description:
    "Ratgeber zu Software, E-Rechnung, Datenschutz und Arbeitsrecht für Unternehmen in Deutschland.",
  path: routes.guides(),
});

const crumbs = [
  { label: "Startseite", href: routes.home() },
  { label: "Ratgeber", href: routes.guides() },
];

/**
 * Ratgeber hub in the editorial system of Über uns: spec header, giant staggered headline, the lead
 * article on the brand band, then numbered lists of all articles and of the Kaufberatung per category.
 */
export default function GuidesPage() {
  const guides = listGuides();
  if (guides.length === 0) return <ReviewsFallback />;

  const featured = guides.find((g) => g.featured) ?? guides[0]!;
  const rest = guides.filter((g) => g.slug !== featured.slug);
  const buying = listBuyingGuides();
  const author = getAuthor(featured.author);
  const topics = [...new Set(guides.map((g) => g.topic))];
  const stats = getStats();
  const updated = guides
    .map((g) => g.updatedAt)
    .sort()
    .at(-1)!;
  // Section numbers follow the sections that render.
  const order = [
    featured.keyPoints.length > 0 && "fokus",
    rest.length > 0 && "alle",
    buying.length > 0 && "kaufberatung",
  ].filter(Boolean);
  const num = (key: string) => sectionNumber(order.indexOf(key) + 1);

  return (
    <div className="overflow-x-clip pb-24 lg:pb-32">
      {/* Spec header */}
      <header className="container-content pt-8">
        <Breadcrumbs items={crumbs} />
        <SpecBar
          className="mt-8"
          cells={[
            "Ratgeber · Wissen",
            `${guides.length} Ratgeber`,
            buying.length > 0 ? `${buying.length} Kaufberatungen` : "Unabhängige Redaktion",
            `Stand ${formatMonthYear(updated)}`,
          ]}
        />
        <div className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-5 border-b border-ink pt-2 pb-6 lg:grid-cols-12">
          <p className="font-display text-[1.375rem] leading-[1.02] font-medium tracking-[-0.01em] text-ink uppercase lg:col-span-3">
            Recht
            <br />
            Steuern
            <br />
            Auswahl
          </p>
          <span className="flex size-14 items-center justify-center rounded-full bg-ink lg:col-span-3 lg:size-16">
            <LogoMark size={24} />
          </span>
          <ul
            aria-label="Themen"
            className="col-span-2 flex flex-wrap gap-2 lg:col-span-6 lg:justify-end lg:self-center"
          >
            {topics.map((t) => (
              <li
                key={t}
                className="rounded-full border border-ink px-3.5 py-1.5 font-ui text-caption font-medium text-ink"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Headline */}
      <section aria-labelledby="ratgeber-titel" className="container-content pt-12 lg:pt-16">
        <div className="font-ui text-ink uppercase lg:grid lg:grid-cols-12">
          <div className="lg:col-span-4 lg:col-start-4">
            <p className="text-eyebrow leading-tight font-semibold tracking-[0.04em]">
              {siteConfig.brand.name}
              <br />
              Ratgeber für Unternehmen
            </p>
            <p className="mt-3 text-micro leading-tight tracking-[0.08em]">
              E-Rechnung, GoBD, Datenschutz
              <br />
              Arbeitsrecht und Auswahl
            </p>
          </div>
        </div>
        <h1
          id="ratgeber-titel"
          className="mt-8 font-display text-[clamp(2.25rem,7vw,6rem)] leading-[0.92] font-medium tracking-[-0.035em] text-ink uppercase lg:mt-10"
        >
          <span className="block lg:pl-[25%]">Wissen, das bei</span>
          <span className="block lg:pl-[25%]">der Softwarewahl</span>
          <span className="block lg:pl-[25%]">zählt.</span>
          <span className="block text-right">Ratgeber</span>
        </h1>
        <p className="mt-8 measure type-lead text-text-muted lg:ml-[25%]">
          Hintergrund zu den Fragen, die bei der Softwareauswahl in Deutschland zählen: Fristen, Pflichten und
          die Prüffragen, die Sie jedem Anbieter stellen sollten. Jeder Ratgeber nennt seine Quellen.
        </p>
      </section>

      {/* Lead article on the brand band */}
      <section aria-label="Im Fokus" className="container-content mt-12 lg:mt-16">
        <div className="relative h-36 overflow-hidden rounded-xl bg-brand-500 sm:h-48 lg:mr-[16.666%] lg:h-64 lg:rounded-full">
          <BandGraphic offset={760} />
        </div>
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <article className="relative z-10 mx-3 -mt-12 flex flex-col gap-4 self-start rounded-lg border border-line bg-white p-6 shadow-lg sm:-mt-16 sm:p-8 lg:col-span-6 lg:col-start-2 lg:mx-0 lg:-mt-24">
            <div className="flex items-center justify-between gap-4">
              <p className="font-ui text-micro tracking-[0.08em] text-brand-ink uppercase">
                Im Fokus · {featured.topic}
              </p>
              <LogoMark size={16} />
            </div>
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.1] font-semibold tracking-[-0.015em] text-ink">
              <AppLink
                href={routes.guide(featured.slug)}
                className="hover:underline hover:decoration-2 hover:underline-offset-4"
              >
                {featured.title}
              </AppLink>
            </h2>
            <p className="type-body text-text-muted">{featured.description}</p>
            <p className="type-small text-text-muted">
              {author && <>Von {author.name} · </>}
              {readingMinutes(featured.content)} Min. Lesezeit · {formatDate(featured.updatedAt)}
            </p>
            <TextLink href={routes.guide(featured.slug)} className="self-start">
              Ratgeber lesen
            </TextLink>
          </article>

          {featured.keyPoints.length > 0 && (
            <div className="lg:col-span-4 lg:col-start-9 lg:pt-10">
              <PillHeading as="h3" number={num("fokus")}>
                Kurz gefasst
              </PillHeading>
              <NumberedPoints className="mt-6" size="md" items={featured.keyPoints.slice(0, 3)} />
            </div>
          )}
        </div>
      </section>

      {/* All articles */}
      {rest.length > 0 && (
        <section aria-labelledby="ratgeber-alle" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Alle Ratgeber" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="flex flex-col gap-4 lg:col-span-3">
              <PillHeading id="ratgeber-alle" number={num("alle")}>
                Alle Ratgeber
              </PillHeading>
              <p className="type-small text-text-muted">
                Jeder Ratgeber nennt seine Quellen und das Datum der letzten Prüfung.
              </p>
            </div>
            <EditorialList className="lg:col-span-9" items={rest.map(guideLink)} start={2} />
          </div>
        </section>
      )}

      {/* Buying guides per category */}
      {buying.length > 0 && (
        <section aria-labelledby="ratgeber-kaufberatung" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Kaufberatung" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="flex flex-col gap-4 lg:col-span-3">
              <PillHeading id="ratgeber-kaufberatung" number={num("kaufberatung")}>
                Kaufberatung
              </PillHeading>
              <p className="type-small text-text-muted">
                Für jede Kategorie: worauf es beim Kauf ankommt, mit Checkliste. Sie finden die Kaufberatung
                jeweils auf der Kategorieseite unter der Bestenliste.
              </p>
            </div>
            <EditorialList
              className="lg:col-span-9"
              items={buying.map((b) => buyingGuideLink(b, getCategory(b.category)?.name ?? b.category))}
            />
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
              {[
                { href: routes.methodology(), label: "Methodik" },
                { href: routes.advisory(), label: "Kostenlose Beratung" },
                { href: "/ueber-uns", label: "Über uns" },
              ].map((l) => (
                <li key={l.href}>
                  <AppLink href={l.href} className="inline-flex min-h-7 items-center hover:underline">
                    {l.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}

/** Newest long form reviews, shown while no guide is published yet. */
function ReviewsFallback() {
  const reviews = listReviews();
  return (
    <>
      <PageHeader
        crumbs={crumbs}
        title="Ratgeber"
        lead="Hintergrund zu den Fragen, die bei der Softwareauswahl in Deutschland zählen: E-Rechnung, GoBD, Datenschutz und Mitbestimmung."
      />
      <div className="container-content pb-20">
        <section aria-labelledby="bewertungen-titel" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="bewertungen-titel" className="type-h2 text-ink">
              Neueste Softwarebewertungen der Redaktion
            </h2>
            <p className="measure type-body text-text-muted">
              {reviews.length} ausführliche Bewertungen mit Preisen, Funktionen, Datenschutz und E-Rechnung,
              jeweils mit Quellen.
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => {
              const software = getSoftware(r.softwareSlug)!;
              return (
                <li key={r.softwareSlug}>
                  <article className="card-lift relative flex h-full flex-col gap-3 rounded-lg border border-line bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <LogoTile name={software.name} logo={software.logo} size={40} />
                      <p className="type-eyebrow text-brand-ink">{software.name}</p>
                    </div>
                    <h3 className="type-h4 text-ink">
                      <AppLink
                        href={routes.software(software.slug)}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {r.title}
                      </AppLink>
                    </h3>
                    <p className="type-body text-text-muted">{r.description}</p>
                    <p className="mt-auto type-small text-text-muted">
                      {readingMinutes(r.content)} Min. Lesezeit · {formatDate(r.updatedAt)}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
