import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DraftNotice, JsonLd, PageHeader } from "@/components/content/page-parts";
import { RankedListItem, SectionHeading } from "@/components/software/cards";
import { ComparisonTable } from "@/components/software/comparison-table";
import {
  getAlternatives,
  getCategory,
  getSoftware,
  listSoftware,
  rankedDetailsOf,
  summaryOf,
} from "@/lib/content";
import { comparisonGroups, comparisonProducts } from "@/lib/content/comparison";
import { routes } from "@/lib/routes";
import { staticParams } from "@/lib/static-params";
import { itemListJsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticParams(
    "slug",
    listSoftware().map((s) => s.slug),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/software/[slug]/alternativen">): Promise<Metadata> {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) return {};
  return pageMetadata({
    title: `${software.name} Alternativen ${software.editorial.updatedAt.slice(0, 4)}: Programme im Vergleich`,
    description: `Alternativen zu ${software.name} im Vergleich: Preise in Euro, Deutschland-Check und Redaktionswertung.`,
    path: routes.softwareAlternatives(software.slug),
  });
}

export default async function AlternativesPage({ params }: PageProps<"/software/[slug]/alternativen">) {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) notFound();
  const category = getCategory(software.primaryCategory);
  const alternatives = getAlternatives(software.slug);
  const table = [software, ...alternatives].slice(0, 5);

  return (
    <>
      <DraftNotice status={software.status} what="Dieses Profil" />
      <JsonLd
        data={itemListJsonLd(
          `Alternativen zu ${software.name}`,
          alternatives.map((a) => ({ name: a.name, path: routes.software(a.slug) })),
        )}
      />
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          ...(category ? [{ label: category.shortName, href: routes.category(category.slug) }] : []),
          { label: software.name, href: routes.software(software.slug) },
          { label: "Alternativen", href: routes.softwareAlternatives(software.slug) },
        ]}
        title={`Die besten Alternativen zu ${software.name}`}
        lead={`Diese Programme erfüllen ähnliche Aufgaben wie ${software.name}. Die Reihenfolge folgt unserer redaktionellen Auswahl, jedes Programm mit seiner eigenen Kurzbewertung.`}
      />
      <div className="container-content flex flex-col gap-14 pb-20">
        <section aria-labelledby="warum">
          <h2 id="warum" className="type-h3 text-ink">
            Wann sich ein Blick auf Alternativen lohnt
          </h2>
          <p className="mt-3 measure type-body text-ink">
            Die Schwächen, die wir bei {software.name} sehen: {software.editorial.cons.join("; ")}. Weniger
            geeignet ist das Programm für {software.editorial.notFor.join(" und ")}.
          </p>
        </section>
        <ol className="flex flex-col gap-6">
          {alternatives.map((a, i) => (
            <li key={a.slug}>
              <RankedListItem
                rank={i + 1}
                software={summaryOf(a, {
                  categorySlug: software.primaryCategory,
                  from: "alternativen",
                  position: i + 1,
                })}
                details={rankedDetailsOf(a)}
              />
            </li>
          ))}
        </ol>
        {table.length > 1 && (
          <section>
            <SectionHeading title={`${software.name} und Alternativen im Vergleich`} />
            <ComparisonTable
              caption={`${software.name} und Alternativen im Vergleich`}
              products={comparisonProducts(table, category?.weights)}
              groups={comparisonGroups(table)}
            />
          </section>
        )}
      </div>
    </>
  );
}
