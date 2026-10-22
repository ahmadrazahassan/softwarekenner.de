import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { BlockPattern } from "./block-pattern";
import { Icon } from "./icon";

/** Skeleton block. Shape it like the final layout so nothing shifts (Section 7.4). */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-skeleton rounded-sm bg-line", className)} />;
}

/** Wrapper announcing a loading region to screen readers. */
export function LoadingRegion({
  label = "Wird geladen …",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/**
 * Empty state with one action (Section 7.4). Until the illustration library exists
 * (docs/IMAGE_PROMPTS.md Section 7.6) it uses the Blockraster pattern as its visual.
 */
export function EmptyState({
  title,
  text,
  action,
  seed = "leer",
  icon,
  className,
}: {
  title: string;
  text?: ReactNode;
  action?: ReactNode;
  seed?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-line bg-white px-6 py-12 text-center",
        className,
      )}
    >
      <BlockPattern
        seed={seed}
        cols={60}
        rows={20}
        corners={["bl", "br"]}
        tone="canvas"
        className="absolute inset-x-0 bottom-0 -z-10 h-24 w-full opacity-80"
      />
      {icon && <Icon icon={icon} size={28} className="text-ink" />}
      <h3 className="type-h4 text-ink">{title}</h3>
      {text && <p className="max-w-md measure type-body text-text-muted">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Inline notice: info, success or error. Icon without background. */
export function Notice({
  tone = "info",
  icon,
  title,
  children,
  className,
}: {
  tone?: "info" | "positive" | "negative";
  icon: LucideIcon;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "negative" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-md border bg-white p-4",
        tone === "info" && "border-info/30",
        tone === "positive" && "border-positive/30",
        tone === "negative" && "border-negative/30",
        className,
      )}
    >
      <Icon
        icon={icon}
        size={20}
        className={cn(
          "mt-0.5 flex-none",
          tone === "info" && "text-info",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
        )}
      />
      <div className="type-body text-ink">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-text-muted">{children}</div>
      </div>
    </div>
  );
}
