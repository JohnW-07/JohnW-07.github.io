import { BootSequence } from "@/components/project/figures/boot-sequence";
import { CaseStudyBody } from "@/components/project/case-study-body";
import { getProjectFigure } from "@/components/project/figure-registry";
import { FigurePlate } from "@/components/project/figure-plate";
import { ProjectMasthead } from "@/components/project/project-masthead";
import { ProjectMetrics } from "@/components/project/project-metrics";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectSchema } from "@/components/project/project-schema";
import { SpecSheet } from "@/components/project/spec-sheet";
import { loadCaseStudy } from "@/views/work/load";

const SLUG = "terps-dashboard";
const { accent: ACCENT } = getProjectFigure("terps-dashboard");

/**
 * Case study: the Terps Racing EV dashboard.
 *
 * The figure closes rather than opens. The boot number is the end of the
 * story on this page, and putting the bar chart at the top would give away
 * the only thing the last section has to say.
 */
export const TerpsDashboardView = () => {
  const { project, study } = loadCaseStudy(SLUG);

  return (
    <main>
      <ProjectSchema project={project} />
      <ProjectMasthead project={project} lede={study.lede} accent={ACCENT} headline={project.metrics[0]} />

      <div className="px-gutter lg:px-page">
        <SpecSheet spec={study.spec} stack={project.stack} accent={ACCENT} layout="band" />
        <CaseStudyBody blocks={study.blocks} accent={ACCENT} className="mt-section" />

        <section aria-label="Figure 1" className="mt-8">
          <FigurePlate caption={study.figureCaption} accent={ACCENT} note="Time to first frame">
            <BootSequence />
          </FigurePlate>
        </section>
      </div>

      <ProjectMetrics metrics={project.metrics} accent={ACCENT} className="mt-section" />
      <ProjectNav slug={SLUG} />
    </main>
  );
};
