// 📖 Docs: obsidian/frontend/components/common.md

import type { ComponentType } from "react";

import type { Accent } from "@/components/project/accent";
import { BootSequence } from "@/components/project/figures/boot-sequence";
import { DivergenceAlert } from "@/components/project/figures/divergence-alert";
import { EvaluationMatrix } from "@/components/project/figures/evaluation-matrix";
import { ImpactKinematics } from "@/components/project/figures/impact-kinematics";
import { SingleCameraEstimate } from "@/components/project/figures/single-camera-estimate";

/**
 * Which drawing and which accent belong to a project.
 *
 * Both facts used to live only inside the case-study page that rendered them —
 * five local `const ACCENT` declarations, and five one-off figure imports. That
 * was fine while a figure appeared exactly once. The work index now shows the
 * same drawings as thumbnails, so a sixth copy of the mapping would have been
 * the point at which the two surfaces could silently disagree about what a
 * project looks like.
 *
 * The case-study pages read their accent from here too, so there is one place
 * to change a project's colour and one place to change its drawing.
 */
export interface ProjectFigure {
  /** The bespoke SVG. Scales to any width — every one is `viewBox`-based. */
  readonly Figure: ComponentType;
  readonly accent: Accent;
  /**
   * Aspect ratio of the drawing, as `width / height` from its `viewBox`.
   * The index needs this to reserve space before the SVG paints, so a row
   * does not shift when the figure lands (CLS).
   */
  readonly ratio: number;
}

export const projectFigures: Record<string, ProjectFigure> = {
  // These two `ratio` values must track their figure's `viewBox`. Both had a
  // 1000-unit box carrying ink that stopped well short of the right edge — 133
  // units of dead margin on the evaluation matrix, 70 on the kinematics — so in
  // the index the drawing sat visibly left of centre in its plate while the
  // three balanced figures below it did not. The boxes were tightened to the
  // ink; the ratios follow.
  "vla-benchmarking": {
    Figure: EvaluationMatrix,
    accent: "cyanotype",
    ratio: 891 / 386,
  },
  "tackle-vision": {
    Figure: ImpactKinematics,
    accent: "safelight",
    ratio: 950 / 460,
  },
  "terps-dashboard": {
    Figure: BootSequence,
    accent: "safelight",
    ratio: 1000 / 404,
  },
  armtopoint: {
    Figure: SingleCameraEstimate,
    accent: "cyanotype",
    ratio: 1000 / 472,
  },
  "cherry-canary": {
    Figure: DivergenceAlert,
    accent: "safelight",
    ratio: 1000 / 596,
  },
};

/**
 * A project's accent. Throws on an unknown slug rather than defaulting, for the
 * same reason `loadCaseStudy` throws: these are hand-built routes, so a slug
 * that is not registered is an authoring mistake and should fail at build time.
 */
export const getProjectFigure = (slug: string): ProjectFigure => {
  const entry = projectFigures[slug];

  if (!entry) {
    throw new Error(`No figure registered for the project slug "${slug}".`);
  }

  return entry;
};
