import type { Metadata } from "next";

import { blogMetadata } from "@/views/blog/metadata";
import { BlogView } from "@/views/blog";

export const metadata: Metadata = blogMetadata();

export default function Page() {
  return <BlogView />;
}
