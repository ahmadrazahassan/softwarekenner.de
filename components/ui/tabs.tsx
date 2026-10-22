"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as m from "motion/react-m";
import { Tabs as TabsPrimitive } from "radix-ui";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";
import { useScrollFade } from "./use-scroll-fade";

export type TabItem = { value: string; label: string };

/**
 * Uppercase tabs with a sliding 3 px orange bar (Section 7.4, Reference 4).
 * The label stays in normal case in the DOM; uppercase comes from CSS.
 * Overflow scrolls horizontally with fade masks and a chevron button.
 */
export function Tabs({
  items,
  value: controlled,
  defaultValue,
  onValueChange,
  label,
  children,
  className,
  listClassName,
}: {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  label: string;
  children?: ReactNode;
  className?: string;
  listClassName?: string;
}) {
  const indicatorId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? items[0]?.value);
  const value = controlled ?? uncontrolled;
  const { ref, canScrollStart, canScrollEnd, scrollBy, fadeProps } = useScrollFade<HTMLDivElement>();

  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={(next) => {
        setUncontrolled(next);
        onValueChange?.(next);
      }}
      className={className}
    >
      <div className={cn("relative flex items-center border-b border-line", listClassName)}>
        <div ref={ref} className="scroll-fade-x min-w-0 flex-1" {...fadeProps}>
          <TabsPrimitive.List aria-label={label} className="flex w-max gap-7">
            {items.map((item) => {
              const active = item.value === value;
              return (
                <TabsPrimitive.Trigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "relative flex min-h-12 items-center type-eyebrow whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink",
                    active ? "text-ink" : "text-text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && (
                    <m.span
                      layoutId={indicatorId}
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-brand-500"
                    />
                  )}
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>
        </div>
        {(canScrollStart || canScrollEnd) && (
          <div className="flex flex-none items-center gap-1 pl-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canScrollStart}
              aria-label="Weitere Reiter links anzeigen"
              tabIndex={-1}
              className="btn btn-ghost size-11 rounded-full p-0 disabled:opacity-30"
            >
              <Icon icon={ChevronLeft} size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canScrollEnd}
              aria-label="Weitere Reiter rechts anzeigen"
              tabIndex={-1}
              className="btn btn-ghost size-11 rounded-full p-0 disabled:opacity-30"
            >
              <Icon icon={ChevronRight} size={20} />
            </button>
          </div>
        )}
      </div>
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <TabsPrimitive.Content
      value={value}
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className,
      )}
    >
      {children}
    </TabsPrimitive.Content>
  );
}
