import type { Metadata } from "next";

import { photographyMetadata } from "@/views/photography/metadata";
import { PhotographyView } from "@/views/photography";

export const metadata: Metadata = photographyMetadata();

export default function Page() {
  return <PhotographyView />;
}
