"use client";

import { animated, useSpring } from "@react-spring/web";
import { useCallback, useEffect, useState } from "react";

import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { snap } from "@/lib/motion";
import { scrollTo } from "@/utils/scroll-to";

interface RailStop {
  id: string;
  label: string;
  /** Position of the section within the scrollable document, 0 to 1. */
  fraction: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const scrollableHeight = () =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/**
 * The scroll rail.
 *
 * A true miniature of the page: each tick sits at the section's real fraction
 * of the document rather than in an evenly spaced slot, so the gaps between
 * ticks tell you how long each section actually is. The amber caret is the
 * only spring on the site with visible residual motion, because it is the one
 * element meant to read as a needle settling.
 *
 * It is a control, not decoration. Ticks are buttons and they scroll. Only the
 * active section shows its name, which keeps long labels from colliding and
 * makes the rail answer one question at a time.
 *
 * Sections opt in with `data-rail-section="Label"` plus an `id`. Nothing is
 * hardcoded here, so a new section joins the rail automatically.
 */
export const ScrollRail = () => {
  const [stops, setStops] = useState<RailStop[]>([]);
  const [active, setActive] = useState(0);
  const lenis = useScroll((state) => state.lenis);

  const [caret, caretApi] = useSpring(() => ({ top: 0, config: snap }));

  const measure = useCallback(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-rail-section]"),
    ).filter((element) => element.id);
    const scrollable = scrollableHeight();

    setStops(
      elements.map((element) => ({
        id: element.id,
        label: element.dataset.railSection ?? element.id,
        fraction: clamp01(
          (element.getBoundingClientRect().top + window.scrollY) / scrollable,
        ),
      })),
    );
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const onScroll = () => {
      const next = clamp01(window.scrollY / scrollableHeight());
      caretApi.start({ top: next });

      // The section that owns the viewport is the last one whose top has
      // crossed a line a third of the way down the screen.
      const line = window.innerHeight * 0.33;
      let current = 0;
      stops.forEach((stop, index) => {
        const element = document.getElementById(stop.id);
        if (element && element.getBoundingClientRect().top <= line) current = index;
      });
      setActive((previous) => (previous === current ? previous : current));
    };

    onScroll();

    if (lenis) {
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis, caretApi, stops]);

  if (stops.length < 2) return null;

  return (
    <nav
      aria-label="Section scale"
      className="pointer-events-none fixed top-1/2 right-4 z-40 hidden h-[52vh] w-8 -translate-y-1/2 xl:block"
    >
      {/* The scale. */}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 bottom-0 w-px bg-line"
      />

      {stops.map((stop, index) => (
        <button
          key={stop.id}
          type="button"
          onClick={() => scrollTo(stop.id)}
          aria-label={`Scroll to ${stop.label}`}
          style={{ top: `${stop.fraction * 100}%` }}
          className="group pointer-events-auto absolute right-0 flex h-7 -translate-y-1/2 items-center justify-end gap-2"
        >
          <span
            className="label-mono whitespace-nowrap text-ink group-hover:text-safelight"
            style={{
              writingMode: "vertical-rl",
              visibility: index === active ? "visible" : "hidden",
            }}
          >
            {stop.label}
          </span>
          <span
            aria-hidden="true"
            className={`block h-px group-hover:bg-safelight ${
              index === active ? "w-4 bg-ink" : "w-2.5 bg-line-strong"
            }`}
          />
        </button>
      ))}

      {/* The needle: a hairline and a rotated square riding the scale. */}
      <animated.span
        aria-hidden="true"
        className="absolute right-0 block h-px w-6 bg-safelight"
        style={{ top: caret.top.to((value) => `${value * 100}%`) }}
      />
      <animated.span
        aria-hidden="true"
        className="absolute right-0 block h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-safelight"
        style={{ top: caret.top.to((value) => `${value * 100}%`) }}
      />

      {/* Position readout, whole percent. */}
      <animated.span className="label-mono absolute -bottom-7 right-0 text-ink-3">
        {caret.top.to((value) => String(Math.round(value * 100)).padStart(3, "0"))}
      </animated.span>
    </nav>
  );
};
