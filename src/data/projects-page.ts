import { NOW_M } from "@/lib/field/constants";

import { additionalWork } from "./projects";

/** Work without a case-study page, as `[year or status, title]` (R14 `ALSO`). */
export const also = additionalWork.map(
  ({ period, title }) => [period.match(/\d{4}$/)?.[0] ?? period.toLowerCase(), title.toLowerCase()] as const,
);

/** Copy for /projects (R4 A timeline) and /projects/all. */
export const projectsPage = {
  title: "Projects",
  description: "Projects by John Wu, placed on a timeline by start date: research above the line, engineering below.",
  sub: "Sep 2025 – present · placed by start date · ↑ research   ↓ engineering",
  ticks: [
    { m: 0, text: "2025", c: "mute" },
    { m: 5, text: "2026", c: "mute" },
    { m: NOW_M, text: "now", c: "acc" },
  ],
  foot: `also · ${also.map(([d, t]) => `${t}, ${d}`).join(" · ")}`,
  allBox: "╔════════════════════╗\n║  all projects  →   ║\n╚════════════════════╝",
  allLabel: "all projects",
} as const;

export const allProjectsPage = {
  title: "All projects",
  description: "Every project by John Wu, newest first, with links to the case studies.",
  sub: (pages: number, more: number) => `${pages} with case studies · newest first · ${more} more without a page`,
  noPage: "no page",
  back: "← timeline",
} as const;
