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
        Wir setzen keine Cookies und keine Dienste ein, die eine Einwilligung erfordern. Zur
        Reichweitenmessung nutzen wir Vercel Web Analytics, ein Dienst unseres Hosting-Anbieters (siehe oben).
        Er arbeitet ohne Cookies und ohne Speicherung von Informationen auf Ihrem Endgerät. Das Skript wird
        von unserer eigenen Domain geladen. Laut Anbieter werden dabei die aufgerufene Seite, die
        Herkunftsseite, Browser, Betriebssystem, Gerätetyp und das Land erfasst; Besucherinnen und Besucher
        werden nur über einen täglich wechselnden, nicht umkehrbaren Wert ohne Wiedererkennung über mehrere
        Tage unterschieden. Die IP-Adresse wird nicht gespeichert und es entsteht kein Profil. Rechtsgrundlage
        ist unser berechtigtes Interesse an einer bedarfsgerechten Gestaltung der Website (Art. 6 Abs. 1 lit.
        f DSGVO). Mit dem Anbieter besteht der oben genannte Vertrag zur Auftragsverarbeitung. Sie können der
        Auswertung jederzeit widersprechen, indem Sie uns eine E-Mail schreiben.
      </p>

      <h2>Beratungsanfragen und Kontakt</h2>
      <p>
        Wenn Sie uns eine Anfrage senden, verarbeiten wir Name, geschäftliche E-Mail-Adresse,
        Unternehmensgröße, Kategorie und Ihre Nachricht, um die Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
        DSGVO). Wir speichern Ihre Anfrage bis {l.retentionInquiries}. Die Eingangsbestätigung und unsere
        Antwort versenden wir über den unten genannten E-Mail-Dienst.
      </p>

      <h2>E-Mail-Versand über Resend</h2>
      <p>
        Bestätigungs-E-Mails, Antworten auf Anfragen und den Newsletter versenden wir über den E-Mail-Dienst
        Resend der Plus Five Five, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA. Resend
        verarbeitet dabei Ihre E-Mail-Adresse, den Inhalt der Nachricht und technische Versanddaten in unserem
        Auftrag (Art. 28 DSGVO). Wir haben den Versand für unsere Domain in der Region EU (Irland)
        eingerichtet. Da Resend ein Unternehmen mit Sitz in den USA ist, ist ein Zugriff aus den USA nicht
        ausgeschlossen. Resend ist nach dem EU-U.S. Data Privacy Framework zertifiziert (Art. 45 DSGVO);
        ergänzend sind die Standardvertragsklauseln der EU-Kommission Teil des Auftragsverarbeitungsvertrags
        (Art. 46 Abs. 2 lit. c DSGVO).
      </p>

      {siteConfig.features.newsletter && <h2>Newsletter</h2>}
      {siteConfig.features.newsletter && (
        <p>
          Für den Newsletter verarbeiten wir Ihre E-Mail-Adresse auf Grundlage Ihrer Einwilligung (Art. 6 Abs.
          1 lit. a DSGVO). Die Anmeldung erfolgt im Double-Opt-in-Verfahren und wird protokolliert. Sie können
          die Einwilligung jederzeit über den Abmeldelink in jeder Ausgabe widerrufen. Wir speichern Ihre
          E-Mail-Adresse bis zum Widerruf. Die Bestätigung protokollieren wir ohne Ihre Adresse mit einer
          Kennung und dem Zeitpunkt. Die Adressen verwalten wir ebenfalls bei Resend.
        </p>
      )}

      <h2>Affiliate-Links</h2>
      <p>
        Mit * gekennzeichnete Links sind Affiliate-Links. Sie führen über unsere eigene Weiterleitung
        (Adressen, die mit /go/ beginnen) zum Anbieter oder zu dessen Partnerprogramm. An den Anbieter geben
        wir dabei höchstens eine Kennung weiter, auf welcher Art von Seite und an welcher Position der Link
        stand, etwa „kategorie-3“. Name, E-Mail-Adresse oder andere Angaben über Sie übermitteln wir nicht.
        Auf unserer Website setzen wir für Affiliate-Links keine Cookies.
      </p>
      <p>
        Nach dem Klick befinden Sie sich auf der Website des Anbieters. Dort kann der Anbieter oder das von
        ihm beauftragte Partnernetzwerk, etwa PartnerStack oder Impact, Cookies oder ähnliche Techniken einsetzen, um
        einen späteren Vertragsabschluss unserer Empfehlung zuzuordnen. Dafür ist der Anbieter verantwortlich;
        es gelten seine Datenschutzhinweise und seine Einwilligungsabfrage. Wir erhalten vom Anbieter nur
        Angaben zu vermittelten Abschlüssen und Provisionen, keine Daten, mit denen wir Sie identifizieren
        können.
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
