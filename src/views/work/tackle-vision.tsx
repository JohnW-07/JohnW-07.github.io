import { CaseStudyBody } from "@/components/project/case-study-body";
import { getProjectFigure } from "@/components/project/figure-registry";
import { FigurePlate } from "@/components/project/figure-plate";
import { ImpactKinematics } from "@/components/project/figures/impact-kinematics";
import { ProjectMasthead } from "@/components/project/project-masthead";
import { ProjectMetrics } from "@/components/project/project-metrics";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectSchema } from "@/components/project/project-schema";
import { SpecSheet } from "@/components/project/spec-sheet";
import { loadCaseStudy } from "@/views/work/load";

const SLUG = "tackle-vision";
const { accent: ACCENT } = getProjectFigure("tackle-vision");

/**
 * Case study: scoring a hit from game film.
 *
 * The figure is placed after the problem statement and before the pipeline
 * section, which is where a reader has just been told there is no number and
 * is about to be told how one gets made. Hanging headings in the margin the
 * whole way down, because this page has no sidebar competing for the width.
 */
export const TackleVisionView = () => {
  const { project, study } = loadCaseStudy(SLUG);
  const [problem, ...rest] = study.blocks;

  return (
    <main>
      <ProjectSchema project={project} />
      <ProjectMasthead project={project} lede={study.lede} accent={ACCENT} />

      <div className="px-gutter lg:px-page">
        <SpecSheet spec={study.spec} stack={project.stack} accent={ACCENT} layout="band" />

        <CaseStudyBody
          blocks={[problem]}
          accent={ACCENT}
          className="mt-section"
        />

        <section aria-label="Figure 1" className="py-4 lg:py-8">
          <FigurePlate
            caption={study.figureCaption}
            accent={ACCENT}
            note="Schematic"
            ruled={false}
          >
            <ImpactKinematics />
          </FigurePlate>
        </section>

        <CaseStudyBody blocks={rest} accent={ACCENT} offset={1} className="mt-8" />
      </div>

      {/* "Scope", not "Measured". The one figure this project can currently
          substantiate is the size of the fine-tuning set, which is an input.
          Labelling an input count as a measurement is the kind of small
          dishonesty a research reader notices immediately. When a verified
          accuracy or agreement number exists, this goes back to the default. */}
      <ProjectMetrics
        metrics={project.metrics}
        accent={ACCENT}
        label="Scope"
        className="mt-section"
      />
      <ProjectNav slug={SLUG} />
    </main>
  );
};
