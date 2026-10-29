import { BootSequence } from "@/components/project/figures/boot-sequence";
import { CaseView } from "@/views/case";

/** Case study: live telemetry for a Formula SAE car. The figure closes the page. */
export const TerpsDashboardView = () => (
  <CaseView slug="terps-dashboard" figure={<BootSequence />} note="Time to first frame" />
);
