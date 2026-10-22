import { useId } from "react";

import { formatRating } from "@/lib/format";
import { starFill } from "@/lib/scoring";
import { cn } from "@/lib/utils/cn";

const STAR_PATH =
  "M12 2.6l2.82 5.72 6.31.92-4.57 4.45 1.08 6.28L12 17l-5.64 2.97 1.08-6.28L2.87 9.24l6.31-.92L12 2.6z";

/** Single star glyph. `Star` icons are only allowed inside the rating components (Section 5.7). */
export function StarShape({ fill, size = 16 }: { fill: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="flex-none"
    >
      <path
        d={STAR_PATH}
        fill={fill}
        stroke="var(--color-brand-700)"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type RatingStarsProps = {
  value: number;
  size?: 14 | 16 | 20 | 24;
  /** Hide the number next to the stars only when it is shown elsewhere right next to them. */
  showValue?: boolean;
  className?: string;
};

/**
 * Five stars with decimal fill by clipping (Section 7.3): 4,6 fills 92 percent.
 * Filled in brand-500 with a brand-700 stroke, empty stars in line-strong.
 */
export function RatingStars({ value, size = 16, showValue = true, className }: RatingStarsProps) {
  const clipId = useId();
  const gap = size / 6;
  const width = size * 5 + gap * 4;
  const filled = starFill(value) * width;

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <svg width={width} height={size} viewBox={`0 0 ${width} ${size}`} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <rect width={filled} height={size} />
          </clipPath>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${i * (size + gap)} 0) scale(${size / 24})`}>
            <path d={STAR_PATH} fill="var(--color-line-strong)" />
          </g>
        ))}
        <g clipPath={`url(#${clipId})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * (size + gap)} 0) scale(${size / 24})`}>
              <path
                d={STAR_PATH}
                fill="var(--color-brand-500)"
                stroke="var(--color-brand-700)"
                strokeWidth={0.75 * (24 / size)}
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      </svg>
      {showValue && (
        <span aria-hidden="true" className="font-display font-semibold text-ink tabular-nums">
          {formatRating(value)}
        </span>
      )}
      <span className="sr-only">{formatRating(value)} von 5 Sternen</span>
    </span>
  );
}
