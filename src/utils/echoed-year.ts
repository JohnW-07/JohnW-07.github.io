/**
 * Suppressing a year that the line beside it already states.
 *
 * This site sets a lot of metadata as adjacent mono fields — an org next to a
 * period, an award next to its detail — and several of those values carry a year
 * inside the string itself. "Bitcamp 2026" beside "Apr 2026", "US–Korea
 * Conference 2024" beside "May – Nov 2024", "Fall 2025 and Spring 2026" beside
 * "2026". Each reads as the same number stuttered.
 *
 * It was fixed three times by editing individual entries, and it came back each
 * time in a place the previous edit had not covered, because per-entry editing
 * cannot see a pattern. **A year already present in the neighbouring string is
 * not a fact, it is an echo**, and that is a rule the render can apply on its
 * own.
 *
 * Kept deliberately literal. A four-digit run is a year on this site; there is
 * no other kind of four-digit number in these fields, and a parser that tried to
 * be cleverer would be harder to predict than the problem it solves.
 */

const YEAR = /\b(19|20)\d{2}\b/g;

/** Every distinct four-digit year mentioned in a string. */
const yearsIn = (text: string): readonly string[] => text.match(YEAR) ?? [];

/**
 * `text` with any year that `context` already states removed, plus the
 * punctuation and whitespace that year left behind.
 *
 * Returns `text` untouched when nothing overlaps, so a value whose year is
 * genuinely new keeps it.
 */
export const withoutEchoedYear = (text: string, context: string): string => {
  const echoed = new Set(yearsIn(context));
  if (echoed.size === 0) return text;

  const stripped = yearsIn(text).reduce(
    (out, year) => (echoed.has(year) ? out.replace(year, "") : out),
    text,
  );

  if (stripped === text) return text;

  return stripped
    .replace(/\s*,\s*(?=,|$)/g, "") // a comma whose clause just vanished
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.·])/g, "$1")
    .replace(/^[\s,·]+|[\s,·]+$/g, "")
    .trim();
};

/**
 * A date range with the year stated once when both ends share it.
 *
 * "May 2026 – Aug 2026" becomes "May – Aug 2026". Spans crossing a year
 * boundary ("Sep 2025 – Dec 2025" versus "May – Nov 2024") keep both, because
 * there the second year is information rather than repetition.
 *
 * The project data already writes the short form by hand; the experience list
 * writes the long one, so the same fact appeared in two formats on one page.
 */
export const compactPeriod = (period: string): string => {
  const match = period.match(
    /^(.*?)\s*((?:19|20)\d{2})\s*([–-])\s*(.*?)\s*((?:19|20)\d{2})$/,
  );
  if (!match) return period;

  const [, from, fromYear, dash, to, toYear] = match;
  if (fromYear !== toYear || !from || !to) return period;

  return `${from} ${dash} ${to} ${toYear}`;
};
