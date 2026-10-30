import type { PhotoFrame, PhotoSet } from "@/data/types";

/** `/photography` copy (R14). Sets are grouped by capture date until John names them. */
export const photoPage = {
  title: "Photography",
  description: "Photographs by John Wu, grouped by set: highlights first, then every frame.",
  sub: "grouped by set · highlights first, then every frame",
  highlights: "highlights",
  all: "all frames",
  count: (n: number) => `${n} frames`,
} as const;

/**
 * Exported frames (long edge 2000px, sRGB). Keyed by original file name,
 * lowercased. Months come from EXIF; P8* files carry none, so August 2025
 * is read from the camera's file naming (P = Olympus, 8 = August).
 */
export const frames: Readonly<Record<string, PhotoFrame>> = {
  p8223146: { src: "/assets/photography/p8223146.jpg", alt: "Photograph P8223146, August 2025", name: "P8223146", w: 2000, h: 1500 },
  p8223358: { src: "/assets/photography/p8223358.jpg", alt: "Photograph P8223358, August 2025", name: "P8223358", w: 1500, h: 2000 },
  p6189270: { src: "/assets/photography/p6189270.jpg", alt: "Photograph P6189270, June 2025", name: "P6189270", w: 2000, h: 1500 },
  p6147377: { src: "/assets/photography/p6147377.jpg", alt: "Photograph P6147377, June 2025", name: "P6147377", w: 1500, h: 2000 },
  img_3628: { src: "/assets/photography/img_3628.jpg", alt: "Photograph IMG_3628, June 2023", name: "IMG_3628", w: 2000, h: 1500 },
  img_1990: { src: "/assets/photography/img_1990.jpg", alt: "Photograph IMG_1990, March 2023", name: "IMG_1990", w: 1215, h: 2000 },
};

/** Grouped by capture date until John names the sets and places. */
export const photoSets: readonly PhotoSet[] = [
  {
    n: "01",
    title: "selected frames",
    meta: "Jun – Aug 2025",
    highlights: ["p8223146", "p6189270", "p8223358"],
    frames: ["p8223146", "p8223358", "p6189270", "p6147377"],
  },
  {
    n: "02",
    title: "selected frames",
    meta: "Mar – Jun 2023",
    highlights: ["img_3628", "img_1990"],
    frames: ["img_3628", "img_1990"],
  },
];
