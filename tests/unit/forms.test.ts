import { describe, expect, it } from "vitest";

import { createRateLimiter, rateKey } from "@/lib/forms/rate-limit";
import {
  AdviceSchema,
  isBusinessEmail,
  ListingSchema,
  NewsletterSchema,
  ReviewSchema,
} from "@/lib/forms/schemas";
import { openToken, sealToken, TOKEN_TTL_MS, tokensEnabled } from "@/lib/forms/tokens";

const secret = "x".repeat(40);
const message = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message;

describe("lib/forms/schemas", () => {
  it("tells business addresses from free mail", () => {
    expect(isBusinessEmail("anna@musterfirma.de")).toBe(true);
    expect(isBusinessEmail("anna@gmx.de")).toBe(false);
    expect(isBusinessEmail("Anna@Web.DE")).toBe(false);
    expect(isBusinessEmail("ohne-at")).toBe(false);
  });

  it("asks politely and specifically in German", () => {
    expect(message(NewsletterSchema.safeParse({ email: "" }))).toBe(
      "Bitte geben Sie Ihre E-Mail-Adresse ein.",
    );
    expect(message(NewsletterSchema.safeParse({ email: "kein-mail" }))).toBe(
      "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    );
    const advice = AdviceSchema.safeParse({
      name: "Anna",
      email: "anna@gmail.com",
      groesse: "10-49",
      einwilligung: true,
    });
    expect(message(advice)).toBe("Bitte geben Sie eine geschäftliche E-Mail-Adresse ein.");
  });

  it("never accepts missing consent", () => {
    const base = { name: "Anna", email: "anna@musterfirma.de", groesse: "10-49" };
    expect(AdviceSchema.safeParse({ ...base, einwilligung: false }).success).toBe(false);
    expect(AdviceSchema.safeParse(base).success).toBe(false);
    expect(AdviceSchema.safeParse({ ...base, einwilligung: true }).success).toBe(true);
  });

  it("requires https and the vendor for listings", () => {
    const listing = {
      anliegen: "eintragen",
      produkt: "Beispiel",
      website: "http://beispiel.de",
      anbieter: "Beispiel GmbH",
      name: "Anna",
      email: "anna@beispiel.de",
      einwilligung: true,
    };
    expect(ListingSchema.safeParse(listing).success).toBe(false);
    expect(ListingSchema.safeParse({ ...listing, website: "https://beispiel.de" }).success).toBe(true);
  });

  it("needs 200 characters of experience and stars from 1 to 5", () => {
    const review = {
      produkt: "beispiel",
      bewertungen: { overall: 4, usability: 4, features: 5, value: 3, support: 4 },
      titel: "Solide für kleine Teams",
      staerken: "Klare Oberfläche und guter Export",
      schwaechen: "Wenige Berichte, langsamer Support",
      erfahrung: "a".repeat(199),
      nutzungsdauer: "1-2-jahre",
      rolle: "Geschäftsführung",
      branche: "Handwerk",
      groesse: "1-9",
      anzeigename: "Anna M.",
      email: "anna@musterfirma.de",
      anreiz: false,
      richtlinien: true,
      einwilligung: true,
    };
    expect(message(ReviewSchema.safeParse(review))).toBe("Bitte schreiben Sie mindestens 200 Zeichen.");
    const valid = { ...review, erfahrung: "a".repeat(200) };
    expect(ReviewSchema.safeParse(valid).success).toBe(true);
    expect(
      ReviewSchema.safeParse({ ...valid, bewertungen: { ...review.bewertungen, value: 6 } }).success,
    ).toBe(false);
  });
});

describe("lib/forms/tokens", () => {
  it("is off without a long enough secret", () => {
    expect(tokensEnabled(undefined)).toBe(false);
    expect(tokensEnabled("kurz")).toBe(false);
    expect(() => sealToken({ p: "newsletter", id: "1" }, { secret: "kurz" })).toThrow();
  });

  it("round trips id and purpose, and holds no readable data", () => {
    const token = sealToken({ p: "download", id: "vorgang-1", s: "crm-leitfaden" }, { secret, now: 0 });
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(token, "base64url").toString("utf8")).not.toContain("vorgang-1");
    expect(openToken(token, { secret, now: 1000 })).toEqual({
      p: "download",
      id: "vorgang-1",
      s: "crm-leitfaden",
      exp: TOKEN_TTL_MS,
    });
  });

  it("rejects expired, forged and foreign tokens", () => {
    const token = sealToken({ p: "newsletter", id: "abc" }, { secret, now: 0 });
    expect(openToken(token, { secret, now: TOKEN_TTL_MS + 1 })).toBeNull();
    expect(openToken(token, { secret: "y".repeat(40), now: 0 })).toBeNull();
    const flipped = token.slice(0, 20) + (token[20] === "A" ? "B" : "A") + token.slice(21);
    expect(openToken(flipped, { secret, now: 0 })).toBeNull();
    expect(openToken("kaputt", { secret, now: 0 })).toBeNull();
  });
});

describe("lib/forms/rate-limit", () => {
  it("allows a few requests per window, then blocks until it resets", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("a", 0)).toBe(true);
    expect(check("a", 10)).toBe(true);
    expect(check("a", 20)).toBe(false);
    expect(check("b", 20)).toBe(true);
    expect(check("a", 1001)).toBe(true);
  });

  it("keys are salted hashes, not addresses", () => {
    const key = rateKey("203.0.113.7", "beratung", "salz");
    expect(key).not.toContain("203.0.113.7");
    expect(key).toBe(rateKey("203.0.113.7", "beratung", "salz"));
    expect(key).not.toBe(rateKey("203.0.113.7", "newsletter", "salz"));
  });
});
