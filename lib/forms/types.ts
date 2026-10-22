import { siteConfig } from "@/site.config";

/** Result of a form submission. Forms only claim success when the server confirms it. */
export type FormResult = { ok: true } | { ok: false; message: string };

export const NOT_CONFIGURED: FormResult = {
  ok: false,
  message: `Das Formular ist gerade nicht erreichbar, Ihre Angaben wurden nicht gespeichert. Schreiben Sie uns bitte direkt an ${siteConfig.contact.email}.`,
};

export const GENERIC_ERROR: FormResult = {
  ok: false,
  message: "Das hat leider nicht geklappt. Bitte versuchen Sie es in einem Moment erneut.",
};
