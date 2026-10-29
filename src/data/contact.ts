/**
 * Contact details — the one file to edit when an address, profile, or the
 * résumé changes. Everything else (footer, hero, contact section, SEO,
 * JSON-LD) reads from here.
 */
export const contact = {
  email: {
    /** Shown on the site and used in structured data. */
    primary: "johnwu07@outlook.com",
    school: "johnwu07@terpmail.umd.edu",
  },
  based: "College Park, MD",
  school: "University of Maryland, College Park",
  github: "https://github.com/JohnW-07",
  linkedin: "https://linkedin.com/in/john-wu07",
  /**
   * Résumé download. Left out of the header until the file exists so the site
   * never ships a link to a 404.
   */
  resume: {
    href: "/john-wu-resume.pdf",
    available: false,
    note: "Add public/john-wu-resume.pdf, then set available: true",
  },
} as const;
