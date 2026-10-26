import { describe, expect, it } from "vitest";

import {
  groupByPartnerLink,
  isCountableClick,
  parseGoPosition,
  parseGoSource,
  resolveGoTarget,
  subidOf,
} from "@/lib/affiliate";
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

  it("groups a vendor's programs behind one partner link into one entry", () => {
    const p = (slug: string, vendor: string, url: string) => ({ slug, vendor, affiliate: { url } });
    const entries = groupByPartnerLink([
      p("easybill", "easybill", "https://a.example"),
      p("sage-100", "sage", "https://s.example"),
      p("sage-50", "sage", "https://s.example"),
      p("weclapp", "weclapp", "https://w.example"),
    ]);
    expect(entries.map((e) => (e.kind === "product" ? e.product.slug : e.vendor))).toEqual([
      "easybill",
      "sage",
      "weclapp",
    ]);
    const sage = entries[1]!;
    expect(sage.kind === "vendor" && sage.products.map((s) => s.slug)).toEqual(["sage-100", "sage-50"]);
  });

  it("counts a person's click but not bots, probes or prefetches", () => {
    const chrome =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";
    const h = (init: Record<string, string>) => new Headers(init);
    expect(isCountableClick("GET", h({ "user-agent": chrome }))).toBe(true);
    expect(isCountableClick("HEAD", h({ "user-agent": chrome }))).toBe(false);
    expect(isCountableClick("GET", h({ "user-agent": chrome, "sec-purpose": "prefetch" }))).toBe(false);
    expect(isCountableClick("GET", h({ "user-agent": chrome, "next-router-prefetch": "1" }))).toBe(false);
    expect(isCountableClick("GET", h({}))).toBe(false);
    for (const ua of [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "facebookexternalhit/1.1",
      "WhatsApp/2.23",
      "curl/8.4.0",
      "python-requests/2.31",
    ]) {
      expect(isCountableClick("GET", h({ "user-agent": ua }))).toBe(false);
    }
  });

  it("tells Impact the placement, the product and our site", () => {
    const sage = {
      slug: "sage",
      affiliate: { url: "https://sagegmbh.sjv.io/5kE542", network: "impact", active: true },
    };
    const target = resolveGoTarget(sage, { from: "start", pos: "4" });
    if (target.kind !== "affiliate") throw new Error("expected affiliate");
    expect(target.url).toBe(
      "https://sagegmbh.sjv.io/5kE542?subId1=start-4&subId2=sage&sharedid=softwarekenner.de",
    );
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
