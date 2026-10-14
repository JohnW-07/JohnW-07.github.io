import Link from "next/link";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";

interface CompartmentDoorProps {
  /**
   * The compartment on the **other** side. The band renders in that theme, so
   * the door reads as light coming through a gap rather than as a button.
   */
  theme: "lab" | "darkroom";
  href: string;
  /** Left-hand running head. */
  eyebrow: string;
  /** Right-hand code, printed opposite the eyebrow. */
  code: string;
  title: string;
  blurb: string;
  cta: string;
}

/**
 * The boundary between the two compartments, seen from either side.
 *
 * The professional side and the photography side are supposed to be separate,
 * so the separation is the design: this band carries the *other* side's
 * `data-theme`, which flips the entire token set inside it. Mid-page the lights
 * go out — or come back on — and the door is the only thing lit.
 *
 * One component for both directions, because a door that looked different
 * depending on which side you approached it from would not read as the same
 * door. It is a full-bleed break in an otherwise ruled, gridded document, which
 * is also why it does not get a section index.
 */
export const CompartmentDoor = ({
  theme,
  href,
  eyebrow,
  code,
  title,
  blurb,
  cta,
}: CompartmentDoorProps) => (
  <div data-theme={theme} className="mt-section bg-paper text-ink">
    {/* The bloom is the safelight itself, so it only exists in the darkroom. */}
    <div className={theme === "darkroom" ? "safelight-bloom" : ""}>
      <Link
        href={href}
        className="group block px-gutter py-24 lg:px-page lg:py-32"
      >
        <Reveal
          shift="none"
          className="flex items-baseline justify-between gap-4 border-b border-line pb-4"
        >
          <MonoLabel tone="signal">{eyebrow}</MonoLabel>
          <MonoLabel>{code}</MonoLabel>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
          <Reveal tag="div" className="lg:col-span-7">
            <h2 className="text-display font-display text-ink group-hover:text-safelight">
              {title}
            </h2>
          </Reveal>

          <Reveal tag="div" delay={90} className="lg:col-span-4 lg:col-start-9">
            <p className="text-body text-ink-2">{blurb}</p>
            <MonoLabel
              tone="signal"
              className="mt-6 inline-block border-b border-safelight pb-1"
            >
              {cta} →
            </MonoLabel>
          </Reveal>
        </div>
      </Link>
    </div>
  </div>
);
