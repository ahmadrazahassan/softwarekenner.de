import type { Metadata } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { MotionProvider } from "@/components/ui/motion-provider";
import { analyticsScript } from "@/lib/analytics";
import { siteConfig } from "@/site.config";
import "@/styles/globals.css";

import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.brand.name,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.positioning,
  // Nothing is public yet. Indexing is switched on in Phase 6.
  robots: { index: false, follow: false },
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
