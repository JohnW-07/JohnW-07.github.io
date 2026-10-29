import type { Metadata } from "next";

import { resumeMetadata } from "@/views/resume/metadata";
import { ResumeView } from "@/views/resume";

export const metadata: Metadata = resumeMetadata();

export default function Page() {
  return <ResumeView />;
}
