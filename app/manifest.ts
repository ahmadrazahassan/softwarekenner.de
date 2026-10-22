import type { MetadataRoute } from "next";

import { siteConfig } from "@/site.config";

/**
 * Web app manifest (Section 8.3). Icons show the logo mark on ink; app/icon.svg, app/favicon.ico and
 * app/apple-icon.png are picked up by Next.js from their file names.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brand.name,
    short_name: siteConfig.brand.name,
    description: siteConfig.brand.positioning,
    lang: siteConfig.locale.locale,
    start_url: "/",
    display: "standalone",
    background_color: "#eceefe",
    theme_color: "#eceefe",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
