import { describe, expect, it } from "vitest";

import { faqJsonLd, metaDescription, pageMetadata, withYear } from "@/lib/seo";

describe("SEO helpers", () => {
  it("keep meta descriptions within 155 characters and cut at a word", () => {
    const long = "Buchhaltung ".repeat(30);
    const text = metaDescription(long);
    expect(text.length).toBeLessThanOrEqual(155);
    expect(text.endsWith("Buchhaltung…")).toBe(true);
    expect(metaDescription("Kurz und gut.")).toBe("Kurz und gut.");
  });

  it("put the year of the last update into SEO titles", () => {
    expect(withYear("Buchhaltungssoftware Vergleich {jahr}: Programme", "2026-10-22")).toBe(
      "Buchhaltungssoftware Vergleich 2026: Programme",
    );
    expect(withYear("Ohne Jahr", "2026-10-22")).toBe("Ohne Jahr");
  });

  it("set the default share image unless the route has its own", () => {
    const base = { title: "Titel", description: "Beschreibung", path: "/ratgeber" };
    expect(pageMetadata(base).openGraph?.images).toBeDefined();
    expect(pageMetadata({ ...base, ownImage: true }).openGraph?.images).toBeUndefined();
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it("build FAQPage markup only when questions exist", () => {
    expect(faqJsonLd([])).toBeNull();
    expect(faqJsonLd([{ question: "Frage?", answer: "Antwort." }])).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [{ name: "Frage?", acceptedAnswer: { text: "Antwort." } }],
    });
  });
});
