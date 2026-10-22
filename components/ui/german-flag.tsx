/**
 * German flag, three stripes at 3:5 (Section 5.7). Uses the official flag colors, which are
 * national symbols, not brand colors. Decorative: always paired with a text label.
 */
export function GermanFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 5 3"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="5" height="1" y="0" fill="#000000" />
      <rect width="5" height="1" y="1" fill="#dd0000" />
      <rect width="5" height="1" y="2" fill="#ffce00" />
    </svg>
  );
}
