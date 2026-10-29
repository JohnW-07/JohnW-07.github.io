import { ComparePlate } from "@/components/project/compare-plate";
import { EvaluationMatrix } from "@/components/project/figures/evaluation-matrix";
import { CaseView } from "@/views/case";

/**
 * Case study: standardizing evaluation for VLA policies. The second plate is
 * evidence, not a diagram: the rig pipeline's output on the same camera before
 * and after the one parameter that was wrong.
 */
export const VlaBenchmarkingView = () => (
  <CaseView slug="vla-benchmarking" figure={<EvaluationMatrix />} note="Task coverage" split={1}>
    <ComparePlate
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
  </CaseView>
);
