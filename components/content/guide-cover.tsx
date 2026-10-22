import { BlockPattern } from "@/components/ui/block-pattern";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/site.config";

/** Long topics get a smaller sticker so the word never breaks (Outfit 800 caps are about 0.7 em wide). */
const stickerSize = (word: string) => `min(8.5cqw, ${Math.floor((76 / (word.length * 0.72)) * 10) / 10}cqw)`;

/**
 * Guide cover (Section 5.8), built in code: brand-500 at 3:4, Blockraster in the corners,
 * top lockup, white stickers with the topic in Outfit 800 uppercase ink.
 * Two word topics are passed as two stickers, e.g. ["Social", "Intranet"].
 */
export function GuideCover({
  stickers,
  seed,
  className,
}: {
  stickers: string[];
  seed: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "@container relative isolate aspect-[3/4] w-full overflow-hidden rounded-lg bg-brand-500",
        className,
      )}
    >
      <BlockPattern seed={seed} className="absolute inset-0 -z-10 size-full" />
      <p className="absolute inset-x-0 top-0 px-[7cqw] pt-[7cqw] font-ui text-[4.6cqw] leading-tight font-semibold text-ink">
        {siteConfig.brand.name}
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        {siteConfig.brand.guideLockupSuffix}
      </p>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2.5cqw] px-[7cqw]">
        {stickers.map((word) => (
          <span
            key={word}
            className="max-w-full rounded-xs bg-white px-[3.5cqw] py-[1.6cqw] text-center font-display leading-none font-extrabold tracking-[0.01em] text-ink uppercase shadow-sm"
            style={{ fontSize: stickerSize(word) }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
