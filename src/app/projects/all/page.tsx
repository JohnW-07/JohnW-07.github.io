import type { Metadata } from "next";

import { ProjectsAllView } from "@/views/projects-all";
import { allProjectsMetadata } from "@/views/projects/metadata";

export const metadata: Metadata = allProjectsMetadata();

export default function Page() {
  return <ProjectsAllView />;
}
