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
  tz: "ET",
  school: "University of Maryland, College Park",
  github: "https://github.com/JohnW-07",
  linkedin: "https://linkedin.com/in/john-wu07",
  /**
   * Résumé download. Left out of the header until the file exists so the site
   * never ships a link to a 404.
   */
  resume: {
    href: "/john-wu-resume.pdf",
    available: true,
  },
} as const;

/** `/contact` copy (R14 Contact A). */
export const contactPage = {
  title: "Contact",
  description: "How to reach John Wu: email first, then GitHub and LinkedIn.",
  sub: `Email is best · ${contact.based} · ${contact.tz}`,
  copy: { idle: "[ copy ]", done: "[ copied ]", fail: "[ select to copy ]" },
  write: "[ write ↗ ]",
  open: "[ open ↗ ]",
  note: "If you are working on systems that have to perceive something and then act on it, I would like to hear about it. Papers, harnesses, half-built rigs that do not work yet, all of it.",
  keys: { github: "github", linkedin: "linkedin", school: "school", resume: "résumé", based: "based" },
  resume: "pdf",
} as const;
