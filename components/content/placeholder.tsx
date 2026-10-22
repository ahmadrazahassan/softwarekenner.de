import { isPlaceholder } from "@/site.config";

/**
 * Shows a site.config value. While it is still a placeholder it is visibly marked, so open legal
 * and contact data can never be mistaken for real data (Section 0).
 */
export function Ph({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <mark
      title="Platzhalter, wird vor dem Start in site.config.ts ergänzt"
      className="rounded-xs border border-dashed border-brand-700 bg-brand-50 px-1.5 font-ui text-small font-semibold text-brand-ink not-italic"
    >
      {value}
      <span className="sr-only"> (Platzhalter)</span>
    </mark>
  );
}
