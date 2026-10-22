import { ArrowRight, type LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { AffiliateButton } from "@/components/ui/affiliate-button";
import { AppLink } from "@/components/ui/app-link";
import { AwardSeal } from "@/components/ui/award-seal";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { AdLabel, StatusChip } from "@/components/ui/chip";
import { Disclosure } from "@/components/ui/disclosure";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { RatingStars } from "@/components/ui/rating-stars";
import { ScoreChip } from "@/components/ui/score-chip";
import { formatNumber, formatPrice, PRICE_UNIT_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

import { CompareCheckbox } from "./compare";
import { DeutschlandCheck, ProsCons } from "./data-display";
import type { CheckRow, SoftwareSummary } from "./types";

/** Honest wording switch (Section 11.4). */
export const reviewLinkLabel = (handsOnTest: boolean) => (handsOnTest ? "Zum Testbericht" : "Zur Bewertung");

function PriceLine({ price, className }: { price: SoftwareSummary["priceFrom"]; className?: string }) {
  if (!price) return <p className={cn("type-small text-text-muted", className)}>Preis auf Anfrage</p>;
  return (
    <p className={cn("type-small text-ink", className)}>
      ab <span className="font-display font-semibold tabular-nums">{formatPrice(price.cents)}</span>{" "}
      {PRICE_UNIT_LABEL[price.unit]}{" "}
      <span className="type-micro text-text-muted normal-case">zzgl. MwSt.</span>
    </p>
  );
}

/* ---------- A. SoftwareCard (Reference 4 structure) ---------- */

export function SoftwareCard({ software, className }: { software: SoftwareSummary; className?: string }) {
  return (
    <article
      className={cn(
        "card-lift group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm",
        className,
      )}
      style={{ "--vendor-color": software.brandColor } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="h-24 flex-none transition-[filter] duration-200 group-hover:saturate-[1.1]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--vendor-color) 22%, #eceefe), #eceefe)",
        }}
      />
      <div className="relative mx-auto -mt-11">
        <LogoTile name={software.name} logo={software.logo} size={88} />
        {software.award && (
          <AwardSeal
            kind={software.award.kind}
            year={software.award.year}
            size="sm"
            className="absolute -top-3 -right-5"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 px-5 pt-4 pb-5 text-center">
        <h3 className="font-display text-[1.5rem] leading-tight font-bold text-ink">{software.name}</h3>
        <p className="type-label text-text-muted">{software.categoryLabel}</p>
        <div className="mt-1 flex flex-col items-center gap-1">
          <RatingStars value={software.score} size={16} />
          <p className="type-small text-text-muted">
            Redaktionswertung
            {software.userReviewCount > 0 && ` · ${formatNumber(software.userReviewCount)} Nutzerbewertungen`}
          </p>
        </div>
        <PriceLine price={software.priceFrom} className="mt-1" />
        <div className="mt-auto pt-3">
          <AppLink href={software.href} className="link-cta after:absolute after:inset-0 after:content-['']">
            <span>{reviewLinkLabel(software.handsOnTest)}</span>
            <span className="sr-only">: {software.name}</span>
            <Icon icon={ArrowRight} size={16} />
          </AppLink>
        </div>
      </div>
    </article>
  );
}

/* ---------- B. FeaturedCard (paid placements only) ---------- */

export function FeaturedCard({ software, className }: { software: SoftwareSummary; className?: string }) {
  return (
    <article
      className={cn("flex h-full flex-col gap-4 rounded-lg border border-line bg-white p-5", className)}
    >
      <div className="flex items-start justify-between">
        <AdLabel />
        <ScoreChip score={software.score} size="sm" />
      </div>
      <div className="flex items-center gap-3">
        <LogoTile name={software.name} logo={software.logo} size={48} />
        <div>
          <h3 className="type-h4 text-ink">{software.name}</h3>
          <p className="type-small text-text-muted">{software.categoryLabel}</p>
        </div>
      </div>
      <PriceLine price={software.priceFrom} />
      <AffiliateButton
        href={software.outboundHref}
        label="Website besuchen"
        sponsored={software.affiliate}
        size="sm"
        block
        adLabel="none"
        className="mt-auto"
      />
    </article>
  );
}

/* ---------- C. RankedListItem (Reference 1 ranked list) ---------- */

export type RankedDetails = {
  verdict: string;
  idealFor: string;
  keyFacts: { label: string; value: string }[];
  pros: string[];
  cons: string[];
  check: CheckRow[];
};

export function RankedListItem({
  rank,
  software,
  details,
  className,
}: {
  rank: number;
  software: SoftwareSummary;
  details: RankedDetails;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative rounded-lg border border-line bg-white p-5 pt-9 shadow-sm sm:p-6 sm:pt-9",
        className,
      )}
    >
      <p className="absolute -top-px left-5 rounded-b-sm bg-brand-50 px-3 py-1 font-display text-body font-semibold text-brand-ink tabular-nums sm:left-6">
        <span className="sr-only">Platz </span>#{rank}
      </p>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <LogoTile name={software.name} logo={software.logo} size={72} />
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="type-h3 text-ink">{software.name}</h3>
                <ScoreChip score={software.score} />
              </div>
              <p className="type-small text-text-muted">von {software.vendorName}</p>
              {software.madeInGermany && (
                <StatusChip flag className="mt-1 self-start">
                  Anbieter aus Deutschland
                </StatusChip>
              )}
            </div>
          </div>
          <p className="type-body text-ink">{details.verdict}</p>
          <dl className="grid grid-cols-1 gap-3 rounded-md bg-surface-tint p-4 sm:grid-cols-3">
            {details.keyFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-micro text-text-muted">{fact.label}</dt>
                <dd className="mt-1 type-label font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="type-small text-ink">
            <span className="font-semibold">Ideal für:</span> {details.idealFor}
          </p>
          <ProsCons
            pros={details.pros.slice(0, 2)}
            cons={details.cons.slice(0, 1)}
            className="gap-5 [&_h3]:mb-2 [&_h3]:text-body"
          />
        </div>
        <div className="flex flex-col gap-3 lg:border-l lg:border-line lg:pl-6">
          <AffiliateButton
            href={software.outboundHref}
            label="Website besuchen"
            sponsored={software.affiliate}
            block
          />
          <ButtonLink href={software.href} variant="outline" icon="none" block>
            {software.handsOnTest ? "Testbericht lesen" : "Bewertung lesen"}
            <span className="sr-only">: {software.name}</span>
          </ButtonLink>
          <CompareCheckbox item={{ slug: software.slug, name: software.name, logo: software.logo }} />
        </div>
      </div>
      <div className="mt-4 border-t border-line pt-2">
        <Disclosure label="Mehr Details" openLabel="Weniger Details">
          <h4 className="mb-3 type-h4 text-ink">Deutschland-Check</h4>
          <DeutschlandCheck rows={details.check} />
        </Disclosure>
      </div>
    </article>
  );
}

/* ---------- M. CategoryTile ---------- */

export function CategoryTile({
  name,
  href,
  icon,
  count,
  logos,
  className,
}: {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Number of profiles, computed from content. */
  count: number;
  logos: { name: string; logo?: string | null }[];
  className?: string;
}) {
  return (
    <article
      className={cn(
        "card-lift group relative flex flex-col gap-4 rounded-lg border border-line bg-white p-5 shadow-sm",
        className,
      )}
    >
      <Icon icon={icon} size={28} className="text-ink" />
      <div>
        <h3 className="type-h4 text-ink">
          <AppLink
            href={href}
            className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-ink"
          >
            {name}
          </AppLink>
        </h3>
        <p className="type-small text-text-muted">
          {count === 1 ? "1 Programm" : `${formatNumber(count)} Programme`}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex -space-x-2" aria-hidden="true">
          {logos.slice(0, 3).map((logo) => (
            <LogoTile
              key={logo.name}
              name={logo.name}
              logo={logo.logo}
              size={40}
              className="ring-2 ring-white"
            />
          ))}
        </div>
        <Icon
          icon={ArrowRight}
          size={20}
          className="text-ink opacity-0 transition-[opacity,transform] duration-200 group-focus-within:opacity-100 group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </div>
    </article>
  );
}

/* ---------- L. ComparisonCard ---------- */

export function ComparisonCard({
  a,
  b,
  teaser,
  href,
  className,
}: {
  a: { name: string; logo?: string | null };
  b: { name: string; logo?: string | null };
  teaser: string;
  href: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "card-lift relative flex flex-col gap-4 rounded-lg border border-line bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3" aria-hidden="true">
        <LogoTile name={a.name} logo={a.logo} size={48} />
        <span className="type-micro text-text-muted">vs.</span>
        <LogoTile name={b.name} logo={b.logo} size={48} />
      </div>
      <h3 className="type-h4 text-ink">
        {a.name} oder {b.name}?
      </h3>
      <p className="type-small text-text-muted">{teaser}</p>
      <TextLink href={href} className="mt-auto after:absolute after:inset-0 after:content-['']">
        Zum Vergleich
      </TextLink>
    </article>
  );
}

/** Section heading with optional action on the right (Reference 4 "To category ›"). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  align = "left",
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 lg:mb-14",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && <p className="type-eyebrow text-brand-ink">{eyebrow}</p>}
        <h2 id={id} className="type-h2 text-ink">
          {title}
        </h2>
        {intro && <p className="measure type-lead text-text-muted">{intro}</p>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}
