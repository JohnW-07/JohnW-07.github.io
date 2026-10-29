import { DivergenceAlert } from "@/components/project/figures/divergence-alert";
import { CaseView } from "@/views/case";

/** Case study: catching respiratory distress before SpO2 drops. */
export const CherryCanaryView = () => (
  <CaseView slug="cherry-canary" figure={<DivergenceAlert />} note="Schematic" split={2} />
);
