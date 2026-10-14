/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper.
 */
import { publicEnv } from "@/env";

export const siteConfig = {
  name: "John Wu",
  description:
    "John Wu is a computer science student at the University of Maryland working on machine learning and computer vision for systems that sense the physical world. Robotics policy evaluation at Stanford's NeuroAI Lab, head-injury screening from game film, and embedded telemetry.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Default Open Graph / Twitter share image (path under `public/`). */
  ogImage: "/open-graph.png",
  twitterHandle: "",
  author: "John Wu",
  /** Browser theme-color. Matches the lab paper token. */
  themeColor: "#f4f1ea",
  jobTitle: "Computer science student and machine learning researcher",
  email: "johnwu07@terpmail.umd.edu",
  profiles: [
    "https://github.com/JohnW-07",
    "https://linkedin.com/in/john-wu07",
  ],
  affiliation: "University of Maryland, College Park",
} as const;
