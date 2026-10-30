import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/site";

// Pre-rendered at build time for the static export (ADR-0028).
export const dynamic = "force-static";

/**
 * Generates `/sitemap.xml`. Case-study routes are derived from the project
 * index rather than listed by hand, so adding a project with `hasPage` adds
 * its entry here too. Paths end in `/` to match `trailingSlash` (no redirect hop).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...["/projects", "/projects/all"].map((path) => ({
      url: `${siteConfig.url}${path}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects
      .filter((project) => project.hasPage)
      .map((project) => ({
        url: `${siteConfig.url}/work/${project.slug}/`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.8,
      })),
    {
      // The contact sheet changes when frames are printed, not on a schedule.
      url: `${siteConfig.url}/photography/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/blog/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...["/resume", "/contact"].map((path) => ({
      url: `${siteConfig.url}${path}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
