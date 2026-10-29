"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { nav } from "@/data/nav";
import { navFor, pageIdFor } from "@/lib/field/page-id";

import { useStage } from "./stage";
import { WipeLink } from "./wipe-link";

/** The Navigation API's history flags (not yet in the DOM typings). */
type HistoryNav = { canGoBack: boolean; canGoForward: boolean };

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const current = navFor(pageIdFor(pathname));
  const { theme, toggleTheme } = useStage();
  // both arrows stay enabled where the Navigation API is missing
  const [can, setCan] = useState({ back: true, forward: true });

  useEffect(() => {
    const n = (window as Window & { navigation?: HistoryNav }).navigation;
    if (n) setCan({ back: n.canGoBack, forward: n.canGoForward });
  }, [pathname]);

  return (
    <nav className="bar" aria-label="Primary">
      <span>
        <WipeLink href="/">
          <b data-c="mid">{nav.mark}</b>
        </WipeLink>
        <button type="button" className="hist" data-c="mute" aria-label={nav.back.label} disabled={!can.back} onClick={() => router.back()}>
          {nav.back.text}
        </button>
        <button type="button" className="hist" data-c="mute" aria-label={nav.forward.label} disabled={!can.forward} onClick={() => router.forward()}>
          {nav.forward.text}
        </button>
      </span>
      <span>
        <span className="links">
          {nav.items.map(({ id, href }, i) => (
            <Fragment key={id}>
              {i > 0 && " "}
              <WipeLink href={href} aria-current={id === current ? "page" : undefined} data-c={id === current ? "mid" : "mute"}>
                {`[ ${id} ]`}
              </WipeLink>
            </Fragment>
          ))}
        </span>
        <button type="button" className="tg" data-c="mid" onClick={toggleTheme}>
          {nav.theme(theme === 1)}
        </button>
      </span>
    </nav>
  );
};
