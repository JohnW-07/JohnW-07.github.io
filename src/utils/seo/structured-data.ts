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

/** `/resume`: a profile page whose subject is the root `Person` node. */
export function getResumeStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/resume#page`,
    url: `${siteConfig.url}/resume`,
    mainEntity: { "@id": `${siteConfig.url}/#person` },
  };
}

/** `/photography`: every published frame, credited to the root `Person`. */
export function getGalleryStructuredData(images: readonly { src: string; alt: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteConfig.url}/photography#gallery`,
    url: `${siteConfig.url}/photography`,
    author: { "@id": `${siteConfig.url}/#person` },
    associatedMedia: images.map((image) => ({
      "@type": "ImageObject",
      contentUrl: `${siteConfig.url}${image.src}`,
      description: image.alt,
    })),
  };
}
