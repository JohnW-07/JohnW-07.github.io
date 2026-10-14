import { CaseStudyBody } from "@/components/project/case-study-body";
import { ComparePlate } from "@/components/project/compare-plate";
import { EvaluationMatrix } from "@/components/project/figures/evaluation-matrix";
import { getProjectFigure } from "@/components/project/figure-registry";
import { FigurePlate } from "@/components/project/figure-plate";
import { ProjectMasthead } from "@/components/project/project-masthead";
import { ProjectMetrics } from "@/components/project/project-metrics";
import { ProjectNav } from "@/components/project/project-nav";
import { ProjectSchema } from "@/components/project/project-schema";
import { SpecSheet } from "@/components/project/spec-sheet";
import { loadCaseStudy } from "@/views/work/load";

const SLUG = "vla-benchmarking";
const { accent: ACCENT } = getProjectFigure("vla-benchmarking");

/**
 * Case study: standardizing evaluation for VLA policies.
 *
 * Same skeleton as the other four: spec band under the masthead, the problem,
 * the figure, then the rest of the prose with its headings hanging in the
 * margin.
 *
 * This page used to be the exception — a sticky spec rail in a left column with
 * the prose stacked beside it. Two things were wrong with that. The rail ran
 * out of content a third of the way down, so the left of the page was empty for
 * thousands of pixels while the prose ran as a narrow ribbon pinned right of
 * centre; and it meant the set of five case studies was really two different
 * documents, which is the one thing a page arguing for standardized measurement
 * cannot afford to be.
 */
export const VlaBenchmarkingView = () => {
  const { project, study } = loadCaseStudy(SLUG);
  const [problem, ...rest] = study.blocks;

  return (
    <main>
      <ProjectSchema project={project} />
      <ProjectMasthead project={project} lede={study.lede} accent={ACCENT} headline={project.metrics[0]} />

      <div className="px-gutter lg:px-page">
        <SpecSheet spec={study.spec} stack={project.stack} accent={ACCENT} layout="band" />

        <CaseStudyBody blocks={[problem]} accent={ACCENT} className="mt-section" />

        <section aria-label="Figure 1" className="py-4 lg:py-8">
          <FigurePlate
            caption={study.figureCaption}
            accent={ACCENT}
            note="Task coverage"
            ruled={false}
          >
            <EvaluationMatrix />
          </FigurePlate>
        </section>

        <CaseStudyBody blocks={rest} accent={ACCENT} offset={1} className="mt-8" />
      </div>

      {/* The second plate is evidence, not a diagram. The prose above says a
          3D point pipeline was built for the bimanual rig; this is that
          pipeline's output on the same camera before and after the one
          parameter that was wrong. */}
      <section className="mt-section px-gutter lg:px-page" aria-label="Figure 2">
        {/* No corner `note` here: the plate's note sits top-right, which is
            where the second pane's own readout already is, and the two collide.
            The caption carries the figure number instead. */}
        <ComparePlate
          accent={ACCENT}
          before={{
            src: "/assets/work/rig-baseline-before.webp",
            alt: "Top-down view of two robot arms with projected point clouds overlaid. The left arm's cloud is much smaller than the arm and sits inboard of it; the right arm's cloud is offset from the gripper.",
            state: "Stock CAD · 0.620 m",
            readout: "IoU 0.564 / 0.550",
            width: 640,
            height: 360,
          }}
          after={{
            src: "/assets/work/rig-baseline-after.webp",
            alt: "The same view after the rig baseline was re-solved. Per-link coloured point clouds sit cleanly along both arms and both grippers.",
            state: "Solved · ~0.52 m",
            readout: "IoU 0.658 / 0.671",
            width: 640,
            height: 360,
          }}
          caption="Fig. 02. Per-arm silhouette IoU on ep_001053 at 40k point density. The borrowed CAD file put the two arm bases 0.620 m apart; sweeping that one distance and re-solving the camera at each value peaked near 0.52 m. Four independent camera-solve methods had already plateaued against it. Precision and recall both rose, so the gain is alignment rather than a cloud shrunk to fit."
        />
      </section>

      <ProjectMetrics metrics={project.metrics} accent={ACCENT} className="mt-section" />
      <ProjectNav slug={SLUG} />
    </main>
  );
};
