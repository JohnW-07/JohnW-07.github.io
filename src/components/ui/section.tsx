import type { ReactNode } from "react";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";

interface SectionProps {
  id: string;
  /** Two-digit index printed in the margin, e.g. "02". */
  index: string;
  /** Short uppercase name. Also the label the scroll rail shows. */
  title: string;
  /** Optional right-hand annotation, set in mono. Counts, dates, units. */
  annotation?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A page section with its margin index and header rule.
 *
 * The header is a single hairline with the index at the left margin and the
 * section name beside it, which is how a lab notebook or a spec sheet is ruled.
 * `data-rail-section` registers the section with the scroll rail so it appears
 * as a tick; that attribute is tooling only and carries no styling.
 */
export const Section = ({
  id,
  index,
  title,
  annotation,
  children,
  className = "",
}: SectionProps) => (
  <section
    id={id}
    data-rail-section={title}
    aria-labelledby={`${id}-title`}
    className={`px-gutter lg:px-page ${className}`}
  >
    {/* Tight under the label. Several sections open with content that carries
        its own top rule, so a generous `pb` here put ~70px of empty page
        between two full-width hairlines — a ruled band whose only content was
        one 14px mono line at its top edge. The header is a caption on a rule,
        not a band in its own right. */}
    <Reveal shift="none" className="rule-t flex items-baseline gap-6 pt-4 pb-5 lg:pb-8">
      <MonoLabel tone="signal">{index}</MonoLabel>
      <h2 id={`${id}-title`} className="label-mono text-ink">
        {title}
      </h2>
      {annotation ? (
        <MonoLabel className="ml-auto text-right">{annotation}</MonoLabel>
      ) : null}
    </Reveal>
    {children}
  </section>
);
