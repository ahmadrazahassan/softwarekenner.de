"use client";

import { ChevronDown, Info, X } from "lucide-react";
import { useState } from "react";

import { TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

/**
 * Methodology and disclosure bar (Section 7.2 K, Reference 1). Closing only collapses it to
 * one line; it never disappears completely.
 */
export function MethodologyBar({ methodHref, className }: { methodHref: string; className?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Hinweis zu Bewertungen und Affiliate-Links"
      className={cn(
        "rounded-md border border-line bg-white",
        collapsed ? "px-4 py-1.5" : "p-4 sm:p-5",
        className,
      )}
    >
      {collapsed ? (
        <div className="flex items-center gap-3">
          <Icon icon={Info} size={16} className="flex-none text-info" />
          <p className="flex-1 type-small text-text-muted">
            Unabhängig bewertet. Mit * markierte Links sind Affiliate-Links.
          </p>
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
            className="inline-flex min-h-11 flex-none items-center gap-1 type-label font-semibold text-brand-ink focus-visible:outline-2 focus-visible:outline-ink"
          >
            Mehr
            <Icon icon={ChevronDown} size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Icon icon={Info} size={20} className="mt-0.5 flex-none text-info" />
          <div className="flex-1">
            <p className="type-small text-ink">
              Unsere Bewertungen entstehen redaktionell unabhängig. Schließen Sie über einen mit * markierten
              Link einen Vertrag ab, erhalten wir unter Umständen eine Provision. Auf unsere Wertungen hat das
              keinen Einfluss. Bezahlte Platzierungen kennzeichnen wir als Anzeige.
            </p>
            <TextLink href={methodHref} className="text-small">
              So bewerten wir
            </TextLink>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-expanded={true}
            aria-label="Hinweis einklappen"
            className="btn btn-ghost -mt-2 -mr-2 size-11 flex-none rounded-full p-0"
          >
            <Icon icon={X} size={20} />
          </button>
        </div>
      )}
    </aside>
  );
}
