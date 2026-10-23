import type { CSSProperties } from "react";

import type { SoftwareSummary } from "@/components/software/types";
import { AffiliateButton } from "@/components/ui/affiliate-button";
import { AppLink } from "@/components/ui/app-link";
import { TextLink } from "@/components/ui/button";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { formatPrice, PRICE_UNIT_LABEL } from "@/lib/format";
import { routes } from "@/lib/routes";

export type PartnerOffer = {
  summary: SoftwareSummary;
  strength: string;
  bestFor: string;
  trialDays: number | null;
  freePlan: boolean;
};

function Terms({ offer }: { offer: PartnerOffer }) {
  const { priceFrom } = offer.summary;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
      <div>
        <dt className="type-micro text-text-muted">Preis ab</dt>
        <dd className="mt-0.5 type-small text-ink">
          {priceFrom ? (
            <>
              <span className="font-display font-semibold tabular-nums">{formatPrice(priceFrom.cents)}</span>{" "}
              {PRICE_UNIT_LABEL[priceFrom.unit]}
            </>
          ) : (
            "auf Anfrage"
          )}
        </dd>
      </div>
      <div>
        <dt className="type-micro text-text-muted">Testen</dt>
        <dd className="mt-0.5 type-small text-ink">
          {[offer.trialDays && `${offer.trialDays} Tage kostenlos`, offer.freePlan && "Gratistarif"]
            .filter(Boolean)
            .join(", ") || "keine Angabe"}
        </dd>
      </div>
    </dl>
  );
}

/**
 * Partner block on the home page (Sections 3.10 and 18). Paid relationships live in their own,
 * labeled slot: "Anzeige" on the block, "*" on every outgoing link, alphabetical order and a plain
 * statement that this is not a ranking. Scores shown are the unchanged editorial scores.
 */
export function PartnerOffers({ offers }: { offers: PartnerOffer[] }) {
  if (offers.length === 0) return null;
  return (
    <section aria-labelledby="partner-titel" className="bg-white section-y">
      <div className="container-content">
        <div className="grid gap-6 border-b-[1.5px] border-ink pb-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div className="flex flex-col items-start gap-4">
            <p className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex h-7 items-center rounded-full bg-ink px-3 font-ui text-caption font-semibold tracking-[0.08em] text-white uppercase">
                Anzeige
              </span>
              <span className="inline-flex h-7 items-center rounded-full border border-ink px-3 font-ui text-caption font-semibold tracking-[0.08em] text-ink uppercase">
                Partnerangebote
              </span>
            </p>
            <h2 id="partner-titel" className="type-h2 text-ink">
              Software unserer Partner
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3">
            <p className="type-body text-text-muted">
              Mit diesen Anbietern arbeiten wir über Partnerprogramme zusammen. Schließen Sie über einen mit *
              gekennzeichneten Link einen Vertrag ab, erhalten wir unter Umständen eine Provision. Für Sie
              ändert sich der Preis nicht, und auf unsere Wertungen hat die Provision keinen Einfluss.
            </p>
            <TextLink href={routes.legal.transparency()} className="text-small">
              Wie wir uns finanzieren
            </TextLink>
          </div>
        </div>

        <ul>
          {offers.map((offer) => {
            const s = offer.summary;
            return (
              <li
                key={s.slug}
                style={{ "--vendor-color": s.brandColor } as CSSProperties}
                className="relative grid gap-5 border-b border-ink py-7 pl-5 before:absolute before:top-7 before:bottom-7 before:left-0 before:w-[3px] before:rounded-full before:bg-(--vendor-color) lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,11rem)_auto] lg:items-center lg:gap-8"
              >
                <div className="flex items-center gap-4">
                  <LogoTile name={s.name} logo={s.logo} size={48} />
                  <div className="min-w-0">
                    <h3 className="type-h4 text-ink">
                      <AppLink href={s.href} className="hover:underline hover:underline-offset-4">
                        {s.name}
                      </AppLink>
                    </h3>
                    <p className="type-small text-text-muted">
                      {s.categoryLabel}
                      {s.madeInGermany && " · Anbieter aus Deutschland"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="type-body text-ink">{offer.strength}</p>
                  <p className="type-small text-text-muted">Passt zu: {offer.bestFor}</p>
                </div>

                <Terms offer={offer} />

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2">
                    <span className="type-micro text-text-muted">Redaktionswertung</span>
                    <ScoreChip score={s.score} size="sm" />
                  </div>
                  <AffiliateButton
                    href={s.outboundHref}
                    label="Zum Anbieter"
                    sponsored={s.affiliate}
                    size="sm"
                    adLabel="none"
                  />
                  <TextLink href={s.href} className="text-small">
                    Bewertung lesen
                  </TextLink>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 type-small text-text-muted">
          Alphabetisch sortiert. Diese Auswahl ist kein Ranking: Die Reihenfolge nach Redaktionswertung finden
          Sie in den{" "}
          <AppLink href={routes.categories()} className="link-inline">
            Kategorien
          </AppLink>
          . Preise netto zzgl. MwSt., Stand laut Profil.
        </p>
      </div>
    </section>
  );
}
