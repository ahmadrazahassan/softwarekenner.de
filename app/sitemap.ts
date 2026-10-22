import type { MetadataRoute } from "next";

import {
  listAuthors,
  listCategories,
  listComparisons,
  listDownloads,
  listGuides,
  listSoftware,
  listSoftwareByCategory,
  listUserReviews,
} from "@/lib/content";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

/**
 * sitemap.xml (Section 20): every indexable page with lastModified from the content. Pages marked
 * noindex (search, confirmation, review pages without reviews) and the styleguide stay out.
 * Empty until the domain is set, like robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!absoluteUrl("/")) return [];
  const software = listSoftware();
  const categories = listCategories();
  const guides = listGuides();
  const latest = (dates: string[]) => dates.sort().at(-1);
  const entry = (path: string, lastModified?: string) => ({
    url: absoluteUrl(path)!,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    entry(
      routes.home(),
      latest([...software.map((s) => s.editorial.updatedAt), ...guides.map((g) => g.updatedAt)]),
    ),
    entry(routes.categories(), latest(categories.map((c) => c.updatedAt))),
    ...categories.map((c) =>
      entry(
        routes.category(c.slug),
        latest([c.updatedAt, ...listSoftwareByCategory(c.slug).map((s) => s.editorial.updatedAt)]),
      ),
    ),
    entry(routes.softwareIndex(), latest(software.map((s) => s.editorial.updatedAt))),
    ...software.flatMap((s) => [
      entry(routes.software(s.slug), s.editorial.updatedAt),
      entry(routes.softwarePrices(s.slug), s.pricing.verifiedAt),
      entry(routes.softwareAlternatives(s.slug), s.editorial.updatedAt),
      ...(listUserReviews(s.slug).length > 0 ? [entry(routes.softwareReviews(s.slug))] : []),
    ]),
    entry(routes.compareTool()),
    ...listComparisons().map((c) => entry(routes.comparison(c.a, c.b), c.updatedAt)),
    ...(guides.length > 0 ? [entry(routes.guides(), latest(guides.map((g) => g.updatedAt)))] : []),
    ...guides.map((g) => entry(routes.guide(g.slug), g.updatedAt)),
    entry(routes.downloads()),
    ...listDownloads().map((d) => entry(routes.download(d.slug), d.updatedAt)),
    ...listAuthors().map((a) => entry(routes.author(a.slug))),
    ...[
      routes.advisory(),
      routes.methodology(),
      routes.editorialTeam(),
      routes.forVendors(),
      routes.submitSoftware(),
      routes.writeReview(),
      "/ueber-uns",
      "/kontakt",
      routes.legal.imprint(),
      routes.legal.privacy(),
      routes.legal.transparency(),
      routes.legal.accessibility(),
      routes.legal.cookies(),
    ].map((path) => entry(path)),
  ];
}
