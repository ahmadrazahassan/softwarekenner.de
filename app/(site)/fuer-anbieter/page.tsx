import type { Metadata } from "next";

import { TextPage } from "@/components/content/text-page";
import { AppLink } from "@/components/ui/app-link";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Für Anbieter",
  description:
    "Was für Softwareanbieter kostenlos ist, was bezahlt ist und warum Wertungen und Ranglisten nicht käuflich sind.",
  path: routes.forVendors(),
});

export default function VendorsPage() {
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Für Anbieter", href: routes.forVendors() },
      ]}
      title="Für Anbieter"
      lead="Sie bieten Software für Unternehmen in Deutschland an? So arbeiten wir mit Anbietern zusammen."
    >
      <h2>Kostenlos</h2>
      <ul>
        <li>Der Eintrag Ihres Produkts, sofern es die Voraussetzungen für den deutschen Markt erfüllt.</li>
        <li>Hinweise auf Fehler oder veraltete Angaben in Ihrem Profil, mit Quelle.</li>
        <li>Antworten auf Nutzerbewertungen, sobald diese freigeschaltet sind.</li>
      </ul>
      <h2>Bezahlt</h2>
      <p>
        Gekennzeichnete Werbeplätze in eigenen Bereichen, immer mit dem Hinweis Anzeige.
        Affiliate-Partnerschaften, deren Links wir mit * kennzeichnen.
      </p>
      <h2>Nicht käuflich</h2>
      <p>
        Wertungen, Auszeichnungen und die Reihenfolge in Ranglisten. Sie folgen ausschließlich unserer{" "}
        <AppLink href={routes.methodology()}>Methodik</AppLink>. Eine Partnerschaft ändert daran nichts.
      </p>
      <h2>Produkt eintragen</h2>
      <p>
        Welche Angaben wir brauchen und welche Voraussetzungen gelten, steht auf der Seite{" "}
        <AppLink href={routes.submitSoftware()}>Software eintragen</AppLink>.
      </p>
    </TextPage>
  );
}
