/**
 * Central de-DE formatters (docs/BUILD_PROMPT.md Section 17). Never format by hand.
 * Money is stored as integer cents in EUR.
 */

export const LOCALE = "de-DE";
export const TIME_ZONE = "Europe/Berlin";
export const VAT_RATE = 0.19;

const NBSP = " ";

export function formatPrice(cents: number, opts?: { compact?: boolean }): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: opts?.compact && whole ? 0 : 2,
    maximumFractionDigits: opts?.compact && whole ? 0 : 2,
  }).format(cents / 100); // "29,00 €" or "29 €" (with a no break space)
}

export const formatRating = (value: number): string =>
  new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value); // "4,6"

export const formatNumber = (value: number, maximumFractionDigits = 0): string =>
  new Intl.NumberFormat(LOCALE, { maximumFractionDigits }).format(value); // "1.234"

/** "92 %" with a no break space, as German typography requires. */
export const formatPercent = (value: number, maximumFractionDigits = 0): string =>
  `${formatNumber(value, maximumFractionDigits)}${NBSP}%`;

/** "14. Oktober 2026" for running text. */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));

/** "14.10.2026" for tables. */
export const formatDateShort = (iso: string): string =>
  new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));

/** "Oktober 2026" for "Stand" lines. */
export const formatMonthYear = (iso: string): string =>
  new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric", timeZone: TIME_ZONE }).format(
    new Date(iso),
  );

/** "vor 3 Tagen". */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffSeconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("de", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return rtf.format(diffSeconds, "second");
}

export const grossFromNet = (cents: number, rate = VAT_RATE): number => Math.round(cents * (1 + rate));

export type PriceUnit = "pro-monat" | "pro-nutzer-monat" | "einmalig" | "nutzungsbasiert";

export const PRICE_UNIT_LABEL: Record<PriceUnit, string> = {
  "pro-monat": "pro Monat",
  "pro-nutzer-monat": "pro Nutzer und Monat",
  einmalig: "einmalig",
  nutzungsbasiert: "nutzungsbasiert",
};

export type CompanySize = "solo" | "1-9" | "10-49" | "50-249" | "250+";

export const COMPANY_SIZE_LABEL: Record<CompanySize, string> = {
  solo: "Selbstständige",
  "1-9": "1 bis 9 Mitarbeitende",
  "10-49": "10 bis 49 Mitarbeitende",
  "50-249": "50 bis 249 Mitarbeitende",
  "250+": "ab 250 Mitarbeitende",
};

/** Sorting that puts Ä with A (Section 17). */
export const compareDe = (a: string, b: string): number => a.localeCompare(b, "de");

/** Initials for monogram tiles and avatars: "Musterfirma GmbH" becomes "MG". */
export function initials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .filter((part) => /^[\p{L}\p{N}]/u.test(part))
    .slice(0, max)
    .map((part) => part[0]!.toLocaleUpperCase("de"))
    .join("");
}
