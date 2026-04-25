"use client";

import { m, LazyMotion } from "framer-motion";

// Asynchronously load the minimal animation features (omits drag, layout, etc)
const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

export const MotionDiv = m.div;
export const MotionH1 = m.h1;
export const MotionH2 = m.h2;
export const MotionH3 = m.h3;
export const MotionP = m.p;
export const MotionSpan = m.span;
