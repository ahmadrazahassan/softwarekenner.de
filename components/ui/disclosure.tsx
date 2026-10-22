"use client";

import { ChevronDown } from "lucide-react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";

/** "Mehr Details" style disclosure on Radix Collapsible. */
export function Disclosure({
  label,
  openLabel,
  children,
  className,
}: {
  label: string;
  /** Label while open, e.g. "Weniger Details". */
  openLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <CollapsiblePrimitive.Root className={className}>
      <CollapsiblePrimitive.Trigger className="group link-cta">
        <span className="group-data-[state=open]:hidden">{label}</span>
        <span className="hidden group-data-[state=open]:inline">{openLabel ?? label}</span>
        <Icon
          icon={ChevronDown}
          size={16}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className={cn("overflow-hidden data-[state=open]:animate-fade-in")}>
        <div className="pt-4">{children}</div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
