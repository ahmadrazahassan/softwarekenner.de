import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

export type ButterflyRow = { label: string; a: number; b: number };

/**
 * Butterfly comparison (Section 14.3) for two products, criterion by criterion. Plain HTML bars:
 * no chart library needed, and the values are visible text. Use inside ChartFrame.
 */
export function Butterfly({
  nameA,
  nameB,
  rows,
  max = 5,
}: {
  nameA: string;
  nameB: string;
  rows: ButterflyRow[];
  max?: number;
}) {
  const width = (v: number) => `${Math.max(0, Math.min(1, v / max)) * 100}%`;
  return (
    <div className="flex h-full flex-col justify-center gap-3" aria-hidden="true">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 type-label font-semibold text-ink">
        <span className="text-right">{nameA}</span>
        <span className="w-28" />
        <span>{nameB}</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center justify-end gap-2">
            <span className="font-display text-small font-semibold text-ink tabular-nums">
              {formatRating(row.a)}
            </span>
            <span className="flex h-3 flex-1 justify-end overflow-hidden rounded-full bg-line">
              <span
                className={cn("block h-full rounded-full", row.a >= row.b ? "bg-brand-700" : "bg-brand-500")}
                style={{ width: width(row.a) }}
              />
            </span>
          </div>
          <span className="w-28 text-center type-small text-text-muted">{row.label}</span>
          <div className="flex items-center gap-2">
            <span className="flex h-3 flex-1 overflow-hidden rounded-full bg-line">
              <span
                className={cn("block h-full rounded-full", row.b >= row.a ? "bg-brand-700" : "bg-brand-500")}
                style={{ width: width(row.b) }}
              />
            </span>
            <span className="font-display text-small font-semibold text-ink tabular-nums">
              {formatRating(row.b)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
