/**
 * Mail delivery behind interfaces (docs/BUILD_PROMPT.md Sections 8.2 and 13.8). Resend in production,
 * an outbox folder for local tests, nothing otherwise: forms then say that delivery is not set up.
 *
 * Environment:
 * - RESEND_API_KEY, MAIL_FROM ("Name <adresse@domain.de>"), optional RESEND_SEGMENT_ID for the newsletter
 * - MAIL_TO: editorial inbox for requests; falls back to CONTACT_EMAIL in site.config.ts once set
 * - MAIL_OUTBOX_DIR: local test provider that writes every message as JSON into this folder.
 *   For development and E2E only; never set it in production.
 */
import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { Resend } from "resend";

import { isPlaceholder, siteConfig } from "@/site.config";

export type MailMessage = { to: string; subject: string; text: string; replyTo?: string };

export interface MailProvider {
  readonly name: "resend" | "outbox";
  send(message: MailMessage): Promise<void>;
}

/** Newsletter contacts: created unsubscribed, switched on only after the confirmation link. */
export interface ContactStore {
  createPending(email: string): Promise<string>;
  confirm(id: string): Promise<boolean>;
}

/* ---------- Resend ---------- */

function resendClient() {
  const key = process.env.RESEND_API_KEY;
  return key && process.env.MAIL_FROM ? new Resend(key) : null;
}

const resendProvider = (client: Resend): MailProvider => ({
  name: "resend",
  async send(message) {
    const { error } = await client.emails.send({
      from: process.env.MAIL_FROM!,
      to: message.to,
      subject: message.subject,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) throw new Error(`Resend: ${error.message}`);
  },
});

const resendContacts = (client: Resend): ContactStore => ({
  async createPending(email) {
    const segment = process.env.RESEND_SEGMENT_ID;
    const { data, error } = await client.contacts.create({
      email,
      unsubscribed: true,
      ...(segment ? { segments: [{ id: segment }] } : {}),
    });
    if (error || !data) throw new Error(`Resend: ${error?.message ?? "kein Kontakt"}`);
    return data.id;
  },
  async confirm(id) {
    const { error } = await client.contacts.update({ id, unsubscribed: false });
    return !error;
  },
});

/* ---------- Outbox (local tests) ---------- */

const outboxDir = () => process.env.MAIL_OUTBOX_DIR || null;

const outboxProvider = (dir: string): MailProvider => ({
  name: "outbox",
  async send(message) {
    await mkdir(dir, { recursive: true });
    const file = join(dir, `${Date.now()}-${randomUUID()}.json`);
    await writeFile(file, JSON.stringify({ ...message, sentAt: new Date().toISOString() }, null, 2));
  },
});

const outboxContacts = (dir: string): ContactStore => {
  const file = join(dir, "contacts.json");
  const read = async (): Promise<Record<string, { email: string; confirmed: boolean }>> => {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      return {};
    }
  };
  return {
    async createPending(email) {
      await mkdir(dir, { recursive: true });
      const contacts = await read();
      const id = randomUUID();
      contacts[id] = { email, confirmed: false };
      await writeFile(file, JSON.stringify(contacts, null, 2));
      return id;
    },
    async confirm(id) {
      const contacts = await read();
      if (!contacts[id]) return false;
      contacts[id].confirmed = true;
      await writeFile(file, JSON.stringify(contacts, null, 2));
      return true;
    },
  };
};

/* ---------- Selection ---------- */

export function mailProvider(): MailProvider | null {
  const client = resendClient();
  if (client) return resendProvider(client);
  const dir = outboxDir();
  return dir ? outboxProvider(dir) : null;
}

export function contactStore(): ContactStore | null {
  const client = resendClient();
  if (client) return resendContacts(client);
  const dir = outboxDir();
  return dir ? outboxContacts(dir) : null;
}

/** Where requests go. Null until an address exists, so nothing is sent into the void. */
export function editorialInbox(): string | null {
  if (process.env.MAIL_TO) return process.env.MAIL_TO;
  if (!isPlaceholder(siteConfig.contact.email)) return siteConfig.contact.email;
  return outboxDir() ? "redaktion@outbox.test" : null;
}
