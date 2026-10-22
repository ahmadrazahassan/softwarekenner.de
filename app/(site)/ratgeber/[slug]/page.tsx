import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  EditorialList,
  NumberedPoints,
  PillHeading,
  SectionRule,
  SourceList,
  SpecBar,
  sectionNumber,
} from "@/components/content/editorial";
import { guideLink } from "@/components/content/guide-links";
import { Mdx } from "@/components/content/mdx";
import { DraftNotice, JsonLd } from "@/components/content/page-parts";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { TableOfContents } from "@/components/layout/page-nav";
import { SoftwareCard } from "@/components/software/cards";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getAuthor, getCategory, getGuide, guideSoftware, listGuides, relatedGuides } from "@/lib/content";
import { outlineOf, readingMinutes } from "@/lib/content/outline";
import { formatDate, initials } from "@/lib/format";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { articleJsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listGuides().map((g) => g.slug),
  );
}

export async function generateMetadata({ params }: PageProps<"/ratgeber/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.title, description: guide.description, path: routes.guide(guide.slug) });
}

/**
 * Ratgeber article (Section 13.6) in the editorial system of Über uns: spec bar, large headline,
 * numbered key points, a reading column with a sticky table of contents, the programs discussed,
 * sources, author and related articles.
 */
export default async function GuidePage({ params }: PageProps<"/ratgeber/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const author = getAuthor(guide.author);
  const reviewer = getAuthor(guide.reviewer);
  const outline = outlineOf(guide.content);
  const software = guideSoftware(guide.software);
  const categories = guide.categories.flatMap((c) => getCategory(c) ?? []);
  const related = relatedGuides(guide.slug);
  const minutes = readingMinutes(guide.content);

  // Section numbers follow the sections that render.
  const order = [
    guide.keyPoints.length > 0 && "kurz",
    "text",
    software.length > 0 && "programme",
    "quellen",
    author && "autor",
    related.length > 0 && "weiterlesen",
  ].filter(Boolean);
  const num = (key: string) => sectionNumber(order.indexOf(key) + 1);

  return (
    <article className="overflow-x-clip pb-24 lg:pb-32">
      <DraftNotice status={guide.status} what="Dieser Ratgeber" />
      <JsonLd
        data={articleJsonLd({
          title: guide.title,
          description: guide.description,
          path: routes.guide(guide.slug),
          authorName: author?.name,
          authorPath: author ? routes.author(author.slug) : undefined,
          publishedAt: guide.publishedAt,
          updatedAt: guide.updatedAt,
        })}
      />

      {/* Header */}
      <header className="container-content pt-8">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: routes.home() },
            { label: "Ratgeber", href: routes.guides() },
            { label: guide.title, href: routes.guide(guide.slug) },
          ]}
        />
        <SpecBar
          className="mt-8"
          cells={[
            `Ratgeber · ${guide.topic}`,
            `${minutes} Min. Lesezeit`,
            author ? `Von ${author.name}` : "Redaktion",
            `Stand ${formatDate(guide.updatedAt)}`,
          ]}
        />
        <div className="grid gap-x-8 gap-y-6 pt-10 lg:grid-cols-12 lg:pt-14">
          <p className="font-ui text-micro leading-tight tracking-[0.08em] text-ink uppercase lg:col-span-3 lg:pt-3">
            {guide.topic}
            <br />
            Ratgeber
          </p>
          <div className="flex flex-col gap-6 lg:col-span-9">
            <h1 className="font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.02] font-medium tracking-[-0.03em] text-ink">
              {guide.title}
            </h1>
            <p className="measure type-lead text-text-muted">{guide.description}</p>
            <p className="type-small text-text-muted">
              {author && (
                <>
                  Von{" "}
                  <AppLink
                    href={routes.author(author.slug)}
                    className="font-semibold text-ink hover:underline"
                  >
                    {author.name}
                  </AppLink>{" "}
                  ·{" "}
                </>
              )}
              {reviewer && <>Fachlich geprüft von {reviewer.name} · </>}
              Zuletzt aktualisiert am {formatDate(guide.updatedAt)}
            </p>
            {categories.length > 0 && (
              <ul aria-label="Passende Kategorien" className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <AppLink
                      href={routes.category(c.slug)}
                      className="inline-flex min-h-10 items-center rounded-full border border-ink px-4 font-ui text-caption font-medium text-ink transition-colors hover:bg-ink hover:text-white"
                    >
                      {c.name}
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Key points */}
      {guide.keyPoints.length > 0 && (
        <section aria-labelledby="kurz-gefasst" className="container-content mt-16 lg:mt-24">
          <SectionRule label="Das Wichtigste in Kürze" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <PillHeading id="kurz-gefasst" number={num("kurz")}>
                Kurz gefasst
              </PillHeading>
            </div>
            <NumberedPoints className="lg:col-span-9" items={guide.keyPoints} />
          </div>
        </section>
      )}

      {/* Body with table of contents */}
      <section aria-labelledby="ratgeber-text" className="container-content mt-16 lg:mt-24">
        <SectionRule label="Ratgeber" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex flex-col gap-8 lg:col-span-3">
            <PillHeading id="ratgeber-text" number={num("text")}>
              Im Detail
            </PillHeading>
            {outline.length > 1 && (
              <TableOfContents items={outline} title="In diesem Ratgeber" className="max-lg:hidden" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-10 lg:col-span-9">
            {guide.hero && (
              <Image
                src={guide.hero.src}
                alt={guide.hero.alt}
                width={1440}
                height={810}
                className="rounded-xl"
                priority
                sizes="(min-width: 1024px) 860px, 100vw"
              />
            )}
            <Mdx code={guide.mdx} />
          </div>
        </div>
      </section>

      {/* Programs discussed */}
      {software.length > 0 && (
        <section aria-labelledby="ratgeber-programme" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Programme zum Thema" />
          <div className="mt-8 flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <PillHeading id="ratgeber-programme" number={num("programme")}>
                Programme zum Thema
              </PillHeading>
              {categories[0] && (
                <TextLink href={routes.category(categories[0].slug)}>
                  Zur Kategorie {categories[0].shortName}
                </TextLink>
              )}
            </div>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
              {software.map((s) => (
                <li key={s.slug}>
                  <SoftwareCard software={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Sources */}
      <section aria-labelledby="quellen" className="container-content mt-24 lg:mt-32">
        <SectionRule label="Quellen" />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex flex-col gap-4 lg:col-span-3">
            <PillHeading id="quellen" number={num("quellen")}>
              Quellen
            </PillHeading>
            <p className="type-small text-text-muted">
              Jede Angabe in diesem Ratgeber stützt sich auf diese Quellen. Maßgeblich bleiben Gesetz und
              aktuelle Verwaltungsanweisungen.
            </p>
          </div>
          <SourceList className="lg:col-span-9" sources={guide.sources} formatDate={formatDate} />
        </div>
      </section>

      {/* Author */}
      {author && (
        <section aria-labelledby="autor" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Redaktion" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <PillHeading id="autor" number={num("autor")}>
                Wer schreibt
              </PillHeading>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start lg:col-span-9">
              <span
                aria-hidden="true"
                className="flex size-20 flex-none items-center justify-center rounded-full bg-ink font-display text-[1.75rem] font-medium tracking-[-0.03em] text-brand-500"
              >
                {initials(author.name)}
              </span>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-display text-h3 leading-tight font-semibold text-ink uppercase">
                    {author.name}
                  </p>
                  <p className="mt-1 font-ui text-label text-text-muted">{author.role}</p>
                </div>
                <p className="measure type-body text-ink">{author.bio}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <TextLink href={routes.author(author.slug)}>Zum Autorenprofil</TextLink>
                  <TextLink href={routes.methodology()}>So arbeiten wir</TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="weiterlesen" className="container-content mt-24 lg:mt-32">
          <SectionRule label="Weiterlesen" />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-3">
              <PillHeading id="weiterlesen" number={num("weiterlesen")}>
                Weiterlesen
              </PillHeading>
            </div>
            <EditorialList className="lg:col-span-9" items={related.map(guideLink)} />
          </div>
        </section>
      )}

      {/* Closing */}
      <section aria-label="Weiter" className="container-content mt-28 lg:mt-40">
        <div className="flex flex-col gap-8 border-t border-ink pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-14">
          <AppLink
            href={routes.guides()}
            className="group flex items-end gap-4 font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-medium tracking-[-0.04em] text-ink uppercase focus-visible:outline-offset-8"
          >
            <span>
              <span className="block">Alle</span>
              <span className="block">Ratgeber</span>
            </span>
            <Icon
              icon={ArrowRight}
              size={28}
              className="mb-[0.12em] size-[0.45em] flex-none transition-transform duration-200 ease-soft group-hover:-rotate-45"
            />
          </AppLink>
          <div className="flex max-w-sm flex-col gap-4 lg:pb-3">
            <p className="type-body text-text-muted">
              Sie möchten die Auswahl nicht allein treffen? Wir helfen kostenlos und unverbindlich beim
              Eingrenzen.
            </p>
            <ButtonLink href={routes.advisory()} className="self-start">
              Beratung anfordern
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
