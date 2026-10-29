import type { Metadata } from "next";

import { ProjectsView } from "@/views/projects";
import { projectsMetadata } from "@/views/projects/metadata";

export const metadata: Metadata = projectsMetadata();

export default function Page() {
  return <ProjectsView />;
}
