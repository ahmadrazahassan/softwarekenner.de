/**
 * Open Graph images (Section 20) with next/og: brand colors and the three brand fonts only
 * (Section 3, rules 4 and 5). One card layout for the home page, Ratgeber, categories and profiles.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { siteConfig } from "@/site.config";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Static instances built by `pnpm fonts:build` (next/og reads no variable fonts).
const font = (file: string) => readFileSync(join(process.cwd(), "assets", "fonts", "og", file));
const FONTS = [
  { name: "Outfit", data: font("outfit-600.ttf"), weight: 600 as const, style: "normal" as const },
  { name: "Outfit", data: font("outfit-800.ttf"), weight: 800 as const, style: "normal" as const },
  { name: "Work Sans", data: font("work-sans-600.ttf"), weight: 600 as const, style: "normal" as const },
];

const C = {
  ink: "#0a0e09",
  canvas: "#eceefe",
  brand500: "#ffa028",
  brand700: "#e06601",
  brand200: "#ffd08f",
  muted: "#4b5068",
};

/** Title size that keeps long German compounds on the card. */
const titleSize = (title: string) => (title.length > 70 ? 52 : title.length > 45 ? 60 : 72);

export function ogCard({
  kicker,
  title,
  facts = [],
  badge,
}: {
  kicker: string;
  title: string;
  /** Up to three short facts in the bottom row, e.g. "ab 7,90 € pro Monat". */
  facts?: string[];
  /** Big figure on the brand panel, e.g. a score "4,4". */
  badge?: { value: string; label: string };
}) {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.canvas }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 780,
          padding: "64px 0 56px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 22 22">
            <rect x="0" y="14" width="8" height="8" fill={C.brand200} />
            <rect x="7" y="7" width="8" height="15" fill={C.brand500} />
            <rect x="14" y="0" width="8" height="22" fill={C.brand700} />
          </svg>
          <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 34, color: C.ink }}>
            {siteConfig.brand.name}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span
            style={{
              fontFamily: "Work Sans",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#a84800",
            }}
          >
            {kicker}
          </span>
          <span
            style={{
              fontFamily: "Outfit",
              fontWeight: 600,
              fontSize: titleSize(title),
              lineHeight: 1.05,
              letterSpacing: -1.5,
              color: C.ink,
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {facts.slice(0, 3).map((f) => (
            <span
              key={f}
              style={{
                display: "flex",
                fontFamily: "Work Sans",
                fontWeight: 600,
                fontSize: 20,
                color: C.ink,
                border: `2px solid ${C.ink}`,
                borderRadius: 999,
                padding: "8px 20px",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          flex: 1,
          margin: "40px 40px 40px 8px",
          borderRadius: 36,
          background: C.brand500,
          overflow: "hidden",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 0,
            width: 110,
            height: 110,
            background: C.brand200,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 140,
            bottom: 0,
            width: 110,
            height: 220,
            background: C.brand200,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 240,
            bottom: 0,
            width: 110,
            height: 330,
            background: C.brand700,
          }}
        />
        {badge && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 48,
              padding: "22px 34px",
              borderRadius: 28,
              background: "#ffffff",
            }}
          >
            <span
              style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 84, lineHeight: 1, color: C.ink }}
            >
              {badge.value}
            </span>
            <span style={{ fontFamily: "Work Sans", fontWeight: 600, fontSize: 18, color: C.muted }}>
              {badge.label}
            </span>
          </div>
        )}
      </div>
    </div>,
    { ...OG_SIZE, fonts: FONTS },
  );
}
