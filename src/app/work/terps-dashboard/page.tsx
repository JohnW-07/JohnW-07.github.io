import type { Metadata } from "next";

import { projectMetadata } from "@/views/work/metadata";
import { TerpsDashboardView } from "@/views/work/terps-dashboard";

export const metadata: Metadata = projectMetadata("terps-dashboard");

export default function Page() {
  return <TerpsDashboardView />;
}
