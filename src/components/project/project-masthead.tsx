"use client";

import Link from "next/link";
import TextEngine from "spring-text-engine";

import { accentTone, type Accent } from "@/components/project/accent";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import type { Metric, Project } from "@/data/types";
import { ease, heavy, textTiming } from "@/lib/motion";

interface ProjectMastheadProps {
  project: Project;
  /** First sentence of the case study. Comes from `data/case-studies.ts`. */
  lede: string;
  accent: Accent;
  /**
   * The page's single strongest result, on the first screen.
   *
   * Pass this **only when the figure is an outcome**. A page whose numbers
   * describe the size of the work rather than its result must not put one here
   * — `tackle-vision` passes nothing, which is why its band is labelled Scope.
   */
  headline?: Metric;
}

/**
 * The top of a case study.
 *
 * Same skeleton on all five pages so the set reads as one document: a running
 * head, the title clipped and slid in a line at a time, then a band that puts
 * the flat facts on the left and the sentence that sets up the problem on the
 * right. Everything below this component is where the pages diverge.
 *
 * `TextEngine` emits its own visually hidden copy of the text (`seo` defaults
 * to true) and marks the animated glyphs `aria-hidden`, so `tag="h1"` here is
 * a real, readable `h1` and the page needs no second one.
 */
export const ProjectMasthead = ({
  project,
  lede,
  accent,
  headline,
}: ProjectMastheadProps) => (
  <header className="px-gutter pt-24 pb-12 lg:px-page lg:pt-28 lg:pb-16">
    <Reveal
      shift="none"
      className="flex items-baseline justify-between gap-4 pb-6"
    >
      <Link
        href="/#work"
        className="label-mono border-b border-transparent pb-1 text-ink-3 hover:border-safelight hover:text-ink"
      >
        ← Index
      </Link>
      {/* Discipline only. The project's index used to lead this label, which
          put a bare "02" at the top of a page whose body sections are numbered
          02.1, 02.2, 02.3 — two unrelated numbering systems using the same
          digits, and on the tackle-vision page they collided exactly. The
          ordinal is a position in the home index; it means nothing once you
          are inside the document. */}
      <MonoLabel tone={accentTone[accent]}>{project.discipline}</MonoLabel>
    </Reveal>

    <div className="border-b border-line-strong pb-3">
      <TextEngine
        tag="h1"
        mode="once"
        overflow
        wrapLineClassName="line-mask"
        className="text-display descender-room block max-w-[22ch] font-display text-ink"
        lineIn={{ y: "0%", opacity: 1 }}
        lineOut={{ y: "104%", opacity: 0 }}
        lineStagger={textTiming.lineStagger}
        lineConfig={heavy}
      >
        {project.title}
      </TextEngine>
    </div>

    <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 lg:mt-10 lg:grid-cols-12">
      <Reveal shift="none" delay={160} className="self-start lg:col-span-3">
        {/* No top border. On phones this list stacks directly under the title's
            own rule, so its `border-t` drew a second full-width hairline 32px
            below the first with nothing between them. Each row's `border-b`
            already separates the rows. */}
        <dl className="grid grid-cols-2 gap-x-6 lg:grid-cols-1">
          <div className="border-b border-line py-3 lg:py-2.5">
            <MonoLabel as="dt">Role</MonoLabel>
            <dd className="text-fine mt-1.5 text-ink">{project.role}</dd>
          </div>
          <div className="border-b border-line py-3 lg:py-2.5">
            <MonoLabel as="dt">Where</MonoLabel>
            <dd className="text-fine mt-1.5 text-ink">{project.org}</dd>
          </div>
          <div className="border-b border-line py-3 lg:py-2.5">
            <MonoLabel as="dt">Period</MonoLabel>
            <dd className="text-fine mt-1.5 text-ink">{project.period}</dd>
          </div>
          {project.location ? (
            <div className="border-b border-line py-3 lg:py-2.5">
              <MonoLabel as="dt">Location</MonoLabel>
              <dd className="text-fine mt-1.5 text-ink">{project.location}</dd>
            </div>
          ) : null}
        </dl>
      </Reveal>

      <div className="lg:col-span-8 lg:col-start-5">
        <TextEngine
          tag="p"
          mode="once"
          className="text-display-sm block max-w-[30ch] font-display text-ink lg:max-w-[34ch]"
          wordIn={{ y: 0, opacity: 1 }}
          wordOut={{ y: 12, opacity: 0 }}
          wordStagger={textTiming.wordStagger}
          wordConfig={ease}
          delayIn={280}
        >
          {lede}
        </TextEngine>

        {/* The result, on the first screen.
            ------------------------------------------------------------------
            The full figures band stays at the end of the page — a case study
            that opens with three big numbers is asking to be skimmed. But the
            fold was eight metadata fields and six tech chips with no evidence
            in it, and on `vla-benchmarking` the one number that decides whether
            a reader keeps going sat at 85% page depth. One figure here, three
            at the end, is the split that gives a reader something to weigh
            without turning the top of the page into a dashboard. */}
        {headline ? (
          <Reveal
            shift="none"
            delay={380}
            className="mt-8 flex items-baseline gap-4 border-t border-line-strong pt-5"
          >
            <p className="text-readout font-display text-ink">
              {headline.value}
              {headline.unit ? (
                <span className="label-mono ml-1 align-super text-ink-3">
                  {headline.unit}
                </span>
              ) : null}
            </p>
            {/* Wide enough not to wrap. At 18ch "RIG IOU, UP FROM 0.564" broke
                into two lines whose first sat on the numeral's baseline and
                whose second hung below it, which read as a stacked caption
                rather than as one label. */}
            <MonoLabel as="p" className="max-w-[26ch]">
              {headline.label}
            </MonoLabel>
          </Reveal>
        ) : null}

        {project.links.length > 0 ? (
          <Reveal delay={420} className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="label-mono border-b border-line-strong pb-1 text-ink hover:border-safelight hover:text-safelight"
              >
                {link.label} ↗
              </a>
            ))}
          </Reveal>
        ) : null}
      </div>
    </div>
  </header>
);
