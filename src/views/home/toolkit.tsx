import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { credentials, education, skills } from "@/data/profile";
import { PLACEHOLDER, type Credential } from "@/data/types";

/**
 * A dot-separated list whose dots are actually separated.
 *
 * These were joined with a plain `" · "`. In the tracked mono layer that reads
 * generously — "ML · CV · VISION SYSTEMS" — but these lists are set in the sans
 * face at `text-fine` with no extra tracking, so the same string binds up:
 * "Python·C·C#·Java" reads as one token, worst around the one-character items.
 * A margin on the separator is the honest fix; widening `word-spacing` would
 * also stretch the space inside "Multi-GPU sharding".
 */
const DotList = ({ items }: { items: readonly string[] }) => (
  <>
    {items.map((item, i) => (
      <span key={item}>
        {i > 0 ? (
          <span aria-hidden="true" className="mx-1.5 text-ink-3">
            ·
          </span>
        ) : null}
        {item}
      </span>
    ))}
  </>
);

/**
 * An award's second line, with the year appended only when it is news.
 *
 * Appending it unconditionally printed "Bitcamp 2026, Social Good track winner"
 * over "UNIVERSITY OF MARYLAND · 2026", and "Fall 2025 and Spring 2026 · 2026".
 * Those were fixed one row at a time and the fix kept missing rows, because
 * per-entry patching cannot see the pattern: **a year that the label or the
 * detail already states is not a fact, it is an echo.** Deciding it here means a
 * new award gets this right without anybody remembering the rule.
 */
const creditLine = ({ label, detail, year }: Credential): string => {
  const stated = year === PLACEHOLDER || label.includes(year) || detail.includes(year);
  return stated ? detail : `${detail} · ${year}`;
};

/**
 * Education, tools, awards.
 *
 * Three columns of reference material, set at the density of a spec sheet
 * rather than as skill bars or percentage rings. A bar chart claiming someone
 * is 82% good at PyTorch is a number nobody measured.
 */
export const Toolkit = ({ className }: { className?: string }) => (
  <Section
    className={className}
    id="toolkit"
    index="03"
    title="Reference"
    annotation="Education · Tools · Awards"
  >
    <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
      {/* Education */}
      <Reveal tag="div" className="lg:col-span-4">
        <MonoLabel as="p" tone="signal">
          Education
        </MonoLabel>
        <h3 className="mt-5 font-display text-3xl leading-tight text-ink">
          {education.school}
        </h3>
        {/* Non-breaking space: "GPA" and its value are one measurement, and
            the line was breaking between them. */}
        <p className="text-body mt-3 text-ink-2">
          {education.degree}. {education.graduation}. GPA&nbsp;{education.gpa}.
        </p>

        <dl className="mt-7 border-t border-line">
          <div className="border-b border-line py-3">
            <MonoLabel as="dt">Minors</MonoLabel>
            <dd className="text-fine mt-1.5 text-ink">
              <DotList items={education.minors} />
            </dd>
          </div>
          <div className="border-b border-line py-3">
            <MonoLabel as="dt">Program</MonoLabel>
            <dd className="text-fine mt-1.5 text-ink">{education.program}</dd>
          </div>
          <div className="border-b border-line py-3">
            <MonoLabel as="dt">Coursework</MonoLabel>
            {/* Dots, not commas. This row sat directly under Minors, which uses
                the spaced separator, so one column carried two separator
                conventions one row apart. Commas are defensible for
                prose-length course names on their own; they are not defensible
                next to a dot list. */}
            <dd className="text-fine mt-1.5 text-ink-2">
              <DotList items={education.coursework} />
            </dd>
          </div>
        </dl>
      </Reveal>

      {/* Tools */}
      <Reveal tag="div" delay={80} className="lg:col-span-5">
        <MonoLabel as="p" tone="signal">
          Tools
        </MonoLabel>
        {/* Underlined rows, like Education to its left and Awards to its right.
            This was a bordered 2×3 box grid — the only bordered blocks in a
            section built entirely from hairline-underlined rows, which made
            three columns of the same kind of reference material look like two
            columns of a document with a table pasted between them. */}
        <dl className="mt-5 border-t border-line">
          {skills.map((group) => (
            <div key={group.heading} className="border-b border-line py-3">
              <MonoLabel as="dt" tone="loud">
                {group.heading}
              </MonoLabel>
              <dd className="text-fine mt-1.5 text-ink-2"><DotList items={group.items} /></dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Awards */}
      <Reveal tag="div" delay={160} className="lg:col-span-3">
        <MonoLabel as="p" tone="signal">
          Awards
        </MonoLabel>
        {/* No right-aligned year column.
            ------------------------------------------------------------------
            One of these four awards has no recorded year, and a column that is
            populated three times out of four is a hole however it is filled:
            blank reads as data that failed to load, and an em dash reads as a
            placeholder that shipped. Both were tried and both were called out.
            The year is not doing enough work to earn its own column, so it
            joins the detail line, where its absence is simply a shorter
            sentence. */}
        <ul className="mt-5 border-t border-line">
          {credentials.map((credential) => (
            <li key={credential.label} className="border-b border-line py-4">
              <p className="text-fine text-ink">{credential.label}</p>
              <MonoLabel as="p" className="mt-2">
                {creditLine(credential)}
              </MonoLabel>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </Section>
);
