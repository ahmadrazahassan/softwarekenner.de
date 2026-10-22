/**
 * Metadata and JSON-LD builders (docs/BUILD_PROMPT.md Sections 13 and 20).
 * Structured data needs absolute URLs, so builders return null until the domain is set.
 */
import type { Metadata } from "next";

import type { CategoryData, SoftwareData } from "@/lib/content/schemas";
import { entryPrice } from "@/lib/content/query";
import { isPlaceholder, siteConfig } from "@/site.config";

export const hasDomain = () => !isPlaceholder(siteConfig.domain);
export const absoluteUrl = (path: string) =>
  hasDomain() ? new URL(path, siteConfig.domain).toString() : null;

/** Page metadata with German Open Graph locale and a canonical once the domain exists. */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url, languages: { "de-DE": url } } } : {}),
    openGraph: {
      title,
      description,
      locale: siteConfig.locale.ogLocale,
      type: "website",
      siteName: siteConfig.brand.name,
      ...(url ? { url } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd | null {
  if (!hasDomain()) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.domain}#organisation`,
        name: siteConfig.brand.name,
        url: siteConfig.domain,
      },
      {
        "@type": "WebSite",
        name: siteConfig.brand.name,
        url: siteConfig.domain,
        inLanguage: "de-DE",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.domain}/suche?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function itemListJsonLd(name: string, items: { name: string; path: string }[]): JsonLd | null {
  if (!hasDomain()) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/**
 * SoftwareApplication with the editorial Review (Section 13.3). AggregateRating only from real,
 * verified user reviews, never from the editorial score.
 */
export function softwareJsonLd(
  software: SoftwareData,
  context: {
    score: number;
    authorName: string;
    category?: CategoryData;
    userRating?: { average: number; count: number };
  },
): JsonLd | null {
  if (!hasDomain()) return null;
  const price = entryPrice(software);
  const os = software.platforms.map(
    (p) =>
      ({ web: "Web", windows: "Windows", macos: "macOS", linux: "Linux", ios: "iOS", android: "Android" })[p],
  );
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: software.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: os.join(", "),
    url: absoluteUrl(`/software/${software.slug}`),
    ...(price
      ? { offers: { "@type": "Offer", price: (price.cents / 100).toFixed(2), priceCurrency: "EUR" } }
      : {}),
    review: {
      "@type": "Review",
      author: { "@type": "Person", name: context.authorName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: context.score.toFixed(1),
        bestRating: "5",
        worstRating: "0",
      },
      datePublished: software.editorial.publishedAt,
    },
    ...(context.userRating && context.userRating.count >= 5
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: context.userRating.average.toFixed(1),
            ratingCount: context.userRating.count,
          },
        }
      : {}),
  };
}

/** Ratgeber and Kaufberatung as Article with author, dates and publisher (Section 20). */
export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  authorName?: string;
  authorPath?: string;
  publishedAt: string;
  updatedAt: string;
}): JsonLd | null {
  if (!hasDomain()) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    mainEntityOfPage: absoluteUrl(article.path),
    inLanguage: "de-DE",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    ...(article.authorName
      ? {
          author: {
            "@type": "Person",
            name: article.authorName,
            ...(article.authorPath ? { url: absoluteUrl(article.authorPath) } : {}),
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.domain}#organisation`,
      name: siteConfig.brand.name,
    },
  };
}
