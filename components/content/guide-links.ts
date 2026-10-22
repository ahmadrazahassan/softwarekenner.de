import type { EditorialLink } from "@/components/content/editorial";
import { readingMinutes } from "@/lib/content/outline";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";

/** Row props for a Ratgeber article in an EditorialList. */
export const guideLink = (guide: {
  slug: string;
  title: string;
  topic: string;
  description: string;
  content: string;
  updatedAt: string;
}): EditorialLink => ({
  href: routes.guide(guide.slug),
  kicker: guide.topic,
  title: guide.title,
  text: guide.description,
  meta: `${readingMinutes(guide.content)} Min. Lesezeit · ${formatDate(guide.updatedAt)}`,
});

/** Row props for the Kaufberatung of a category; it lives on the category page. */
export const buyingGuideLink = (
  guide: { category: string; title: string; description: string; content: string; updatedAt: string },
  categoryName: string,
): EditorialLink => ({
  href: `${routes.category(guide.category)}#kaufberatung`,
  kicker: `Kaufberatung · ${categoryName}`,
  title: guide.title,
  text: guide.description,
  meta: `${readingMinutes(guide.content)} Min. Lesezeit · ${formatDate(guide.updatedAt)}`,
});
