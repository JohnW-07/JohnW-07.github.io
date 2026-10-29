"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

import { nav } from "@/data/nav";
import { navFor, pageIdFor } from "@/lib/field/page-id";

import { useStage } from "./stage";
import { WipeLink } from "./wipe-link";

export const NavBar = () => {
  const router = useRouter();
  const current = navFor(pageIdFor(usePathname()));
  const { theme, toggleTheme } = useStage();

  return (
    <nav className="bar" aria-label="Primary">
      <span>
        <WipeLink href="/">
          <b data-c="mid">{nav.mark}</b>
        </WipeLink>
        <button type="button" className="hist" data-c="mute" aria-label={nav.back.label} onClick={() => router.back()}>
          {nav.back.text}
        </button>
        <button type="button" className="hist" data-c="mute" aria-label={nav.forward.label} onClick={() => router.forward()}>
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
