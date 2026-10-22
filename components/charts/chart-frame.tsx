"use client";

import { useId, useState, type ReactNode } from "react";

import { Skeleton } from "@/components/ui/feedback";
import { cn } from "@/lib/utils/cn";

export type ChartTable = { columns: string[]; rows: string[][] };

/**
 * Frame for every chart (Section 14.1): title, one sentence takeaway, the chart as `role="img"` with
 * a summary, a toggle "Daten als Tabelle anzeigen" and a footnote with basis and "Stand".
 * The fixed height keeps the layout still while the chart code loads.
 */
export function ChartFrame({
  title,
  takeaway,
  summary,
  footnote,
  table,
  height = 320,
  onDark,
  headingLevel = 3,
  className,
  children,
}: {
  title: string;
  takeaway: string;
  /** Screen reader summary of what the chart shows. */
  summary: string;
  footnote: string;
  table: ChartTable;
  height?: number;
  onDark?: boolean;
  headingLevel?: 3 | 4;
  className?: string;
  children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  const Heading = headingLevel === 3 ? "h3" : "h4";
  const muted = onDark ? "text-on-dark-muted" : "text-text-muted";

  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-1">
        <Heading
          className={cn(headingLevel === 3 ? "type-h3" : "type-h4", onDark ? "text-white" : "text-ink")}
        >
          {title}
        </Heading>
        <p className={cn("measure type-body", muted)}>{takeaway}</p>
      </div>

      {showTable ? (
        <div id={tableId} className="overflow-x-auto rounded-md border border-line bg-white">
          <table className="w-full border-collapse type-small text-ink tabular-nums">
            <caption className="sr-only">{title}</caption>
            <thead>
              <tr>
                {table.columns.map((c) => (
                  <th key={c} scope="col" className="border-b border-line px-4 py-2.5 text-left type-label">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="px-4 py-2 text-left font-semibold">
                        {cell}
                      </th>
                    ) : (
                      <td key={j} className="px-4 py-2">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          role="img"
          aria-label={summary}
          className={cn("chart w-full", onDark && "chart-on-dark")}
          style={{ height }}
        >
          {children}
        </div>
      )}

      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className={cn("type-small", muted)}>{footnote}</span>
        <button
          type="button"
          aria-expanded={showTable}
          aria-controls={showTable ? tableId : undefined}
          onClick={() => setShowTable((v) => !v)}
          className={cn("link-cta min-h-11 text-small", onDark && "text-brand-500")}
        >
          {showTable ? "Diagramm anzeigen" : "Daten als Tabelle anzeigen"}
        </button>
      </figcaption>
    </figure>
  );
}

/** Same size placeholder while the chart code loads (no layout shift). */
export function ChartSkeleton({ onDark }: { onDark?: boolean }) {
  return (
    <Skeleton
      className={cn("h-full w-full rounded-md in-[.chart-on-dark]:bg-ink-700", onDark && "bg-ink-700")}
    />
  );
}
