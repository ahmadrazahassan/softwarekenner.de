import { AppLink } from "@/components/ui/app-link";
import { ArcGauge, CountUp, GrowBar, GrowStack } from "@/components/ui/animated";
import { LogoTile } from "@/components/ui/logo-tile";
import type { PortfolioStats } from "@/lib/content/stats";
import { formatMonthYear, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils/cn";

import { Columns, Figure, Panel, PanelHeader, Pill } from "./parts";

/**
 * Key figures from our own profiles (home page, dark section). Every number is computed from
 * content/software at build time; nothing is estimated.
 */

const SERVER_COLORS = ["bg-brand-500", "bg-brand-200", "bg-white", "bg-on-dark-muted", "bg-ink-700"];
const STATUS_COLORS = ["bg-brand-500", "bg-brand-200", "bg-white", "bg-ink-700"];

export function PortfolioReport({
  stats,
  categoryCount,
  reviewCount,
  medians,
  updatedAt,
}: {
  stats: PortfolioStats;
  categoryCount: number;
  reviewCount: number;
  medians: { label: string; cents: number; count: number }[];
  updatedAt: string | null;
}) {
  const tiles = [
    { value: stats.total, label: "Softwareprofile", light: true },
    { value: categoryCount, label: "Kategorien", light: false },
    { value: reviewCount, label: "ausführliche Bewertungen", light: false },
    { value: stats.vendors, label: "Anbieter", light: true },
  ];
  const sortedMedians = [...medians].sort((a, b) => a.cents - b.cents);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid overflow-hidden rounded-xl bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col items-start gap-6 p-6 sm:p-10">
          {updatedAt && <Pill>Stand {formatMonthYear(updatedAt)}</Pill>}
          <h3 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none font-semibold tracking-tight text-ink">
            Unsere Datenbasis
          </h3>
          <p className="measure type-body-lg text-text-muted">
            Jede Zahl in diesem Bereich stammt aus unseren eigenen Profilen: Preise, Hosting, Schnittstellen
            und Wertungen, belegt mit Quellen der Anbieter.
          </p>
        </div>
        <div className="m-2 grid grid-cols-2 gap-3 rounded-xl bg-ink-800 p-3 sm:p-5 lg:m-3">
          {tiles.map((t) => (
            <div
              key={t.label}
              className={cn(
                "flex min-h-36 flex-col justify-between gap-4 rounded-lg p-5",
                t.light ? "bg-brand-50" : "bg-ink-700",
              )}
            >
              <Figure value={t.value} size="md" dark={!t.light} />
              <span className={cn("type-small", t.light ? "text-text-muted" : "text-on-dark-muted")}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GaugeCard
          pill="Herkunft"
          title="Anbieter aus Deutschland"
          percent={stats.germanPercent}
          caption={`${stats.german.count} von ${stats.total} Programmen`}
        />
        <GaugeCard
          pill="Steuerberatung"
          title="Mit DATEV-Schnittstelle"
          percent={stats.datevPercent}
          caption={`${stats.datev.count} von ${stats.total} Programmen`}
        />
        <Panel tone="raised" className="md:col-span-2 lg:col-span-1">
          <PanelHeader pill="Transparenz" title="Testen und Preise" dark />
          <div className="grid flex-1 grid-cols-2 gap-3">
            <div className="flex flex-col justify-between gap-4 rounded-lg bg-ink-700 p-5">
              <Figure value={Math.round(stats.trial.percent)} unit="prozent" size="md" dark />
              <span className="type-small text-on-dark-muted">
                mit kostenloser Testphase
                {stats.trial.medianDays ? `, im Mittel ${stats.trial.medianDays} Tage` : ""}
              </span>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-lg bg-brand-50 p-5">
              <Figure value={Math.round(stats.priced.percent)} unit="prozent" size="md" />
              <span className="type-small text-text-muted">mit öffentlichen Preisen</span>
            </div>
          </div>
          {stats.freePlan.count > 0 && (
            <p className="type-small text-on-dark-muted">
              {stats.freePlan.count} Programme bieten zusätzlich eine dauerhaft kostenlose Version.
            </p>
          )}
        </Panel>
      </div>

      {sortedMedians.length > 1 && (
        <div className="grid overflow-hidden rounded-xl bg-ink-800 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <div className="flex flex-col items-start gap-6 p-6 sm:p-10">
            <Pill dark>Median je Kategorie</Pill>
            <h3 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-tight text-white">
              Was der Einstieg kostet
            </h3>
            <p className="type-body text-on-dark-muted">
              Mittlerer Preis des günstigsten kostenpflichtigen Tarifs, netto pro Monat. Bei Preisen pro
              Nutzer gilt der Preis für einen Nutzer. Am günstigsten startet {sortedMedians[0]!.label} mit{" "}
              {formatPrice(sortedMedians[0]!.cents)}.
            </p>
          </div>
          <div className="px-4 pb-6 sm:px-10 sm:pb-10 lg:pt-10 lg:pl-0">
            <Columns
              dark
              height="h-72"
              items={sortedMedians.map((m, i) => ({
                label: m.label,
                value: m.cents,
                highlight: i === sortedMedians.length - 1,
              }))}
              format={(v) => formatPrice(v, { compact: true })}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Panel tone="raised">
          <PanelHeader pill="Datenschutz" title="Serverstandort laut Anbieter" dark />
          <Distribution shares={stats.server} colors={SERVER_COLORS} />
        </Panel>
        <Panel tone="raised">
          <PanelHeader pill="E-Rechnung" title="XRechnung laut Anbieter" dark />
          <Distribution shares={stats.xrechnung} colors={STATUS_COLORS} />
        </Panel>
        <Panel tone="light" className="md:col-span-2 lg:col-span-1">
          <PanelHeader pill="Redaktionswertung" title="Die fünf Bestbewerteten" />
          <ol className="flex flex-col gap-4">
            {stats.top.map((t, i) => (
              <li key={t.slug} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3">
                <LogoTile name={t.name} logo={t.logo} size={40} />
                <span className="flex min-w-0 flex-col gap-1.5">
                  <AppLink
                    href={routes.software(t.slug)}
                    className="truncate type-label text-ink hover:underline"
                  >
                    {t.name}
                  </AppLink>
                  <GrowBar
                    percent={(t.score / 5) * 100}
                    trackClassName="h-1.5"
                    className={i === 0 ? "bg-brand-500" : "bg-brand-200"}
                    delay={0.08 * i}
                  />
                </span>
                <span className="font-display text-lead font-medium text-ink tabular-nums">
                  <CountUp value={t.score} decimals={1} />
                  <span className="sr-only"> von 5</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

function GaugeCard({
  pill,
  title,
  percent,
  caption,
}: {
  pill: string;
  title: string;
  percent: number;
  caption: string;
}) {
  return (
    <Panel tone="raised">
      <PanelHeader pill={pill} title={title} dark />
      <ArcGauge percent={percent} size={260} thickness={24} trackClassName="stroke-ink-700">
        <Figure value={Math.round(percent)} unit="prozent" size="md" dark />
        <span className="mt-1 type-small text-on-dark-muted">{caption}</span>
      </ArcGauge>
    </Panel>
  );
}

function Distribution({
  shares,
  colors,
}: {
  shares: { label: string; count: number; percent: number }[];
  colors: string[];
}) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-6">
      <GrowStack
        className="h-10 bg-ink-700"
        segments={shares.map((s, i) => ({ percent: s.percent, className: colors[i] ?? "bg-white" }))}
      />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
        {shares.map((s, i) =>
          s.count === 0 ? null : (
            <li key={s.label} className="flex items-start gap-2.5">
              <span aria-hidden="true" className={cn("mt-2 size-2.5 flex-none rounded-full", colors[i])} />
              <span className="flex flex-col">
                <span className="font-display text-[1.75rem] leading-none font-medium text-white tabular-nums">
                  <CountUp value={s.count} />
                </span>
                <span className="type-small text-on-dark-muted">{s.label}</span>
              </span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
