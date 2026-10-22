import { ArcGauge } from "@/components/ui/animated";
import type { MarketDatasetData, SoftwareData } from "@/lib/content/schemas";
import type { checkTally, planLadder, pricePosition, rankIn, teamCosts } from "@/lib/content/stats";
import { formatNumber, formatPercent, formatPrice, PRICE_UNIT_LABEL } from "@/lib/format";
import { scoreLabel } from "@/lib/scoring";
import { cn } from "@/lib/utils/cn";

import { ArrowLink, Change, Columns, Figure, Panel, PanelHeader, PillBars, SourceNote } from "./parts";

/**
 * "In Zahlen" section of a profile, laid out like an analytics dashboard: KPI tiles, plan columns,
 * a check gauge, team costs, the price against the category and market context. Everything is
 * computed from our content; cards without data are left out.
 */

export type SoftwareStatsData = {
  category?: { shortName: string; name: string } | undefined;
  rank: ReturnType<typeof rankIn>;
  price: ReturnType<typeof pricePosition>;
  plans: ReturnType<typeof planLadder>;
  team: ReturnType<typeof teamCosts>;
  check: ReturnType<typeof checkTally>;
};

const SERVER_TEXT: Record<string, string> = {
  DE: "in Deutschland",
  EU: "in der EU",
  USA: "in den USA",
  weltweit: "weltweit verteilt",
  unbekannt: "ohne Angabe",
};

const STATUS_TEXT: Record<string, string> = {
  ja: "ja, laut Anbieter",
  teilweise: "teilweise",
  nein: "nein",
  unbekannt: "ohne Angabe",
};

const euro = (cents: number) => formatPrice(cents, { compact: true });
const decimalsOf = (cents: number) => (cents % 100 === 0 ? 0 : 2);

function Kpi({
  label,
  children,
  footer,
  href,
  hrefLabel,
  dark,
}: {
  label: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  hrefLabel?: string;
  dark?: boolean;
}) {
  return (
    <Panel tone={dark ? "ink" : "light"} className="min-h-52 justify-between gap-5">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("type-label", dark ? "text-on-dark-muted" : "text-text-muted")}>{label}</span>
        {href && <ArrowLink href={href} label={hrefLabel ?? label} dark={dark} />}
      </div>
      <div className="flex flex-col gap-3">
        {children}
        {footer && (
          <div className={cn("type-small", dark ? "text-on-dark-muted" : "text-text-muted")}>{footer}</div>
        )}
      </div>
    </Panel>
  );
}

export function SoftwareStats({
  software,
  score,
  stats,
  market,
}: {
  software: SoftwareData;
  score: number;
  stats: SoftwareStatsData;
  market: { origin?: MarketDatasetData; apps?: MarketDatasetData };
}) {
  const { rank, price, plans, team, check, category } = stats;
  const teamRows = team?.rows.filter((r): r is { users: number; cents: number } => r.cents !== null) ?? [];
  const open = check.total - check.ja;
  const trial = software.pricing.trialDays ?? 0;
  const showPlans = plans.length > 1;
  const showTeam = team !== null && teamRows.length >= 2;
  const entry = price ?? plans[0] ?? null;
  const checkFooter =
    [
      check.teilweise > 0 && `${check.teilweise} teilweise`,
      check.nein > 0 && `${check.nein} nicht erfüllt`,
      check.unbekannt > 0 && `${check.unbekannt} ohne Angabe`,
    ]
      .filter(Boolean)
      .join(" · ") || "Alle Fragen erfüllt";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          dark
          label="Redaktionswertung"
          href="#bewertung"
          hrefLabel="Zur Bewertung im Detail"
          footer={
            rank && category ? (
              <>
                Platz <strong className="font-semibold text-white">{rank.rank}</strong> von {rank.of} in{" "}
                {category.shortName}
              </>
            ) : undefined
          }
        >
          <div className="flex flex-wrap items-end gap-3">
            <Figure value={score} decimals={1} suffix="/5" size="lg" dark />
            <span className="rounded-full bg-brand-500 px-2.5 py-1 type-small font-semibold text-ink">
              {scoreLabel(score)}
            </span>
          </div>
        </Kpi>

        <Kpi
          label="Einstiegspreis"
          href="#preise"
          hrefLabel="Zu den Preisen"
          footer={
            price
              ? `Median in ${category?.shortName ?? "der Kategorie"}: ${euro(price.median)}`
              : entry
                ? "Günstigster kostenpflichtiger Tarif"
                : "Konditionen im Angebot des Anbieters"
          }
        >
          {entry ? (
            <div className="flex flex-wrap items-end gap-3">
              <Figure value={entry.cents / 100} decimals={decimalsOf(entry.cents)} suffix={" €"} size="lg" />
              {price && <Change value={price.deltaPercent} srLabel="zum Median der Kategorie" />}
            </div>
          ) : (
            <span className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-none font-medium text-ink">
              Auf Anfrage
            </span>
          )}
          {entry && <span className="type-small text-text-muted">{PRICE_UNIT_LABEL[entry.unit]}, netto</span>}
        </Kpi>

        <Kpi
          label="Deutschland-Check"
          href="#deutschland-check"
          hrefLabel="Zum Deutschland-Check"
          footer={checkFooter}
        >
          <Figure value={check.ja} suffix={`/${check.total}`} size="lg" />
          <span className="type-small text-text-muted">Fragen erfüllt</span>
        </Kpi>

        {trial > 0 ? (
          <Kpi
            label="Testphase"
            href="#preise"
            hrefLabel="Zu den Preisen"
            footer={software.pricing.freePlan ? "Dazu eine kostenlose Version" : "Kostenlos laut Anbieter"}
          >
            <Figure value={trial} suffix={" Tage"} size="lg" />
          </Kpi>
        ) : (
          <Kpi
            label="Schnittstellen"
            href="#funktionen"
            hrefLabel="Zu Funktionen und Schnittstellen"
            footer={software.integrations.slice(0, 3).join(", ") || undefined}
          >
            <Figure value={software.integrations.length} size="lg" />
          </Kpi>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {showPlans ? (
          <Panel className="lg:col-span-8">
            <PanelHeader pill="netto pro Monat" title="Preisstufen im Überblick" />
            <Columns
              height="h-64"
              items={plans.map((p) => ({ label: p.name, value: p.cents, highlight: p.recommended }))}
              format={euro}
            />
            <p className="type-small text-text-muted">
              Jeweils der günstigere Abrechnungszeitraum. Hervorgehoben ist der Tarif, den wir empfehlen.
            </p>
          </Panel>
        ) : showTeam ? (
          <TeamCard plan={team!.plan} rows={teamRows} className="lg:col-span-8" />
        ) : null}

        <Panel className={showPlans || showTeam ? "lg:col-span-4" : "lg:col-span-12"}>
          <PanelHeader
            pill="Deutschland-Check"
            title="So viel ist belegt"
            action={<ArrowLink href="#deutschland-check" label="Zum Deutschland-Check" />}
          />
          <ArcGauge
            percent={(check.ja / check.total) * 100}
            segments={check.total * 3}
            size={260}
            thickness={26}
            activeClassName="stroke-positive"
          >
            <Figure value={check.ja} suffix={`/${check.total}`} size="md" />
            <span className="mt-1 type-small text-text-muted">erfüllt</span>
          </ArcGauge>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2 rounded-lg bg-surface-tint p-4">
              <span className="type-small text-text-muted">erfüllt</span>
              <Figure value={check.ja} size="sm" />
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-surface-tint p-4">
              <span className="type-small text-text-muted">offen oder teilweise</span>
              <Figure value={open} size="sm" />
            </div>
          </div>
        </Panel>
      </div>

      {(showPlans && showTeam) || (price && category) ? (
        <div className="grid gap-4 lg:grid-cols-12">
          {showPlans && showTeam && <TeamCard plan={team!.plan} rows={teamRows} className="lg:col-span-6" />}
          {price && category && (
            <Panel className={showPlans && showTeam ? "lg:col-span-6" : "lg:col-span-12"}>
              <PanelHeader
                pill={category.shortName}
                title={price.deltaPercent <= 0 ? "Günstiger als die Mitte" : "Teurer als die Mitte"}
                action={<ArrowLink href="#alternativen" label="Zu den Alternativen" />}
              />
              <PillBars
                thickness="h-10"
                items={(() => {
                  const max = Math.max(price.cents, price.median, price.min);
                  return [
                    {
                      label: software.name,
                      value: (price.cents / max) * 100,
                      display: euro(price.cents),
                      highlight: true,
                    },
                    {
                      label: "Median der Kategorie",
                      value: (price.median / max) * 100,
                      display: euro(price.median),
                    },
                    {
                      label: "Günstigster Einstieg",
                      value: (price.min / max) * 100,
                      display: euro(price.min),
                      muted: true,
                    },
                  ];
                })()}
              />
              <p className="type-small text-text-muted">
                Günstigster kostenpflichtiger Tarif im Vergleich zu {price.peers} Programmen mit gleicher
                Preisbasis, netto. Der teuerste Einstieg liegt bei {euro(price.max)}.
              </p>
            </Panel>
          )}
        </div>
      ) : null}

      {market.origin && <MarketContext software={software} origin={market.origin} apps={market.apps} />}
    </div>
  );
}

function TeamCard({
  plan,
  rows,
  className,
}: {
  plan: string;
  rows: { users: number; cents: number }[];
  className?: string;
}) {
  return (
    <Panel className={className}>
      <PanelHeader pill={`Tarif ${plan}`} title="Kosten nach Teamgröße" />
      <Columns
        height="h-64"
        items={rows.map((r, i) => ({
          label: `${formatNumber(r.users)} Nutzer`,
          value: r.cents,
          highlight: i === rows.length - 1,
        }))}
        format={euro}
      />
      <p className="type-small text-text-muted">
        Netto pro Monat. Fehlt eine Teamgröße, nennt der Anbieter dafür keinen festen Preis.
      </p>
    </Panel>
  );
}

function MarketContext({
  software,
  origin,
  apps,
}: {
  software: SoftwareData;
  origin: MarketDatasetData;
  apps?: MarketDatasetData;
}) {
  const de = origin.points.find((p) => p.highlight);
  const appPoint = apps?.points.find((p) => software.categories.includes(p.label.toLowerCase()));
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {de && (
        <Panel tone="ink" className="lg:col-span-5">
          <PanelHeader
            pill="Marktkontext 2026"
            title="Was Unternehmen wollen"
            dark
            action={
              <ArrowLink
                href={origin.source.url}
                external
                dark
                label={`Quelle öffnen: ${origin.source.label}`}
              />
            }
          />
          <div className="mt-auto flex flex-col gap-3">
            <Figure value={de.compare ?? de.value} unit="prozent" size="xl" dark />
            <p className="type-body text-on-dark-muted">
              der Unternehmen bevorzugen Cloud-Anbieter aus Deutschland. Genutzt werden sie heute von{" "}
              {formatPercent(de.value)}.
            </p>
          </div>
          <SourceNote source={origin.source} basis={origin.basis} period={origin.period} dark />
        </Panel>
      )}
      <Panel className={de ? "lg:col-span-7" : "lg:col-span-12"}>
        <PanelHeader pill="Im Abgleich" title={`${software.name} und der Markt`} />
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Server laut Anbieter",
              value: SERVER_TEXT[software.hosting.serverLocation],
              good: software.hosting.serverLocation === "DE",
            },
            {
              label: "Anbieter",
              value: software.madeInGermany ? "mit Sitz in Deutschland" : "ohne Sitz in Deutschland",
              good: software.madeInGermany,
            },
            {
              label: "Support",
              value: software.germanSupport ? "auf Deutsch" : "nicht auf Deutsch",
              good: software.germanSupport,
            },
            {
              label: "DATEV-Schnittstelle",
              value: software.integrations.some((i) => i.toLowerCase().includes("datev"))
                ? "vorhanden"
                : "nicht genannt",
              good: software.integrations.some((i) => i.toLowerCase().includes("datev")),
            },
            {
              label: "XRechnung",
              value: STATUS_TEXT[software.compliance.xrechnung],
              good: software.compliance.xrechnung === "ja",
            },
            {
              label: "Vertrag zur Auftragsverarbeitung",
              value: STATUS_TEXT[software.hosting.avv],
              good: software.hosting.avv === "ja",
            },
          ].map((row) => (
            <li
              key={row.label}
              className={cn(
                "flex flex-col gap-2 rounded-lg p-4",
                row.good ? "bg-brand-50" : "bg-surface-tint",
              )}
            >
              <span className="type-small text-text-muted">{row.label}</span>
              <span className="type-label font-semibold text-ink">{row.value}</span>
            </li>
          ))}
        </ul>
        {appPoint && apps && (
          <div className="mt-auto flex flex-col gap-3">
            <PillBars
              thickness="h-9"
              items={[
                {
                  label: `${appPoint.label} aus der Cloud`,
                  value: appPoint.value,
                  display: formatPercent(appPoint.value),
                  highlight: true,
                },
              ]}
            />
            <p className="type-small text-text-muted">
              So viele Unternehmen mit Cloud-Services beziehen {appPoint.label} bereits aus der Cloud. Der
              Markt steht hier noch am Anfang.
            </p>
            <SourceNote source={apps.source} basis={apps.basis} period={apps.period} />
          </div>
        )}
      </Panel>
    </div>
  );
}
