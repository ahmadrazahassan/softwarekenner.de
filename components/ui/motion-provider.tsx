"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () => import("./motion-features").then((module) => module.default);

/**
 * Motion with LazyMotion (Section 8.2): the animation features load after hydration, so they
 * never weigh on first load JS. reducedMotion "user" honours prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
