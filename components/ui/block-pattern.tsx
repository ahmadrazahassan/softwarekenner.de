import { cn } from "@/lib/utils/cn";

/** Small deterministic PRNG (mulberry32) seeded from a string hash. */
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Block = { x: number; y: number; w: number; h: number; tone: 0 | 1 };

/** A soft staircase of blocks growing out of one corner, on an 8 px grid. */
function staircase(next: () => number, cols: number, rows: number, corner: "bl" | "tr" | "br" | "tl") {
  const blocks: Block[] = [];
  const steps = 4 + Math.floor(next() * 3);
  let x = 0;
  let height = Math.round(rows * (0.32 + next() * 0.14));
  for (let s = 0; s < steps && height > 0 && x < cols * 0.6; s++) {
    const w = 2 + Math.floor(next() * 3);
    blocks.push({ x, y: rows - height, w, h: height, tone: (s % 2) as 0 | 1 });
    if (next() > 0.55 && height > 3) {
      blocks.push({ x, y: rows - height - 1 - Math.floor(next() * 2), w: 1, h: 1, tone: 1 });
    }
    x += w;
    height -= 1 + Math.floor(next() * 3);
  }
  return blocks.map((b) => {
    const flipX = corner === "tr" || corner === "br";
    const flipY = corner === "tr" || corner === "tl";
    return {
      ...b,
      x: flipX ? cols - b.x - b.w : b.x,
      y: flipY ? rows - b.y - b.h : b.y,
    };
  });
}

/**
 * Blockraster pattern (Section 5.8): squares on an 8 px grid as soft staircases, stable per seed.
 * tone "brand": brand-100 and brand-200 on a brand-500 surface. tone "canvas": line on canvas.
 */
export function BlockPattern({
  seed,
  cols = 30,
  rows = 40,
  corners = ["bl", "tr"],
  tone = "brand",
  className,
}: {
  seed: string;
  cols?: number;
  rows?: number;
  corners?: ("bl" | "tr" | "br" | "tl")[];
  tone?: "brand" | "canvas";
  className?: string;
}) {
  const next = rng(seed);
  const blocks = corners.flatMap((corner) => staircase(next, cols, rows, corner));
  const fills =
    tone === "brand"
      ? ["var(--color-brand-200)", "var(--color-brand-100)"]
      : ["var(--color-line)", "var(--color-line-strong)"];

  return (
    <svg
      viewBox={`0 0 ${cols * 8} ${rows * 8}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none", className)}
    >
      {blocks.map((b, i) => (
        <rect key={i} x={b.x * 8} y={b.y * 8} width={b.w * 8} height={b.h * 8} fill={fills[b.tone]} />
      ))}
    </svg>
  );
}
