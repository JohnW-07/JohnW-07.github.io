// 📖 Docs: obsidian/frontend/components/common.md

import { accentText } from "@/components/project/accent";
import { getProjectFigure } from "@/components/project/figure-registry";

interface FigureThumbProps {
  slug: string;
  className?: string;
}

/**
 * A project's drawing, shown small in the work index.
 *
 * The index used to be five rows of pure text. Every project already had a
 * hand-drawn figure explaining its mechanism, but each one was buried inside
 * its own case study — so the page whose entire job is to make you want to open
 * a case study was the one page with no evidence on it.
 *
 * The drawing is rendered at full fidelity and scaled down rather than
 * redrawn as a simplified mark. At this size the mono annotations inside it
 * stop being readable and become texture, which is the intent: the thumbnail
 * is not asking to be read, it is asking to be recognised as a real diagram.
 * The legible version is one click away, and it is the same component, so the
 * two can never drift apart.
 *
 * Decorative here. The SVG's own `aria-label` describes the mechanism in full
 * on the case-study page; repeating that description in an index of five rows
 * would bury a screen-reader user in detail they did not ask for. The row's
 * link text carries the meaning instead.
 *
 * On a phone the annotations land at roughly 4px and stop resolving at all.
 * Two independent design reviews called this out, and the proposed fix both
 * times was the horizontal-scroll treatment `FigurePlate` uses on the case
 * studies. It is not applied here, deliberately: **this thumbnail sits inside
 * the row's navigation `<Link>`**, and a horizontal scroll region inside a link
 * makes a touch drag ambiguous between scrolling the figure and following the
 * link. The case-study plates can scroll precisely because nothing wraps them.
 *
 * So the mobile thumbnail stays what the desktop one already is at a smaller
 * size: a recognisable mark that says this project has a real diagram behind
 * it. If that trade stops being acceptable, the honest options are to lift the
 * figure out of the link element or to drop it below `sm` — not to nest a
 * scroller in a link.
 */
export const FigureThumb = ({ slug, className = "" }: FigureThumbProps) => {
  const { Figure, accent, ratio } = getProjectFigure(slug);

  return (
    <div
      aria-hidden="true"
      /* `ratio` reserves the box before the SVG paints, so the row cannot
         reflow underneath the reader. */
      style={{ aspectRatio: ratio }}
      className={`relative overflow-hidden border border-line bg-paper-2 ${accentText[accent]} ${className}`}
    >
      {/* Registration mark, quarter-scale of the full plate's. Keeps the
          thumbnail in the same visual family as the figure it points to. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px -left-px z-10 h-2 w-2 border-t border-l border-current"
      />
      {/* The drawing is inset so its own outermost strokes do not collide with
          the thumbnail's border. */}
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <Figure />
      </div>
    </div>
  );
};
