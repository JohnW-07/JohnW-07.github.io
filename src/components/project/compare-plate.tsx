// 📖 Docs: obsidian/frontend/components/common.md

import Image from "next/image";

import { accentTone, type Accent } from "@/components/project/accent";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";

export interface ComparePane {
  readonly src: string;
  readonly alt: string;
  /** Printed over the pane. Two or three words. */
  readonly state: string;
  /** The measurement that makes the pane worth looking at. */
  readonly readout: string;
  readonly width: number;
  readonly height: number;
}

interface ComparePlateProps {
  before: ComparePane;
  after: ComparePane;
  caption: string;
  accent: Accent;
  /**
   * Optional mono note in the plate's top-right corner. Leave it unset unless
   * the panes are unlabelled — the second pane's own readout sits in the same
   * corner and the two will overlap.
   */
  note?: string;
  className?: string;
}

/**
 * Two captures of the same system, before and after one change.
 *
 * The other plate on these pages, `FigurePlate`, mounts a hand-drawn schematic
 * of a mechanism. This one mounts photographic evidence that the mechanism
 * worked, which is a different claim and deserves a different frame: no ruled
 * substrate behind it, because there is already a photograph there, and a
 * readout under each pane, because a before/after with no numbers is an
 * assertion rather than a result.
 *
 * Both panes are the same pixel dimensions and are laid out on one grid, so the
 * comparison is honest — a reader is not being shown a large "after" next to a
 * small "before".
 */
export const ComparePlate = ({
  before,
  after,
  caption,
  accent,
  note,
  className = "",
}: ComparePlateProps) => (
  <Reveal shift="none" tag="figure" className={className}>
    <div className="relative border border-line bg-paper-2">
      {note ? (
        <MonoLabel tone={accentTone[accent]} className="absolute top-3 right-4 z-10">
          {note}
        </MonoLabel>
      ) : null}

      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
        {[before, after].map((pane) => (
          <div key={pane.state} className="bg-paper-2 p-4 lg:p-5">
            {/* Stacked below `lg`, so both panes' headers are always the same
                number of lines.
                ----------------------------------------------------------
                Side by side, the left pane's "Stock CAD · 0.620 m / IoU 0.564 /
                0.550" wrapped to two lines at 768px while the right pane's
                shorter strings fitted on one — which pushed the two video
                frames ~17px out of vertical alignment. In a before/after
                comparison the shared top and bottom edges are the entire point,
                and they were broken at exactly one breakpoint. Stacking removes
                the dependency on how long the strings happen to be.

                `whitespace-nowrap` on both: these are measurements, and one
                that breaks between its numeral and its unit stops being one. */}
            <div className="flex flex-col gap-y-1 pb-3 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-4">
              <MonoLabel tone={accentTone[accent]} className="whitespace-nowrap">
                {pane.state}
              </MonoLabel>
              <MonoLabel className="whitespace-nowrap">{pane.readout}</MonoLabel>
            </div>
            {/* Explicit dimensions: the box is reserved before the file lands,
                so the page cannot reflow under the reader. */}
            <Image
              src={pane.src}
              alt={pane.alt}
              width={pane.width}
              height={pane.height}
              sizes="(max-width: 640px) 100vw, 45vw"
              className="h-auto w-full border border-line"
            />
          </div>
        ))}
      </div>
    </div>

    <figcaption className="text-fine mt-3 max-w-[46rem] text-ink-3">{caption}</figcaption>
  </Reveal>
);
