import type { Metadata } from "next";

import { allProjectsPage, projectsPage } from "@/data/projects-page";
import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

export const projectsMetadata = (): Metadata =>
  buildMetadata({ title: `${projectsPage.title} · ${siteConfig.name}`, description: projectsPage.description, url: "/projects" });

export const allProjectsMetadata = (): Metadata =>
  buildMetadata({ title: `${allProjectsPage.title} · ${siteConfig.name}`, description: allProjectsPage.description, url: "/projects/all" });
