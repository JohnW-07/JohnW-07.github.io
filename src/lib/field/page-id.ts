export type PageId = "home" | "projects" | "all" | "case" | "photo" | "blog" | "post" | "resume" | "contact";
export type FieldPageId = "home" | "blog" | "post";
export type NavId = "home" | "projects" | "photo" | "blog" | "resume" | "contact";
export type Zone = "site" | "photo";

const ROUTES: Record<string, PageId> = {
  "/projects": "projects", "/projects/all": "all", "/photography": "photo",
  "/blog": "blog", "/resume": "resume", "/contact": "contact",
};

export const pageIdFor = (pathname: string): PageId => {
  const p = pathname.replace(/\/+$/, "");
  if (p.startsWith("/blog/")) return "post";
  return p.startsWith("/work/") ? "case" : ROUTES[p] ?? "home";
};

export const navFor = (id: PageId): NavId => {
  if (id === "all" || id === "case") return "projects";
  return id === "post" ? "blog" : id;
};
export const isFieldPage = (id: PageId): id is FieldPageId => id === "home" || id === "blog" || id === "post";
export const curveVisible = (id: PageId) => !isFieldPage(id) && id !== "all";
export const zoneOf = (id: PageId): Zone => (id === "photo" ? "photo" : "site");
