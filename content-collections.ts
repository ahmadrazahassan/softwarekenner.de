/**
 * Content Collections configuration (docs/BUILD_PROMPT.md Sections 9 and 10).
 * Schemas live in lib/content/schemas.ts; cross reference guards in lib/content/guards.ts.
 * Pages never import this output directly: they use the data access layer in lib/content.
 */
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";

import * as S from "./lib/content/schemas";

const json = <TName extends string, TSchema extends Parameters<typeof defineCollection>[0]["schema"]>(
  name: TName,
  directory: string,
  schema: TSchema,
) => defineCollection({ name, directory, include: "*.json", parser: "json", schema });

const software = json("software", "content/software", S.Software);
const categories = json("categories", "content/categories", S.Category);
const vendors = json("vendors", "content/vendors", S.Vendor);
const authors = json("authors", "content/authors", S.Author);
const userReviews = json("userReviews", "content/user-reviews", S.UserReview);
const market = json("market", "content/markt", S.MarketDataset);

const reviews = defineCollection({
  name: "reviews",
  directory: "content/reviews",
  include: "*.mdx",
  schema: S.Review,
  transform: async (document, context) => ({
    ...document,
    slug: document._meta.path,
    mdx: await compileMDX(context, document),
  }),
});

const comparisons = defineCollection({
  name: "comparisons",
  directory: "content/comparisons",
  include: "*.mdx",
  schema: S.Comparison,
  transform: async (document, context) => ({
    ...document,
    slug: document._meta.path,
    mdx: await compileMDX(context, document),
  }),
});

const guides = defineCollection({
  name: "guides",
  directory: "content/guides",
  include: "*.mdx",
  schema: S.Guide,
  transform: async (document, context) => ({
    ...document,
    slug: document._meta.path,
    mdx: await compileMDX(context, document),
  }),
});

const buyingGuides = defineCollection({
  name: "buyingGuides",
  directory: "content/kaufberatung",
  include: "*.mdx",
  schema: S.BuyingGuide,
  transform: async (document, context) => ({
    ...document,
    slug: document._meta.path,
    mdx: await compileMDX(context, document),
  }),
});

const downloads = defineCollection({
  name: "downloads",
  directory: "content/downloads",
  include: "*.mdx",
  schema: S.Download,
  transform: async (document, context) => ({
    ...document,
    slug: document._meta.path,
    mdx: await compileMDX(context, document),
  }),
});

export default defineConfig({
  content: [
    software,
    categories,
    vendors,
    authors,
    userReviews,
    market,
    reviews,
    comparisons,
    guides,
    buyingGuides,
    downloads,
  ],
});
