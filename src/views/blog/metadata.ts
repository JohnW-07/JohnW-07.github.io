import type { Metadata } from "next";

import { blog } from "@/data/blog";
import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

/** Metadata for `/blog`, built from the same data the page renders. */
export const blogMetadata = (): Metadata =>
  buildMetadata({
    title: `Blog · ${siteConfig.name}`,
    description: blog.description,
    url: "/blog",
  });
