import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/app-link";
import { CountUp, GrowBar, GrowColumn } from "@/components/ui/animated";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

/**
 * Building blocks of the stat panels (home page and profiles). Calm surfaces with generous
 * radius and padding, big figures with a muted unit, thick pill bars and tall rounded columns.
 * Panels are server components; only numbers and shapes animate on the client.
 */

export type Tone = "light" | "tint" | "ink" | "raised" | "cream";

const TONE: Record<Tone, string> = {
  light: "bg-white text-ink shadow-xs",
  tint: "bg-surface-tint text-ink",
  ink: "text-white bg-ink-glow",
  raised: "bg-ink-800 text-white",
  cream: "bg-brand-50 text-ink",
};

export const isDark = (tone: Tone) => tone === "ink" || tone === "raised";

export function Panel({
  tone = "light",
  className,
  children,
  as: Tag = "article",
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
  as?: "article" | "div" | "section";
}) {
  return (
    <Tag className={cn("flex flex-col gap-6 rounded-xl p-6 sm:p-8", TONE[tone], className)}>{children}</Tag>
  );
}

/** Outline pill for periods and labels ("Prognose 2026", "nach Größe"). */
export function Pill({
  children,
  dark,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 type-small font-medium whitespace-nowrap",
        dark ? "border-ink-700 text-on-dark-muted" : "border-line-strong text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Round arrow link in the top right corner of a panel (an interactive control with its own surface). */
export function ArrowLink({
  href,
  label,
  dark,
  external,
}: {
  href: string;
  label: string;
  dark?: boolean;
  external?: boolean;
}) {
  return (
    <AppLink
      href={href}
      external={external}
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid size-11 flex-none place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        dark
          ? "bg-ink-700 text-white hover:bg-white hover:text-ink focus-visible:outline-white"
          : "bg-surface-tint text-ink hover:bg-ink hover:text-white focus-visible:outline-ink",
      )}
    >
      <Icon icon={ArrowUpRight} size={20} />
    </AppLink>
  );
}

export function PanelHeader({
  pill,
  title,
  titleSize = "md",
  action,
  dark,
  headingLevel = 3,
}: {
  pill?: ReactNode;
  title: ReactNode;
  titleSize?: "md" | "lg" | "xl";
  action?: ReactNode;
  dark?: boolean;
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col items-start gap-3">
        {pill && <Pill dark={dark}>{pill}</Pill>}
        <Heading
          className={cn(
            "font-display font-semibold tracking-tight text-balance",
            titleSize === "md" && "text-[1.375rem] leading-tight",
            titleSize === "lg" && "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]",
            titleSize === "xl" && "text-[clamp(2.25rem,4.5vw,3.75rem)] leading-none",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </Heading>
      </div>
      {action}
    </header>
  );
}

const UNIT: Record<string, string> = { prozent: " %", "mrd-eur": " Mrd. €", mio: " Mio." };

/** Big animated figure; the unit is set smaller and muted. */
export function Figure({
  value,
  unit,
  suffix,
  size = "lg",
  dark,
  className,
  decimals,
}: {
  value: number;
  unit?: "prozent" | "mrd-eur" | "mio";
  suffix?: string;
  size?: "sm" | "md" | "lg" | "xl";
  dark?: boolean;
  className?: string;
  decimals?: number;
}) {
  const d = decimals ?? (Number.isInteger(value) ? 0 : 1);
  return (
    <span
      className={cn(
        "font-display font-medium tracking-tight whitespace-nowrap tabular-nums",
        size === "sm" && "text-[1.75rem] leading-none",
        size === "md" && "text-[2.5rem] leading-none",
        size === "lg" && "text-[clamp(2.75rem,5vw,3.75rem)] leading-[0.95]",
        size === "xl" && "text-[clamp(3.5rem,8vw,6rem)] leading-[0.9]",
        dark ? "text-white" : "text-ink",
        className,
      )}
    >
      <CountUp value={value} decimals={d} />
      {(unit || suffix) && (
        <span className={cn("text-[0.5em] font-normal", dark ? "text-on-dark-muted" : "text-text-subtle")}>
          {unit ? UNIT[unit] : suffix}
        </span>
      )}
    </span>
  );
}

/** "+9,9 %" chip. */
export function Change({
  value,
  dark,
  suffix = " %",
  srLabel = "zum Vorjahr",
}: {
  value: number;
  dark?: boolean;
  suffix?: string;
  srLabel?: string;
}) {
  const text = `${value > 0 ? "+" : ""}${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value)}${suffix}`;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 type-small font-semibold whitespace-nowrap tabular-nums",
        dark ? "bg-brand-500 text-ink" : "bg-brand-50 text-brand-ink",
      )}
    >
      {text}
      <span className="sr-only"> {srLabel}</span>
    </span>
  );
}

/** Tall columns with rounded tops, value labels above and the highlighted value in a bubble. */
export function Columns({
  items,
  dark,
  height = "h-60",
  format,
}: {
  items: { label: string; value: number; highlight?: boolean }[];
  dark?: boolean;
  height?: string;
  format: (v: number) => ReactNode;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className={cn("grid auto-cols-fr grid-flow-col items-end gap-3 sm:gap-4", height)}>
      {items.map((item, i) => (
        <li key={item.label} className="flex h-full min-w-0 flex-col items-center justify-end gap-3">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 type-small font-semibold whitespace-nowrap tabular-nums",
              item.highlight
                ? dark
                  ? "bg-white text-ink"
                  : "bg-ink text-white"
                : dark
                  ? "text-on-dark-muted"
                  : "text-text-muted",
            )}
          >
            {format(item.value)}
          </span>
          <span className="flex w-full max-w-24 flex-1 items-end">
            <GrowColumn
              percent={(item.value / max) * 100}
              className={cn(
                "rounded-t-[999px] rounded-b-lg",
                item.highlight ? "bg-brand-500" : dark ? "bg-ink-700" : "bg-brand-100",
              )}
              delay={0.08 * i}
            />
          </span>
          <span
            className={cn(
              "w-full truncate rounded-full px-2 py-1 text-center type-small",
              item.highlight
                ? dark
                  ? "bg-ink-700 font-semibold text-white"
                  : "bg-surface-tint font-semibold text-ink"
                : dark
                  ? "text-on-dark-muted"
                  : "text-text-muted",
            )}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Thick pill bars with the value set right after the end of the bar (0 to 100 scale). */
export function PillBars({
  items,
  dark,
  thickness = "h-9",
  gap = "gap-4",
  hideLabels,
}: {
  items: { label: string; value: number; display: ReactNode; highlight?: boolean; muted?: boolean }[];
  dark?: boolean;
  thickness?: string;
  gap?: string;
  /** Labels only for assistive technology, when a legend explains the bars. */
  hideLabels?: boolean;
}) {
  return (
    <ul className={cn("flex flex-col", gap)}>
      {items.map((item, i) => (
        <li key={item.label} className="flex flex-col gap-2">
          <span
            className={cn(
              "type-small",
              hideLabels && "sr-only",
              item.highlight
                ? dark
                  ? "font-semibold text-white"
                  : "font-semibold text-ink"
                : dark
                  ? "text-on-dark-muted"
                  : "text-text-muted",
            )}
          >
            {item.label}
          </span>
          <div className="flex items-center gap-3">
            <span
              className="min-w-6"
              style={{ width: `calc((100% - 5rem) * ${Math.max(0, Math.min(100, item.value)) / 100})` }}
            >
              <GrowBar
                percent={100}
                trackClassName={cn(thickness, "bg-transparent")}
                className={cn(
                  item.highlight
                    ? "bg-brand-500"
                    : item.muted
                      ? dark
                        ? "bg-ink-700"
                        : "bg-line-strong"
                      : dark
                        ? "bg-white"
                        : "bg-brand-200",
                )}
                delay={0.08 * i}
              />
            </span>
            <span
              className={cn(
                "font-display text-lead font-medium whitespace-nowrap tabular-nums",
                dark ? "text-white" : "text-ink",
              )}
            >
              {item.display}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Source line (Section 14.1: data basis and Stand). */
export function SourceNote({
  source,
  basis,
  period,
  dark,
}: {
  source: { label: string; url: string; publisher: string; publishedAt?: string; accessedAt: string };
  basis: string;
  period: string;
  dark?: boolean;
}) {
  return (
    <p className={cn("type-small", dark ? "text-on-dark-muted" : "text-text-muted")}>
      Quelle:{" "}
      <AppLink href={source.url} external className="underline decoration-1 underline-offset-2">
        {source.publisher}
      </AppLink>
      {source.publishedAt
        ? `, ${formatDate(source.publishedAt)}`
        : `, abgerufen am ${formatDate(source.accessedAt)}`}
      {". Basis: "}
      {basis} ({period}).
    </p>
  );
}
