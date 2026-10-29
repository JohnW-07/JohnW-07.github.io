/** Home page copy (R14 mockup). Rows link to case studies by slug. */
export const home = {
  chip: "UMD · CS · ROBOTICS   ● now · stanford neuroai lab",
  boxTitle: "selected work",
  rows: [
    { n: "01", slug: "vla-benchmarking", label: "robot policy eval", year: "2026" },
    { n: "02", slug: "tackle-vision", label: "hit scoring from film", year: "2026" },
    { n: "03", slug: "terps-dashboard", label: "fsae live telemetry", year: "2025" },
    { n: "04", slug: "armtopoint", label: "rgb → 3d position", year: "2025" },
  ],
  /** Caption under the field for the photo on screen (1-based of 6). */
  frameLabel: (i: number, name: string) => `frame ${String(i).padStart(2, "0")}/6 · ${name} · bar across`,
} as const;
