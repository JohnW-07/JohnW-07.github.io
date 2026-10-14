import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { loadCaseStudy } from "@/views/work/load";

/**
 * Per-case-study metadata, derived from the same data the page renders so the
 * share card and the page can never disagree. Routes call this rather than
 * building metadata inline, which keeps `app/**` importing only from `views/`.
 */
export const projectMetadata = (slug: string): Metadata => {
  const { project } = loadCaseStudy(slug);

  return buildMetadata({
    title: `${project.title} · ${siteConfig.name}`,
    description: project.summary,
    url: `/work/${project.slug}`,
  });
};
