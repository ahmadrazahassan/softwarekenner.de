import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { AppLink } from "@/components/ui/app-link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/site.config";

/**
 * The editorial system of Über uns (owner reference: product case study sheet), shared by the
 * Ratgeber hub, articles, the Kaufberatung on category pages and the home page: ink rules with
 * micro labels, number and label pills, numbered rows between ink lines.
 */

/** Two digit section number, "01". */
export const sectionNumber = (n: number) => String(n).padStart(2, "0");

/** Section heading in the reference style: an outlined number pill and an ink label pill. */
export function PillHeading({
  id,
  number,
  children,
  as: Tag = "h2",
  className,
}: {
  id?: string;
  number: string;
  children: ReactNode;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <Tag id={id} className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <span className="inline-flex h-8 min-w-12 items-center justify-center rounded-full border border-ink px-3 font-ui text-caption font-semibold text-ink tabular-nums">
        {number}
      </span>
      <span className="inline-flex h-8 items-center rounded-full bg-ink px-5 font-ui text-caption font-semibold tracking-[0.08em] text-white uppercase">
        {children}
      </span>
    </Tag>
  );
}

/** Thin ink rule with a micro label on the left, as in an editorial spec sheet. */
export function SectionRule({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-t border-ink pt-2.5 font-ui text-micro tracking-[0.08em] text-ink uppercase",
        className,
      )}
    >
      <span>{label}</span>
      <span aria-hidden="true">{siteConfig.brand.name}</span>
    </div>
  );
}

/** Spec bar: a row of micro labels between two ink rules (page headers). */
export function SpecBar({ cells, className }: { cells: ReactNode[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-1 border-y border-ink py-2.5 font-ui text-micro tracking-[0.08em] text-ink uppercase lg:grid-cols-12",
        className,
      )}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className={cn(
            "lg:col-span-3",
            i % 2 === 1 && "text-right lg:text-left",
            i === cells.length - 1 && cells.length > 2 && "lg:text-right",
          )}
        >
          {cell}
        </span>
      ))}
    </div>
  );
}

/**
 * The logo mark as a tonal super graphic in the brand band (Section 5.8). Drawn on the 22 unit grid
 * of LogoMark, bottom aligned and cropped by the band.
 */
export function BandGraphic({ offset = 330 }: { offset?: number }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <g transform={`translate(${offset} 4) scale(14)`}>
        <rect x="0" y="14" width="8" height="8" fill="var(--color-brand-200)" />
        <rect x="7" y="7" width="8" height="15" fill="var(--color-brand-200)" />
        <rect x="14" y="0" width="8" height="22" fill="var(--color-brand-700)" />
      </g>
    </svg>
  );
}

/** Numbered statements between ink rules (Über uns "So arbeiten wir", "Das Wichtigste in Kürze"). */
export function NumberedPoints({
  items,
  size = "lg",
  className,
}: {
  items: ReactNode[];
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <ol className={cn("border-t border-ink", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-ink py-5 sm:grid-cols-[4rem_1fr] lg:py-6"
        >
          <span
            aria-hidden="true"
            className="font-display text-h3 leading-none font-medium text-ink tabular-nums"
          >
            {sectionNumber(i + 1)}
          </span>
          <p className={cn(size === "lg" ? "type-body-lg" : "type-body", "text-ink")}>{item}</p>
        </li>
      ))}
    </ol>
  );
}

export type EditorialLink = {
  href: string;
  /** Micro label above the title, e.g. the topic or the category. */
  kicker: string;
  title: string;
  text?: string;
  meta?: string;
};

/**
 * Editorial index: numbered rows between ink rules, the title links the whole row. Used for the
 * Ratgeber list, the Kaufberatung list and related articles.
 */
export function EditorialList({
  items,
  start = 1,
  headingLevel = "h3",
  compact = false,
  className,
}: {
  items: EditorialLink[];
  start?: number;
  headingLevel?: "h3" | "h4";
  compact?: boolean;
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <ol className={cn("border-t border-ink", className)}>
      {items.map((item, i) => (
        <li
          key={item.href}
          className={cn(
            "group relative grid grid-cols-[2.75rem_1fr_auto] gap-x-4 gap-y-2 border-b border-ink transition-colors duration-200 ease-soft hover:bg-white/60 sm:grid-cols-[4rem_1fr_auto]",
            compact ? "py-5" : "py-6 lg:grid-cols-12 lg:gap-x-8 lg:py-7",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "font-display text-h3 leading-none font-medium text-ink tabular-nums",
              !compact && "lg:col-span-1",
            )}
          >
            {sectionNumber(start + i)}
          </span>
          <div className={cn("flex min-w-0 flex-col gap-2", !compact && "lg:col-span-6")}>
            <p className="font-ui text-micro tracking-[0.08em] text-brand-ink uppercase">{item.kicker}</p>
            <Heading
              className={cn(
                "font-display font-semibold text-ink",
                compact ? "text-[1.125rem]" : "text-[1.25rem] lg:text-[1.375rem]",
                // After the size: tailwind-merge drops a line height that precedes a font size.
                "leading-tight",
              )}
            >
              <AppLink
                href={item.href}
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
              >
                {item.title}
              </AppLink>
            </Heading>
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 flex-none items-center justify-center self-start rounded-full border border-ink text-ink transition-colors duration-200 ease-soft group-hover:bg-ink group-hover:text-brand-500",
              !compact && "lg:col-span-1 lg:justify-self-end",
            )}
          >
            <Icon
              icon={ArrowRight}
              size={16}
              className="transition-transform duration-200 ease-soft group-hover:-rotate-45"
            />
          </span>
          {(item.text || item.meta) && (
            <div
              className={cn(
                "col-start-2 col-end-4 flex flex-col gap-2",
                !compact && "lg:col-span-4 lg:col-start-8 lg:row-start-1",
              )}
            >
              {item.text && <p className="type-body text-text-muted">{item.text}</p>}
              {item.meta && <p className="type-small text-text-muted">{item.meta}</p>}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Source list between ink rules: label as link, access date. */
export function SourceList({
  sources,
  formatDate,
  className,
}: {
  sources: { label: string; url: string; accessedAt: string }[];
  formatDate: (iso: string) => string;
  className?: string;
}) {
  return (
    <ol className={cn("border-t border-ink", className)}>
      {sources.map((s, i) => (
        <li
          key={s.url}
          className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-b border-line py-3.5 type-small sm:grid-cols-[4rem_1fr]"
        >
          <span
            aria-hidden="true"
            className="font-ui text-caption font-semibold text-text-muted tabular-nums"
          >
            {sectionNumber(i + 1)}
          </span>
          <p className="text-text-muted">
            <a href={s.url} target="_blank" rel="noopener" className="link-inline">
              {s.label}
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
            , abgerufen am {formatDate(s.accessedAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
