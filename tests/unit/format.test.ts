import { describe, expect, it } from "vitest";

import {
  compareDe,
  formatDate,
  formatDateShort,
  formatMonthYear,
  formatNumber,
  formatPercent,
  formatPrice,
  formatRating,
  formatRelative,
  grossFromNet,
  initials,
} from "@/lib/format";

const NBSP = " ";

describe("lib/format", () => {
  it("formats euro prices the German way", () => {
    expect(formatPrice(2900)).toBe(`29,00${NBSP}€`);
    expect(formatPrice(990)).toBe(`9,90${NBSP}€`);
    expect(formatPrice(2900, { compact: true })).toBe(`29${NBSP}€`);
    expect(formatPrice(990, { compact: true })).toBe(`9,90${NBSP}€`);
    expect(formatPrice(123456)).toBe(`1.234,56${NBSP}€`);
  });

  it("formats ratings with exactly one decimal and a comma", () => {
    expect(formatRating(4.6)).toBe("4,6");
    expect(formatRating(4)).toBe("4,0");
    expect(formatRating(4.66)).toBe("4,7");
  });

  it("formats numbers and percentages", () => {
    expect(formatNumber(1234)).toBe("1.234");
    expect(formatPercent(92)).toBe(`92${NBSP}%`);
  });

  it("formats dates in Europe/Berlin", () => {
    expect(formatDate("2026-10-14")).toBe("14. Oktober 2026");
    expect(formatDateShort("2026-10-14")).toBe("14.10.2026");
    expect(formatMonthYear("2026-10-14")).toBe("Oktober 2026");
  });

  it("formats relative dates in German", () => {
    const now = new Date("2026-10-19T12:00:00Z");
    expect(formatRelative("2026-10-16T12:00:00Z", now)).toBe("vor 3 Tagen");
    expect(formatRelative("2026-10-18T12:00:00Z", now)).toBe("gestern");
  });

  it("adds 19 % VAT and rounds to whole cents", () => {
    expect(grossFromNet(2900)).toBe(3451);
    expect(grossFromNet(999)).toBe(1189);
  });

  it("sorts umlauts with their base letter", () => {
    expect(["Zeit", "Ärzte", "Apfel"].sort(compareDe)).toEqual(["Apfel", "Ärzte", "Zeit"]);
  });

  it("builds initials for monograms", () => {
    expect(initials("Musterfirma GmbH")).toBe("MG");
    expect(initials("Ölmühle")).toBe("Ö");
  });
});
