import type { ReactNode } from "react";

type Tone = "quiet" | "loud" | "signal" | "data";

interface MonoLabelProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Renders as <dt>/<dd> pair members inside definition lists. */
  as?: "span" | "dt" | "dd" | "div" | "p";
}

const tones: Record<Tone, string> = {
  quiet: "text-ink-3",
  loud: "text-ink",
  signal: "text-safelight",
  data: "text-cyanotype",
};

/**
 * The instrument-panel voice: uppercase mono, tracked out, one of four tones.
 *
 * Used for every label, unit, index number and piece of metadata on the site.
 * Prose never uses it. Keeping all of them on one component is what stops the
 * page drifting into six slightly different small-caps treatments.
 */
export const MonoLabel = ({
  children,
  tone = "quiet",
  className = "",
  as: Tag = "span",
}: MonoLabelProps) => (
  <Tag className={`label-mono ${tones[tone]} ${className}`}>{children}</Tag>
);
