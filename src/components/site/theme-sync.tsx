"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Routes that run in the darkroom compartment. */
const DARKROOM_ROUTES = ["/photography"];

export const themeForPath = (pathname: string): "lab" | "darkroom" =>
  DARKROOM_ROUTES.some((route) => pathname.startsWith(route)) ? "darkroom" : "lab";

/**
 * Inline bootstrap that stamps the theme before first paint.
 *
 * The site has two compartments and the photography one inverts the entire
 * palette. Waiting for hydration to apply it would flash a white page on the
 * way into the darkroom, which is exactly the moment the design is trying to
 * make an impression. The root layout is shared, so a nested layout cannot set
 * the attribute server-side; a blocking script in the body can.
 */
export const THEME_BOOTSTRAP = `document.documentElement.dataset.theme=${JSON.stringify(
  DARKROOM_ROUTES,
)}.some(function(r){return location.pathname.indexOf(r)===0})?"darkroom":"lab";`;

/** Keeps the attribute correct across client-side navigation. */
export const ThemeSync = (): null => {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.theme = themeForPath(pathname);
  }, [pathname]);

  return null;
};
