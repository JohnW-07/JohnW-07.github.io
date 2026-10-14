import { getCaseStudy, type CaseStudy } from "@/data/case-studies";
import { getProject } from "@/data/projects";
import type { Project } from "@/data/types";

/**
 * Pulls a project and its narrative together for a case-study page.
 *
 * Every one of these pages is a hand-built route, so a missing slug is an
 * authoring mistake rather than a bad request. Throwing here surfaces it at
 * build time with the slug in the message instead of rendering a page with
 * holes in it.
 */
export const loadCaseStudy = (
  slug: string,
): { project: Project; study: CaseStudy } => {
  const project = getProject(slug);
  const study = getCaseStudy(slug);

  if (!project || !study) {
    throw new Error(
      `No ${project ? "case study" : "project"} registered for the slug "${slug}".`,
    );
  }

  return { project, study };
};
