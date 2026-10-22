import { submitReview } from "@/app/actions/forms";
import { ReviewForm } from "@/components/forms/review-form";
import { listSoftware } from "@/lib/content";
import type { Metadata } from "next";

import { TextPage } from "@/components/content/text-page";
import { AppLink } from "@/components/ui/app-link";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Bewertung schreiben",
  description:
    "Wie Sie eine Software bewerten, wie wir Bewertungen verifizieren und welche Richtlinien gelten.",
  path: routes.writeReview(),
});

/** Section 13.11: guidelines plus the multi step form with business email confirmation. */
export default function WriteReviewPage() {
  return (
    <TextPage
      crumbs={[
        { label: "Startseite", href: routes.home() },
        { label: "Bewertung schreiben", href: routes.writeReview() },
      ]}
      title="Bewertung schreiben"
      lead="Ihre Erfahrung hilft anderen Unternehmen bei der Entscheidung. Jede Bewertung prüfen wir vor der Veröffentlichung."
      after={
        <section aria-labelledby="formular" className="flex flex-col gap-4">
          <h2 id="formular" className="type-h2 text-ink">
            Ihre Bewertung
          </h2>
          <ReviewForm
            products={listSoftware().map((s) => ({ value: s.slug, label: s.name }))}
            action={submitReview}
          />
        </section>
      }
    >
      <h2>So läuft es ab</h2>
      <ol>
        <li>Sie wählen das Programm und bewerten es in fünf Bereichen.</li>
        <li>Sie beschreiben Stärken, Schwächen und Ihre Erfahrung in mindestens 200 Zeichen.</li>
        <li>Sie bestätigen Ihre Bewertung über einen Link an Ihre geschäftliche E-Mail-Adresse.</li>
        <li>Wir prüfen die Bewertung vor der Veröffentlichung auf unsere Richtlinien.</li>
      </ol>
      <h2>Richtlinien</h2>
      <ul>
        <li>Bewerten Sie nur Software, die Sie selbst beruflich genutzt haben.</li>
        <li>Keine Bewertungen von Mitarbeitenden des Anbieters oder seiner Wettbewerber.</li>
        <li>Sachlich bleiben, keine persönlichen Daten Dritter.</li>
        <li>Haben Sie für die Bewertung einen Anreiz erhalten, kennzeichnen wir sie entsprechend.</li>
      </ul>
      <p>
        Wie wir mit Bewertungen umgehen, steht in unserer{" "}
        <AppLink href={routes.methodology()}>Methodik</AppLink>.
      </p>
    </TextPage>
  );
}
