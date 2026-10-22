import { ArcGauge, GrowBar, Waffle } from "@/components/ui/animated";
import type { MarketDatasetData } from "@/lib/content/schemas";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

import { ArrowLink, Change, Columns, Figure, Panel, PanelHeader, PillBars, SourceNote } from "./parts";

/**
 * "Der deutsche Softwaremarkt in Zahlen": market data from content/markt, laid out as a report
 * of split panels and cards. Every figure is printed as text; shapes are decorative.
 */

type Dataset = MarketDatasetData;
const pct = (v: number) => formatPercent(v, Number.isInteger(v) ? 0 : 1);

function Source({ d, dark }: { d: Dataset; dark?: boolean }) {
  return <SourceNote source={d.source} basis={d.basis} period={d.period} dark={dark} />;
}

function SourceArrow({ d, dark }: { d: Dataset; dark?: boolean }) {
  return <ArrowLink href={d.source.url} external dark={dark} label={`Quelle öffnen: ${d.source.label}`} />;
}

export function MarketReport({ datasets }: { datasets: Dataset[] }) {
  const by = Object.fromEntries(datasets.map((d) => [d.slug, d])) as Record<string, Dataset | undefined>;
  const software = by["software-umsatz-2026"];
  const cloud = by["cloud-nutzung-2026"];
  const ki = by["ki-nutzung-2026"];
  const invest = by["digitalinvestitionen"];
  const origin = by["cloud-anbieter-herkunft"];
  const size = by["cloud-unternehmensgroesse"];
  const kmu = by["kmu-deutschland"];
  const hurdles = by["digitalisierungshemmnisse"];
  const apps = by["cloud-anwendungen"];
  const kiSize = by["ki-unternehmensgroesse"];

  return (
    <div className="flex flex-col gap-4">
      {software && <RevenueSplit d={software} itk={by["itk-markt-2026"]} />}

      <div className="grid gap-4 lg:grid-cols-3">
        {cloud && <CloudGauge d={cloud} />}
        {ki && <ColumnCard d={ki} />}
        {invest && <ColumnCard d={invest} />}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {origin && <OriginBars d={origin} className="lg:col-span-7" />}
        {size && <SizeWaffle d={size} className="lg:col-span-5" />}
      </div>

      {kmu && <KmuSplit d={kmu} />}

      <div className="grid gap-4 lg:grid-cols-12">
        {hurdles && <BarCard d={hurdles} className="lg:col-span-5" />}
        {apps && <BarCard d={apps} className="lg:col-span-4" />}
        {kiSize && <KiSizeGauge d={kiSize} className="lg:col-span-3" />}
      </div>
    </div>
  );
}

/** Hero: white story panel next to an ink panel of tiles (reference "Our Highlights"). */
function RevenueSplit({ d, itk }: { d: Dataset; itk?: Dataset }) {
  const [lead, ...rest] = d.points;
  if (!lead) return null;
  const tiles = [
    ...rest.map((p) => ({ label: p.label, value: p.value, unit: p.unit, change: p.change })),
    ...(itk?.points.slice(0, 2) ?? []).map((p) => ({
      label: p.label === "ITK gesamt" ? "ITK-Markt gesamt" : p.label,
      value: p.value,
      unit: p.unit,
      change: p.change,
    })),
  ];
  return (
    <div className="grid overflow-hidden rounded-xl bg-white shadow-xs lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-8 p-6 sm:p-10">
        <PanelHeader pill={d.period} title={d.title} titleSize="xl" action={<SourceArrow d={d} />} />
        <p className="measure type-body-lg text-text-muted">{d.takeaway}</p>
        <div className="mt-auto flex flex-col gap-3">
          <Figure value={lead.value} unit={lead.unit} size="xl" />
          <div className="flex flex-wrap items-center gap-3">
            {lead.change !== undefined && <Change value={lead.change} />}
            <span className="type-small text-text-muted">Softwareumsatz in Deutschland</span>
          </div>
        </div>
        <Source d={d} />
        {itk && itk.source.url !== d.source.url && <Source d={itk} />}
      </div>
      <div className="m-2 grid grid-cols-1 gap-3 rounded-xl p-4 text-white bg-ink-glow sm:grid-cols-2 sm:p-6 lg:m-3">
        {tiles.map((t, i) => {
          const light = i === 0 || i === 3;
          return (
            <div
              key={t.label}
              className={cn(
                "flex min-h-44 flex-col justify-between gap-6 rounded-lg p-5 sm:p-6",
                light ? "bg-brand-50 text-ink" : "bg-ink-800",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn("type-label", light ? "text-text-muted" : "text-on-dark-muted")}>
                  {t.label}
                </span>
                {t.change !== undefined && <Change value={t.change} dark={!light} />}
              </div>
              <Figure value={t.value} unit={t.unit} size="md" dark={!light} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Segmented half gauge with two inset tiles (reference "Sales Overview"). */
function CloudGauge({ d }: { d: Dataset }) {
  const [lead, ...rest] = d.points;
  if (!lead) return null;
  return (
    <Panel>
      <PanelHeader pill={d.kicker} title={d.title} action={<SourceArrow d={d} />} />
      <ArcGauge percent={lead.value} size={300} thickness={28}>
        <Figure value={lead.value} unit="prozent" size="md" />
        <span className="mt-1 type-small text-text-muted">{lead.label}</span>
      </ArcGauge>
      <div className="grid grid-cols-2 gap-3">
        {rest.slice(0, 2).map((p) => (
          <div key={p.label} className="flex flex-col gap-3 rounded-lg bg-surface-tint p-4">
            <span className="type-small text-text-muted">{p.label}</span>
            <Figure value={p.value} unit="prozent" size="sm" />
          </div>
        ))}
      </div>
      {rest.length > 2 && (
        <p className="type-small text-text-muted">
          {rest
            .slice(2)
            .map((p) => `${p.label} ${pct(p.value)}`)
            .join(" · ")}
        </p>
      )}
      <Source d={d} />
    </Panel>
  );
}

/** Big lead figure with tall rounded columns (references "Monthly sales", "Projected Revenue"). */
function ColumnCard({ d }: { d: Dataset }) {
  const last = d.points.at(-1);
  const first = d.points[0];
  if (!last || !first) return null;
  return (
    <Panel>
      <PanelHeader pill={d.kicker} title={d.title} action={<SourceArrow d={d} />} />
      <div className="flex flex-wrap items-end gap-3">
        <Figure value={last.value} unit="prozent" size="lg" />
        <Change
          value={last.value - first.value}
          suffix={" Pkt."}
          srLabel={`Prozentpunkte seit ${first.label}`}
        />
      </div>
      <p className="type-small text-text-muted">{d.takeaway}</p>
      <div className="mt-auto">
        <Columns
          items={d.points.map((p) => ({ label: p.label, value: p.value, highlight: p.highlight }))}
          height="h-56"
          format={pct}
        />
      </div>
      <Source d={d} />
    </Panel>
  );
}

/** Used versus wanted, thick pill bars (reference "Porcentagem"). */
function OriginBars({ d, className }: { d: Dataset; className?: string }) {
  const [used = "genutzt", wanted = "bevorzugt"] = d.legend ?? [];
  return (
    <Panel className={className}>
      <PanelHeader pill={d.kicker} title={d.title} titleSize="lg" action={<SourceArrow d={d} />} />
      <p className="measure type-body text-text-muted">{d.takeaway}</p>
      <p className="flex flex-wrap gap-5 type-small text-text-muted" aria-hidden="true">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 rounded-full bg-line-strong" />
          {used}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 rounded-full bg-brand-500" />
          {wanted}
        </span>
      </p>
      <div className="flex flex-col gap-7">
        {d.points.map((p) => (
          <div key={p.label} className="flex flex-col gap-3">
            <span className={cn("type-label", p.highlight ? "font-semibold text-ink" : "text-text-muted")}>
              {p.label}
            </span>
            <PillBars
              gap="gap-2"
              thickness="h-10"
              items={[
                { label: `${p.label} ${used}`, value: p.value, display: pct(p.value), muted: true },
                {
                  label: `${p.label} ${wanted}`,
                  value: p.compare ?? 0,
                  display: pct(p.compare ?? 0),
                  highlight: true,
                },
              ]}
              hideLabels
            />
          </div>
        ))}
      </div>
      <Source d={d} />
    </Panel>
  );
}

/** One cell is one percent of companies (reference pictogram grid). */
function SizeWaffle({ d, className }: { d: Dataset; className?: string }) {
  const all = d.points.find((p) => p.highlight) ?? d.points.at(-1);
  if (!all) return null;
  const sizes = d.points.filter((p) => p !== all);
  return (
    <Panel tone="ink" className={className}>
      <PanelHeader pill={d.kicker} title={d.title} dark action={<SourceArrow d={d} dark />} />
      <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Figure value={all.value} unit="prozent" size="lg" dark />
          <p className="type-small text-on-dark-muted">
            der Unternehmen ab 10 Beschäftigten bezahlen für Cloud-Services. Ein Feld entspricht einem
            Prozentpunkt.
          </p>
        </div>
        <Waffle percent={all.value} trackClassName="bg-ink-700" className="max-w-64" />
      </div>
      <ul className="mt-auto flex flex-col gap-3">
        {sizes.map((p, i) => (
          <li key={p.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between gap-3 type-small">
              <span className="text-on-dark-muted">{p.label}</span>
              <span className="font-semibold text-white tabular-nums">{pct(p.value)}</span>
            </div>
            <GrowBar
              percent={p.value}
              trackClassName="h-2 bg-ink-700"
              className="bg-white"
              delay={0.08 * i}
            />
          </li>
        ))}
      </ul>
      <Source d={d} dark />
    </Panel>
  );
}

/** Ink figure panel next to light tiles (reference "Market Traction"). */
function KmuSplit({ d }: { d: Dataset }) {
  const [lead, ...rest] = d.points;
  if (!lead) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Panel tone="ink">
        <PanelHeader
          pill={d.period}
          title={d.title}
          titleSize="lg"
          dark
          action={<SourceArrow d={d} dark />}
        />
        <div className="mt-auto flex flex-col gap-3">
          <Figure value={lead.value} unit={lead.unit} size="xl" dark />
          <span className="type-label text-on-dark-muted">Unternehmen in Deutschland</span>
        </div>
        <Source d={d} dark />
      </Panel>
      <div className="grid content-start gap-4 sm:grid-cols-3">
        {rest.map((p, i) => (
          <Panel key={p.label} tone={i === 0 ? "cream" : "light"} className="min-h-56 justify-between">
            <span className="type-label text-text-muted">{p.label}</span>
            <div className="flex flex-col gap-4">
              <Figure value={p.value} unit="prozent" size="md" />
              <GrowBar
                percent={p.value}
                trackClassName="h-2.5"
                className={i === 0 ? "bg-brand-500" : "bg-ink"}
              />
            </div>
          </Panel>
        ))}
        <p className="px-2 type-body text-text-muted sm:col-span-3">{d.takeaway}</p>
      </div>
    </div>
  );
}

function BarCard({ d, className }: { d: Dataset; className?: string }) {
  return (
    <Panel className={className}>
      <PanelHeader pill={d.kicker} title={d.title} action={<SourceArrow d={d} />} />
      <p className="type-small text-text-muted">{d.takeaway}</p>
      <div className="mt-auto">
        <PillBars
          thickness="h-7"
          gap="gap-3"
          items={d.points.map((p) => ({
            label: p.label,
            value: p.value,
            display: pct(p.value),
            highlight: p.highlight,
          }))}
        />
      </div>
      <Source d={d} />
    </Panel>
  );
}

function KiSizeGauge({ d, className }: { d: Dataset; className?: string }) {
  const all = d.points.find((p) => p.highlight);
  const large = d.points.find((p) => p.label.startsWith("ab 250"));
  if (!all) return null;
  return (
    <Panel tone="cream" className={className}>
      <PanelHeader pill={d.kicker} title="KI im Unternehmen" action={<SourceArrow d={d} />} />
      <ArcGauge percent={all.value} size={240} thickness={24} trackClassName="stroke-brand-100">
        <Figure value={all.value} unit="prozent" size="md" />
        <span className="mt-1 type-small text-text-muted">{all.label}</span>
      </ArcGauge>
      <ul className="flex flex-col gap-2 type-small text-text-muted">
        {d.points
          .filter((p) => p !== all)
          .map((p) => (
            <li key={p.label} className="flex justify-between gap-3">
              <span>{p.label}</span>
              <span className={cn("font-semibold tabular-nums", p === large ? "text-brand-ink" : "text-ink")}>
                {pct(p.value)}
              </span>
            </li>
          ))}
      </ul>
      <Source d={d} />
    </Panel>
  );
}
