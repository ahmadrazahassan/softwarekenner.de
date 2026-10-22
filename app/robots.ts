import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/** robots.txt (Sections 18 and 20). The sitemap line appears once the domain is set. */
export default function robots(): MetadataRoute.Robots {
  const sitemap = absoluteUrl("/sitemap.xml");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/", "/styleguide", "/bestaetigen"] }],
    ...(sitemap ? { sitemap } : {}),
  };
}
