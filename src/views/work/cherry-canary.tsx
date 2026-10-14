import { CaseStudyBody } from "@/components/project/case-study-body";
import { DivergenceAlert } from "@/components/project/figures/divergence-alert";
import { getProjectFigure } from "@/components/project/figure-registry";
import { FigurePlate } from "@/components/project/figure-plate";
import { ProjectMasthead } from "@/components/project/project-masthead";
import { ProjectMetrics } from "@/components/project/project-metrics";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectSchema } from "@/components/project/project-schema";
import { SpecSheet } from "@/components/project/spec-sheet";
import { loadCaseStudy } from "@/views/work/load";

const SLUG = "cherry-canary";
const { accent: ACCENT } = getProjectFigure("cherry-canary");

/**
 * Case study: Cherry Canary.
 *
 * The figure sits in a band lit by the safelight glow, which is the only place
 * on the professional side of the site that borrows the darkroom's atmosphere.
 * It earns it: this is the one project where the interesting content is a
 * signal, and the plate carries both the traces and the chain that produces
 * them. The last section, about the model that got thrown away, reads after
 * the drawing has already shown where the model is not.
 */
export const CherryCanaryView = () => {
  const { project, study } = loadCaseStudy(SLUG);
  const leading = study.blocks.slice(0, 2);
  const closing = study.blocks.slice(2);

  return (
    <main>
      <ProjectSchema project={project} />
      <ProjectMasthead project={project} lede={study.lede} accent={ACCENT} headline={project.metrics[0]} />

      <div className="px-gutter lg:px-page">
        <SpecSheet spec={study.spec} stack={project.stack} accent={ACCENT} layout="band" />
        <CaseStudyBody blocks={leading} accent={ACCENT} className="mt-section" />
      </div>

      <section
        aria-label="Figure 1"
        className="safelight-bloom mt-12 border-y border-line bg-paper-2 py-12 lg:mt-16 lg:py-16"
      >
        <div className="px-gutter lg:px-page">
          <FigurePlate
            caption={study.figureCaption}
            accent={ACCENT}
            note="Schematic"
            ruled={false}
          >
            <DivergenceAlert />
          </FigurePlate>
        </div>
      </section>

      <div className="px-gutter lg:px-page">
        <CaseStudyBody
          blocks={closing}
          accent={ACCENT}
          offset={leading.length}
          className="mt-12 lg:mt-16"
        />
      </div>

      <ProjectMetrics metrics={project.metrics} accent={ACCENT} className="mt-section" />
      <ProjectNav slug={SLUG} />
    </main>
  );
};
