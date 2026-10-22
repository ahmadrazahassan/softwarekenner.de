/**
 * Form schemas (docs/BUILD_PROMPT.md Section 7.5). Client safe: React Hook Form validates with them in
 * the browser, the server actions validate the same data again. Error messages are German, specific
 * and polite. Consent is never pre ticked, so it must be `true`.
 */
import { z } from "zod";

import { COMPANY_SIZE_LABEL, type CompanySize } from "../format/index.ts";

const SIZES = Object.keys(COMPANY_SIZE_LABEL) as [CompanySize, ...CompanySize[]];

/** Free mail domains. A business address is required where Section 13 asks for one. */
const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "gmx.de",
  "gmx.net",
  "gmx.at",
  "gmx.ch",
  "web.de",
  "t-online.de",
  "yahoo.com",
  "yahoo.de",
  "outlook.com",
  "outlook.de",
  "hotmail.com",
  "hotmail.de",
  "live.com",
  "live.de",
  "icloud.com",
  "me.com",
  "freenet.de",
  "aol.com",
  "aol.de",
  "posteo.de",
  "mail.de",
  "proton.me",
  "protonmail.com",
  "arcor.de",
  "online.de",
]);

export const isBusinessEmail = (email: string) => {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return domain !== "" && !FREE_MAIL_DOMAINS.has(domain);
};

const text = (label: string, min = 1, max = 200) =>
  z
    .string({ error: `Bitte geben Sie ${label} ein.` })
    .trim()
    .min(min, min > 1 ? `Bitte schreiben Sie mindestens ${min} Zeichen.` : `Bitte geben Sie ${label} ein.`)
    .max(max, `Bitte fassen Sie sich kürzer (höchstens ${max} Zeichen).`);

const optionalText = (max: number) =>
  z.string().trim().max(max, `Bitte fassen Sie sich kürzer (höchstens ${max} Zeichen).`).optional();

export const emailField = z
  .string({ error: "Bitte geben Sie Ihre E-Mail-Adresse ein." })
  .trim()
  .min(1, "Bitte geben Sie Ihre E-Mail-Adresse ein.")
  .pipe(z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein."));

export const businessEmailField = emailField.refine(
  isBusinessEmail,
  "Bitte geben Sie eine geschäftliche E-Mail-Adresse ein.",
);

const consent = z.literal(true, {
  error: "Bitte bestätigen Sie die Einwilligung, damit wir Ihre Angaben verwenden dürfen.",
});

const size = z.enum(SIZES, { error: "Bitte wählen Sie die Größe Ihres Unternehmens." });

/* ---------- Beratung (Section 13.8) ---------- */

export const AdviceSchema = z.object({
  name: text("Ihren Namen", 1, 120),
  email: businessEmailField,
  groesse: size,
  kategorie: z.string().trim().max(60).optional(),
  anforderungen: z.array(z.string().max(60)).max(12).optional(),
  nachricht: optionalText(2000),
  einwilligung: consent,
});
export type AdviceInput = z.input<typeof AdviceSchema>;

/* ---------- Newsletter (Sections 13.1 and 19) ---------- */

export const NewsletterSchema = z.object({ email: emailField });

/* ---------- Leitfaden download (Section 13.7) ---------- */

export const DownloadSchema = z.object({
  leitfaden: z.string().regex(/^[a-z0-9-]+$/),
  name: text("Ihren Namen", 1, 120),
  email: businessEmailField,
  unternehmen: optionalText(160),
  einwilligung: consent,
});
export type DownloadInput = z.input<typeof DownloadSchema>;

/* ---------- Software eintragen und Profil übernehmen (Section 13.10) ---------- */

export const LISTING_REQUESTS = {
  eintragen: "Neues Programm eintragen",
  uebernehmen: "Bestehendes Profil übernehmen",
  korrektur: "Fehler in einem Profil melden",
} as const;

export const ListingSchema = z.object({
  anliegen: z.enum(Object.keys(LISTING_REQUESTS) as [keyof typeof LISTING_REQUESTS], {
    error: "Bitte wählen Sie Ihr Anliegen.",
  }),
  produkt: text("den Produktnamen", 1, 120),
  website: z
    .string({ error: "Bitte geben Sie die Website an." })
    .trim()
    .pipe(z.url({ protocol: /^https$/, error: "Bitte geben Sie eine Adresse mit https:// an." })),
  anbieter: text("den Anbieter laut Impressum", 2, 160),
  name: text("Ihren Namen", 1, 120),
  email: businessEmailField,
  nachricht: optionalText(3000),
  einwilligung: consent,
});
export type ListingInput = z.input<typeof ListingSchema>;

/* ---------- Bewertung schreiben (Section 13.11), fields as in UserReview ---------- */

export const USAGE_DURATION = {
  "unter-6-monate": "Weniger als 6 Monate",
  "6-12-monate": "6 bis 12 Monate",
  "1-2-jahre": "1 bis 2 Jahre",
  "ueber-2-jahre": "Mehr als 2 Jahre",
} as const;

export const REVIEW_RATINGS = {
  overall: "Gesamteindruck",
  usability: "Bedienung",
  features: "Funktionen",
  value: "Preis-Leistung",
  support: "Support",
} as const;

const stars = z
  .number({ error: "Bitte vergeben Sie 1 bis 5 Sterne." })
  .int()
  .min(1, "Bitte vergeben Sie 1 bis 5 Sterne.")
  .max(5, "Bitte vergeben Sie 1 bis 5 Sterne.");

export const ReviewSchema = z.object({
  produkt: z
    .string({ error: "Bitte wählen Sie das Programm." })
    .regex(/^[a-z0-9-]+$/, "Bitte wählen Sie das Programm."),
  bewertungen: z.object({
    overall: stars,
    usability: stars,
    features: stars,
    value: stars,
    support: stars,
  }),
  titel: text("einen Titel", 5, 120),
  staerken: text("die Stärken", 20, 1000),
  schwaechen: text("die Schwächen", 20, 1000),
  erfahrung: text("Ihre Erfahrung", 200, 5000),
  nutzungsdauer: z.enum(Object.keys(USAGE_DURATION) as [keyof typeof USAGE_DURATION], {
    error: "Bitte wählen Sie, wie lange Sie das Programm nutzen.",
  }),
  rolle: text("Ihre Rolle im Unternehmen", 2, 80),
  branche: text("Ihre Branche", 2, 80),
  groesse: size,
  anzeigename: text("einen Namen für die Anzeige", 2, 60),
  email: businessEmailField,
  anreiz: z.boolean(),
  richtlinien: z.literal(true, { error: "Bitte bestätigen Sie, dass Sie die Richtlinien einhalten." }),
  einwilligung: consent,
});
export type ReviewInput = z.input<typeof ReviewSchema>;

/** Field names per step of the review form, for step wise validation. */
export const REVIEW_STEPS = [
  ["produkt", "bewertungen"],
  ["titel", "staerken", "schwaechen", "erfahrung", "nutzungsdauer"],
  ["rolle", "branche", "groesse", "anzeigename", "email", "anreiz", "richtlinien", "einwilligung"],
] as const;
