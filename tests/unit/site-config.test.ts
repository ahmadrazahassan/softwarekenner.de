import { describe, expect, it } from "vitest";

import { isPlaceholder, openPlaceholders, siteConfig } from "@/site.config";

describe("site.config", () => {
  it("has no open placeholder from BUILD_PROMPT Section 0", () => {
    // The hosting provider (Vercel) was the last one, set on 22 October 2026.
    expect(openPlaceholders()).toEqual([]);
  });

  it("recognises placeholders and ignores real values", () => {
    expect(isPlaceholder("{{BRAND_NAME}}")).toBe(true);
    expect(isPlaceholder("Musterfirma GmbH")).toBe(false);
    expect(isPlaceholder(42)).toBe(false);
    expect(openPlaceholders({ a: { b: "{{X}}", c: "fertig" } })).toEqual(["X"]);
  });

  it("is set up for Germany, euro and net B2B prices", () => {
    expect(siteConfig.locale).toMatchObject({
      lang: "de",
      locale: "de-DE",
      currency: "EUR",
      timeZone: "Europe/Berlin",
      vatRate: 0.19,
      priceBasis: "netto",
    });
  });
});
