import { describe, expect, it } from "vitest";

import {
  CONSENT_SERVICES,
  CONSENT_VERSION,
  consentRequired,
  decide,
  isGranted,
  parseDecision,
} from "@/lib/consent";

const services = [
  { id: "video", name: "Video", purpose: "Videos.", provider: "A", location: "EU" },
  { id: "karte", name: "Karte", purpose: "Karten.", provider: "B", location: "EU" },
];
const now = new Date("2026-10-19T10:00:00Z");

describe("lib/consent", () => {
  it("needs no banner while no service requires consent", () => {
    expect(CONSENT_SERVICES).toEqual([]);
    expect(consentRequired()).toBe(false);
    expect(consentRequired(services)).toBe(true);
  });

  it("grants all, none, or exactly the chosen services", () => {
    expect(decide(services, "alle", now).granted).toEqual({ video: true, karte: true });
    expect(decide(services, "notwendige", now).granted).toEqual({ video: false, karte: false });
    expect(decide(services, { karte: true, fremd: true }, now).granted).toEqual({
      video: false,
      karte: true,
    });
  });

  it("nothing is granted before a decision", () => {
    expect(isGranted(null, "video")).toBe(false);
  });

  it("asks again after a version change or broken storage", () => {
    const stored = JSON.stringify(decide(services, "alle", now));
    expect(parseDecision(stored)?.granted.video).toBe(true);
    expect(parseDecision(JSON.stringify({ ...JSON.parse(stored), version: CONSENT_VERSION + 1 }))).toBeNull();
    expect(parseDecision("{kaputt")).toBeNull();
    expect(parseDecision(null)).toBeNull();
  });
});
