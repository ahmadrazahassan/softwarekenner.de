import type { ReactNode } from "react";

import { ConsentProvider } from "@/components/consent/consent";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CompareProvider, CompareTray } from "@/components/software/compare";
import { CONSENT_SERVICES } from "@/lib/consent";
import { getSiteChrome } from "@/lib/content";

/** Site wide chrome (Section 7.1): skip link, header, main landmark, footer, compare tray. */
export function SiteShell({ children }: { children: ReactNode }) {
  const chrome = getSiteChrome();
  return (
    <ConsentProvider services={CONSENT_SERVICES}>
      <CompareProvider persist>
        <a
          href="#inhalt"
          className="sr-only z-50 rounded-full bg-ink px-5 py-3 type-label text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Zum Inhalt springen
        </a>
        <Header
          categorySlugs={chrome.categorySlugs}
          categoryCounts={chrome.categoryCounts}
          popularComparisons={chrome.popularComparisons}
          guideTeaser={chrome.guideTeaser}
          mainNav={chrome.mainNav}
        />
        <main id="inhalt" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer
          categorySlugs={chrome.categorySlugs}
          popularComparisons={chrome.popularComparisons}
          latestGuides={chrome.latestGuides}
        />
        <CompareTray />
      </CompareProvider>
    </ConsentProvider>
  );
}
