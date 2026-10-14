import type { Metadata } from "next";

import { projectMetadata } from "@/views/work/metadata";
import { VlaBenchmarkingView } from "@/views/work/vla-benchmarking";

export const metadata: Metadata = projectMetadata("vla-benchmarking");

export default function Page() {
  return <VlaBenchmarkingView />;
}
