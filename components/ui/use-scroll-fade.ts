"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks whether a horizontal scroller can scroll left or right, for fade masks and
 * chevron buttons (Section 7.4). Pair with the `scroll-fade-x` class.
 */
export function useScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ start: false, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.scrollLeft > 2;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setState((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollBy = useCallback((direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return {
    ref,
    canScrollStart: state.start,
    canScrollEnd: state.end,
    scrollBy,
    fadeProps: { "data-fade-start": state.start, "data-fade-end": state.end },
  };
}
