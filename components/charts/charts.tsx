"use client";

/**
 * Recharts implementations (Section 14.3). Loaded lazily through ./index.tsx, never imported directly
 * by pages. Fonts, text colors and grid lines come from the `.chart` rules in styles/components.css.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { CHART_COLORS, type CostRow } from "@/lib/charts";
import { formatNumber, formatPercent, formatPrice, formatRating } from "@/lib/format";

const euro = (value: number) => `${formatNumber(value)} €`;

function TooltipCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-md border border-line bg-white px-4 py-3 shadow-md">
      <p className="type-label font-semibold text-ink">{title}</p>
      {lines.map((line) => (
        <p key={line} className="type-small text-text-muted tabular-nums">
          {line}
        </p>
      ))}
    </div>
  );
}

/* ---------- Entry price bars ---------- */

export type PriceBar = { label: string; cents: number; highlight?: boolean; note?: string };

export function PriceBars({ data, onDark }: { data: PriceBar[]; onDark?: boolean }) {
  const rows = data.map((d) => ({ ...d, euros: d.cents / 100 }));
  const base = onDark ? CHART_COLORS.onDark[0] : CHART_COLORS.single;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 72, bottom: 4, left: 8 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickFormatter={euro} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: onDark ? "rgba(255,255,255,0.06)" : CHART_COLORS.track, opacity: 0.4 }}
          content={({ active, payload }) => {
            const row = active ? (payload?.[0]?.payload as (typeof rows)[number] | undefined) : undefined;
            return row ? (
              <TooltipCard
                title={row.label}
                lines={[`${formatPrice(row.cents)} netto pro Monat`, ...(row.note ? [row.note] : [])]}
              />
            ) : null;
          }}
        />
        <Bar dataKey="euros" radius={[0, 6, 6, 0]} maxBarSize={22} isAnimationActive={false}>
          {rows.map((row) => (
            <Cell key={row.label} fill={row.highlight ? CHART_COLORS.highlight : base} />
          ))}
          <LabelList dataKey="cents" position="right" formatter={(v) => formatPrice(Number(v))} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Price and score scatter ---------- */

export type ScatterPoint = { name: string; euros: number; score: number };

export function ScoreScatter({ data, logX }: { data: ScatterPoint[]; logX?: boolean }) {
  const minScore = Math.min(...data.map((d) => d.score));
  const low = Math.max(0, Math.floor((minScore - 0.3) * 2) / 2);
  const ticks = Array.from({ length: Math.round((5 - low) * 2) + 1 }, (_, i) => low + i * 0.5);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 24, bottom: 24, left: 8 }}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="euros"
          name="Einstiegspreis"
          tickFormatter={euro}
          {...(logX ? { scale: "log" as const, domain: ["auto", "auto"] as [string, string] } : {})}
          label={{ value: "Einstiegspreis netto pro Monat", position: "insideBottom", offset: -16 }}
        />
        <YAxis
          type="number"
          dataKey="score"
          name="Wertung"
          domain={[low, 5]}
          ticks={ticks}
          tickFormatter={(v: number) => formatRating(v)}
          width={40}
        />
        <ZAxis range={[90, 90]} />
        <Tooltip
          cursor={{ strokeDasharray: "4 4" }}
          content={({ active, payload }) => {
            const point = active ? (payload?.[0]?.payload as ScatterPoint | undefined) : undefined;
            return point ? (
              <TooltipCard
                title={point.name}
                lines={[`Wertung ${formatRating(point.score)}`, `ab ${euro(point.euros)} netto pro Monat`]}
              />
            ) : null;
          }}
        />
        <Scatter
          data={data}
          fill={CHART_COLORS.single}
          stroke={CHART_COLORS.highlight}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ---------- Criteria radar ---------- */

export function CriteriaRadar({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid />
        <PolarAngleAxis dataKey="label" />
        <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
        <Tooltip
          content={({ active, payload }) => {
            const row = active
              ? (payload?.[0]?.payload as { label: string; value: number } | undefined)
              : undefined;
            return row ? (
              <TooltipCard title={row.label} lines={[`${formatRating(row.value)} von 5`]} />
            ) : null;
          }}
        />
        <Radar
          dataKey="value"
          stroke={CHART_COLORS.highlight}
          strokeWidth={2}
          fill={CHART_COLORS.single}
          fillOpacity={0.35}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Weights donut ---------- */

const DONUT_COLORS = [...CHART_COLORS.series, "#ffd08f"];

export function WeightsDonut({ data }: { data: { label: string; percent: number }[] }) {
  return (
    <div className="flex h-full flex-col items-center gap-6 sm:flex-row">
      <div className="aspect-square h-full max-h-64 min-h-48 flex-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percent"
              nameKey="label"
              innerRadius="58%"
              outerRadius="96%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell key={d.label} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const row = active
                  ? (payload?.[0]?.payload as { label: string; percent: number } | undefined)
                  : undefined;
                return row ? <TooltipCard title={row.label} lines={[formatPercent(row.percent)]} /> : null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid w-full gap-2" aria-hidden="true">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-3 type-label text-ink">
            <span
              className="size-3 flex-none rounded-full"
              style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}
            />
            <span className="flex-1">{d.label}</span>
            <span className="font-display font-semibold tabular-nums">{formatPercent(d.percent)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Cost over users (step lines) ---------- */

export function CostLines({ rows, series }: { rows: CostRow[]; series: string[] }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-hidden="true">
        {series.map((name, i) => (
          <li key={name} className="flex items-center gap-2 type-label text-ink">
            <span
              className="h-1 w-6 flex-none rounded-full"
              style={{ background: CHART_COLORS.series[i % CHART_COLORS.series.length] }}
            />
            {name}
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 12, right: 24, bottom: 24, left: 8 }}>
            <CartesianGrid />
            <XAxis dataKey="users" label={{ value: "Nutzer", position: "insideBottom", offset: -16 }} />
            <YAxis tickFormatter={euro} width={64} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <TooltipCard
                    title={`${formatNumber(Number(label))} Nutzer`}
                    lines={payload.map((p) =>
                      p.value === null || p.value === undefined
                        ? `${p.name}: kein fester Preis`
                        : `${p.name}: ${formatPrice(Math.round(Number(p.value) * 100))}`,
                    )}
                  />
                ) : null
              }
            />
            {series.map((name, i) => (
              <Line
                key={name}
                type="stepAfter"
                dataKey={name}
                name={name}
                stroke={CHART_COLORS.series[i % CHART_COLORS.series.length]}
                strokeWidth={i === 0 ? 3 : 2}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
