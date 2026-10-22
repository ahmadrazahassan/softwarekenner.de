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

/** The static default share image route (app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Page metadata with German Open Graph locale and a canonical once the domain exists. */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
  type = "website",
  ownImage = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  /** The route has its own opengraph-image file; a config image would replace it. */
  ownImage?: boolean;
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
      type,
      siteName: siteConfig.brand.name,
      ...(url ? { url } : {}),
      // Default share image (app/opengraph-image.tsx); routes with their own image file override it.
      ...(ownImage
        ? {}
        : { images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: siteConfig.brand.name }] }),
    },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Meta description within the Section 15.7 limit, cut at a word boundary with an ellipsis. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}

/** Replaces the {jahr} token in SEO titles with the year of the last content update (Section 15.7). */
export const withYear = (title: string, updatedAt: string) => title.replace("{jahr}", updatedAt.slice(0, 4));

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
        logo: absoluteUrl("/icons/icon-512.png"),
        email: siteConfig.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.legal.companyStreet,
          postalCode: siteConfig.legal.companyCity.split(" ")[0],
          addressLocality: siteConfig.legal.companyCity.split(" ").slice(1).join(" "),
          addressCountry: "DE",
        },
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
    image: absoluteUrl(DEFAULT_OG_IMAGE),
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

/** FAQPage for the category FAQ (Section 20); the questions are visible on the page. */
export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd | null {
  if (!hasDomain() || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
