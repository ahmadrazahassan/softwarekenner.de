"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { IconButton } from "./button";

/**
 * Embla carousel (Section 7.4): snap scrolling, keyboard support, icon-round controls that
 * overlap the edges (References 4 and 5), no autoplay, "1 von 3" status for screen readers.
 */
export function Carousel({
  label,
  children,
  slideClassName = "basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4",
  className,
}: {
  /** Accessible name, e.g. "Beliebte Software im Bereich Buchhaltung". */
  label: string;
  children: ReactNode;
  /** Width of each slide as flex-basis classes. */
  slideClassName?: string;
  className?: string;
}) {
  const [viewportRef, api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: "auto",
  });
  const [state, setState] = useState({ prev: false, next: false, index: 0, count: 0 });
  const slides = Children.toArray(children);

  const sync = useCallback(() => {
    if (!api) return;
    setState({
      prev: api.canScrollPrev(),
      next: api.canScrollNext(),
      index: api.selectedScrollSnap(),
      count: api.scrollSnapList().length,
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const frame = requestAnimationFrame(sync);
    api.on("select", sync).on("reInit", sync);
    return () => {
      cancelAnimationFrame(frame);
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      api?.scrollNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      api?.scrollPrev();
    }
  };

  return (
    <section
      aria-roledescription="Karussell"
      aria-label={label}
      className={cn("relative", className)}
      onKeyDown={onKeyDown}
    >
      <div ref={viewportRef} className="-m-3 overflow-hidden p-3">
        <div className="-ml-6 flex touch-pan-y">
          {slides.map((slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="Folie"
              aria-label={`${i + 1} von ${slides.length}`}
              className={cn("min-w-0 flex-none pl-6", slideClassName)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {state.count > 1 && (
        <>
          <IconButton
            icon={ChevronLeft}
            label="Vorherige Folien"
            disabled={!state.prev}
            onClick={() => api?.scrollPrev()}
            className={cn(
              "absolute top-1/2 -left-3 -translate-y-1/2 max-md:hidden",
              !state.prev && "invisible",
            )}
          />
          <IconButton
            icon={ChevronRight}
            label="Nächste Folien"
            disabled={!state.next}
            onClick={() => api?.scrollNext()}
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 max-md:hidden",
              !state.next && "invisible",
            )}
          />
        </>
      )}
      <p className="sr-only" aria-live="polite">
        {state.count > 0 && `Ansicht ${state.index + 1} von ${state.count}`}
      </p>
    </section>
  );
}
