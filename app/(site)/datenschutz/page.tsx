import type { Metadata } from "next";

import { LegalReviewNote } from "@/components/content/page-parts";
import { Ph } from "@/components/content/placeholder";
import { TextPage } from "@/components/content/text-page";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description:
    "Welche personenbezogenen Daten wir verarbeiten, zu welchem Zweck, wie lange und welche Rechte Sie haben.",
  path: routes.legal.privacy(),
});

/** Structure of the privacy policy (Sections 13.13 and 19). Content to be completed and reviewed by a lawyer. */
export default function PrivacyPage() {
  const l = siteConfig.legal;
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Datenschutz", href: routes.legal.privacy() },
      ]}
      title="Datenschutzerklärung"
      before={<LegalReviewNote />}
    >
      <h2>Verantwortlicher</h2>
      <p>
        <Ph value={l.companyLegalName} />, {siteConfig.brand.name}, {l.companyAddress}
        <br />
        E-Mail: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>, Telefon:{" "}
        <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>
      </p>

      <h2>Hosting und Server-Protokolle</h2>
      <p>
        Diese Website wird bei <Ph value={l.hostingProvider} /> betrieben. Beim Aufruf verarbeitet der Server
        technisch notwendige Daten wie IP-Adresse, Zeitpunkt und aufgerufene Seite. Mit dem Hosting-Anbieter
        besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
      </p>
      <p>{l.hostingDetails}</p>

      <h2>Schriftarten</h2>
      <p>
        Die Schriftarten dieser Website liegen auf unserem eigenen Server. Beim Aufruf werden keine Daten an
        Anbieter von Schriftarten übertragen.
      </p>

      <h2>Cookies und Reichweitenmessung</h2>
      <p>
        Wir setzen derzeit keine Cookies und keine Dienste ein, die eine Einwilligung erfordern. Für die
        Reichweitenmessung ist ein cookieloses, in der EU betriebenes Verfahren vorgesehen; es wird hier
        beschrieben, bevor es aktiviert wird.
      </p>

      <h2>Beratungsanfragen und Kontakt</h2>
      <p>
        Wenn Sie uns eine Anfrage senden, verarbeiten wir Name, geschäftliche E-Mail-Adresse,
        Unternehmensgröße, Kategorie und Ihre Nachricht, um die Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
        DSGVO). Wir speichern Ihre Anfrage bis {l.retentionInquiries}. Einen E-Mail-Dienst, der als
        Auftragsverarbeiter Nachrichten für uns versendet, nennen wir hier, bevor wir ihn einsetzen.
      </p>

      {siteConfig.features.newsletter && <h2>Newsletter</h2>}
      {siteConfig.features.newsletter && (
        <p>
          Für den Newsletter verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer Einwilligung (Art. 6 Abs.
          1 lit. a DSGVO). Die Anmeldung erfolgt im Double-Opt-in-Verfahren und wird protokolliert. Sie können
          die Einwilligung jederzeit über den Abmeldelink in jeder Ausgabe widerrufen. Wir speichern Ihre
          E-Mail-Adresse bis zum Widerruf. Die Bestätigung protokollieren wir ohne Ihre Adresse mit einer
          Kennung und dem Zeitpunkt.
        </p>
      )}
      {siteConfig.features.newsletter && (
        <p>
          Für Versand und Verwaltung der Adressen setzen wir den E-Mail-Dienst Resend (Resend, Inc., San
          Francisco, USA) als Auftragsverarbeiter ein (Art. 28 DSGVO). Auch Bestätigungs- und
          Antwort-E-Mails zu Anfragen werden darüber versendet. Die Daten werden in der Region EU (Irland)
          verarbeitet.
        </p>
      )}

      <h2>Affiliate-Links</h2>
      <p>
        Mit * gekennzeichnete Links führen über unsere eigene Weiterleitung zum Anbieter. Dabei übergeben wir
        nur, von welcher Seite der Klick kam, keine personenbezogenen Daten.
      </p>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch sowie das Recht, eine Einwilligung zu widerrufen. Sie können sich
        bei einer Datenschutzaufsichtsbehörde beschweren. Für uns zuständig ist:{" "}
        <Ph value={l.supervisoryAuthority} />.
      </p>
    </TextPage>
  );
}
