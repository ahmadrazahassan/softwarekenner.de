import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/site.config";

import { LogoMark } from "./logo-mark";

/** Wordmark in Outfit 700 with a small Blockraster staircase as the mark (Sections 5.8 and 7.1). */
export function Wordmark({ onDark, className }: { onDark?: boolean; className?: string }) {
  return (
    <AppLink
      href="/"
      aria-label={`${siteConfig.brand.name}, zur Startseite`}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4",
        onDark ? "text-white focus-visible:outline-white" : "text-ink focus-visible:outline-ink",
        className,
      )}
    >
      <LogoMark className="flex-none" />
      <span className="font-display text-[1.375rem] leading-none font-bold tracking-[-0.02em]">
        {siteConfig.brand.name}
      </span>
    </AppLink>
  );
}
