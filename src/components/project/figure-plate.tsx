import type { ReactNode } from "react";

import { accentText, accentTone, type Accent } from "@/components/project/accent";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";

interface FigurePlateProps {
  /** Printed under the plate. Comes from `data/case-studies.ts`. */
  caption: string;
  accent: Accent;
  /** Short mono note in the plate's top-right corner. Units, scale, source. */
  note?: string;
  children: ReactNode;
  className?: string;
  /** Ruled substrate behind the drawing. Off for figures that already have a grid. */
  ruled?: boolean;
  /**
   * Runs the plate to the viewport edge. The side borders come off, since a
   * border you cannot see the end of reads as an accident, and the caption
   * keeps the page gutter so it still lines up with the prose.
   */
  bleed?: boolean;
}

/**
 * The mount a bespoke diagram sits in.
 *
 * Every case study has exactly one figure and it is hand-drawn SVG, not a
 * chart library, because each of these depicts a specific mechanism rather
 * than a series. The plate supplies the paper, the registration marks and the
 * caption; the page supplies the drawing. Drawings inherit the accent through
 * `currentColor`, so a figure moved between pages recolors itself.
 */
export const FigurePlate = ({
  caption,
  accent,
  note,
  children,
  className = "",
  ruled = true,
  bleed = false,
}: FigurePlateProps) => (
  <Reveal shift="none" tag="figure" className={className}>
    <div
      className={`relative border border-line bg-paper-2 ${accentText[accent]} ${
        bleed ? "border-x-0" : ""
      }`}
    >
      {/* Registration marks, offset outward the way they are on a press sheet. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px -left-px h-4 w-4 border-t border-l border-current"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-px -bottom-px h-4 w-4 border-r border-b border-current"
      />

      {/* Hidden on phones. The plate's corner note sits top-right, which is
          exactly where these drawings put their own top-right annotation — so
          on a narrow screen "SCHEMATIC" landed 30px above the figure's own
          "IMPACT FRAME, DETECTED", both rust mono, the lower one faded and cut
          mid-word by the scroll edge. Two stacked labels in the same colour,
          one of them truncated inside a word, is the only thing on the site
          that read as broken rather than sparse. The note is plate metadata,
          not content; the drawing's own labels win the corner. */}
      {note ? (
        <MonoLabel
          tone={accentTone[accent]}
          className="absolute top-3 right-4 z-10 hidden sm:block"
        >
          {note}
        </MonoLabel>
      ) : null}

      {/* The drawing scrolls sideways rather than shrinking below legibility.
          ------------------------------------------------------------------
          These figures are ~1000 user units wide with 11px annotations inside
          them. Fitted to a 390px phone that is a scale factor of about 0.35,
          which puts "TRACKED JOINT" and every axis tick at roughly 4px — the
          centrepiece of the case study rendering as grey texture. The plate
          chrome around it is HTML and does not scale, so the `SCHEMATIC` tag
          ended up several times the size of the labels inside the drawing it
          was tagging.

          Below `sm` the drawing holds a minimum width and the plate scrolls to
          it. A figure you can push sideways is readable; a figure scaled to fit
          is only present. `touch-pan-x` keeps vertical page scrolling intact
          when a finger starts inside the plate. */}
      <div
        className={`scroll-fade overflow-x-auto touch-pan-x p-4 sm:overflow-x-visible sm:p-6 lg:p-8 ${
          ruled ? "field-rules" : ""
        }`}
      >
        <div className="min-w-[34rem] sm:min-w-0">{children}</div>
      </div>

      {/* Says the plate scrolls, in the plate's own voice.
          A drawing cut off mid-word at the screen edge with no affordance reads
          as a broken figure, not as a scroll region — a static reader has no
          way to tell the difference. The `scroll-fade` above softens the cut
          edge; this names it. Both are `sm`-and-below only, because above that
          the figure fits and there is nothing to scroll. */}
      <MonoLabel
        aria-hidden="true"
        className="absolute right-4 bottom-3 sm:hidden"
      >
        Scroll →
      </MonoLabel>
    </div>

    <figcaption
      className={`text-fine mt-3 max-w-[46rem] text-ink-3 ${
        bleed ? "px-gutter lg:px-page" : ""
      }`}
    >
      {caption}
    </figcaption>
  </Reveal>
);
