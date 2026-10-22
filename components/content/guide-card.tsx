import { ButtonLink } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils/cn";

import { GuideCover } from "./guide-cover";

/** Guide card (Section 7.2 D, Reference 5): cover, title, page count and PDF, download CTA. */
export function GuideCard({
  title,
  stickers,
  slug,
  pages,
  href,
  className,
}: {
  title: string;
  stickers: string[];
  slug: string;
  pages: number;
  href: string;
  className?: string;
}) {
  return (
    <article className={cn("flex h-full flex-col gap-4", className)}>
      <GuideCover stickers={stickers} seed={slug} className="shadow-sm" />
      <div className="flex flex-col gap-1">
        <h3 className="type-h4 text-ink">{title}</h3>
        <p className="type-small text-text-muted">{formatNumber(pages)} Seiten · PDF</p>
      </div>
      <ButtonLink href={href} icon="download" block className="mt-auto">
        Leitfaden herunterladen
        <span className="sr-only">: {title}</span>
      </ButtonLink>
    </article>
  );
}
