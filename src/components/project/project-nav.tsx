import Link from "next/link";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { getAdjacentProjects } from "@/data/projects";

/**
 * End of a case study.
 *
 * Two links, previous and next, wrapping around the index so neither slot is
 * ever empty. A disabled arrow at the ends of a five-item list is a control
 * that exists to be a control, and the wrap costs nothing.
 */
export const ProjectNav = ({ slug }: { slug: string }) => {
  const { previous, next } = getAdjacentProjects(slug);
  if (!previous || !next) return null;

  return (
    <Reveal
      shift="none"
      tag="nav"
      aria-label="Other case studies"
      /* `border-t`, not `border-y`. The footer opens with its own top rule a
         section-gap below this, so a bottom border here drew a second rule with
         nothing but empty page between the two — a ruled band ~120px tall
         containing no content, at the end of every case study. */
      className="mt-section grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-2"
    >
      {/* The band runs full bleed, but its text sits on the page margin like
          everything else. Padding it by a flat `p-6 lg:p-10` put these two
          titles at x=40 while every figure caption, section rule and heading
          on the page above sat at x=80 — the one place the document broke its
          own margin. */}
      <Link
        href={`/work/${previous.slug}`}
        className="group bg-paper px-gutter py-8 hover:bg-paper-2 lg:px-page lg:py-12"
      >
        <MonoLabel className="group-hover:text-safelight">← Previous</MonoLabel>
        <p className="text-display-sm mt-4 font-display text-ink group-hover:text-safelight">
          {previous.title}
        </p>
        <MonoLabel as="p" className="mt-3">
          {previous.org}
        </MonoLabel>
      </Link>

      <Link
        href={`/work/${next.slug}`}
        className="group bg-paper px-gutter py-8 hover:bg-paper-2 md:text-right lg:px-page lg:py-12"
      >
        <MonoLabel className="group-hover:text-safelight">Next →</MonoLabel>
        <p className="text-display-sm mt-4 font-display text-ink group-hover:text-safelight">
          {next.title}
        </p>
        <MonoLabel as="p" className="mt-3">
          {next.org}
        </MonoLabel>
      </Link>
    </Reveal>
  );
};
