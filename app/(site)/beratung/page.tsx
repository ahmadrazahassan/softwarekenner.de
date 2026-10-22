import type { Metadata } from "next";

import { requestAdvice } from "@/app/actions/forms";
import { PageHeader } from "@/components/content/page-parts";
import { Ph } from "@/components/content/placeholder";
import { AdviceWizard } from "@/components/forms/advice-wizard";
import { AppLink } from "@/components/ui/app-link";
import { listCategories } from "@/lib/content";
import { REQUIREMENTS } from "@/lib/finder";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Kostenlose Softwareberatung",
  description:
    "Beschreiben Sie Ihre Anforderungen, wir helfen bei der Auswahl. Kostenlos, unverbindlich und ohne Verkaufsdruck.",
  path: routes.advisory(),
});

const STEPS = [
  { title: "Anfrage senden", text: "Sie nennen Kategorie, Unternehmensgröße und was Ihnen wichtig ist." },
  {
    title: "Auswahl eingrenzen",
    text: "Wir gleichen Ihre Anforderungen mit unseren Profilen und dem Deutschland-Check ab.",
  },
  {
    title: "Antwort per E-Mail",
    text: "Sie erhalten eine begründete Auswahl passender Programme, ohne Verpflichtung.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Beratung", href: routes.advisory() },
        ]}
        title="Kostenlose Softwareberatung"
        lead="Unser Team kennt die Anbieter und hilft Ihnen, die Auswahl einzugrenzen. Unverbindlich und ohne Verkaufsdruck."
      />
      <div className="container-content grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="ablauf">
            <h2 id="ablauf" className="type-h2 text-ink">
              So funktioniert die Beratung
            </h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-2 rounded-lg border border-line bg-white p-6"
                >
                  <span className="font-display text-h3 font-semibold text-brand-ink tabular-nums">
                    {i + 1}
                  </span>
                  <h3 className="type-h4 text-ink">{step.title}</h3>
                  <p className="type-body text-text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="anfrage" className="flex flex-col gap-6">
            <h2 id="anfrage" className="type-h2 text-ink">
              Beratung anfragen
            </h2>
            <AdviceWizard
              categories={listCategories().map((c) => ({ value: c.shortName, label: c.shortName }))}
              requirements={REQUIREMENTS.map((r) => ({ value: r.id, label: r.label }))}
              action={requestAdvice}
            />
          </section>
        </div>
        <aside
          aria-labelledby="datenschutz-hinweis"
          className="flex flex-col gap-3 self-start rounded-lg border border-line bg-white p-6 lg:sticky lg:top-24"
        >
          <h2 id="datenschutz-hinweis" className="type-h4 text-ink">
            Was mit Ihren Angaben passiert
          </h2>
          <p className="type-body text-text-muted">
            Wir nutzen Ihre Angaben ausschließlich, um Ihre Anfrage zu beantworten, und geben sie nicht an
            Anbieter weiter. Sie erhalten eine Eingangsbestätigung per E-Mail.
          </p>
          <p className="type-body text-text-muted">
            Speicherdauer: <Ph value={siteConfig.legal.retentionInquiries} />.
          </p>
          <p className="type-body text-text-muted">
            Ihre Rechte und alle Details stehen in der{" "}
            <AppLink href={routes.legal.privacy()} className="link-inline">
              Datenschutzerklärung
            </AppLink>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
