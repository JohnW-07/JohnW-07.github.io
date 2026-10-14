import { PLACEHOLDER, type Frame } from "@/data/types";

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
export const frames: readonly Frame[] = Array.from({ length: 12 }, (_, i) =>
  emptyFrame(i + 1),
);

export const loadedCount = frames.filter(
  (frame) => frame.asset.kind === "image",
).length;
