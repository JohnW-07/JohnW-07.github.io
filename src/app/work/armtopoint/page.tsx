import type { Metadata } from "next";

import { ArmToPointView } from "@/views/work/armtopoint";
import { projectMetadata } from "@/views/work/metadata";

export const metadata: Metadata = projectMetadata("armtopoint");

export default function Page() {
  return <ArmToPointView />;
}
