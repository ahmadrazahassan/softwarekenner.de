import { getGuide, listGuides } from "@/lib/content";
import { readingMinutes } from "@/lib/content/outline";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { staticParams } from "@/lib/static-params";

export const alt = "Ratgeber von Softwarekenner";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return staticParams(
    "slug",
    listGuides().map((g) => g.slug),
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return ogCard({
    kicker: guide ? `Ratgeber · ${guide.topic}` : "Ratgeber",
    title: guide?.seoTitle ?? guide?.title ?? "Ratgeber für Unternehmen",
    facts: guide ? [`${readingMinutes(guide.content)} Min. Lesezeit`, `${guide.sources.length} Quellen`] : [],
  });
}
