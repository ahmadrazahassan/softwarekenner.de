import { ArrowUpRight, Headset, Scale } from "lucide-react";

import { AffiliateButton } from "@/components/ui/affiliate-button";
import { AppLink } from "@/components/ui/app-link";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

/**
 * Calls to action on a profile (Section 6): one orange primary per block, secondary actions in ink
 * or outline. Outgoing links go through AffiliateButton, so "Anzeige" and rel stay correct.
 */

export type CtaSoftware = {
  slug: string;
  name: string;
  trialDays: number | null;
  freePlan: boolean;
  outboundHref: string;
  sponsored: boolean;
  alternatives: string[];
};

const outboundLabel = (s: CtaSoftware) =>
  s.trialDays
    ? `${s.trialDays} Tage kostenlos testen`
    : s.freePlan
      ? "Kostenlos starten"
      : "Website besuchen";

/** Large split block after the key figures: try it, compare it, or ask us. */
export function NextStepCta({ software }: { software: CtaSoftware }) {
  const compareHref = routes.compareTool([software.slug, ...software.alternatives.slice(0, 2)]);
  return (
    <section
      aria-labelledby="naechster-schritt"
      className="grid gap-4 overflow-hidden rounded-xl bg-white shadow-xs lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
    >
      <div className="m-2 flex flex-col justify-between gap-8 rounded-xl p-6 text-white bg-ink-glow sm:p-10 lg:m-3">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex rounded-full border border-ink-700 px-3 py-1 type-small font-medium text-on-dark-muted">
            Nächster Schritt
          </span>
          <h2
            id="naechster-schritt"
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-tight"
          >
            {software.name} selbst ausprobieren
          </h2>
          <p className="measure type-body-lg text-on-dark-muted">
            {software.trialDays
              ? `Der Anbieter bietet eine kostenlose Testphase von ${software.trialDays} Tagen. Prüfen Sie Ihre wichtigsten Abläufe mit echten Daten, bevor Sie sich binden.`
              : "Fordern Sie eine Demo oder ein Angebot direkt beim Anbieter an und prüfen Sie Ihre wichtigsten Abläufe mit echten Daten."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <AffiliateButton
            href={software.outboundHref}
            label={outboundLabel(software)}
            sponsored={software.sponsored}
            adLabel="below"
            size="lg"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 pt-0 sm:p-6 lg:py-6 lg:pl-0">
        <LinkTile
          href={compareHref}
          icon={Scale}
          title="Mit Alternativen vergleichen"
          text="Preise, Deutschland-Check und Wertung nebeneinander."
          tone="cream"
        />
        <LinkTile
          href={routes.advisory()}
          icon={Headset}
          title="Kostenlose Beratung"
          text="Wir grenzen die Auswahl mit Ihnen ein, unverbindlich."
          tone="tint"
        />
      </div>
    </section>
  );
}

function LinkTile({
  href,
  icon,
  title,
  text,
  tone,
}: {
  href: string;
  icon: typeof Scale;
  title: string;
  text: string;
  tone: "cream" | "tint";
}) {
  return (
    <AppLink
      href={href}
      className={cn(
        "group relative flex flex-1 flex-col justify-between gap-6 rounded-xl p-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        tone === "cream" ? "bg-brand-50 hover:bg-brand-100" : "bg-surface-tint hover:bg-line",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <Icon icon={icon} size={28} className="text-ink" />
        <span className="inline-grid size-11 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-ink group-hover:text-white">
          <Icon icon={ArrowUpRight} size={20} />
        </span>
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="font-display text-[1.5rem] leading-tight font-semibold text-ink">{title}</span>
        <span className="type-small text-text-muted">{text}</span>
      </span>
    </AppLink>
  );
}

/** Compact row between sections. */
export function InlineCta({
  software,
  title,
  text,
  secondary,
}: {
  software: CtaSoftware;
  title: string;
  text: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <aside className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-xs sm:p-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <p className="font-display text-[1.5rem] leading-tight font-semibold text-ink">{title}</p>
        <p className="measure type-body text-text-muted">{text}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {secondary && (
          <ButtonLink href={secondary.href} variant="outline">
            {secondary.label}
          </ButtonLink>
        )}
        <AffiliateButton
          href={software.outboundHref}
          label={outboundLabel(software)}
          sponsored={software.sponsored}
          adLabel="inline"
        />
      </div>
    </aside>
  );
}

/** Closing block: advice for the undecided. */
export function AdvisorCta({ name }: { name: string }) {
  return (
    <aside className="grid gap-6 rounded-xl bg-brand-50 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex flex-col gap-3">
        <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-semibold tracking-tight text-ink">
          Noch unsicher, ob {name} passt?
        </p>
        <p className="measure type-body-lg text-text-muted">
          Beschreiben Sie uns Ihre Anforderungen. Wir helfen Ihnen kostenlos, die Auswahl einzugrenzen,
          unabhängig von Provisionen.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={routes.advisory()} variant="ink" size="lg">
          Beratung anfordern
        </ButtonLink>
        <ButtonLink href={routes.categories()} variant="outline" size="lg">
          Alle Kategorien
        </ButtonLink>
      </div>
    </aside>
  );
}
