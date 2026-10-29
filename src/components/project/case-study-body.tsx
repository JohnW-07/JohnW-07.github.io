import type { CaseStudyBlock } from "@/data/case-studies";

interface CaseStudyBodyProps {
  blocks: readonly CaseStudyBlock[];
  /** Blocks already printed above, so the numbering runs on across a figure. */
  offset?: number;
}

/** Case-study prose: a numbered heading in the margin, paragraphs beside it. */
export const CaseStudyBody = ({ blocks, offset = 0 }: CaseStudyBodyProps) => (
  <>
    {blocks.map((block, i) => (
      <article key={block.heading} className="cs" data-p="mute">
        <header>
          <pre data-c="mute">{String(i + 1 + offset).padStart(2, "0")}</pre>
          <h2 data-c="mid">{block.heading}</h2>
        </header>
        <div>
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} data-c="mid">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    ))}
  </>
);
