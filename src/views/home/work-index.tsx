"use client";

import Link from "next/link";
import { useRef } from "react";

import { Hover } from "@/components/animation/springs/hover";
import { accentTone } from "@/components/project/accent";
import { FigureThumb } from "@/components/project/figure-thumb";
import { getProjectFigure } from "@/components/project/figure-registry";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { additionalWork, projects } from "@/data/projects";
import { react } from "@/lib/motion";
import { withoutEchoedYear } from "@/utils/echoed-year";
import type { Project } from "@/data/types";

/**
 * One row of the index.
 *
 * The whole row is the link, so the target is the size of the row rather than
 * the size of a word. Hover is a spring on the title only, fired from the row
 * via `trigger`: the title steps right, which reads as the row being pulled
 * out of a drawer, and nothing else on the row moves.
 *
 * Each row leads with the project's own drawing. Before that the index was five
 * blocks of prose at one grey value, so the section that exists to make a
 * visitor open a case study was the least scannable thing on the page. The
 * figure is the anchor you navigate by; the text explains what you are looking
 * at.
 */
const ProjectRow = ({ project, isLead = false }: { project: Project; isLead?: boolean }) => {
  const row = useRef<HTMLElement>(null);
  /* The row's one number. Every project's metric list is ordered with its
     strongest figure first, so this needs no second piece of data to maintain.
     Without it the index was five titles and five paragraphs of prose, and a
     reviewer scanning for twenty seconds left with no quantity at all — the
     only hard figures on the site were thousands of pixels down inside a case
     study. */
  const [headline] = project.metrics;

  return (
    <Reveal shift="none" tag="li">
      <Link
        href={`/work/${project.slug}`}
        /* The lead row gets air as well as scale. Its title is already a step
           up (measured 1.53× the siblings' cap height at desktop) and its
           metric runs at readout size, but every row occupied the same
           footprint, so the page presented the Stanford work and the hackathon
           at the same weight and ranked nothing. Space is the cheapest ranking
           device there is and the only one that does not need another
           component. */
        className={`group block border-b border-line hover:bg-paper-2 ${
          isLead ? "py-12 lg:py-20" : "py-8 lg:py-10"
        }`}
      >
        {/* One structure for all five rows.
            ------------------------------------------------------------------
            Rows 02–05 used to put the figure in a 4-of-12 column, which is
            395px on a 1440 desktop — the internal mono annotations land at ~5px
            there and stop resolving. The same drawings render at 726px on a
            768px tablet, where every label is legible, so the *widest* viewport
            was giving the work its worst presentation. The figure now leads
            every row at full width, capped below the lead row's so the index
            still has a hierarchy.

            Unifying also fixes something separate: with two row structures a
            reader had to relearn where the number and the tags lived between
            row 01 and row 02. `isLead` now changes only scale — title size,
            figure width, how many chips show. */}
        <article
          ref={row}
          className="grid grid-cols-1 items-start gap-y-5 px-2 lg:px-4"
        >
          {/* Full width on every row, including the subordinate ones. Capping
              these at 58rem read better in isolation and worse on the page: the
              figure then ended at x=928 while the title, summary, metric and
              rules all ran to 1360, adding a fifth right edge to a layout whose
              whole claim is that things line up. Hierarchy is carried by title
              size, metric size and chip count instead — none of which cost an
              alignment. */}
          <FigureThumb slug={project.slug} className="w-full" />

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pb-3 lg:col-span-12">
              {/* The ordinal carries the project's own accent, not a blanket
                  rust. The site encodes rust for work on physical things moving
                  in real time and Prussian blue for work on measurement and
                  inference, but every ordinal in the index was rust — so the
                  one page that introduces all five projects was the one page
                  where the rule was invisible, and a reader met the blue for
                  the first time inside a case study with nothing to tie it to. */}
              <MonoLabel tone={accentTone[getProjectFigure(project.slug).accent]}>
                {project.index}
              </MonoLabel>
              {/* "Bitcamp 2026" sat directly beside "Apr 2026". */}
              <MonoLabel>{withoutEchoedYear(project.org, project.period)}</MonoLabel>
              {/* An explicit separator, but only where the fields share a line.
                  On one line they were divided by an 18px gap against an 11px
                  word space — 1.6×, same colour, size and weight — so "NEUROAI
                  LAB MAY – AUG 2026" read as one run-on string. As its own flex
                  item it then orphaned when the row wrapped on a phone, opening
                  line two on one row and closing line one on the next. Below
                  `sm` the wrap already separates the fields, so the separator
                  has no work to do and is not rendered. */}
              <MonoLabel aria-hidden="true" className="hidden text-ink-3 sm:inline">
                ·
              </MonoLabel>
              <MonoLabel>{project.period}</MonoLabel>
            </div>

            {/* A step larger than it was. The index ran its titles at the same
                size as the "Also" cards below it and barely above body copy, so
                a page with one monumental element (the name) had nothing
                between that and 17px prose. */}
            <Hover
              tag="h3"
              trigger={row}
              config={react}
              from={{ x: 0 }}
              to={{ x: 10 }}
              className={`font-display text-ink group-hover:text-safelight lg:col-span-7 ${
                isLead ? "text-display" : "text-display-sm"
              }`}
            >
              {project.title}
            </Hover>
            <p className="text-body mt-4 text-ink-2 lg:col-span-5 lg:mt-0">
              {project.summary}
            </p>

            {/* Every row's number, right-aligned into one scan column.
                ----------------------------------------------------------
                Three corrections landed on this block in succession. It began
                in the utility band at the foot of the row, at the same size as
                everything else — the strongest figure in the index, in its
                weakest slot. Moving it under the title fixed the scale and
                stepped it out of the right-hand column a reader scans down.
                Putting it back on that edge fixed the scan and left the lead
                row's entry point ~190px lower than the others'. All five now
                sit in the same slot of the same grid, so the column reads
                0.658 / 1,000+ / 75% / ±5cm / 1st straight down. */}
            {headline ? (
              <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-4 lg:text-right">
                <p
                  className={`font-display whitespace-nowrap tabular-nums text-ink ${
                    isLead ? "text-readout" : "text-sub"
                  }`}
                >
                  {headline.value}
                  {headline.unit ? (
                    <span className="label-mono ml-1 align-super text-ink-3">
                      {headline.unit}
                    </span>
                  ) : null}
                </p>
                <MonoLabel as="p" className="mt-1">
                  {headline.label}
                </MonoLabel>
              </div>
            ) : null}
          </div>

          {/* The utility band: chips left, call to action right, one rule above
              the pair. It used to be a right-hand column on rows 02–05 and a
              full-width band on the lead row — two constructions doing the same
              job. */}
          <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-4 border-t border-line pt-4">
            {/* Bordered chips, the same idiom the case studies use for the same
                data. These were bare mono words separated only by a gap, so a
                right-aligned list that wrapped read as one run-on string —
                "CAN BUS PYTHON" is two tools or three, and nothing on the row
                says which. */}
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, isLead ? 6 : 4).map((tool) => (
                <li
                  key={tool}
                  className="label-mono border border-line px-2 py-1 text-ink-2"
                >
                  {tool}
                </li>
              ))}
            </ul>

            {/* Opposite end of the band from the chips, so it is never read as
                one more tag. The rule now sits above the whole band rather than
                above this label alone. */}
            <MonoLabel tone="loud" as="p" className="group-hover:text-safelight">
              Case study →
            </MonoLabel>
          </div>
        </article>
      </Link>
    </Reveal>
  );
};

export const WorkIndex = ({ className }: { className?: string }) => (
  <Section
    className={className}
    id="work"
    index="01"
    title="Selected work"
    annotation={`${projects.length} projects`}
  >
    {/* The first project runs full-width with its figure at full size and its
        title a step larger. The index is ordered by weight, not date, so the
        row a visitor is meant to open first should not be the same size as the
        homelab dashboard four rows below it. */}
    <ul className="border-t border-line-strong">
      {projects.map((project, i) => (
        <ProjectRow key={project.slug} project={project} isLead={i === 0} />
      ))}
    </ul>

    {/* Everything else that is real but does not need a case study. */}
    <Reveal shift="none" className="mt-16">
      <MonoLabel as="p" className="pb-5">
        Also
      </MonoLabel>
      {/* Column count follows the item count. The grid is drawn by letting a
          `bg-line` parent show through 1px gaps between `bg-paper` cells, so a
          column with no card in it is not empty — it paints as a solid block of
          rule colour. Hard-coding three columns left exactly that block behind
          when the list dropped to two items. */}
      <ul
        className={`grid grid-cols-1 gap-px border border-line bg-line ${
          additionalWork.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {additionalWork.map((item) => (
          <li key={item.title} className="bg-paper p-6">
            <MonoLabel tone="signal">{item.period}</MonoLabel>
            <h3 className="text-sub mt-4 font-display text-ink">
              {item.title}
            </h3>
            <MonoLabel as="p" className="mt-2">
              {withoutEchoedYear(item.org, item.period)}
            </MonoLabel>
            <p className="text-fine mt-4 text-ink-2">{item.note}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  </Section>
);
