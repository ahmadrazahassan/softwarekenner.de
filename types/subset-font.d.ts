declare module "subset-font" {
  type AxisRange = number | { min: number; max: number; default?: number };

  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: {
      targetFormat?: "sfnt" | "woff" | "woff2" | "truetype";
      preserveNameIds?: number[];
      variationAxes?: Record<string, AxisRange>;
      noLayoutClosure?: boolean;
    },
  ): Promise<Buffer>;
}
