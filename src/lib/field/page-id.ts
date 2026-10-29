export type PageId = "home" | "projects" | "all" | "case" | "photo" | "blog" | "resume" | "contact";
export type NavId = "home" | "projects" | "photo" | "blog" | "resume" | "contact";
export type Zone = "site" | "photo";

const ROUTES: Record<string, PageId> = {
  "/projects": "projects", "/projects/all": "all", "/photography": "photo",
  "/blog": "blog", "/resume": "resume", "/contact": "contact",
};

export const pageIdFor = (pathname: string): PageId => {
  const p = pathname.replace(/\/+$/, "");
  return p.startsWith("/work/") ? "case" : ROUTES[p] ?? "home";
};

export const navFor = (id: PageId): NavId => (id === "all" || id === "case" ? "projects" : id);
export const isFieldPage = (id: PageId) => id === "home" || id === "blog";
export const curveVisible = (id: PageId) => !isFieldPage(id) && id !== "all";
export const zoneOf = (id: PageId): Zone => (id === "photo" ? "photo" : "site");
