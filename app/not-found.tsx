import { Search } from "lucide-react";
import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { listCategories } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false, follow: true } };

export default function NotFound() {
  const categories = listCategories().slice(0, 6);
  return (
    <SiteShell>
      <div className="container-content flex flex-col gap-10 py-16 lg:py-24">
        <div className="flex flex-col gap-4">
          <p className="type-eyebrow text-brand-ink">Fehler 404</p>
          <h1 className="type-h1 text-ink">Diese Seite gibt es nicht.</h1>
          <p className="measure type-lead text-text-muted">
            Vielleicht wurde sie verschoben, oder die Adresse enthält einen Tippfehler. Suchen Sie nach der
            Software oder stöbern Sie in den Kategorien.
          </p>
        </div>
        <form action={routes.search()} method="get" role="search" className="flex max-w-xl gap-3">
          <label htmlFor="nf-suche" className="sr-only">
            Suchbegriff
          </label>
          <input
            id="nf-suche"
            name="q"
            type="search"
            placeholder="Software, Kategorie oder Anbieter suchen"
            className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-5 font-body text-body text-ink outline-none focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          />
          <button type="submit" className="btn btn-primary btn-no-icon">
            <span>Suchen</span>
          </button>
        </form>
        {categories.length > 0 ? (
          <nav aria-label="Kategorien">
            <h2 className="type-h4 text-ink">Kategorien</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <AppLink
                    href={routes.category(c.slug)}
                    className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white px-4 type-label text-ink hover:border-ink"
                  >
                    {c.shortName}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <EmptyState
            icon={Search}
            title="Zurück zur Startseite"
            action={<ButtonLink href={routes.home()}>Zur Startseite</ButtonLink>}
          />
        )}
      </div>
    </SiteShell>
  );
}
