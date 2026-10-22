import { cn } from "@/lib/utils/cn";

import { buttonVariants } from "./button";
import { AdLabel } from "./chip";

type AffiliateButtonProps = {
  /** `/go/[slug]?from=…&pos=…` for affiliate links, the vendor website otherwise. */
  href: string;
  label: string;
  /** True only with an active affiliate deal: adds "*", "Anzeige" and rel="sponsored". */
  sponsored: boolean;
  /** Where the "Anzeige" micro label sits; "none" only inside a card already labeled "Anzeige". */
  adLabel?: "inline" | "below" | "none";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  className?: string;
};

/**
 * Outgoing CTA (Sections 6.2 and 18). Affiliate links carry rel="sponsored nofollow noopener",
 * an asterisk after the label and the "Anzeige" marker. Without a deal it is a plain external link.
 */
export function AffiliateButton({
  href,
  label,
  sponsored,
  adLabel = "below",
  size,
  block,
  className,
}: AffiliateButtonProps) {
  const button = (
    <a
      href={href}
      target="_blank"
      rel={sponsored ? "sponsored nofollow noopener" : "noopener"}
      className={cn(buttonVariants({ variant: "primary", size, block }), !block && className)}
    >
      <span>
        {label}
        {sponsored && <span aria-hidden="true">*</span>}
        <span className="sr-only">
          {sponsored ? " (Affiliate-Link, öffnet in neuem Tab)" : " (öffnet in neuem Tab)"}
        </span>
      </span>
      <span className="btn-arrow btn-arrow-diagonal" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </span>
    </a>
  );

  // "none" only where the surrounding card already carries the "Anzeige" label (FeaturedCard).
  if (!sponsored || adLabel === "none") return block ? <div className={className}>{button}</div> : button;

  return (
    <div
      className={cn(
        "inline-flex gap-2",
        adLabel === "below" ? "flex-col items-center" : "flex-row items-center",
        block && "flex w-full",
        className,
      )}
    >
      {button}
      <AdLabel />
    </div>
  );
}
