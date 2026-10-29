import type { Metadata } from "next";

import { photoPage } from "@/data/photography";
import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

/**
 * Metadata for `/photography`, built from the same data the page renders so the
 * share card and the page can never disagree. The route calls this rather than
 * building metadata inline, which keeps `app/**` importing only from `views/`.
 */
export const photographyMetadata = (): Metadata =>
  buildMetadata({
    title: `Photography · ${siteConfig.name}`,
    description: photoPage.description,
    url: "/photography",
  });
