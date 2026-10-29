import { SingleCameraEstimate } from "@/components/project/figures/single-camera-estimate";
import { CaseView } from "@/views/case";

/** Case study: a 3D position from one RGB camera. The drawing sits between the method and the takeaway. */
export const ArmToPointView = () => <CaseView slug="armtopoint" figure={<SingleCameraEstimate />} split={2} />;
