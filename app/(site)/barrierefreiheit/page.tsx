import type { Metadata } from "next";

import { LegalReviewNote } from "@/components/content/page-parts";
import { Ph } from "@/components/content/placeholder";
import { TextPage } from "@/components/content/text-page";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Erklärung zur Barrierefreiheit",
  description:
    "Stand der Barrierefreiheit dieser Website, bekannte Einschränkungen und wie Sie Barrieren melden können.",
  path: routes.legal.accessibility(),
});

export default function AccessibilityPage() {
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Barrierefreiheit", href: routes.legal.accessibility() },
      ]}
      title="Erklärung zur Barrierefreiheit"
      before={<LegalReviewNote />}
    >
      <h2>Ziel</h2>
      <p>
        Wir gestalten diese Website nach den Web Content Accessibility Guidelines (WCAG) 2.2 auf Stufe AA.
        Jede Seitenvorlage prüfen wir vor der Veröffentlichung automatisch und per Tastatur.
      </p>
      <h2>Stand der Vereinbarkeit</h2>
      <p>
        Eine vollständige Prüfung durch eine unabhängige Stelle steht noch aus. Das Ergebnis und bekannte
        Einschränkungen ergänzen wir hier nach der Prüfung.
      </p>
      <h2>Barrieren melden</h2>
      <p>
        Wenn Ihnen eine Barriere auffällt, schreiben Sie uns an <Ph value={siteConfig.contact.email} />. Wir
        antworten so schnell wie möglich und beheben gemeldete Barrieren.
      </p>
    </TextPage>
  );
}
