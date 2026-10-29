import { ImpactKinematics } from "@/components/project/figures/impact-kinematics";
import { CaseView } from "@/views/case";

/** Case study: scoring a hit from game film. */
export const TackleVisionView = () => (
  <CaseView slug="tackle-vision" figure={<ImpactKinematics />} note="Schematic" split={1} />
);
