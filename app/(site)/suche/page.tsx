import { ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/content/page-parts";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { getSiteChrome } from "@/lib/content";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { createSearcher, SEARCH_GROUPS } from "@/lib/search";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Suche",
  description: "Software, Kategorien, Vergleiche und Ratgeber durchsuchen.",
  path: routes.search(),
  noindex: true,
});

async function Results({ searchParams }: { searchParams: PageProps<"/suche">["searchParams"] }) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  if (!query) {
    return (
      <p className="type-body text-text-muted">
        Geben Sie einen Suchbegriff ein, zum Beispiel Buchhaltung oder DATEV.
      </p>
    );
  }
  const results = createSearcher(getSiteChrome().searchItems)(query, 50);
  if (results.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={`Keine Treffer für „${query}“`}
        text="Versuchen Sie einen allgemeineren Begriff oder stöbern Sie in den Kategorien."
        action={
          <ButtonLink href={routes.categories()} variant="outline">
            Alle Kategorien
          </ButtonLink>
        }
      />
    );
  }
  return (
    <div className="flex flex-col gap-10">
      <p className="type-label text-text-muted" aria-live="polite">
        {formatNumber(results.length)} Treffer für „{query}“
      </p>
      {SEARCH_GROUPS.map((group) => {
        const items = results.filter((r) => r.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} aria-labelledby={`gruppe-${group}`}>
            <h2 id={`gruppe-${group}`} className="mb-3 type-eyebrow text-text-muted">
              {group}
            </h2>
            <ul className="divide-y divide-line rounded-lg border border-line bg-white">
              {items.map((item) => (
                <li key={item.id}>
                  <AppLink
                    href={item.href}
                    className="group flex min-h-14 items-center gap-4 px-5 py-3 hover:bg-surface-tint"
                  >
                    <span className="flex flex-1 flex-col">
                      <span className="type-label font-semibold text-ink">{item.label}</span>
                      {item.hint && <span className="type-small text-text-muted">{item.hint}</span>}
                    </span>
                    <Icon
                      icon={ArrowRight}
                      size={16}
                      className="text-text-muted transition-transform group-hover:translate-x-0.5"
                    />
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps<"/suche">) {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Suche", href: routes.search() },
        ]}
        title="Suche"
      />
      <div className="container-content flex flex-col gap-10 pb-20">
        <form action={routes.search()} method="get" role="search" className="flex max-w-2xl gap-3">
          <label htmlFor="suche-q" className="sr-only">
            Suchbegriff
          </label>
          <input
            id="suche-q"
            name="q"
            type="search"
            placeholder="Software, Kategorie oder Anbieter suchen"
            className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-5 font-body text-body text-ink outline-none focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          />
          <button type="submit" className="btn btn-primary btn-no-icon">
            <span>Suchen</span>
          </button>
        </form>
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
