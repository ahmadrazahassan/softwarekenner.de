"use client";

import dynamic from "next/dynamic";

import { ChartSkeleton } from "./chart-frame";

/**
 * Charts load lazily and only in the browser (Section 21: charts load lazily). The skeleton fills
 * the fixed height of ChartFrame, so nothing shifts. next/dynamic needs literal options per call.
 */
const load = () => import("./charts");

export const PriceBars = dynamic(() => load().then((m) => m.PriceBars), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
export const ScoreScatter = dynamic(() => load().then((m) => m.ScoreScatter), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
export const CriteriaRadar = dynamic(() => load().then((m) => m.CriteriaRadar), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
export const WeightsDonut = dynamic(() => load().then((m) => m.WeightsDonut), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
export const CostLines = dynamic(() => load().then((m) => m.CostLines), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export { ChartFrame, type ChartTable } from "./chart-frame";
export { Butterfly, type ButterflyRow } from "./butterfly";
export type { PriceBar, ScatterPoint } from "./charts";
