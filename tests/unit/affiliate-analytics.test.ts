import { describe, expect, it } from "vitest";

import { parseGoPosition, parseGoSource, resolveGoTarget, subidOf } from "@/lib/affiliate";
import { analyticsScript, serverEventRequest, type AnalyticsConfig } from "@/lib/analytics";

const deal = (active: boolean, network = "awin") => ({
  slug: "beispiel",
  affiliate: { url: "https://partner.example/klick?id=7", network, active },
});

describe("lib/affiliate", () => {
  it("sends unknown slugs to the A to Z list", () => {
    expect(resolveGoTarget(undefined, { from: "profil", pos: "1" })).toEqual({
      kind: "index",
      path: "/software",
    });
  });

  it("sends products without an active deal to their profile", () => {
    expect(resolveGoTarget({ slug: "beispiel", affiliate: null }, { from: null, pos: null })).toEqual({
      kind: "profile",
      path: "/software/beispiel",
    });
    expect(resolveGoTarget(deal(false), { from: null, pos: null }).kind).toBe("profile");
  });

  it("appends the network's sub id from whitelisted values only", () => {
    const target = resolveGoTarget(deal(true), { from: "kategorie", pos: "3" });
    expect(target).toMatchObject({ kind: "affiliate", from: "kategorie", position: 3 });
    if (target.kind !== "affiliate") throw new Error("expected affiliate");
    const url = new URL(target.url);
    expect(url.searchParams.get("id")).toBe("7");
    expect(url.searchParams.get("clickref")).toBe("kategorie-3");
  });

  it("leaves direct partner links (UTM only) exactly as given", () => {
    const target = resolveGoTarget(deal(true, "direkt"), { from: "start", pos: "2" });
    if (target.kind !== "affiliate") throw new Error("expected affiliate");
    expect(target.url).toBe("https://partner.example/klick?id=7");
  });

  it("drops values outside the whitelist", () => {
    expect(parseGoSource("newsletter?email=a@b.de")).toBeNull();
    expect(parseGoSource("vergleich")).toBe("vergleich");
    expect(parseGoPosition("0")).toBeNull();
    expect(parseGoPosition("51")).toBeNull();
    expect(parseGoPosition("2x")).toBeNull();
    expect(parseGoPosition("12")).toBe(12);
    expect(subidOf(null, null)).toBe("direkt");
    const target = resolveGoTarget(deal(true, "unbekannt"), { from: "x", pos: "-1" });
    if (target.kind !== "affiliate") throw new Error("expected affiliate");
    expect(new URL(target.url).searchParams.get("subid")).toBe("direkt");
  });
});

describe("lib/analytics", () => {
  const off: AnalyticsConfig = { provider: null, endpoint: null, siteId: null };
  const plausible: AnalyticsConfig = {
    provider: "plausible",
    endpoint: "https://plausible.io/",
    siteId: "beispiel.de",
  };
  const umami: AnalyticsConfig = { provider: "umami", endpoint: "https://stats.beispiel.de", siteId: "abc" };

  it("does nothing while no provider is configured", () => {
    expect(analyticsScript(off)).toBeNull();
    expect(serverEventRequest("Klick", "https://beispiel.de/go/x", {}, off)).toBeNull();
  });

  it("builds the script tag per provider", () => {
    expect(analyticsScript(plausible)).toEqual({
      src: "https://plausible.io/js/script.js",
      "data-domain": "beispiel.de",
    });
    expect(analyticsScript(umami)).toEqual({
      src: "https://stats.beispiel.de/script.js",
      "data-website-id": "abc",
    });
  });

  it("sends server events without IP address or visitor user agent", () => {
    const request = serverEventRequest("Klick", "https://beispiel.de/go/x", { produkt: "x" }, plausible)!;
    expect(request.url).toBe("https://plausible.io/api/event");
    const headers = request.init.headers as Record<string, string>;
    expect(Object.keys(headers).map((h) => h.toLowerCase())).not.toContain("x-forwarded-for");
    expect(JSON.parse(request.init.body as string)).toEqual({
      name: "Klick",
      url: "https://beispiel.de/go/x",
      domain: "beispiel.de",
      props: { produkt: "x" },
    });
    expect(serverEventRequest("Klick", "u", {}, umami)!.url).toBe("https://stats.beispiel.de/api/send");
  });
});
