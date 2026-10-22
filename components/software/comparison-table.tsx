"use client";

import { useState } from "react";

import { Switch } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { LogoTile } from "@/components/ui/logo-tile";
import { ScoreChip } from "@/components/ui/score-chip";
import { formatPrice, PRICE_UNIT_LABEL, type PriceUnit } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

import { STATUS_META, StatusIcon } from "./data-display";
import type { Status } from "./types";

export type ComparisonCell =
  | { kind: "status"; status: Status; note?: string }
  | { kind: "text"; text: string }
  | { kind: "price"; cents: number | null; unit?: PriceUnit }
  | { kind: "score"; value: number };

export type ComparisonGroup = {
  title: string;
  rows: { label: string; cells: ComparisonCell[] }[];
};

export type ComparisonProduct = { slug: string; name: string; logo?: string | null; score: number };

const cellKey = (cell: ComparisonCell) => JSON.stringify(cell);

function Cell({ cell }: { cell: ComparisonCell }) {
  switch (cell.kind) {
    case "status":
      return (
        <span className="inline-flex items-start gap-2">
          <StatusIcon status={cell.status} />
          {cell.note && <span className="type-small text-text-muted">{cell.note}</span>}
        </span>
      );
    case "price":
      return cell.cents === null ? (
        <span className="type-small text-text-muted">Preis auf Anfrage</span>
      ) : (
        <span className="flex flex-col">
          <span className="font-display font-semibold text-ink tabular-nums">{formatPrice(cell.cents)}</span>
          {cell.unit && <span className="type-small text-text-muted">{PRICE_UNIT_LABEL[cell.unit]}</span>}
        </span>
      );
    case "score":
      return <ScoreChip score={cell.value} size="sm" />;
    case "text":
      return <span className="type-small text-ink">{cell.text}</span>;
  }
}

/**
 * Comparison table (Section 7.3): sticky header row and first column inside its own scroll area,
 * grouped rows, "Nur Unterschiede anzeigen", icons with screen reader text.
 */
export function ComparisonTable({
  products,
  groups,
  caption,
  className,
}: {
  products: ComparisonProduct[];
  groups: ComparisonGroup[];
  caption: string;
  className?: string;
}) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      rows: onlyDifferences
        ? group.rows.filter((row) => new Set(row.cells.map(cellKey)).size > 1)
        : group.rows,
    }))
    .filter((group) => group.rows.length > 0);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Switch
        label="Nur Unterschiede anzeigen"
        checked={onlyDifferences}
        onCheckedChange={setOnlyDifferences}
      />
      <div
        className="max-h-[80vh] overflow-auto rounded-lg border border-line bg-white shadow-sm"
        tabIndex={0}
        role="region"
        aria-label={`${caption}, horizontal scrollbar`}
      >
        <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 left-0 z-30 w-48 border-b border-line bg-white px-4 py-4 align-bottom type-eyebrow text-text-muted"
              >
                Kriterium
              </th>
              {products.map((product) => (
                <th
                  key={product.slug}
                  scope="col"
                  className="sticky top-0 z-20 min-w-44 border-b border-line bg-white px-4 py-4 align-bottom"
                >
                  <span className="flex flex-col items-start gap-2">
                    <LogoTile name={product.name} logo={product.logo} size={40} />
                    <span className="type-label font-semibold text-ink">{product.name}</span>
                    <ScoreChip score={product.score} size="sm" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {visibleGroups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={products.length + 1}
                  className="sticky left-0 border-b border-line bg-surface-tint px-4 py-3 type-eyebrow text-ink"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="group">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-line bg-white px-4 py-3.5 align-top type-label font-medium text-ink group-hover:bg-surface-tint"
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={i}
                      className="border-b border-line px-4 py-3.5 align-top group-hover:bg-surface-tint"
                    >
                      <Cell cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        {visibleGroups.length === 0 && (
          <p className="px-4 py-6 type-body text-text-muted">
            Bei den gewählten Programmen gibt es keine Unterschiede.
          </p>
        )}
      </div>
      <ul aria-label="Legende" className="flex flex-wrap gap-x-5 gap-y-2">
        {Object.values(STATUS_META).map((meta) => (
          <li key={meta.label} className="flex items-center gap-1.5 type-small text-text-muted">
            <Icon icon={meta.icon} size={16} className={meta.className} />
            {meta.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
