"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { tickerSubscriberCount } from "@/lib/animation/ticker";
import { CURVE, H, W } from "@/lib/field/constants";
import { createEngine, type Engine } from "@/lib/field/engine";
import { curveVisible, pageIdFor } from "@/lib/field/page-id";

import { NavBar } from "./nav-bar";

type Theme = 0 | 1;

const RESIZE_MS = 150;

const samePath = (a: string, b: string) => (a.replace(/\/$/, "") || "/") === (b.replace(/\/$/, "") || "/");

type StageApi = {
  go: (href: string) => void;
  toggleTheme: () => void;
  theme: Theme;
};

const StageContext = createContext<StageApi | null>(null);

export const useStage = (): StageApi => {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("useStage must be used inside <Stage>");
  return stage;
};

/**
 * Persistent full-viewport shell: fixed canvases and overlays around the live
 * route in `main[data-layer]`. The field engine and wipes attach here.
 */
export const Stage = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pageIdFor(pathname);
  const [theme, setTheme] = useState<Theme>(0);
  const fldRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef(pathname);
  const reducedRef = useRef(false);
  /** The ghost copy waiting for the next route commit, the running wave's token, and the click queued behind it. */
  const pendingRef = useRef<HTMLElement | null>(null);
  const waveRef = useRef(0);
  const wipingRef = useRef(false);
  const queuedRef = useRef<string | null>(null);

  /** Freezes a copy of the live page over the stage, where it stays until the wave clears it. */
  const freeze = useCallback(() => {
    const layer = layerRef.current, host = ghostRef.current;
    if (!layer || !host) return;
    const ghost = layer.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, { position: "fixed", top: `${-scrollY}px`, left: "0", right: "0" });
    ghost.inert = true;
    ghost.setAttribute("aria-hidden", "true");
    host.replaceChildren(ghost);
    pendingRef.current = ghost;
  }, []);

  useEffect(() => {
    const root = fldRef.current?.parentElement;
    if (!root) return;
    reducedRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = createEngine(root, { reducedMotion: reducedRef.current });
    engineRef.current = engine;
    if (layerRef.current) engine.setPage(pageIdFor(pathRef.current), layerRef.current);
    if (process.env.NEXT_PUBLIC_E2E === "1") Object.assign(window, { __engine: engine, __tickers: tickerSubscriberCount });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => engine.resize(), RESIZE_MS);
    };
    // capture: runs before the router's own popstate handler re-renders the route
    const onPop = () => {
      if (reducedRef.current || samePath(location.pathname, pathRef.current)) return;
      engine.settle();
      queuedRef.current = null;
      freeze();
    };
    addEventListener("resize", onResize);
    addEventListener("popstate", onPop, true);
    return () => {
      clearTimeout(timer);
      removeEventListener("resize", onResize);
      removeEventListener("popstate", onPop, true);
      engine.destroy();
      engineRef.current = null;
    };
  }, [freeze]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme ? "dark" : "light";
  }, [theme]);

  const go = useCallback(
    (href: string) => {
      if (samePath(new URL(href, location.href).pathname, pathRef.current)) return;
      if (wipingRef.current) { queuedRef.current = href; return; }
      if (!reducedRef.current) freeze();
      router.push(href, { scroll: !pendingRef.current });
    },
    [router, freeze],
  );

  // keyed on the path, not the page id: case → case is a new page with the same id
  useLayoutEffect(() => {
    pathRef.current = pathname;
    const layer = layerRef.current, engine = engineRef.current, ghost = pendingRef.current;
    pendingRef.current = null;
    if (!layer || !engine) return;
    if (!ghost) { engine.setPage(id, layer); return; }
    scrollTo(0, 0);
    const token = ++waveRef.current;
    wipingRef.current = true;
    void engine.wipe(ghost, layer, id).then(() => {
      ghost.remove();
      if (token !== waveRef.current) return;
      wipingRef.current = false;
      const next = queuedRef.current;
      queuedRef.current = null;
      if (next) go(next);
    });
  }, [pathname, id, go]);
  const toggleTheme = useCallback(() => {
    engineRef.current?.toggleTheme();
    setTheme((t) => (t ? 0 : 1));
  }, []);
  const api = useMemo(() => ({ go, toggleTheme, theme }), [go, toggleTheme, theme]);

  return (
    <StageContext.Provider value={api}>
      <canvas data-paper aria-hidden />
      <canvas ref={fldRef} className="fld" aria-hidden />
      <svg data-curve data-off={!curveVisible(id) || undefined} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <defs>
          <linearGradient id="site-curve" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--curve-a)" }} />
            <stop offset=".55" style={{ stopColor: "var(--curve-b)" }} />
            <stop offset="1" style={{ stopColor: "var(--curve-c)", stopOpacity: 0.35 }} />
          </linearGradient>
        </defs>
        <path d={CURVE} fill="none" stroke="url(#site-curve)" strokeWidth={1.6} opacity={0.8} />
      </svg>
      <svg className="grain" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={3} seed={2} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div ref={ghostRef} data-ghost aria-hidden inert />
      <div data-frame>
        <main ref={layerRef} data-layer data-page={id}>
          <NavBar />
          {children}
        </main>
      </div>
      <canvas className="top" aria-hidden />
    </StageContext.Provider>
  );
};
