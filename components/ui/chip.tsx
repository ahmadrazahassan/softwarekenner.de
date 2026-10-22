import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { GermanFlag } from "./german-flag";
import { Icon } from "./icon";

/** Outline status chip with an icon (Section 7.3 StatusChip). */
export function StatusChip({
  icon,
  flag,
  children,
  tone = "default",
  className,
}: {
  icon?: LucideIcon;
  /** Shows the German flag instead of an icon ("Anbieter aus Deutschland"). */
  flag?: boolean;
  children: ReactNode;
  tone?: "default" | "positive" | "onDark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-xs border px-2.5 py-1 font-ui text-small leading-tight font-medium",
        tone === "default" && "border-line-strong bg-surface text-ink",
        tone === "positive" && "border-positive/35 bg-surface text-positive",
        tone === "onDark" && "border-ink-700 bg-ink-800 text-white",
        className,
      )}
    >
      {flag ? <GermanFlag className="h-3 w-5" /> : icon ? <Icon icon={icon} size={16} /> : null}
      {children}
    </span>
  );
}

/** Small neutral tag, for strengths and weaknesses or topics. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs bg-surface-tint px-2 py-1 font-ui text-caption font-medium text-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** "Anzeige" micro label for paid placements and affiliate CTAs (Sections 3.10 and 18). */
export function AdLabel({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn("type-micro", onDark ? "text-on-dark-muted" : "text-text-muted", className)}>
      Anzeige
    </span>
  );
}
