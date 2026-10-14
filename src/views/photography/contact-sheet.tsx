import { AssetFrame } from "@/components/ui/asset-frame";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { frames, sheet } from "@/data/photography";
import { PLACEHOLDER, type Frame } from "@/data/types";

/**
 * Frames per strip. A roll is cut into six-frame strips before it is laid on
 * the paper, which is also what keeps the frames small: a contact sheet is a
 * proof, printed at negative size, not a gallery wall.
 */
const STRIP_SIZE = 6;

const strips: readonly (readonly Frame[])[] = Array.from(
  { length: Math.ceil(frames.length / STRIP_SIZE) },
  (_, i) => frames.slice(i * STRIP_SIZE, i * STRIP_SIZE + STRIP_SIZE),
);

/** Film edge numbering: one-based, zero-padded, matching `data/photography.ts`. */
const frameNumber = (index: number): string => String(index + 1).padStart(2, "0");

/** Strips are lettered on the rebate the way a lab marks a cut roll. */
const stripCode = (index: number): string => String.fromCharCode(65 + index);

interface ContactSheetProps {
  className?: string;
}

/**
 * The sheet itself: the whole roll printed at frame size on one page.
 *
 * Not a gallery grid. A contact sheet is proof — every frame at the same size,
 * in the order it was shot, including the ones that did not work. That is why
 * the empty frames stay on the page instead of the sheet shrinking to fit what
 * exists: an unexposed frame is a real state on a real sheet, and twelve of
 * them is an honest answer to "where are the photographs".
 *
 * Frames print dark because a clear, unexposed negative passes all the light
 * through. Nothing here is a grey box waiting for an image.
 */
export const ContactSheet = ({ className = "" }: ContactSheetProps) => (
  <Section
    id="sheet"
    index="01"
    title={sheet.title}
    /* No annotation. The frame and print counts are already two rows of the
       masthead readout a few hundred pixels up, and repeating them here made
       the page state the same two numbers twice on one screen. */
    className={className}
  >
    <div className="safelight-bloom border border-line-strong p-3 lg:p-5">
      <ol className="space-y-3 lg:space-y-4">
        {strips.map((strip, stripIndex) => {
          const first = stripIndex * STRIP_SIZE;

          return (
            <Reveal
              tag="li"
              key={stripCode(stripIndex)}
              shift="none"
              delay={stripIndex * 90}
            >
              {/* Rebate: the margin between strips, where a lab writes on the print. */}
              <div className="flex items-baseline justify-between gap-4 pb-2">
                <MonoLabel tone="signal">
                  {sheet.rollCode} / {stripCode(stripIndex)}
                </MonoLabel>
                <MonoLabel>
                  {frameNumber(first)}–{frameNumber(first + strip.length - 1)}
                </MonoLabel>
              </div>

              <ol className="grid grid-cols-3 gap-px border border-line-strong bg-line-strong sm:grid-cols-6">
                {strip.map((frame, offset) => {
                  const number = frameNumber(first + offset);

                  return (
                    <li key={frame.id}>
                      <figure>
                        <AssetFrame
                          asset={frame.asset}
                          ratio="1 / 1"
                          marker={number}
                          sizes="(max-width: 640px) 32vw, 16vw"
                        />
                        {frame.caption === PLACEHOLDER ? null : (
                          <figcaption className="border-t border-line-strong bg-paper-2 px-2 py-2">
                            <p className="text-fine text-ink">{frame.caption}</p>
                            {frame.exif === PLACEHOLDER ? null : (
                              <MonoLabel className="mt-1.5 block">
                                {frame.exif}
                              </MonoLabel>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          );
        })}
      </ol>
    </div>
  </Section>
);
