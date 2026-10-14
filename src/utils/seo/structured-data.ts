/**
 * @fileoverview JSON-LD structured data helpers.
 *
 * This site is a person, not an organisation, so the root graph is a `Person`
 * linked to the `WebSite` that publishes it. Search engines use the Person node
 * to reconcile the site with the GitHub and LinkedIn profiles listed on it.
 */

import { siteConfig } from "@/lib/site";

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.author,
        url: siteConfig.url,
        email: `mailto:${siteConfig.email}`,
        jobTitle: siteConfig.jobTitle,
        description: siteConfig.description,
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: siteConfig.affiliation,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: siteConfig.affiliation,
        },
        knowsAbout: [
          "Machine learning",
          "Computer vision",
          "Robot manipulation",
          "Vision-language-action models",
          "Embedded systems",
          "Photography",
        ],
        sameAs: siteConfig.profiles,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
    ],
  };
}

/** Per-project JSON-LD, emitted on each case study page. */
export function getProjectStructuredData(project: {
  title: string;
  summary: string;
  slug: string;
  period: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteConfig.url}/work/${project.slug}#project`,
    name: project.title,
    description: project.summary,
    url: `${siteConfig.url}/work/${project.slug}`,
    temporalCoverage: project.period,
    author: { "@id": `${siteConfig.url}/#person` },
  };
}
