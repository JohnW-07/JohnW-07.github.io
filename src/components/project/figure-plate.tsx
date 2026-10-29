import type { ReactNode } from "react";

interface FigurePlateProps {
  caption: string;
  /** Plate metadata printed above the drawing, e.g. "Schematic". */
  note?: string;
  children: ReactNode;
}

/**
 * A figure on the case-study page. The drawings ink with `currentColor`, so the
 * plate sets the accent. Below 640px the drawing keeps a minimum width and the
 * plate scrolls sideways rather than shrinking its labels below legibility.
 */
export const FigurePlate = ({ caption, note, children }: FigurePlateProps) => (
  <figure className="fp" data-p="mute">
    {note ? <pre data-c="mute">{note}</pre> : null}
    <div className="fp-d" data-c="acc">
      <div>{children}</div>
    </div>
    <figcaption data-c="mute">{caption}</figcaption>
  </figure>
);
