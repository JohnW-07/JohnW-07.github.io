import { JsonLd } from "@/components/seo/json-ld";
import type { Project } from "@/data/types";
import { getProjectStructuredData } from "@/utils/seo/structured-data";

/**
 * Per-page JSON-LD. The `CreativeWork` node points back at the `Person` node
 * the root layout already emits, so a crawler resolves the author without a
 * second copy of the profile on every page.
 */
export const ProjectSchema = ({ project }: { project: Project }) => (
  <JsonLd
    data={getProjectStructuredData({
      title: project.title,
      summary: project.summary,
      slug: project.slug,
      period: project.period,
    })}
  />
);
