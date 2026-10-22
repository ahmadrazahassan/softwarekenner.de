import { AppLink } from "@/components/ui/app-link";
import { AWARD_LABEL, AwardSeal, type AwardKind } from "@/components/ui/award-seal";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { cn } from "@/lib/utils/cn";

import type { SoftwareSummary } from "./types";

/** The rule behind each award (Section 11.3), shown as the one line reason. */
export const AWARD_REASON: Record<AwardKind, string> = {
  redaktion: "Höchste Redaktionswertung der Kategorie, mindestens 4,3.",
  preisLeistung: "Beste Wertung bei Preis-Leistung unter allen Programmen ab 4,0.",
  selbststaendige: "Höchste Wertung unter den Programmen für Selbstständige und Kleinstbetriebe.",
  mittelstand: "Höchste Wertung unter den Programmen für 50 bis 249 Mitarbeitende.",
  datenschutz: "Beste Wertung bei Datenschutz unter den Programmen mit Servern in Deutschland.",
};

/** Award card for "Unsere Empfehlungen" (Section 13.2). Awards are computed, never sold. */
export function AwardCard({
  kind,
  year,
  software,
  className,
}: {
  kind: AwardKind;
  year: number;
  software: SoftwareSummary;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "card-lift relative flex gap-5 rounded-lg border border-line bg-white p-5 shadow-sm",
        className,
      )}
    >
      <AwardSeal kind={kind} year={year} size="md" className="flex-none" />
      <div className="flex min-w-0 flex-col gap-2">
        <p className="type-micro text-brand-ink">{AWARD_LABEL[kind].title}</p>
        <div className="flex items-center gap-3">
          <LogoTile name={software.name} logo={software.logo} size={40} />
          <h3 className="type-h4 text-ink">
            <AppLink href={software.href} className="after:absolute after:inset-0 after:content-['']">
              {software.name}
            </AppLink>
          </h3>
        </div>
        <ScoreChip score={software.score} size="sm" className="self-start" />
        <p className="type-small text-text-muted">{AWARD_REASON[kind]}</p>
      </div>
    </article>
  );
}
