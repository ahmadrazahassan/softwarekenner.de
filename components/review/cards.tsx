import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { TextLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";

/**
 * Topic card (Section 7.2 F, Reference 2 "What people talk about most").
 * Only rendered with at least 10 real reviews for the product.
 */
export function TopicCard({
  topic,
  summary,
  href,
  className,
}: {
  topic: string;
  summary: string;
  href: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border border-line-strong bg-surface-tint p-5",
        className,
      )}
    >
      <h3 className="type-h4 text-ink">{topic}</h3>
      <p className="line-clamp-3 type-body text-text-muted">{summary}</p>
      <TextLink href={href} className="mt-auto">
        Mehr erfahren
        <span className="sr-only"> zu {topic}</span>
      </TextLink>
    </article>
  );
}

/** Transparency card (Section 7.2 G): icon without background, title, two lines, optional link. */
export function TransparencyCard({
  icon,
  title,
  children,
  link,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <article className={cn("flex gap-4 rounded-lg border border-line bg-white p-5", className)}>
      <Icon icon={icon} size={24} className="mt-0.5 flex-none text-ink" />
      <div className="flex flex-col gap-1">
        <h3 className="type-label font-semibold text-ink">{title}</h3>
        <p className="type-small text-text-muted">{children}</p>
        {link && (
          <TextLink href={link.href} className="text-small">
            {link.label}
          </TextLink>
        )}
      </div>
    </article>
  );
}
