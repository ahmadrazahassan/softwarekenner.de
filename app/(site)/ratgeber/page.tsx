import type { Metadata } from "next";

import { PageHeader } from "@/components/content/page-parts";
import { AppLink } from "@/components/ui/app-link";
import { LogoTile } from "@/components/ui/logo-tile";
import { getSoftware, listGuides, listReviews } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ratgeber",
  description:
    "Ratgeber zu Software, E-Rechnung, Datenschutz und Arbeitsrecht für Unternehmen in Deutschland.",
  path: routes.guides(),
});

/** Reading time from word count, 200 words per minute. */
const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

export default function GuidesPage() {
  const guides = listGuides();
  const [featured, ...rest] = guides;
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Ratgeber", href: routes.guides() },
        ]}
        title="Ratgeber"
        lead="Hintergrund zu den Fragen, die bei der Softwareauswahl in Deutschland zählen: E-Rechnung, GoBD, Datenschutz und Mitbestimmung."
      />
      <div className="container-content pb-20">
        {!featured ? (
          <LatestReviews />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[featured, ...rest].map((g, i) => (
              <li key={g.slug} className={i === 0 ? "md:col-span-2 lg:col-span-3" : undefined}>
                <article className="card-lift relative flex h-full flex-col gap-3 rounded-lg border border-line bg-white p-6 shadow-sm">
                  <p className="type-eyebrow text-brand-ink">{g.topic}</p>
                  <h2 className={i === 0 ? "type-h2 text-ink" : "type-h4 text-ink"}>
                    <AppLink
                      href={routes.guide(g.slug)}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {g.title}
                    </AppLink>
                  </h2>
                  <p className="type-body text-text-muted">{g.description}</p>
                  <p className="mt-auto type-small text-text-muted">
                    {readingTime(g.content)} Min. Lesezeit · {formatDate(g.updatedAt)}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/** Newest long form reviews, shown while no guide is published yet. */
function LatestReviews() {
  const reviews = listReviews();
  return (
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
                  {readingTime(r.content)} Min. Lesezeit · {formatDate(r.updatedAt)}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
