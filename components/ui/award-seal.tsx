import { siteConfig } from "@/site.config";

import type { AwardKind } from "@/lib/scoring";

export type { AwardKind };

/** Award names (Section 11.3). Lines are pre broken so the seal never needs hyphenation. */
export const AWARD_LABEL: Record<AwardKind, { title: string; lines: string[] }> = {
  redaktion: { title: "Empfehlung der Redaktion", lines: ["Empfehlung", "der Redaktion"] },
  preisLeistung: { title: "Preis-Leistungs-Tipp", lines: ["Preis-", "Leistungs-Tipp"] },
  selbststaendige: { title: "Beste Wahl für Selbstständige", lines: ["Beste Wahl für", "Selbstständige"] },
  mittelstand: { title: "Beste Wahl für den Mittelstand", lines: ["Beste Wahl für den", "Mittelstand"] },
  datenschutz: { title: "Datenschutz-Tipp", lines: ["Datenschutz-", "Tipp"] },
};

const SHIELD =
  "M50 3.5 88.6 14.6c3 .9 4.9 3.5 4.9 6.6v36.2c0 29.7-18.4 47.3-41.3 58.6a5 5 0 0 1-4.4 0C24.9 104.7 6.5 87.1 6.5 57.4V21.2c0-3.1 1.9-5.7 4.9-6.6L50 3.5Z";

/**
 * Custom award seal (Section 7.3): rounded shield, brand-500 fill, ink outline, Outfit text.
 * No stars, no laurels. "sm" (40 px, for overlapping a logo tile) shows the year only and
 * carries the full name as its accessible label.
 */
export function AwardSeal({
  kind,
  year,
  size = "md",
  className,
}: {
  kind: AwardKind;
  year: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { title, lines } = AWARD_LABEL[kind];
  const px = { sm: 40, md: 104, lg: 144 }[size];
  const label = `${title} ${year}`;

  return (
    <svg
      width={px}
      height={px * 1.2}
      viewBox="0 0 100 120"
      role="img"
      aria-label={label}
      className={className}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <title>{label}</title>
      <path
        d={SHIELD}
        fill="var(--color-brand-500)"
        stroke="var(--color-ink)"
        strokeWidth={size === "sm" ? 5 : 3}
      />
      {size === "sm" ? (
        <text x="50" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-ink)">
          {year}
        </text>
      ) : (
        <>
          <path d="M22 30h56" stroke="var(--color-ink)" strokeWidth="1.25" strokeOpacity="0.35" />
          <text
            x="50"
            y="24"
            textAnchor="middle"
            fontSize="6.4"
            fontWeight="600"
            letterSpacing="0.9"
            fill="var(--color-ink)"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {siteConfig.brand.name.toUpperCase()}
          </text>
          {lines.map((line, i) => (
            <text
              key={line}
              x="50"
              y={50 + i * 13 - (lines.length - 2) * 6}
              textAnchor="middle"
              fontSize={line.length > 15 ? 8.6 : 10.5}
              fontWeight="700"
              fill="var(--color-ink)"
            >
              {line}
            </text>
          ))}
          <text x="50" y="92" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--color-ink)">
            {year}
          </text>
        </>
      )}
    </svg>
  );
}
