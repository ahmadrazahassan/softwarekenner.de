import { submitListing } from "@/app/actions/forms";
import { ListingForm } from "@/components/forms/listing-form";
import type { Metadata } from "next";

import { Ph } from "@/components/content/placeholder";
import { TextPage } from "@/components/content/text-page";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Software eintragen",
  description: "Voraussetzungen und benötigte Angaben für den Eintrag eines Programms.",
  path: routes.submitSoftware(),
});

export default function SubmitSoftwarePage() {
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Für Anbieter", href: routes.forVendors() },
        { label: "Software eintragen", href: routes.submitSoftware() },
      ]}
      title="Software eintragen"
      lead="Der Eintrag ist kostenlos. Wir nehmen Programme auf, die sich an Unternehmen in Deutschland richten."
      after={
        <section aria-labelledby="formular" className="flex flex-col gap-4">
          <h2 id="formular" className="type-h2 text-ink">
            Angaben senden
          </h2>
          <ListingForm action={submitListing} />
        </section>
      }
    >
      <h2>Voraussetzungen</h2>
      <ul>
        <li>Das Programm wird aktiv an Unternehmen in Deutschland verkauft.</li>
        <li>Es gibt eine deutsche Oberfläche oder deutschsprachigen Support.</li>
        <li>Die Preise sind in Euro angegeben, oder ein Vertragspartner bedient den deutschen Markt.</li>
      </ul>
      <h2>Welche Angaben wir brauchen</h2>
      <ul>
        <li>Produktname, Website und Anbieter laut Impressum</li>
        <li>Tarife mit Preisen in Euro und Link zur Preisseite</li>
        <li>Serverstandort, Auftragsverarbeitung, GoBD und E-Rechnung, jeweils mit Quelle</li>
        <li>Offizielles Logo als SVG aus Ihrem Pressebereich</li>
      </ul>
      <h2>So geht es weiter</h2>
      <p>
        Wir prüfen jede Angabe anhand öffentlicher Quellen, bevor ein Profil erscheint. Ein Eintrag bedeutet
        keine Bewertung zu Ihren Gunsten. Senden Sie die Angaben über das Formular unten oder per E-Mail an{" "}
        <Ph value={siteConfig.contact.email} />. Über dasselbe Formular übernehmen Sie ein bestehendes Profil
        oder melden einen Fehler.
      </p>
    </TextPage>
  );
}
