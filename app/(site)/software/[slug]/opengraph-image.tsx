import { getCategory, getScore, getSoftware, listSoftware } from "@/lib/content";
import { entryPrice } from "@/lib/content/query";
import { formatPrice, formatRating, PRICE_UNIT_LABEL } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { staticParams } from "@/lib/static-params";

export const alt = "Softwareprofil von Softwarekenner";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return staticParams(
    "slug",
    listSoftware().map((s) => s.slug),
  );
}

/** Profile share image: name, category, entry price and editorial score (Section 20). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const software = getSoftware(slug);
  if (!software) return ogCard({ kicker: "Softwareprofil", title: "Software im Überblick" });
  const price = entryPrice(software);
  const score = getScore(software.slug) ?? 0;
  return ogCard({
    kicker: getCategory(software.primaryCategory)?.name ?? "Softwareprofil",
    title: `${software.name} ${software.editorial.handsOnTest ? "im Test" : "im Überblick"}`,
    facts: [
      price ? `ab ${formatPrice(price.cents)} ${PRICE_UNIT_LABEL[price.unit]}` : "Preis auf Anfrage",
      software.pricing.trialDays ? `${software.pricing.trialDays} Tage Testphase` : "Deutschland-Check",
    ],
    badge: { value: formatRating(score), label: "Redaktionswertung" },
  });
}
