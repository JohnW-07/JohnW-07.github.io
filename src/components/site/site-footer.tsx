import { links, profile, resume } from "@/data/profile";

/**
 * Closing rule.
 *
 * Carries the contact links and nothing else. No newsletter, no social-icon
 * row, no "back to top" button that duplicates a key the browser already has,
 * and no second Photography link: the header carries one on every page and the
 * home page ends on a full-width door to it.
 *
 * The name is not followed by the positioning line here. That sentence is
 * already the hero and the metadata description; a third copy in the footer is
 * a tagline, not information.
 */
export const SiteFooter = () => (
  <footer className="mt-section border-t border-line px-gutter py-10 lg:px-page">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <p className="font-display text-display-sm text-ink">{profile.name}</p>

      <nav aria-label="Contact and profiles">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="label-mono border-b border-line pb-1 text-ink hover:border-safelight hover:text-safelight"
              >
                {link.label}
              </a>
            </li>
          ))}
          {/* Appears the moment the PDF exists. Until then the site has no
              résumé link at all, rather than one that 404s. */}
          {resume.available ? (
            <li>
              <a
                href={resume.href}
                className="label-mono border-b border-line pb-1 text-ink hover:border-safelight hover:text-safelight"
              >
                Résumé
              </a>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>

  </footer>
);

/* The colophon row is gone.
   ---------------------------------------------------------------------------
   It once credited the build stack — "Next.js · react-spring · Tailwind CSS" —
   which is a studio-site convention that spends the last line of a research
   portfolio naming a framework instead of a person. That was replaced with the
   email address and the location, and both turned out to be restatements: the
   home page then ended on the address set in 64px Fraunces, an "Email" link in
   this footer's own nav, and the same address again in mono directly below it,
   with "College Park, MD" appearing twice inside 750px. Three copies of one
   string in one screen.

   The nav above carries the email. The Contact section's annotation carries the
   location. Neither needs a third voice under a rule. */
