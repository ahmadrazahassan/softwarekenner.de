"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ScoreChip } from "@/components/ui/score-chip";
import { cn } from "@/lib/utils/cn";

export type SectionLink = { id: string; label: string };

/** Scrollspy: the last section whose top has passed the reading line below the header. */
export function useActiveSection(ids: string[], offset = 120) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const update = () => {
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? sectionIds[sectionIds.length - 1] : current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key, offset]);

  return active;
}

/** Sticky table of contents with scrollspy; active item gets a 2 px orange left bar (Section 7.4). */
export function TableOfContents({
  items,
  title = "Inhalt",
  className,
}: {
  items: SectionLink[];
  title?: string;
  className?: string;
}) {
  const active = useActiveSection(items.map((i) => i.id));
  return (
    <nav aria-label={title} className={cn("lg:sticky lg:top-24", className)}>
      <p className="mb-3 type-micro text-text-muted">{title}</p>
      <ol className="flex flex-col border-l border-line">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px flex min-h-10 items-center border-l-2 py-1.5 pl-4 type-small transition-colors focus-visible:outline-2 focus-visible:outline-ink",
                  isActive
                    ? "border-brand-500 font-semibold text-ink"
                    : "border-transparent text-text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Sticky profile sub navigation (Section 7.4, Reference 3). Appears once the element with
 * `sentinelId` (the profile header) has left the viewport. Scrollspy tabs left, score and CTA right.
 */
export function StickySubNav({
  sentinelId,
  items,
  score,
  cta,
  label = "Abschnitte",
}: {
  sentinelId: string;
  items: SectionLink[];
  score: number;
  /** Usually the affiliate CTA. */
  cta: ReactNode;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);
  const active = useActiveSection(
    items.map((i) => i.id),
    140,
  );

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;
    // Visible only once the sentinel has scrolled above the header, not while it is still below.
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry!.isIntersecting && entry!.boundingClientRect.top < 72),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-18 z-30 border-b border-line bg-white/95 backdrop-blur transition-[transform,opacity] duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="container-wide flex h-14 items-center gap-6">
        <nav aria-label={label} className="scroll-fade-x min-w-0 flex-1">
          <ul className="flex w-max gap-6">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={item.id === active ? "location" : undefined}
                  className={cn(
                    "relative flex h-14 items-center type-eyebrow whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink",
                    item.id === active ? "text-ink" : "text-text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  {item.id === active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-brand-500"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden flex-none items-center gap-4 md:flex">
          <ScoreChip score={score} />
          {cta}
        </div>
      </div>
    </div>
  );
}
