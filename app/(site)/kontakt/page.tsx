import type { Metadata } from "next";

import { Ph } from "@/components/content/placeholder";
import { TextPage } from "@/components/content/text-page";
import { AppLink } from "@/components/ui/app-link";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description: "So erreichen Sie die Redaktion: Fragen, Hinweise auf Fehler und Anfragen von Anbietern.",
  path: "/kontakt",
});

export default function ContactPage() {
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Kontakt", href: "/kontakt" },
      ]}
      title="Kontakt"
      lead="Fragen, Hinweise auf Fehler oder Anfragen von Anbietern: Wir lesen jede Nachricht."
    >
      <h2>E-Mail und Telefon</h2>
      <p>
        E-Mail: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        <br />
        Telefon: <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>
      </p>
      <p>
        Ansprechpartner ist {siteConfig.legal.editorInChief}, Gründer und verantwortlicher Redakteur von{" "}
        {siteConfig.brand.name}.
      </p>
      <h2>Anschrift</h2>
      <p>
        <Ph value={siteConfig.legal.companyLegalName} />
        <br />
        {siteConfig.brand.name}
        <br />
        {siteConfig.legal.companyStreet}
        <br />
        {siteConfig.legal.companyCity}
      </p>
      <h2>Softwareberatung</h2>
      <p>
        Für Hilfe bei der Auswahl nutzen Sie bitte unsere{" "}
        <AppLink href={routes.advisory()}>kostenlose Beratung</AppLink>.
      </p>
    </TextPage>
  );
}
