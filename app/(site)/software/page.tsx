import type { Metadata } from "next";

import { PageHeader } from "@/components/content/page-parts";
import { AppLink } from "@/components/ui/app-link";
import { EmptyState } from "@/components/ui/feedback";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { getCategory, getScore, listSoftware } from "@/lib/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Unternehmenssoftware von A bis Z: alle Programme",
  description:
    "Alle bewerteten Programme für Buchhaltung, Zeiterfassung, HR, Lohn, ERP und CRM von A bis Z, mit Redaktionswertung, Preisen in Euro und Deutschland-Check.",
  path: routes.softwareIndex(),
});

/** First letter for grouping; umlauts sort with their base letter (Section 17). */
const letterOf = (name: string) =>
  name.normalize("NFKD").replace(/\p{M}/gu, "").charAt(0).toLocaleUpperCase("de");

export default function SoftwareIndexPage() {
  const software = listSoftware();
  const groups = new Map<string, typeof software>();
  for (const s of software) {
    const letter = /[A-Z]/.test(letterOf(s.name)) ? letterOf(s.name) : "#";
    groups.set(letter, [...(groups.get(letter) ?? []), s]);
  }
  const letters = [...groups.keys()];

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Startseite", href: routes.home() },
          { label: "Software von A bis Z", href: routes.softwareIndex() },
        ]}
        title="Software von A bis Z"
        lead="Alle Programme, die wir bewertet haben, alphabetisch sortiert."
      />
      <div className="container-content flex flex-col gap-10 pb-20">
        {software.length === 0 ? (
          <EmptyState
            title="Noch keine Profile veröffentlicht"
            text="Hier erscheinen alle Programme, sobald die ersten Bewertungen geprüft sind."
          />
        ) : (
          <>
            <nav aria-label="Buchstaben" className="flex flex-wrap gap-2">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#buchstabe-${l}`}
                  className="flex size-11 items-center justify-center rounded-full border border-line-strong bg-white type-label text-ink hover:border-ink"
                >
                  {l}
                </a>
              ))}
            </nav>
            {letters.map((l) => (
              <section key={l} id={`buchstabe-${l}`} aria-labelledby={`titel-${l}`} className="scroll-mt-24">
                <h2 id={`titel-${l}`} className="mb-4 type-h3 text-ink">
                  {l}
                </h2>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-3">
                  {groups.get(l)!.map((s) => (
                    <li key={s.slug}>
                      <AppLink
                        href={routes.software(s.slug)}
                        className="flex items-center gap-3 rounded-md border border-line bg-white p-3 transition-colors hover:border-line-strong"
                      >
                        <LogoTile name={s.name} logo={s.logo} size={40} />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="type-label font-semibold text-ink">{s.name}</span>
                          <span className="type-small text-text-muted">
                            {getCategory(s.primaryCategory)?.shortName}
                          </span>
                        </span>
                        <ScoreChip score={getScore(s.slug) ?? 0} size="sm" />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </>
  );
}
