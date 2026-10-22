import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/content/page-parts";
import { CompareCheckbox } from "@/components/software/compare";
import { ComparisonTable } from "@/components/software/comparison-table";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { LogoTile } from "@/components/ui/logo-tile";
import { getSoftware, listCategories, listSoftwareByCategory } from "@/lib/content";
import { comparisonGroups, comparisonProducts } from "@/lib/content/comparison";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Vergleichsrechner",
  description:
    "Bis zu vier Programme direkt vergleichen: Preise in Euro, Deutschland-Check, Schnittstellen und Redaktionswertung.",
  path: routes.compareTool(),
});

const MAX = 4;

async function Results({ searchParams }: { searchParams: PageProps<"/vergleich">["searchParams"] }) {
  const { produkte } = await searchParams;
  const slugs = (Array.isArray(produkte) ? produkte.join(",") : (produkte ?? ""))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX);
  const items = slugs.map((s) => getSoftware(s)).filter((s) => !!s);

  if (items.length < 2) {
    return (
      <EmptyState
        title="Wählen Sie mindestens zwei Programme"
        text="Setzen Sie unten bei bis zu vier Programmen den Haken „Vergleichen“ und starten Sie den Vergleich in der Leiste am unteren Rand."
      />
    );
  }
  return (
    <ComparisonTable
      caption={`Vergleich: ${items.map((s) => s.name).join(", ")}`}
      products={comparisonProducts(items)}
      groups={comparisonGroups(items)}
    />
  );
}

export default function CompareToolPage({ searchParams }: PageProps<"/vergleich">) {
  const categories = listCategories();
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Vergleichsrechner", href: routes.compareTool() },
        ]}
        title="Vergleichsrechner"
        lead="Vergleichen Sie bis zu vier Programme Seite an Seite. Die Werte stammen aus unseren Profilen, jeweils mit Stand der Preisprüfung."
      />
      <div className="container-content flex flex-col gap-14 pb-28">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
          <Results searchParams={searchParams} />
        </Suspense>

        {categories.map((c) => {
          const items = listSoftwareByCategory(c.slug);
          if (items.length === 0) return null;
          return (
            <section key={c.slug} aria-labelledby={`auswahl-${c.slug}`}>
              <h2 id={`auswahl-${c.slug}`} className="mb-4 type-h4 text-ink">
                {c.name}
              </h2>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3">
                {items.map((s) => (
                  <li
                    key={s.slug}
                    className="flex items-center gap-3 rounded-md border border-line bg-white p-3"
                  >
                    <LogoTile name={s.name} logo={s.logo} size={40} />
                    <span className="min-w-0 flex-1 type-label font-semibold text-ink">{s.name}</span>
                    <CompareCheckbox item={{ slug: s.slug, name: s.name, logo: s.logo }} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
