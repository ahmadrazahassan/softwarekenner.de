import { getCategory, listCategories, listSoftwareByCategory } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { staticParams } from "@/lib/static-params";

export const alt = "Softwarevergleich von Softwarekenner";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return staticParams(
    "kategorie",
    listCategories().map((c) => c.slug),
  );
}

export default async function Image({ params }: { params: Promise<{ kategorie: string }> }) {
  const { kategorie } = await params;
  const category = getCategory(kategorie);
  const count = category ? listSoftwareByCategory(category.slug).length : 0;
  return ogCard({
    kicker: "Softwarevergleich",
    title: category ? `${category.name} im Vergleich` : "Software im Vergleich",
    facts: category ? [`${count} Programme bewertet`, "Preise in Euro", "Kaufberatung"] : [],
  });
}
