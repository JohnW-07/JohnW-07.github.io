import type { Metadata } from "next";

import { projectMetadata } from "@/views/work/metadata";
import { TackleVisionView } from "@/views/work/tackle-vision";

export const metadata: Metadata = projectMetadata("tackle-vision");

export default function Page() {
  return <TackleVisionView />;
}
