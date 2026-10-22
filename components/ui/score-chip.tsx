import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

import { StarShape } from "./rating-stars";

/** Ink pill with the score and an orange star (Section 7.3 ScoreChip). */
export function ScoreChip({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-ink font-display font-semibold text-white tabular-nums",
        size === "md" ? "h-8 px-3 text-body" : "h-6 px-2 text-small",
        className,
      )}
    >
      <StarShape fill="var(--color-brand-500)" size={size === "md" ? 14 : 12} />
      <span aria-hidden="true">{formatRating(score)}</span>
      <span className="sr-only">Redaktionswertung {formatRating(score)} von 5</span>
    </span>
  );
}
