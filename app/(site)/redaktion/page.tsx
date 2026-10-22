import type { Metadata } from "next";

import { PageHeader } from "@/components/content/page-parts";
import { AppLink } from "@/components/ui/app-link";
import { TextLink } from "@/components/ui/button";
import { listAuthors } from "@/lib/content";
import { initials } from "@/lib/format";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Redaktion",
  description:
    "Wer bei uns Software bewertet, nach welchen Grundsätzen wir arbeiten und wie Sie uns erreichen.",
  path: routes.editorialTeam(),
});

export default function EditorialPage() {
  const authors = listAuthors();
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Redaktion", href: routes.editorialTeam() },
        ]}
        title="Redaktion"
        lead="Hinter jeder Bewertung steht ein Mensch mit Namen. Wir zeigen, wer recherchiert, wer prüft und nach welchen Grundsätzen wir arbeiten."
      />
      <div className="container-content flex flex-col gap-12 pb-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {authors.map((a) => (
            <li key={a.slug} className="flex gap-5 rounded-lg border border-line bg-white p-6">
              <span
                aria-hidden="true"
                className="flex size-16 flex-none items-center justify-center rounded-full bg-line font-display text-lead font-bold text-ink"
              >
                {initials(a.name)}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="type-h4 text-ink">
                  <AppLink href={routes.author(a.slug)} className="hover:underline">
                    {a.name}
                  </AppLink>
                </h2>
                <p className="type-small text-text-muted">{a.role}</p>
                <p className="mt-2 type-body text-ink">{a.bio}</p>
              </div>
            </li>
          ))}
        </ul>
        <section aria-labelledby="grundsaetze" className="prose-brand container-reading mx-0 px-0">
          <h2 id="grundsaetze">Unsere Grundsätze</h2>
          <ul>
            <li>Jede Angabe hat eine Quelle mit Abrufdatum.</li>
            <li>Jedes Programm hat echte, konkrete Schwächen. Wir nennen sie.</li>
            <li>Test heißt Test nur, wenn wir die Software selbst genutzt haben.</li>
            <li>Provisionen beeinflussen keine Wertung und keine Reihenfolge.</li>
            <li>Wir erfinden keine Bewertungen, Zitate oder Zahlen.</li>
          </ul>
          <p>
            <TextLink href={routes.methodology()}>Zur Methodik</TextLink>
          </p>
        </section>
      </div>
    </>
  );
}
