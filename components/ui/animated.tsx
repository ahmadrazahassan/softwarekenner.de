"use client";

import { animate, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Animated data primitives (Section 5.6): count up once on first view in 600 ms, bars and rings
 * draw in once. The server renders the final values, so text, search engines and readers without
 * JavaScript always see the real number; prefers-reduced-motion skips every animation.
 */

const EASE = [0.2, 0.8, 0.2, 1] as const;
const VIEW = { once: true, amount: 0.4 } as const;

const formatter = (decimals: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Number that counts up from zero when it scrolls into view. */
export function CountUp({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEW);
  const reduced = useReducedMotion();
  const text = formatter(decimals).format(value);

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduced || !el) return;
    const format = formatter(decimals).format;
    const controls = animate(0, value, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, decimals]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </span>
  );
}

/**
 * Observe the stable track, not the scaled shape: an element scaled to 0 has no area, so the
 * intersection observer would never see it enter the viewport.
 */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, VIEW);
  return [ref, inView] as const;
}

/** Horizontal bar that grows from the left, value 0 to 100. */
export function GrowBar({
  percent,
  className,
  trackClassName,
  delay = 0,
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
  delay?: number;
}) {
  const [ref, inView] = useReveal<HTMLSpanElement>();
  const width = `${Math.max(0, Math.min(100, percent))}%`;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("block h-2 overflow-hidden rounded-full bg-line", trackClassName)}
    >
      <m.span
        className={cn("block h-full origin-left rounded-full bg-brand-500", className)}
        style={{ width }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay }}
      />
    </span>
  );
}

/** Stacked bar of segments (percent widths) that grows from the left as one piece. */
export function GrowStack({
  segments,
  className,
}: {
  segments: { percent: number; className: string }[];
  className?: string;
}) {
  const [ref, inView] = useReveal<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("block h-3 overflow-hidden rounded-full bg-line", className)}
    >
      <m.span
        className="flex h-full origin-left gap-0.5"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {segments
          .filter((s) => s.percent > 0)
          .map((s, i) => (
            <span
              key={i}
              className={cn("h-full first:rounded-l-full last:rounded-r-full", s.className)}
              style={{ width: `${s.percent}%` }}
            />
          ))}
      </m.span>
    </span>
  );
}

/** Vertical column that grows from the bottom, value 0 to 100 of the available height. */
export function GrowColumn({
  percent,
  className,
  delay = 0,
}: {
  percent: number;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className="flex h-full w-full items-end">
      <m.span
        className={cn("block w-full origin-bottom rounded-md bg-line-strong", className)}
        style={{ height: `${Math.max(2, Math.min(100, percent))}%` }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay }}
      />
    </span>
  );
}

/** Progress ring, value 0 to 100. Starts at twelve o'clock and draws clockwise. */
export function Ring({
  percent,
  size = 132,
  stroke = 12,
  className,
  trackClassName = "stroke-line",
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const r = (size - stroke) / 2;
  const target = Math.max(0, Math.min(100, percent)) / 100;
  return (
    <div className="relative inline-grid flex-none place-items-center" style={{ width: size, height: size }}>
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn("stroke-brand-500", className)}
          initial={{ pathLength: reduced ? target : 0 }}
          whileInView={{ pathLength: target }}
          viewport={VIEW}
          transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
        />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}

/** Round marker that slides along a track to its position (0 to 100). */
export function SlideMarker({ position }: { position: number }) {
  return (
    <m.span
      className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-md"
      initial={{ left: "0%" }}
      whileInView={{ left: `${Math.max(0, Math.min(100, position))}%` }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  );
}

/** Fade and 12 px rise once on first view, staggered by index (Section 5.6). */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index, 8) * 0.06 }}
    >
      {children}
    </m.div>
  );
}

/**
 * Half circle gauge of rounded segments (value 0 to 100). Filled segments light up one after
 * another from the left; the center slot takes the number.
 */
export function ArcGauge({
  percent,
  segments = 14,
  size = 260,
  thickness = 26,
  activeClassName = "stroke-brand-500",
  trackClassName = "stroke-line",
  children,
}: {
  percent: number;
  segments?: number;
  size?: number;
  thickness?: number;
  activeClassName?: string;
  trackClassName?: string;
  children?: React.ReactNode;
}) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  const cx = size / 2;
  const cy = size / 2;
  const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * segments);
  // Each segment is a short radial bar with round ends (reference: segmented sales gauge).
  const span = 180 / segments;
  const length = thickness * 1.6;
  const width = Math.max(6, Math.min(thickness, ((Math.PI * (size / 2 - length / 2) * span) / 180) * 0.74));
  const outer = size / 2 - width / 2;
  const height = size / 2 + width / 2;
  const point = (deg: number, radius: number) => {
    const rad = (Math.PI * (180 - deg)) / 180;
    return [cx + radius * Math.cos(rad), cy - radius * Math.sin(rad)] as const;
  };
  const arcs = Array.from({ length: segments }, (_, i) => {
    const deg = (i + 0.5) * span;
    const [x1, y1] = point(deg, outer - length + width);
    const [x2, y2] = point(deg, outer);
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  });
  return (
    <div
      ref={ref}
      className="relative mx-auto w-full"
      style={{ maxWidth: size, aspectRatio: `${size} / ${height}` }}
    >
      <svg aria-hidden="true" viewBox={`0 0 ${size} ${height}`} className="absolute inset-0 h-full w-full">
        {arcs.map((d, i) => (
          <path
            key={`t${i}`}
            d={d}
            fill="none"
            strokeWidth={width}
            strokeLinecap="round"
            className={trackClassName}
          />
        ))}
        {arcs.slice(0, filled).map((d, i) => (
          <m.path
            key={`a${i}`}
            d={d}
            fill="none"
            strokeWidth={width}
            strokeLinecap="round"
            className={activeClassName}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.25, delay: 0.035 * i }}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center">{children}</div>
    </div>
  );
}

/** 10 by 10 grid, the first `percent` cells filled: one cell is one percent. */
export function Waffle({
  percent,
  activeClassName = "bg-brand-500",
  trackClassName = "bg-line",
  className,
}: {
  percent: number;
  activeClassName?: string;
  trackClassName?: string;
  className?: string;
}) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  const filled = Math.round(Math.max(0, Math.min(100, percent)));
  return (
    <div ref={ref} aria-hidden="true" className={cn("grid grid-cols-10 gap-1.5", className)}>
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} className={cn("relative aspect-square rounded-[4px]", trackClassName)}>
          {i < filled && (
            <m.span
              className={cn("absolute inset-0 rounded-[4px]", activeClassName)}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.2, delay: 0.006 * i }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
