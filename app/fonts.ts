import localFont from "next/font/local";

// Only these three families exist in this project: Outfit, Nunito Sans and Work Sans (SIL OFL).
// Self hosted from assets/fonts/web (built by scripts/build-fonts.ts), so no request ever goes
// to Google (DSGVO, LG München I, 20.01.2022). next/font/local instead of next/font/google because
// Turbopack ignores adjustFontFallback: false for Google fonts (docs/DECISIONS.md).
// No generated fallback faces: adjustFontFallback is off and no fallback list is set.
// display "block" plus preload avoids ever rendering a different family.
// Each file is a variable font, so one file per style covers every weight we use.
export const outfit = localFont({
  src: [{ path: "../assets/fonts/web/outfit.woff2", weight: "400 800", style: "normal" }],
  variable: "--font-outfit",
  display: "block",
  adjustFontFallback: false,
});

export const nunitoSans = localFont({
  src: [
    { path: "../assets/fonts/web/nunito-sans.woff2", weight: "400 700", style: "normal" },
    { path: "../assets/fonts/web/nunito-sans-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-nunito-sans",
  display: "block",
  adjustFontFallback: false,
});

export const workSans = localFont({
  src: [{ path: "../assets/fonts/web/work-sans.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-work-sans",
  display: "block",
  adjustFontFallback: false,
});

export const fontVariables = [outfit.variable, nunitoSans.variable, workSans.variable].join(" ");
