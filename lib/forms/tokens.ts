/**
 * Confirmation tokens for double opt in (Section 19). AES-256-GCM sealed, so they can neither be read
 * nor forged. They hold an id and a purpose, never an email address or a name.
 *
 * Environment: FORM_TOKEN_SECRET, at least 32 characters. Without it, double opt in is off.
 */
import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type TokenPurpose = "newsletter" | "download" | "review";
export type TokenPayload = { p: TokenPurpose; id: string; s?: string; exp: number };

/** Links stay valid for seven days. */
export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const keyFrom = (secret: string) => createHash("sha256").update(secret).digest();

export const tokensEnabled = (secret = process.env.FORM_TOKEN_SECRET) => !!secret && secret.length >= 32;

export function sealToken(
  payload: Omit<TokenPayload, "exp">,
  { secret = process.env.FORM_TOKEN_SECRET, now = Date.now() } = {},
): string {
  if (!tokensEnabled(secret)) throw new Error("FORM_TOKEN_SECRET fehlt oder ist zu kurz.");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secret!), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify({ ...payload, exp: now + TOKEN_TTL_MS }), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

/** The payload, or null for a forged, damaged or expired token. */
export function openToken(
  token: string,
  { secret = process.env.FORM_TOKEN_SECRET, now = Date.now() } = {},
): TokenPayload | null {
  if (!tokensEnabled(secret) || !/^[A-Za-z0-9_-]{40,600}$/.test(token)) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", keyFrom(secret!), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const payload = JSON.parse(json) as TokenPayload;
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    if (!["newsletter", "download", "review"].includes(payload.p) || typeof payload.id !== "string")
      return null;
    return payload;
  } catch {
    return null;
  }
}
