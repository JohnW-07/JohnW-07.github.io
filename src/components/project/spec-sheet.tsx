import { accentTone, type Accent } from "@/components/project/accent";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import type { SpecRow } from "@/data/case-studies";

interface SpecSheetProps {
  spec: readonly SpecRow[];
  stack: readonly string[];
  accent: Accent;
  className?: string;
  /**
   * "column" is a narrow sidebar list, "band" is a wide multi-column strip.
   * Pages pick whichever their figure leaves room for.
   */
  layout?: "column" | "band";
}

/**
 * The flat facts, set like the specification block on a datasheet.
 *
 * Rows are label over value rather than side by side, because the values are
 * long enough that a two-column table would either wrap badly or force the
 * labels into an abbreviation nobody asked for.
 */
export const SpecSheet = ({
  spec,
  stack,
  accent,
  className = "",
  layout = "column",
}: SpecSheetProps) => (
  <Reveal shift="none" className={className}>
    {/* Numbered 01, so the page's sequence resolves.
        ----------------------------------------------------------------------
        The body sections are 02.1, 02.2, 02.3 and the figures band is 03, but
        this block carried no index at all — so a reader met "02.1" as the first
        number on the page and had to assume a 01 and 02 they never saw. The
        numbering was internally consistent and looked broken, which for a page
        styled as a datasheet is the worse failure.

        No row count on the right. It annotated the block with the one number a
        reader can get by looking at it. */}
    <div className="flex items-baseline gap-4 border-b border-line-strong pb-3">
      <MonoLabel tone={accentTone[accent]}>01</MonoLabel>
      <MonoLabel>Spec</MonoLabel>
    </div>

    {/* The band's column count follows the row count.
        ----------------------------------------------------------------------
        Hard-coding six columns meant a page with three specs drew three fields
        and their rules across the left half and left the right 45% blank —
        which reads as a six-slot datasheet with three slots missing rather than
        as three deliberate facts. Same failure the "Also" grid had when its
        item count dropped. */}
    <dl
      className={
        layout === "band"
          ? `grid grid-cols-2 gap-x-8 ${
              spec.length >= 6
                ? "md:grid-cols-3 lg:grid-cols-6"
                : spec.length >= 4
                  ? "md:grid-cols-3 lg:grid-cols-4"
                  : spec.length === 3
                    ? "md:grid-cols-3 lg:grid-cols-3"
                    : "md:grid-cols-2 lg:grid-cols-2"
            }`
          : "grid grid-cols-2 gap-x-6 lg:grid-cols-1"
      }
    >
      {spec.map((row) => (
        <div key={row.label} className="border-b border-line py-3">
          <MonoLabel as="dt">{row.label}</MonoLabel>
          <dd className="text-fine mt-1.5 text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>

    <div className="pt-5">
      <MonoLabel as="p">Built with</MonoLabel>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
        {stack.map((tool) => (
          <li
            key={tool}
            className="label-mono border border-line px-2 py-1 text-ink-2"
          >
            {tool}
          </li>
        ))}
      </ul>
    </div>
  </Reveal>
);
