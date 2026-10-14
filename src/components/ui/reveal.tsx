import type { ReactNode } from "react";

import { Inview } from "@/components/animation/springs/in-view";
import { ease, revealShift } from "@/lib/motion";
import type { Tags } from "@/types/springs";

interface RevealProps {
  children: ReactNode;
  /** Semantic element to render. Defaults to a plain div. */
  tag?: Tags;
  className?: string;
  /** Stagger, in ms. Use multiples of ~70 within a group. */
  delay?: number;
  /**
   * Direction the element travels in from. "up" is the default; "none" fades
   * only, which is correct for anything already sitting on a hairline rule
   * because a moving element makes the rule look bent.
   */
  shift?: "up" | "left" | "none";
  id?: string;
}

const offsets = {
  up: { y: revealShift },
  left: { x: -revealShift },
  none: {},
} as const;

/**
 * The site's single reveal primitive.
 *
 * Wraps `Inview` with the house config so every element enters identically.
 * `mode="once"` throughout: content that re-animates every time it scrolls
 * back into view is the fastest way to make a portfolio feel like a demo.
 */
export const Reveal = ({
  children,
  tag = "div",
  className,
  delay = 0,
  shift = "up",
  id,
}: RevealProps) => (
  <Inview
    tag={tag}
    id={id}
    className={className}
    mode="once"
    delayIn={delay}
    config={ease}
    from={{ opacity: 0, ...offsets[shift] }}
    to={{ opacity: 1, x: 0, y: 0 }}
  >
    {children}
  </Inview>
);
