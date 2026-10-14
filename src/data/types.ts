/**
 * Content model for the portfolio.
 *
 * Everything rendered on this site is typed here and authored in `src/data/*`.
 * No component hardcodes copy. Two consequences worth knowing:
 *
 * 1. `PLACEHOLDER` marks content John has not supplied yet (a headshot, a
 *    photograph, a link). Components render a deliberate empty state for it
 *    rather than a broken image or a dead anchor. Nothing on the site
 *    silently invents a value.
 * 2. Every number in `Metric` traces back to John's verified fact bank. If a
 *    figure is not in there it does not go on the page.
 */

/** Sentinel for content that is not available yet. */
export const PLACEHOLDER = "__placeholder__" as const;

export type Placeholder = typeof PLACEHOLDER;

/** An asset that may not exist yet. Renders as a marked empty frame if absent. */
export type AssetSlot =
  | { readonly kind: "image"; readonly src: string; readonly alt: string }
  | { readonly kind: "placeholder"; readonly note: string };

/** A single readout on an instrument panel. Value is pre-formatted. */
export interface Metric {
  readonly value: string;
  readonly unit?: string;
  readonly label: string;
}

export interface ExternalLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

/** Which compartment a piece of work belongs to. Drives accent + index order. */
export type Discipline = "research" | "systems" | "hardware";

export interface Project {
  readonly slug: string;
  /** Zero-padded index shown in the mono rail, e.g. "01". */
  readonly index: string;
  readonly title: string;
  /** The organisation or venue. Sits above the title. */
  readonly org: string;
  readonly role: string;
  readonly period: string;
  readonly location?: string;
  readonly discipline: Discipline;
  /** One sentence for the index. Plain, no pitch. */
  readonly summary: string;
  readonly stack: readonly string[];
  readonly metrics: readonly Metric[];
  readonly links: readonly ExternalLink[];
  /** Whether a bespoke case-study page exists at /work/[slug]. */
  readonly hasPage: boolean;
}

export interface ExperienceEntry {
  readonly org: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly note: string;
  /** Slug of the related case study, if one exists. */
  readonly project?: string;
}

export interface Credential {
  readonly label: string;
  readonly detail: string;
  readonly year: string;
}

export interface SkillGroup {
  readonly heading: string;
  readonly items: readonly string[];
}

/** One frame on the photography contact sheet. */
export interface Frame {
  readonly id: string;
  readonly asset: AssetSlot;
  readonly caption: string | Placeholder;
  /** Shot metadata, printed in the margin like a film rebate. */
  readonly exif: string | Placeholder;
}
