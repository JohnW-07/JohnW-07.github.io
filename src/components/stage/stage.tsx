"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { tickerSubscriberCount } from "@/lib/animation/ticker";
import { CURVE, H, W } from "@/lib/field/constants";
import { createEngine, type Engine } from "@/lib/field/engine";
import { curveVisible, pageIdFor } from "@/lib/field/page-id";

import { NavBar } from "./nav-bar";

type Theme = 0 | 1;

const RESIZE_MS = 150;

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
  const id = pageIdFor(usePathname());
  const [theme, setTheme] = useState<Theme>(0);
  const fldRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    const root = fldRef.current?.parentElement;
    if (!root) return;
    const engine = createEngine(root, { reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
    engineRef.current = engine;
    if (process.env.NEXT_PUBLIC_E2E === "1") Object.assign(window, { __engine: engine, __tickers: tickerSubscriberCount });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => engine.resize(), RESIZE_MS);
    };
    addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      removeEventListener("resize", onResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (layerRef.current) engineRef.current?.setPage(id, layerRef.current);
  }, [id]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme ? "dark" : "light";
  }, [theme]);

  const go = useCallback((href: string) => router.push(href), [router]);
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
      <div data-ghost aria-hidden inert />
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
