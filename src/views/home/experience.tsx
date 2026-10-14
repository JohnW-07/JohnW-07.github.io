import Link from "next/link";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { experience } from "@/data/profile";
import { getProject } from "@/data/projects";
import { compactPeriod } from "@/utils/echoed-year";

/**
 * The record.
 *
 * Set as a ruled list rather than a vertical timeline with dots and a spine.
 * A spine implies a single continuous thread; this is five separate posts and
 * a list says that more honestly, in less space.
 *
 * Three of these five posts are also case studies, and this section used to
 * restate each one's summary and repeat its "read the case study" link — the
 * same three projects described twice on one page, about three thousand pixels
 * apart, in near-identical words. A post that has a case study now carries a
 * cross-reference to its index number instead of a second description. What is
 * left is the thing the work index genuinely does not say: where he was, when,
 * and under what title.
 *
 * The prose `note` survives only for the posts with no case study, because for
 * those it is the sole description that exists.
 */
export const Experience = ({ className }: { className?: string }) => (
  <Section
    className={className}
    id="experience"
    index="02"
    title="Positions"
    annotation="2022 – 2026"
  >
    <ol className="border-t border-line-strong">
      {experience.map((entry) => {
        const study = entry.project ? getProject(entry.project) : undefined;

        return (
          <Reveal shift="none" tag="li" key={`${entry.org}-${entry.period}`}>
            <div className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-line py-6 lg:grid-cols-12">
              <div className="lg:col-span-3">
                {/* "May 2026 – Aug 2026" here against "May – Aug 2026" in the
                    case-study spec band: one fact, two formats, one page. */}
                <MonoLabel tone="signal">{compactPeriod(entry.period)}</MonoLabel>
                <MonoLabel as="p" className="mt-2">
                  {entry.location}
                </MonoLabel>
              </div>

              {/* One content column, not two.
                  ------------------------------------------------------------
                  This used to be a third column that held a cross-reference on
                  the three rows with case studies and a paragraph of prose on
                  the two without — the same column position carrying two
                  unrelated kinds of thing, with no header to say so, and three
                  rows of dead width on whichever kind was shorter. Both now sit
                  under the role, where they read as part of the post rather
                  than as a table cell that changed meaning halfway down. */}
              <div className="lg:col-span-9">
                <h3 className="text-sub font-display text-ink">{entry.org}</h3>
                <MonoLabel as="p" className="mt-2">
                  {entry.role}
                </MonoLabel>

                {study ? (
                  <Link
                    href={`/work/${study.slug}`}
                    className="label-mono group mt-3 inline-flex items-baseline gap-2 text-ink-3 hover:text-safelight"
                  >
                    {/* The label used to read "In selected work, above", which
                        describes a scroll upward. The link does not scroll up —
                        it opens the case study. A control whose label and
                        destination disagree is worse than no control. */}
                    <span className="text-safelight">{study.index}</span>
                    <span className="border-b border-line-strong pb-1 group-hover:border-safelight">
                      Case study →
                    </span>
                  </Link>
                ) : (
                  <p className="text-body mt-3 max-w-[44rem] text-ink-2">{entry.note}</p>
                )}
              </div>
            </div>
          </Reveal>
        );
      })}
    </ol>
  </Section>
);
