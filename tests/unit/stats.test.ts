import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import * as S from "@/lib/content/schemas";
import {
  checkTally,
  planLadder,
  portfolioStats,
  pricePosition,
  rankIn,
  shares,
  teamCosts,
} from "@/lib/content/stats";

import { software } from "./fixtures/content";

const plan = (name: string, cents: number) => ({
  name,
  priceMonthlyNet: cents,
  priceYearlyNetPerMonth: null,
  unit: "pro-nutzer-monat" as const,
  includedUsers: null,
  highlights: [],
  recommended: false,
});

const priced = (slug: string, cents: number) =>
  software(slug, {
    pricing: { ...software(slug).pricing, plans: [plan("Basis", cents)] },
  });

describe("market datasets", () => {
  const dir = join(import.meta.dirname, "..", "..", "content", "markt");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

  it("all parse, carry a source with publisher and stay in plausible ranges", () => {
    expect(files.length).toBeGreaterThan(5);
    for (const f of files) {
      const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
      const parsed = S.MarketDataset.safeParse(data);
      expect(parsed.success, f).toBe(true);
      for (const p of data.points) if (p.unit === "prozent") expect(p.value, f).toBeLessThanOrEqual(100);
      expect(data.source.url, f).toMatch(/^https:\/\/www\.(bitkom\.org|destatis\.de)\//);
    }
  });
});

describe("stats", () => {
  it("shares count every key and add up to 100 %", () => {
    const result = shares(
      ["DE", "DE", "EU", "unbekannt"],
      [
        { key: "DE", label: "Deutschland" },
        { key: "EU", label: "EU" },
        { key: "unbekannt", label: "keine Angabe" },
      ],
    );
    expect(result.map((r) => r.count)).toEqual([2, 1, 1]);
    expect(result.reduce((s, r) => s + r.percent, 0)).toBe(100);
  });

  it("price position uses peers with the same price basis and a log scale", () => {
    const peers = [priced("a", 500), priced("b", 1000), priced("c", 2000), priced("d", 400000)];
    const pos = pricePosition(priced("b", 1000), peers)!;
    expect(pos.median).toBe(1500);
    expect(pos.deltaPercent).toBe(-33);
    // On a linear scale 10 € would sit at 0 %; logarithmic keeps it readable.
    expect(pos.position).toBeGreaterThan(5);
    expect(pricePosition(priced("b", 1000), peers.slice(0, 2))).toBeNull();
  });

  it("plan ladder keeps paid plans with their cheapest price", () => {
    const ladder = planLadder([
      plan("Frei", 0),
      { ...plan("Pro", 2000), priceYearlyNetPerMonth: 1500, recommended: true },
    ]);
    expect(ladder).toEqual([{ name: "Pro", cents: 1500, unit: "pro-nutzer-monat", recommended: true }]);
  });

  it("team costs multiply per user plans and need two fixed prices", () => {
    const team = teamCosts([plan("Pro", 1000)])!;
    expect(team.rows.map((r) => r.cents)).toEqual([1000, 5000, 10000, 25000]);
    expect(teamCosts([{ ...plan("Anfrage", 0) }])).toBeNull();
  });

  it("rank shares ties and tally counts statuses", () => {
    const scored = [
      { slug: "a", score: 4.5 },
      { slug: "b", score: 4.2 },
      { slug: "c", score: 4.2 },
    ];
    expect(rankIn("c", scored)).toEqual({ rank: 2, of: 3 });
    expect(checkTally([{ status: "ja" }, { status: "nein" }, { status: "ja" }])).toMatchObject({
      total: 3,
      ja: 2,
      nein: 1,
    });
  });

  it("portfolio stats summarise the profiles", () => {
    const list = [software("alpha"), software("beta", { madeInGermany: false })];
    const stats = portfolioStats(list, () => 4);
    expect(stats.total).toBe(2);
    expect(stats.germanPercent).toBe(50);
    expect(stats.datev.count).toBe(2);
    expect(stats.top).toHaveLength(2);
  });
});
