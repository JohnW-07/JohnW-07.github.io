import type { Metric } from "@/data/types";

interface MetricReadoutProps {
  metrics: readonly Metric[];
  className?: string;
  /** "row" divides with vertical rules, "stack" with horizontal ones. */
  layout?: "row" | "stack";
}

/**
 * A row of measured values.
 *
 * Numerals are set in the display serif because they are the largest thing in
 * the block and the serif carries size better than the mono does; the unit and
 * the label stay mono so the pairing reads as a gauge face rather than as a
 * marketing stat. Values are pre-formatted strings, never computed at render.
 */
/**
 * Static class strings, because Tailwind cannot see an interpolated one. A
 * gauge face divides itself evenly over however many readings it carries —
 * but only once there is width to divide.
 *
 * These were unconditional. On a 390px phone `grid-cols-3` gave each reading a
 * ~110px cell while the numerals are set at `text-readout`, so "155,656" needed
 * about 130px and simply drew over its neighbour: the flagship case study's
 * results band rendered as "155,656235" with the unit broken to "GPU-" / "H".
 * A grid cell does not clip its overflow, so this was invisible to every check
 * that measured boxes rather than looking at glyphs.
 */
const columns: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/**
 * A gauge face divides itself evenly over however many readings it carries —
 * but a full-page-width band holding one reading reads as a three-slot row with
 * two slots missing, not as one deliberate figure. Below three, the block stops
 * spanning the page and sizes to its contents instead.
 */
const spans: Record<number, string> = {
  1: "max-w-xs",
  2: "max-w-2xl",
};

export const MetricReadout = ({
  metrics,
  className = "",
  layout = "row",
}: MetricReadoutProps) => (
  <dl
    className={
      layout === "row"
        ? `grid grid-cols-1 ${columns[metrics.length] ?? "sm:grid-cols-3"} ${spans[metrics.length] ?? ""} ${className}`
        : `flex flex-col ${className}`
    }
  >
    {metrics.map((metric, i) => (
      <div
        key={metric.label}
        /* Stacked below `sm`, so the divider has to turn with the axis: a left
           rule between side-by-side readings, a top rule between stacked ones. */
        className={
          layout === "row"
            ? `${i > 0 ? "rule-t pt-4 sm:rule-l sm:border-t-0 sm:pt-0 sm:pl-4 lg:pl-6" : ""} pb-4 sm:pr-4 sm:pb-0`
            : `${i > 0 ? "rule-t pt-4" : ""} pb-4`
        }
      >
        {/* The unit is not the accent.
            ----------------------------------------------------------------
            It used to be `text-safelight`, which meant the only saturated
            thing in a three-figure band was the unit of whichever figure
            happened to carry one — on the vla page, the "GPU-H" on the compute
            cost, while the actual outcome next to it got no emphasis at all.
            A unit symbol is the least important glyph in a readout and it was
            the loudest. */}
        {/* `whitespace-nowrap`: a value and its unit are one token. Without it
            "235 GPU-h" broke after the numeral and left the "H" of "GPU-H"
            alone on its own line. */}
        <dd className="text-readout font-display whitespace-nowrap text-ink">
          {metric.value}
          {metric.unit ? (
            <span className="label-mono ml-1 align-super text-ink-3">
              {metric.unit}
            </span>
          ) : null}
        </dd>
        <dt className="label-mono mt-3 text-ink-3">{metric.label}</dt>
      </div>
    ))}
  </dl>
);
