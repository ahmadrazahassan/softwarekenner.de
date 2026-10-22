"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger, SheetContent } from "@/components/ui/overlay";
import { useScrollFade } from "@/components/ui/use-scroll-fade";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

export type FilterGroup = { id: string; label: string; options: { value: string; label: string }[] };
export type FilterState = Record<string, string[]>;

const pill =
  "type-label inline-flex min-h-11 flex-none items-center gap-1.5 rounded-full border bg-white px-4 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function GroupOptions({
  group,
  selected,
  onToggle,
}: {
  group: FilterGroup;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{group.label}</legend>
      <div className="flex flex-col">
        {group.options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            onCheckedChange={() => onToggle(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Filter bar (Section 7.4): pill dropdowns above the list plus an "Alle Filter" sheet.
 * Phase 1 keeps state local and reports it through `onChange`; Phase 4 moves it into the URL
 * with nuqs (product attributes only). `resultCount` comes from the parent.
 */
export function FilterBar({
  groups,
  value,
  onChange,
  resultCount,
  className,
}: {
  groups: FilterGroup[];
  value: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
  className?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { ref, fadeProps } = useScrollFade<HTMLDivElement>();
  const activeTotal = Object.values(value).reduce((sum, list) => sum + list.length, 0);

  const toggle = (groupId: string, option: string) => {
    const current = value[groupId] ?? [];
    onChange({
      ...value,
      [groupId]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option],
    });
  };
  const results =
    resultCount === 1 ? "1 Ergebnis anzeigen" : `${formatNumber(resultCount)} Ergebnisse anzeigen`;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <DialogPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogPrimitive.Trigger className={cn(pill, "border-ink text-ink hover:bg-surface-tint")}>
          <Icon icon={SlidersHorizontal} size={16} />
          Alle Filter
          {activeTotal > 0 && (
            <span className="ml-0.5 rounded-full bg-ink px-1.5 text-caption leading-5 text-white tabular-nums">
              {activeTotal}
            </span>
          )}
        </DialogPrimitive.Trigger>
        <SheetContent
          title="Alle Filter"
          footer={
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onChange({})}
                className="link-cta text-small"
                disabled={activeTotal === 0}
              >
                Filter zurücksetzen
              </button>
              <Button block icon="none" onClick={() => setSheetOpen(false)} className="flex-1">
                {results}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col divide-y divide-line">
            {groups.map((group) => (
              <section key={group.id} className="py-4 first:pt-0">
                <h3 className="mb-2 type-h4 text-ink">{group.label}</h3>
                <GroupOptions
                  group={group}
                  selected={value[group.id] ?? []}
                  onToggle={(v) => toggle(group.id, v)}
                />
              </section>
            ))}
          </div>
        </SheetContent>
      </DialogPrimitive.Root>

      <div ref={ref} className="scroll-fade-x -my-1 min-w-0 flex-1 py-1" {...fadeProps}>
        <ul className="flex w-max gap-2 pr-2" aria-label="Schnellfilter">
          {groups.map((group) => {
            const count = value[group.id]?.length ?? 0;
            return (
              <li key={group.id}>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      pill,
                      "group",
                      count > 0
                        ? "border-ink text-ink"
                        : "border-line-strong text-text-muted hover:border-ink hover:text-ink",
                    )}
                  >
                    {group.label}
                    {count > 0 && <span className="font-semibold tabular-nums"> ({count})</span>}
                    <Icon
                      icon={ChevronDown}
                      size={16}
                      className="transition-transform group-data-[state=open]:rotate-180"
                    />
                  </PopoverTrigger>
                  <PopoverContent aria-label={group.label}>
                    <p className="mb-1 type-micro text-text-muted">{group.label}</p>
                    <GroupOptions
                      group={group}
                      selected={value[group.id] ?? []}
                      onToggle={(v) => toggle(group.id, v)}
                    />
                  </PopoverContent>
                </Popover>
              </li>
            );
          })}
        </ul>
      </div>
      {activeTotal > 0 && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="link-cta hidden flex-none text-small md:inline-flex"
        >
          Filter zurücksetzen
        </button>
      )}
      <p className="sr-only" aria-live="polite">
        {formatNumber(resultCount)} Ergebnisse
      </p>
    </div>
  );
}
