import type { Metadata } from "next";

import { GuideCard } from "@/components/content/guide-card";
import { PageHeader } from "@/components/content/page-parts";
import { CategoryTile } from "@/components/software/cards";
import { listCategories, listDownloads, listSoftwareByCategory } from "@/lib/content";
import { CATEGORY_ICONS } from "@/lib/content/icons";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software-Leitfäden zum Download",
  description:
    "Kompakte Leitfäden als PDF: Funktionen, Preise, Stärken und Schwächen der wichtigsten Anbieter je Kategorie.",
  path: routes.downloads(),
});

export default function DownloadsPage() {
  const downloads = listDownloads();
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Leitfäden", href: routes.downloads() },
        ]}
        title="Software-Leitfäden zum Download"
        lead="Kompaktes Wissen für Ihre Entscheidung: Funktionen, Preise, Stärken und Schwächen der wichtigsten Anbieter je Kategorie, als PDF zum Mitnehmen."
      />
      <div className="container-content pb-20">
        {downloads.length === 0 ? (
          <CategoryOverviews />
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-6">
            {downloads.map((d) => (
              <li key={d.slug}>
                <GuideCard
                  title={d.title}
                  stickers={d.stickers}
                  slug={d.slug}
                  pages={d.pages}
                  href={routes.download(d.slug)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/** Category rankings as the compact overview, shown while no PDF guide is published yet. */
function CategoryOverviews() {
  const categories = listCategories();
  return (
    <section aria-labelledby="bestenlisten-titel" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="bestenlisten-titel" className="type-h2 text-ink">
          Bestenlisten nach Kategorie
        </h2>
        <p className="measure type-body text-text-muted">
          Jede Kategorie fasst die bewerteten Programme mit Preisen, Redaktionswertung und Deutschland-Check
          zusammen.
        </p>
      </div>
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
    </section>
  );
}
