import type { Metadata } from "next";

import { contactPage } from "@/data/contact";
import { siteConfig } from "@/lib/site";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

/** Metadata for `/contact`, built from the same data the page renders. */
export const contactMetadata = (): Metadata =>
  buildMetadata({
    title: `${contactPage.title} · ${siteConfig.name}`,
    description: contactPage.description,
    url: "/contact",
  });
