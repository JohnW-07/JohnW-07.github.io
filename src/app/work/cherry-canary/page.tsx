import type { Metadata } from "next";

import { CherryCanaryView } from "@/views/work/cherry-canary";
import { projectMetadata } from "@/views/work/metadata";

export const metadata: Metadata = projectMetadata("cherry-canary");

export default function Page() {
  return <CherryCanaryView />;
}
