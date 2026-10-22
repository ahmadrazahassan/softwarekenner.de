import { describe, expect, it } from "vitest";

import { matchesDe, normalizeDe } from "@/lib/search/normalize";

describe("lib/search/normalize", () => {
  it("transliterates umlauts and ß", () => {
    expect(normalizeDe("Größe")).toBe("groesse");
    expect(normalizeDe("Übersicht für Büros")).toBe("uebersicht fuer bueros");
  });

  it("matches umlaut and transliterated spellings in both directions", () => {
    expect(matchesDe("Unternehmensgröße", "groesse")).toBe(true);
    expect(matchesDe("Unternehmensgroesse", "Größe")).toBe(true);
    expect(matchesDe("Zeiterfassung für Handwerk", "handwerk zeit")).toBe(true);
    expect(matchesDe("Buchhaltung", "lohn")).toBe(false);
  });

  it("ignores punctuation and hyphens", () => {
    expect(normalizeDe("E-Rechnung, XRechnung")).toBe("e rechnung xrechnung");
  });
});
