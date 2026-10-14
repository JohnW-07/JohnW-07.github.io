import { CaseStudyBody } from "@/components/project/case-study-body";
import { getProjectFigure } from "@/components/project/figure-registry";
import { FigurePlate } from "@/components/project/figure-plate";
import { ProjectMasthead } from "@/components/project/project-masthead";
import { ProjectMetrics } from "@/components/project/project-metrics";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectSchema } from "@/components/project/project-schema";
import { SingleCameraEstimate } from "@/components/project/figures/single-camera-estimate";
import { SpecSheet } from "@/components/project/spec-sheet";
import { loadCaseStudy } from "@/views/work/load";

const SLUG = "armtopoint";
const { accent: ACCENT } = getProjectFigure("armtopoint");

/**
 * Case study: ArmToPoint.
 *
 * This is the drawing page. The figure runs edge to edge with no page gutter,
 * because it is set as an orthographic sheet with a title block and a sheet
 * wants its own margins rather than the page's. The spec sits at the bottom
 * where a colophon goes, since the interesting part here is the geometry
 * rather than the stack.
 */
export const ArmToPointView = () => {
  const { project, study } = loadCaseStudy(SLUG);
  const [question, loop, takeaway] = study.blocks;

  return (
    <main>
      <ProjectSchema project={project} />
      <ProjectMasthead project={project} lede={study.lede} accent={ACCENT} headline={project.metrics[0]} />

      <div className="px-gutter lg:px-page">
        <CaseStudyBody blocks={[question, loop]} accent={ACCENT} />
      </div>

      {/* Full bleed. The drawing carries its own border and title block. */}
      <section aria-label="Figure 1" className="mt-12 lg:mt-16">
        {/* No corner note here: the drawing carries its own title block. */}
        <FigurePlate caption={study.figureCaption} accent={ACCENT} ruled={false} bleed>
          <SingleCameraEstimate />
        </FigurePlate>
      </section>

      <div className="px-gutter lg:px-page">
        <CaseStudyBody blocks={[takeaway]} accent={ACCENT} offset={2} className="mt-12 lg:mt-16" />
        <SpecSheet
          spec={study.spec}
          stack={project.stack}
          accent={ACCENT}
          layout="band"
          className="mt-section"
        />
      </div>

      <ProjectMetrics metrics={project.metrics} accent={ACCENT} className="mt-section" />
      <ProjectNav slug={SLUG} />
    </main>
  );
};
