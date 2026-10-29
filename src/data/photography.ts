import { PLACEHOLDER, type Frame, type PhotoFrame, type PhotoSet } from "@/data/types";

/**
 * Photography compartment.
 *
 * John's fact bank records exactly one thing about his photography: that he
 * shoots, and that it is where his eye for design comes from. Nothing else is
 * known — no genre, no camera, no images. So this file ships an honest empty
 * contact sheet rather than invented captions over stock photographs.
 *
 * To load real work:
 *   1. Export frames to `public/assets/photography/` (long edge 2000px, sRGB).
 *   2. Swap a frame's `asset` from `{ kind: "placeholder" }` to
 *      `{ kind: "image", src: "/assets/photography/<file>", alt: "..." }`.
 *   3. Fill `caption` and `exif`. Anything still set to PLACEHOLDER renders as
 *      an unexposed frame with its number, which is a real state on a real
 *      contact sheet and reads as intentional.
 */

export const sheet = {
  title: "Contact sheet",
  /** Printed in the rebate margin of the sheet, like a film edge code. */
  rollCode: "JW-001",
  /** Meta description for `/photography`. */
  description:
    "The photography half of John Wu's portfolio: a contact sheet, printed as frames are made.",
  /** Opening line. Set large, in the display face. */
  lede: "Photography is the other half of this. It is where the eye for framing and for what to leave out came from, and it is the reason the research pages on this site look the way they do.",
  /** The honest state of the sheet, in smaller type under the lede. */
  note: "The sheet below is unexposed. Frames go up as they are printed.",
} as const;

/**
 * Copy for the compartment boundary, both directions.
 *
 * One object because it is one door. Wording that drifted between the two
 * sides would give away that they are separate components.
 */
export const doors = {
  toDarkroom: {
    eyebrow: "Other compartment",
    title: "Photography",
    /* The door invites; the sheet's own lede explains. This used to make the
       same claim as `lede` above in almost the same words — "the reason the
       research pages on this site are laid out the way they are" against "the
       reason the research pages on this site look the way they do" — one click
       apart, which reads as a draft nobody edited. The door now says only where
       it goes and what happens on the way. */
    blurb:
      "The other half of the work, kept on its own sheet. The lights go out on the way in.",
    cta: "Open the contact sheet",
  },
  toLab: {
    eyebrow: "Other compartment",
    title: "The lab",
    blurb:
      "Back the other way: machine learning and computer vision for systems that have to sense something real, with the case studies that go with them.",
    cta: "Return to the work",
  },
} as const;

const emptyFrame = (n: number): Frame => ({
  id: `frame-${String(n).padStart(2, "0")}`,
  asset: {
    kind: "placeholder",
    note: `public/assets/photography/${String(n).padStart(2, "0")}.jpg`,
  },
  caption: PLACEHOLDER,
  exif: PLACEHOLDER,
});

/** Twelve frames, the length of a 120 roll on 6x6. All empty until John loads them. */
export const sheetFrames: readonly Frame[] = Array.from({ length: 12 }, (_, i) =>
  emptyFrame(i + 1),
);

export const loadedCount = sheetFrames.filter(
  (frame) => frame.asset.kind === "image",
).length;

/**
 * Exported frames (long edge 2000px, sRGB). Keyed by original file name,
 * lowercased. Months come from EXIF; P8* files carry none, so August 2025
 * is read from the camera's file naming (P = Olympus, 8 = August).
 */
export const frames: Readonly<Record<string, PhotoFrame>> = {
  p8223146: { src: "/assets/photography/p8223146.jpg", alt: "Photograph P8223146, August 2025", name: "P8223146", w: 2000, h: 1500 },
  p8223358: { src: "/assets/photography/p8223358.jpg", alt: "Photograph P8223358, August 2025", name: "P8223358", w: 2000, h: 1500 },
  p6189270: { src: "/assets/photography/p6189270.jpg", alt: "Photograph P6189270, June 2025", name: "P6189270", w: 2000, h: 1500 },
  p6147377: { src: "/assets/photography/p6147377.jpg", alt: "Photograph P6147377, June 2025", name: "P6147377", w: 2000, h: 1500 },
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
