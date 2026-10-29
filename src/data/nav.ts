/** Site navigation (R14 nav bar). `id` doubles as the label: `[ home ]`. */
export const nav = {
  mark: "JW/",
  items: [
    { id: "home", href: "/" },
    { id: "projects", href: "/projects" },
    { id: "photo", href: "/photography" },
    { id: "blog", href: "/blog" },
    { id: "resume", href: "/resume" },
    { id: "contact", href: "/contact" },
  ],
  back: { label: "Back", text: "[ ← ]" },
  forward: { label: "Forward", text: "[ → ]" },
  /** Padded so the toggle keeps its width across themes. */
  theme: (dark: boolean) => `[ ◐ ${dark ? "dark " : "light"} ]`,
} as const;
