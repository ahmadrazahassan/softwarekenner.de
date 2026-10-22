/**
 * The logo mark: a Blockraster staircase of three blocks (Section 5.8). Used by the wordmark, the
 * footer, the about page and as the source of app/icon.svg (keep the geometry in sync).
 * Works on its own in HTML and nested inside another SVG (x, y and size place it there).
 */
export const LOGO_MARK_BLOCKS = [
  { x: 0, y: 14, width: 8, height: 8, fill: "--color-brand-500" },
  { x: 7, y: 7, width: 8, height: 15, fill: "--color-brand-500" },
  { x: 14, y: 0, width: 8, height: 22, fill: "--color-brand-700" },
] as const;

export function LogoMark({
  size = 22,
  x,
  y,
  tone = "brand",
  className,
}: {
  size?: number;
  x?: number;
  y?: number;
  /** "brand" are the logo colors; "ink" is the one color version for orange surfaces. */
  tone?: "brand" | "ink";
  className?: string;
}) {
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {LOGO_MARK_BLOCKS.map(({ fill, ...block }) => (
        <rect key={block.x} {...block} fill={tone === "ink" ? "var(--color-ink)" : `var(${fill})`} />
      ))}
    </svg>
  );
}
