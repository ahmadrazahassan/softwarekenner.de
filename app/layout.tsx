import type { Metadata } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { MotionProvider } from "@/components/ui/motion-provider";
import { analyticsScript } from "@/lib/analytics";
import { siteConfig } from "@/site.config";
import "@/styles/globals.css";

import { fontVariables } from "./fonts";

/** Search Console and Bing Webmaster ownership tags, only when the keys are set (.env.example). */
const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteConfig.brand.name,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.positioning,
  applicationName: siteConfig.brand.name,
  // Indexing is on since the launch content was published (Section 20). Pages that must stay out
  // of the index (search, confirmation, empty review pages) set noindex themselves.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Cookieless analytics loads only once a provider is configured (lib/analytics).
  const analytics = analyticsScript();
  return (
    <html lang={siteConfig.locale.lang} className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <NuqsAdapter>
          <MotionProvider>{children}</MotionProvider>
        </NuqsAdapter>
        {analytics && <Script strategy="afterInteractive" {...analytics} />}
      </body>
    </html>
  );
}
