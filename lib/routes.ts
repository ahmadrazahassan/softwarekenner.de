/**
 * URL builders (docs/BUILD_PROMPT.md Section 12). Every internal link is built here.
 * German slugs, lowercase, no trailing slashes. Phase 3 switches the return types to typed routes
 * once every page exists.
 */

export const routes = {
  home: () => "/",
  categories: () => "/kategorien",
  category: (slug: string) => `/kategorien/${slug}`,
  softwareIndex: () => "/software",
  software: (slug: string) => `/software/${slug}`,
  softwarePrices: (slug: string) => `/software/${slug}/preise`,
  softwareAlternatives: (slug: string) => `/software/${slug}/alternativen`,
  softwareReviews: (slug: string) => `/software/${slug}/bewertungen`,
  compareTool: (slugs: string[] = []) =>
    slugs.length ? `/vergleich?produkte=${slugs.join(",")}` : "/vergleich",
  comparison: (a: string, b: string) => `/vergleich/${a}-vs-${b}`,
  guides: () => "/ratgeber",
  guide: (slug: string) => `/ratgeber/${slug}`,
  downloads: () => "/leitfaeden",
  download: (slug: string) => `/leitfaeden/${slug}`,
  advisory: () => "/beratung",
  newsletter: () => "/newsletter",
  methodology: () => "/methodik",
  editorialTeam: () => "/redaktion",
  author: (slug: string) => `/autoren/${slug}`,
  forVendors: () => "/fuer-anbieter",
  submitSoftware: () => "/software-eintragen",
  writeReview: () => "/bewertung-schreiben",
  search: () => "/suche",
  legal: {
    imprint: () => "/impressum",
    privacy: () => "/datenschutz",
    transparency: () => "/transparenz",
    accessibility: () => "/barrierefreiheit",
    cookies: () => "/cookie-einstellungen",
  },
} as const;

/** Where on the site an affiliate click happened. Whitelisted values only, no personal data (Section 18). */
export const GO_SOURCES = [
  "start",
  "kategorie",
  "profil",
  "preise",
  "alternativen",
  "vergleich",
  "ratgeber",
] as const;
export type GoSource = (typeof GO_SOURCES)[number];

/** `/go/[slug]?from=…&pos=…` for affiliate links. */
export const goHref = (slug: string, from: GoSource, position?: number) =>
  `/go/${slug}?from=${from}${position ? `&pos=${position}` : ""}`;

/** Slug rule from Section 12: lowercase, umlauts transliterated, hyphens between words. */
export function toSlug(input: string): string {
  return input
    .toLocaleLowerCase("de")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
