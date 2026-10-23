import type { Metadata } from "next";

import { LegalReviewNote } from "@/components/content/page-parts";
import { TextPage } from "@/components/content/text-page";
import { AppLink } from "@/components/ui/app-link";
import { listSoftware } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Transparenz",
  description:
    "Wie wir uns finanzieren: Affiliate-Links, gekennzeichnete Anzeigen und warum Wertungen nicht käuflich sind.",
  path: routes.legal.transparency(),
});

export default function TransparencyPage() {
  const partners = listSoftware().filter((s) => s.affiliate?.active);
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Transparenz", href: routes.legal.transparency() },
      ]}
      title="Transparenz"
      lead={`Wie sich ${siteConfig.brand.name} finanziert und wie wir unsere Unabhängigkeit schützen.`}
      before={<LegalReviewNote />}
    >
      <h2>Affiliate-Links</h2>
      <p>
        Mit * gekennzeichnete Links sind Affiliate-Links. Schließen Sie darüber einen Vertrag ab, erhalten wir
        unter Umständen eine Provision. Für Sie ändert sich der Preis nicht, und auf unsere Bewertungen hat
        die Provision keinen Einfluss.
      </p>
      {partners.length > 0 && (
        <>
          <h2>Unsere Partnerprogramme</h2>
          <p>
            Derzeit haben wir Partnerschaften mit diesen Anbietern. Links zu ihnen tragen ein *, und auf der
            Startseite stellen wir sie in einem eigenen, als Anzeige gekennzeichneten Bereich vor.
          </p>
          <ul>
            {partners.map((s) => (
              <li key={s.slug}>
                <AppLink href={routes.software(s.slug)}>{s.name}</AppLink>
              </li>
            ))}
          </ul>
          <p>
            Bei allen anderen Programmen verlinken wir direkt und ohne Provision auf die Website des
            Anbieters. Eine Partnerschaft ändert weder die Redaktionswertung noch die Reihenfolge in unseren
            Kategorien.
          </p>
        </>
      )}
      <h2>Anzeigen</h2>
      <p>
        Bezahlte Platzierungen und Partnerangebote stehen in eigenen Bereichen und tragen immer den Hinweis
        Anzeige. Sie sind nach dem Namen sortiert und kein Ranking.
      </p>
      <h2>Unabhängigkeit</h2>
      <p>
        Wertungen, Auszeichnungen und Ranglisten folgen ausschließlich unserer{" "}
        <AppLink href={routes.methodology()}>Methodik</AppLink>. Sie können weder gekauft noch durch
        Partnerschaften beeinflusst werden.
      </p>
      <h2>Kostenlose Beratung</h2>
      <p>
        Unsere Beratung ist für Unternehmen kostenlos. Wir empfehlen die Programme, die zu Ihren Anforderungen
        passen, nicht die mit der höchsten Provision.
      </p>
      <h2>Marken und Logos</h2>
      <p>
        Produktnamen und Logos gehören den jeweiligen Inhabern. Wir verwenden sie nur, um die bewerteten
        Produkte zu kennzeichnen.
      </p>
    </TextPage>
  );
}
