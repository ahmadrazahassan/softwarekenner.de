"use server";

import { headers } from "next/headers";
import { randomUUID } from "node:crypto";

import { getDownload, getSoftware } from "@/lib/content";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import { createRateLimiter, rateKey } from "@/lib/forms/rate-limit";
import {
  AdviceSchema,
  DownloadSchema,
  LISTING_REQUESTS,
  ListingSchema,
  NewsletterSchema,
  REVIEW_RATINGS,
  ReviewSchema,
  USAGE_DURATION,
} from "@/lib/forms/schemas";
import { openToken, sealToken, tokensEnabled, type TokenPurpose } from "@/lib/forms/tokens";
import { GENERIC_ERROR, NOT_CONFIGURED, type FormResult } from "@/lib/forms/types";
import { contactStore, editorialInbox, mailProvider } from "@/lib/mail";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/site.config";

/**
 * Form server actions (Sections 7.5, 13 and 19). Every action validates again with the shared schema,
 * drops honeypot submissions silently, limits the rate per client and only reports success after the
 * mail provider accepted the message. Without a provider the actions say so and store nothing.
 */

const brand = siteConfig.brand.name;
// Five submissions per form and client in ten minutes; FORM_RATE_LIMIT overrides it for tests.
const limiter = createRateLimiter({
  limit: Number(process.env.FORM_RATE_LIMIT) || 5,
  windowMs: 10 * 60 * 1000,
});

const RATE_LIMITED: FormResult = {
  ok: false,
  message:
    "Sie haben in kurzer Zeit viele Anfragen gesendet. Bitte versuchen Sie es in einigen Minuten erneut.",
};
const INVALID: FormResult = {
  ok: false,
  message: "Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.",
};

type Input = FormData | Record<string, unknown>;
const toObject = (input: Input): Record<string, unknown> =>
  input instanceof FormData ? Object.fromEntries(input) : input;

/** Bots fill the hidden honeypot. They get a success answer and nothing happens. */
const isBot = (data: Record<string, unknown>, field: string) => String(data[field] ?? "").trim() !== "";

async function requestContext(form: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unbekannt";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return {
    allowed: limiter(rateKey(ip, form)),
    // Links in emails use the real domain once it is set, else the address the request came in on.
    link: (path: string) => absoluteUrl(path) ?? `${proto}://${host}${path}`,
  };
}

/** Sends through the provider; any failure becomes a polite generic error. */
async function deliver(messages: Parameters<NonNullable<ReturnType<typeof mailProvider>>["send"]>[0][]) {
  const provider = mailProvider();
  if (!provider) return NOT_CONFIGURED;
  try {
    for (const message of messages) await provider.send(message);
    return { ok: true } as const;
  } catch (error) {
    console.error("Formular: Versand fehlgeschlagen", error instanceof Error ? error.message : error);
    return GENERIC_ERROR;
  }
}

const confirmLink = (link: (path: string) => string, p: TokenPurpose, id: string, s?: string) =>
  link(`/bestaetigen?token=${sealToken({ p, id, ...(s ? { s } : {}) })}`);

/* ---------- Beratung ---------- */

export async function requestAdvice(input: Input): Promise<FormResult> {
  const data = toObject(input);
  if (isBot(data, "firma_website")) return { ok: true };
  const parsed = AdviceSchema.safeParse({
    ...data,
    einwilligung: data.einwilligung === true || data.einwilligung === "on" || data.einwilligung === "true",
    anforderungen: Array.isArray(data.anforderungen) ? data.anforderungen : undefined,
    kategorie: data.kategorie || undefined,
    nachricht: data.nachricht || undefined,
  });
  if (!parsed.success) return INVALID;
  const inbox = editorialInbox();
  if (!mailProvider() || !inbox) return NOT_CONFIGURED;
  const ctx = await requestContext("beratung");
  if (!ctx.allowed) return RATE_LIMITED;

  const a = parsed.data;
  return deliver([
    {
      to: inbox,
      replyTo: a.email,
      subject: `Beratungsanfrage: ${a.kategorie ?? "ohne Kategorie"}, ${COMPANY_SIZE_LABEL[a.groesse]}`,
      text: [
        `Name: ${a.name}`,
        `E-Mail: ${a.email}`,
        `Unternehmensgröße: ${COMPANY_SIZE_LABEL[a.groesse]}`,
        `Kategorie: ${a.kategorie ?? "keine Angabe"}`,
        `Anforderungen: ${a.anforderungen?.length ? a.anforderungen.join(", ") : "keine Angabe"}`,
        "",
        a.nachricht ?? "(keine Nachricht)",
      ].join("\n"),
    },
    {
      to: a.email,
      subject: `Ihre Beratungsanfrage bei ${brand}`,
      text: [
        `Guten Tag ${a.name},`,
        "",
        "vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns per E-Mail bei Ihnen.",
        "Ihre Angaben verwenden wir nur, um Ihre Anfrage zu beantworten. Wir geben sie nicht an Anbieter weiter.",
        "",
        `Ihr Team von ${brand}`,
      ].join("\n"),
    },
  ]);
}

/* ---------- Newsletter with double opt in ---------- */

export async function subscribeNewsletter(input: Input): Promise<FormResult> {
  const data = toObject(input);
  if (isBot(data, "newsletter_website")) return { ok: true };
  const parsed = NewsletterSchema.safeParse({ email: data.email });
  if (!parsed.success) return { ok: false, message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  const contacts = contactStore();
  if (!mailProvider() || !contacts || !tokensEnabled()) return NOT_CONFIGURED;
  const ctx = await requestContext("newsletter");
  if (!ctx.allowed) return RATE_LIMITED;

  let id: string;
  try {
    id = await contacts.createPending(parsed.data.email);
  } catch (error) {
    console.error("Newsletter: Kontakt nicht angelegt", error instanceof Error ? error.message : error);
    return GENERIC_ERROR;
  }
  // Consent log without personal data: the contact id and the time.
  console.info(
    JSON.stringify({ event: "newsletter_doi_angefragt", kontakt: id, zeit: new Date().toISOString() }),
  );
  return deliver([
    {
      to: parsed.data.email,
      subject: `Bitte bestätigen Sie Ihre Anmeldung zum Newsletter von ${brand}`,
      text: [
        "Guten Tag,",
        "",
        `Sie haben sich für den Newsletter von ${brand} angemeldet. Bitte bestätigen Sie die Anmeldung über diesen Link:`,
        confirmLink(ctx.link, "newsletter", id),
        "",
        "Der Link ist sieben Tage gültig. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach.",
        "",
        `Ihr Team von ${brand}`,
      ].join("\n"),
    },
  ]);
}

/* ---------- Leitfaden download with double opt in ---------- */

export async function requestDownload(input: Input): Promise<FormResult> {
  const data = toObject(input);
  if (isBot(data, "firma_website")) return { ok: true };
  const parsed = DownloadSchema.safeParse({
    ...data,
    unternehmen: data.unternehmen || undefined,
    einwilligung: data.einwilligung === true || data.einwilligung === "on" || data.einwilligung === "true",
  });
  if (!parsed.success) return INVALID;
  const download = getDownload(parsed.data.leitfaden);
  if (!download) return INVALID;
  if (!mailProvider() || !tokensEnabled()) return NOT_CONFIGURED;
  const ctx = await requestContext("leitfaden");
  if (!ctx.allowed) return RATE_LIMITED;

  const id = randomUUID();
  console.info(JSON.stringify({ event: "leitfaden_doi_angefragt", vorgang: id, leitfaden: download.slug }));
  return deliver([
    {
      to: parsed.data.email,
      subject: `Ihr Leitfaden „${download.title}“`,
      text: [
        `Guten Tag ${parsed.data.name},`,
        "",
        "bitte bestätigen Sie Ihre E-Mail-Adresse. Danach können Sie den Leitfaden herunterladen:",
        confirmLink(ctx.link, "download", id, download.slug),
        "",
        "Der Link ist sieben Tage gültig.",
        "",
        `Ihr Team von ${brand}`,
      ].join("\n"),
    },
  ]);
}

/* ---------- Software eintragen, Profil übernehmen ---------- */

export async function submitListing(input: Input): Promise<FormResult> {
  const data = toObject(input);
  if (isBot(data, "firma_website")) return { ok: true };
  const parsed = ListingSchema.safeParse({
    ...data,
    nachricht: data.nachricht || undefined,
    einwilligung: data.einwilligung === true || data.einwilligung === "on" || data.einwilligung === "true",
  });
  if (!parsed.success) return INVALID;
  const inbox = editorialInbox();
  if (!mailProvider() || !inbox) return NOT_CONFIGURED;
  const ctx = await requestContext("eintrag");
  if (!ctx.allowed) return RATE_LIMITED;

  const l = parsed.data;
  return deliver([
    {
      to: inbox,
      replyTo: l.email,
      subject: `${LISTING_REQUESTS[l.anliegen]}: ${l.produkt}`,
      text: [
        `Anliegen: ${LISTING_REQUESTS[l.anliegen]}`,
        `Produkt: ${l.produkt}`,
        `Website: ${l.website}`,
        `Anbieter laut Impressum: ${l.anbieter}`,
        `Ansprechperson: ${l.name}, ${l.email}`,
        "",
        l.nachricht ?? "(keine Nachricht)",
      ].join("\n"),
    },
  ]);
}

/* ---------- Bewertung schreiben (moderation queue by email) ---------- */

export async function submitReview(input: Input): Promise<FormResult> {
  const data = toObject(input);
  if (isBot(data, "firma_website")) return { ok: true };
  const parsed = ReviewSchema.safeParse(data);
  if (!parsed.success) return INVALID;
  const software = getSoftware(parsed.data.produkt);
  if (!software) return INVALID;
  const inbox = editorialInbox();
  if (!mailProvider() || !inbox || !tokensEnabled()) return NOT_CONFIGURED;
  const ctx = await requestContext("bewertung");
  if (!ctx.allowed) return RATE_LIMITED;

  const r = parsed.data;
  const id = `bewertung-${randomUUID().slice(0, 8)}`;
  return deliver([
    {
      to: inbox,
      replyTo: r.email,
      subject: `Neue Bewertung (unbestätigt) ${id}: ${software.name}`,
      text: [
        `Vorgang: ${id}. Status: E-Mail noch nicht bestätigt. Erst nach der Bestätigung moderieren.`,
        `Programm: ${software.name} (${software.slug})`,
        ...Object.entries(REVIEW_RATINGS).map(
          ([key, label]) => `${label}: ${r.bewertungen[key as keyof typeof REVIEW_RATINGS]} von 5`,
        ),
        `Titel: ${r.titel}`,
        `Stärken: ${r.staerken}`,
        `Schwächen: ${r.schwaechen}`,
        `Nutzungsdauer: ${USAGE_DURATION[r.nutzungsdauer]}`,
        `Rolle: ${r.rolle}, Branche: ${r.branche}, Größe: ${COMPANY_SIZE_LABEL[r.groesse]}`,
        `Anzeigename: ${r.anzeigename}`,
        `E-Mail (geschäftlich, nicht veröffentlichen): ${r.email}`,
        `Anreiz erhalten: ${r.anreiz ? "ja, als solche kennzeichnen" : "nein"}`,
        "",
        r.erfahrung,
      ].join("\n"),
    },
    {
      to: r.email,
      subject: `Bitte bestätigen Sie Ihre Bewertung von ${software.name}`,
      text: [
        `Guten Tag ${r.anzeigename},`,
        "",
        `vielen Dank für Ihre Bewertung von ${software.name}. Bitte bestätigen Sie Ihre geschäftliche E-Mail-Adresse:`,
        confirmLink(ctx.link, "review", id),
        "",
        "Nach der Bestätigung prüfen wir die Bewertung anhand unserer Richtlinien und veröffentlichen sie dann.",
        "",
        `Ihr Team von ${brand}`,
      ].join("\n"),
    },
  ]);
}

/* ---------- Confirmation (button on /bestaetigen, never on GET) ---------- */

export type ConfirmResult =
  | { ok: true; purpose: TokenPurpose; download?: { title: string; file: string } }
  | { ok: false; message: string };

export async function confirmToken(token: string): Promise<ConfirmResult> {
  const payload = openToken(token);
  if (!payload) {
    return {
      ok: false,
      message: "Dieser Link ist abgelaufen oder ungültig. Bitte melden Sie sich erneut an.",
    };
  }
  if (payload.p === "newsletter") {
    const contacts = contactStore();
    if (!contacts) return NOT_CONFIGURED as ConfirmResult;
    if (!(await contacts.confirm(payload.id))) return GENERIC_ERROR as ConfirmResult;
    console.info(
      JSON.stringify({
        event: "newsletter_doi_bestaetigt",
        kontakt: payload.id,
        zeit: new Date().toISOString(),
      }),
    );
    return { ok: true, purpose: "newsletter" };
  }
  if (payload.p === "download") {
    const download = payload.s ? getDownload(payload.s) : undefined;
    if (!download) return { ok: false, message: "Diesen Leitfaden gibt es nicht mehr." };
    console.info(
      JSON.stringify({ event: "leitfaden_doi_bestaetigt", vorgang: payload.id, leitfaden: download.slug }),
    );
    return { ok: true, purpose: "download", download: { title: download.title, file: download.file } };
  }
  const inbox = editorialInbox();
  if (!inbox) return NOT_CONFIGURED as ConfirmResult;
  const sent = await deliver([
    {
      to: inbox,
      subject: `Bewertung ${payload.id} bestätigt`,
      text: `Die E-Mail-Adresse zur Bewertung ${payload.id} wurde bestätigt. Die Bewertung kann moderiert werden.`,
    },
  ]);
  return sent.ok ? { ok: true, purpose: "review" } : (sent as ConfirmResult);
}
