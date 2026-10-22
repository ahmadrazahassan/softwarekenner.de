import type { Metadata } from "next";

import { PageHeader } from "@/components/content/page-parts";
import { CategoryTile } from "@/components/software/cards";
import { EmptyState } from "@/components/ui/feedback";
import { listCategories, listSoftwareByCategory } from "@/lib/content";
import { CATEGORY_ICONS } from "@/lib/content/icons";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Alle Kategorien",
  description:
    "Alle Softwarekategorien im Überblick: Buchhaltung, Zeiterfassung, HR-Software und mehr, mit Preisen in Euro und Deutschland-Check.",
  path: routes.categories(),
});

export default function CategoriesPage() {
  const categories = listCategories();
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Kategorien", href: routes.categories() },
        ]}
        title="Alle Kategorien"
        lead="Wählen Sie den Bereich, für den Sie Software suchen. In jeder Kategorie bewerten wir die Programme nach denselben sechs Kriterien."
      />
      <div className="container-content pb-20">
        {categories.length === 0 ? (
          <EmptyState
            title="Noch keine Kategorien veröffentlicht"
            text="Die ersten Kategorien erscheinen hier, sobald die Bewertungen geprüft sind."
          />
        ) : (
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
        )}
      </div>
    </>
  );
}
