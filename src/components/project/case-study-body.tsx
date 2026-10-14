import { accentTone, type Accent } from "@/components/project/accent";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import type { CaseStudyBlock } from "@/data/case-studies";

interface CaseStudyBodyProps {
  blocks: readonly CaseStudyBlock[];
  accent: Accent;
  className?: string;
  /**
   * "margin" hangs each heading in a left column, which needs the full page
   * width. "stacked" puts the heading above its paragraphs and fits inside a
   * column, for pages that spend their width on a figure instead.
   */
  layout?: "margin" | "stacked";
  /** Section index prefix, e.g. "02" gives 02.1, 02.2, 02.3. */
  group?: string;
  /**
   * Added to the heading numbers. Pages that break their prose around a figure
   * render two of these and use the offset to keep the numbering continuous.
   */
  offset?: number;
}

/**
 * The prose.
 *
 * Copy is authored in `data/case-studies.ts` and rendered verbatim. Headings
 * are numbered against the section they sit in so a reader can point at a
 * paragraph the way they would point at a clause in a spec.
 */
export const CaseStudyBody = ({
  blocks,
  accent,
  className = "",
  layout = "margin",
  group = "02",
  offset = 0,
}: CaseStudyBodyProps) => (
  <div className={className}>
    {blocks.map((block, i) => (
      <Reveal
        key={block.heading}
        shift="none"
        tag="article"
        className={
          layout === "margin"
            ? "grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line py-8 lg:grid-cols-12 lg:py-12"
            : "border-t border-line py-8 lg:py-10"
        }
      >
        <div
          className={
            layout === "margin"
              ? "lg:col-span-3"
              : "flex items-baseline gap-4 pb-4"
          }
        >
          <MonoLabel tone={accentTone[accent]}>
            {group}.{i + 1 + offset}
          </MonoLabel>
          <h2
            className={`font-display text-2xl leading-tight text-ink ${
              layout === "margin" ? "mt-3" : ""
            }`}
          >
            {block.heading}
          </h2>
        </div>

        <div
          className={
            layout === "margin"
              ? "flex flex-col gap-5 lg:col-span-8 lg:col-start-5"
              : "flex flex-col gap-5"
          }
        >
          {block.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="text-lede max-w-[40rem] text-ink-2"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    ))}
  </div>
);
