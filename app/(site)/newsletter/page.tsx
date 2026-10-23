import type { Metadata } from "next";

import { subscribeNewsletter } from "@/app/actions/forms";
import { NumberedPoints, PillHeading } from "@/components/content/editorial";
import { PageHeader } from "@/components/content/page-parts";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { AppLink } from "@/components/ui/app-link";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Newsletter: Software, Preise und Fristen",
  description:
    "Einmal im Monat das Wichtigste für Ihr Unternehmen: neue Bewertungen, Preisänderungen und gesetzliche Fristen. Kostenlos, ohne Werbung, jederzeit abbestellbar.",
  path: routes.newsletter(),
});

const CONTENTS = [
  "Neue Bewertungen: Welche Programme wir neu geprüft oder überarbeitet haben und was sich an der Wertung geändert hat.",
  "Preisänderungen: Wo Anbieter Tarife erhöht, gestrichen oder neu geschnitten haben, jeweils mit Stand und Quelle.",
  "Fristen und Pflichten: Was sich für Buchhaltung, Lohn und Zeiterfassung rechtlich ändert und bis wann Sie handeln müssen.",
  "Ein Ratgeber des Monats: Der eine Beitrag, den Sie als Geschäftsführung oder Büroleitung nicht verpassen sollten.",
];

const PROMISES = [
  {
    title: "Einmal im Monat",
    text: "Eine Ausgabe, die Sie in wenigen Minuten lesen. Kein Takt von Werbemails, keine Zusatzsendungen.",
  },
  {
    title: "Ohne bezahlte Platzierung",
    text: "Wertungen und Empfehlungen im Newsletter folgen derselben Methodik wie auf der Website. Provisionen verändern keine Note.",
  },
  {
    title: "Keine Weitergabe",
    text: "Wir verkaufen keine Adressen und geben sie nicht an Anbieter weiter. Wir nutzen Ihre Adresse nur für diesen Newsletter.",
  },
  {
    title: "Jederzeit abmelden",
    text: "Jede Ausgabe enthält einen Abmeldelink. Ein Klick genügt, ohne Begründung und ohne Anmeldung.",
  },
];

const STEPS = [
  "Sie tragen Ihre E-Mail-Adresse ein. Mehr brauchen wir nicht.",
  "Sie erhalten eine E-Mail mit einem Bestätigungslink, gültig für sieben Tage.",
  "Sie öffnen den Link und bestätigen mit einem Klick. Erst dann sind Sie angemeldet.",
];

const FAQ = [
  {
    q: "Was kostet der Newsletter?",
    a: "Nichts. Der Newsletter ist kostenlos. Wir finanzieren uns über gekennzeichnete Affiliate-Links, die Wertungen nicht beeinflussen. Details stehen auf der Seite Transparenz.",
  },
  {
    q: "Wie oft bekomme ich eine E-Mail?",
    a: "Einmal im Monat. Zwischendurch schreiben wir Ihnen nur, wenn es um Ihre Anmeldung selbst geht, etwa mit dem Bestätigungslink.",
  },
  {
    q: "Warum muss ich meine Anmeldung bestätigen?",
    a: "Wir arbeiten im Double-Opt-in-Verfahren. So stellen wir sicher, dass niemand mit Ihrer Adresse angemeldet werden kann, und können Ihre Einwilligung nachweisen (Art. 7 Abs. 1 DSGVO). Die Bestätigung protokollieren wir ohne Ihre Adresse, nur mit einer Kennung und dem Zeitpunkt.",
  },
  {
    q: "Ich habe keine Bestätigungs-E-Mail erhalten.",
    a: "Schauen Sie bitte im Spam-Ordner nach. Die Nachricht kommt von newsletter@softwarekenner.de. Kommt sie auch dort nicht an, tragen Sie sich einfach noch einmal ein oder schreiben Sie uns über die Seite Kontakt.",
  },
  {
    q: "Wo werden meine Daten verarbeitet?",
    a: "Den Versand übernimmt der E-Mail-Dienst Resend als Auftragsverarbeiter. Welche Daten wir wofür verarbeiten und wie lange, steht in der Datenschutzerklärung.",
  },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Newsletter", href: routes.newsletter() },
        ]}
        eyebrow="Newsletter"
        title="Einmal im Monat das Wichtigste"
        lead="Neue Bewertungen, Preisänderungen und Fristen, die Ihr Unternehmen betreffen. Kurz, nachvollziehbar und ohne Werbung."
      />

      <div className="container-content grid gap-14 pb-20 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16">
        <div className="flex flex-col gap-16">
          <section aria-labelledby="inhalt" className="flex flex-col gap-6">
            <PillHeading id="inhalt" number="01">
              Das steht drin
            </PillHeading>
            <NumberedPoints items={CONTENTS} size="md" />
          </section>

          <section aria-labelledby="versprechen" className="flex flex-col gap-6">
            <PillHeading id="versprechen" number="02">
              Unser Versprechen
            </PillHeading>
            <ul className="grid gap-4 sm:grid-cols-2">
              {PROMISES.map((p) => (
                <li key={p.title} className="flex flex-col gap-2 rounded-lg border border-line bg-white p-6">
                  <h3 className="type-h4 text-ink">{p.title}</h3>
                  <p className="type-body text-text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="anmeldung" className="flex flex-col gap-6">
            <PillHeading id="anmeldung" number="03">
              So melden Sie sich an
            </PillHeading>
            <NumberedPoints items={STEPS} size="md" />
          </section>

          <section aria-labelledby="fragen" className="flex flex-col gap-6">
            <PillHeading id="fragen" number="04">
              Häufige Fragen
            </PillHeading>
            <dl className="border-t border-ink">
              {FAQ.map((item) => (
                <div key={item.q} className="border-b border-ink py-6">
                  <dt className="type-h4 text-ink">{item.q}</dt>
                  <dd className="mt-2 measure type-body text-text-muted">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside
          aria-labelledby="anmelden-titel"
          className="flex flex-col gap-5 self-start rounded-lg border-[1.5px] border-ink bg-brand-500 p-6 text-ink sm:p-8 lg:sticky lg:top-24"
        >
          <h2
            id="anmelden-titel"
            className="font-display text-[1.75rem] leading-[1] font-bold tracking-[-0.02em] uppercase"
          >
            Jetzt kostenlos anmelden
          </h2>
          <p className="type-body">
            Eine E-Mail im Monat, von der Redaktion von {siteConfig.brand.name}. Ihre Anmeldung bestätigen Sie
            im nächsten Schritt.
          </p>
          <NewsletterForm privacyHref={routes.legal.privacy()} onBrand onSubmit={subscribeNewsletter} />
          <p className="type-small">
            Mehr zu unserer Arbeitsweise lesen Sie unter{" "}
            <AppLink href={routes.methodology()} className="font-semibold underline underline-offset-3">
              Methodik
            </AppLink>{" "}
            und{" "}
            <AppLink
              href={routes.legal.transparency()}
              className="font-semibold underline underline-offset-3"
            >
              Transparenz
            </AppLink>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
