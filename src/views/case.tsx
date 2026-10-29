import { Fragment, type ReactNode } from "react";

import { CaseStudyBody } from "@/components/project/case-study-body";
import { FigurePlate } from "@/components/project/figure-plate";
import { ProjectSchema } from "@/components/project/project-schema";
import { WipeLink } from "@/components/stage/wipe-link";
import { casePage } from "@/data/projects-page";
import { metricValue } from "@/lib/format";
import { Words } from "@/views/shared/words";
import { loadCaseStudy } from "@/views/work/load";

/** Width the RESULTS values are padded to, so the labels form one column (M:188). */
const VALUE_COLS = 11;

interface CaseViewProps {
  slug: string;
  /** The page's bespoke drawing. */
  figure: ReactNode;
  /** Plate metadata printed above the drawing. */
  note?: string;
  /** How many prose blocks run before the figure; the rest follow it. Defaults to all. */
  split?: number;
  /** Further plates after the prose. */
  children?: ReactNode;
}

/**
 * A case study: the R14 header (back, title, summary, RESULTS, spec), then the
 * narrative with the bespoke figure set into it.
 */
export const CaseView = ({ slug, figure, note, split, children }: CaseViewProps) => {
  const { project, study } = loadCaseStudy(slug);
  const at = split ?? study.blocks.length;
  const { keys } = casePage;
  const spec = [
    [keys.role, project.role],
    [keys.org, project.org],
    [keys.period, project.period],
    [keys.where, project.location ?? "—"],
    [keys.type, project.discipline],
    [keys.stack, project.stack.join(" · ")],
  ] as const;

  return (
    <>
      <ProjectSchema project={project} />
      <WipeLink href="/projects" className="back" data-c="mute">
        {casePage.back}
      </WipeLink>
      <h1 className="ct">
        <Words text={project.title} />
      </h1>
      <p className="sum" data-c="mid">
        {project.summary}
      </p>
      <div className="res">
        <pre data-c="mute">{casePage.results}</pre>
        {project.metrics.map((m) => (
          <pre key={m.label}>
            <b data-c="mid">{metricValue(m).padEnd(VALUE_COLS)}</b>
            <span data-c="mute">{m.label}</span>
          </pre>
        ))}
      </div>
      <div className="spec ko">
        <dl>
          {spec.map(([k, v]) => (
            <Fragment key={k}>
              <dt data-c="mute">{k}</dt>
              <dd data-c="mid">{v}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
      <section className="cb" aria-label={project.title}>
        <header className="cs" data-p="mute">
          <dl>
            {study.spec.map((row) => (
              <Fragment key={row.label}>
                <dt data-c="mute">{row.label.toLowerCase()}</dt>
                <dd data-c="mid">{row.value}</dd>
              </Fragment>
            ))}
          </dl>
          <p className="lede" data-c="mid">
            {study.lede}
          </p>
        </header>
        <CaseStudyBody blocks={study.blocks.slice(0, at)} />
        <FigurePlate caption={study.figureCaption} note={note}>
          {figure}
        </FigurePlate>
        <CaseStudyBody blocks={study.blocks.slice(at)} offset={at} />
        {children}
      </section>
    </>
  );
};
