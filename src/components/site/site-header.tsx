"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MonoLabel } from "@/components/ui/mono-label";

const nav = [
  { label: "Work", href: "/#work" },
  { label: "Photography", href: "/photography" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Which nav item is current.
 *
 * `/#work` and `/#contact` are jumps within the home page, and marking either
 * of them "current" the whole time you are on the home page is an indicator
 * that never changes, which is no indicator. So on `/` nothing is marked.
 *
 * The five `/work/*` case studies are a different case. They are real routes,
 * they are the deepest pages on the site, and the nav there was pixel-identical
 * to the nav on the home page — a reader two thousand pixels into a case study
 * had nothing telling them which section they were in. "Work" is that section,
 * even though its href points at the index.
 */
const isActive = (pathname: string, href: string) => {
  if (href === "/#work") return pathname.startsWith("/work/");
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
};

/**
 * Top rule.
 *
 * Four links, no menu button. On a narrow phone the links wrap onto a second
 * row under the name rather than hiding behind a hamburger, because a hamburger
 * that hides four links is a control that exists to be a control.
 *
 * Hover and active states change instantly rather than easing. The house rules
 * forbid CSS transitions, and an instrument that snaps between states is more
 * honest than one that fades anyway.
 */
export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-paper/85 px-gutter py-3 backdrop-blur-md lg:px-page">
        <Link href="/" className="group flex items-baseline gap-3" aria-label="John Wu, home">
          <span className="font-display text-xl leading-none text-ink">
            John Wu
          </span>
          <MonoLabel className="hidden sm:inline">ML · CV · Vision systems</MonoLabel>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 lg:gap-8">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`label-mono border-b pb-1 ${
                      active
                        ? "border-safelight text-ink"
                        : "border-transparent text-ink-3 hover:border-safelight hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};
