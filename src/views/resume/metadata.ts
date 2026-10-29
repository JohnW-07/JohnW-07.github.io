import type { Metadata } from "next";

import { resumePage } from "@/data/resume-page";
import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

/** Metadata for `/resume`, built from the same data the page renders. */
export const resumeMetadata = (): Metadata =>
  buildMetadata({
    title: `${resumePage.title} · ${siteConfig.name}`,
    description: resumePage.description,
    url: "/resume",
  });
