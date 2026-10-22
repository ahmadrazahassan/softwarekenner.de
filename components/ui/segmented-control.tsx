"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils/cn";

/** Two to four mutually exclusive options, e.g. "monatlich / jährlich", "netto / brutto". */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onValueChange,
  className,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}) {
  return (
    <ToggleGroupPrimitive.Root
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(next) => next && onValueChange(next as T)}
      className={cn("inline-flex rounded-full border border-line-strong bg-white p-1", className)}
    >
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className="min-h-10 rounded-full px-4 type-label whitespace-nowrap text-text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink data-[state=on]:bg-ink data-[state=on]:text-white"
        >
          {option.label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
