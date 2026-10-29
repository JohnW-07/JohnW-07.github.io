import { home } from "@/data/home";
import { frames as PHOTO_FRAMES } from "@/data/photography";
import { subscribeToTicker } from "@/lib/animation/ticker";

import { buildAtlas, type GlyphSink } from "./atlas";
import { drawBand, type BandGrid } from "./band";
import { CORE, FZ, PAGE_MS, PHOTOS, STAGES, THEMES, TRAIL, VEIL } from "./constants";
import { makeSignedDist, sampleCurve, type Point } from "./curve";
import { create2dSink } from "./draw2d";
import { makeFront } from "./front";
import { createGlBatch } from "./gl-batch";
import { createHero, type FieldLayer } from "./hero";
import { buildKnockout, type KnockoutGrid } from "./knockout";
import { blur, toLum } from "./luminance";
import { paint, prep, type CellGrid, type Item } from "./masks";
import { clamp, smoothstep } from "./math";
import { isFieldPage, type PageId } from "./page-id";

export type Engine = {
  setPage: (id: PageId, layer: HTMLElement) => void;
  wipe: (ghost: HTMLElement | null, layer: HTMLElement, id: PageId) => Promise<void>;
  toggleTheme: () => void;
  resize: () => void;
  destroy: () => void;
  /** Finishes a running wipe at once (history moves, hidden tab). */
  settle: () => void;
  readonly renderer: "webgl2" | "2d";
  /** True once the first scene is built. */
  readonly ready: boolean;
  /** Duration of the last finished wipe, in ms. */
  readonly lastWipeMs: number;
};

const PHONE_MAX = 640, MAX_DPR = 2, ROW_ASPECT = 1.75, HERO_SAMPLES = 300, CURVE_SAMPLES = 800, H1_WEIGHT = 800;
const GL_OPTS: WebGLContextAttributes = { premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: process.env.NEXT_PUBLIC_E2E === "1" };
const NO_SINK: GlyphSink = { push: () => {}, begin: () => {}, end: () => {}, destroy: () => {} };

type Photo = { img: HTMLImageElement; fy: number; name: string };

type Scene = {
  key: string;
  sink: GlyphSink;
  hero: ReturnType<typeof createHero>;
  TH: Float32Array;
  grid: KnockoutGrid;
  ko: Record<"home" | "blog", string>;
  kn: Map<PageId, Float32Array>;
  band: BandGrid;
  css: CellGrid;
  frontAt: (p: number) => number;
  top: GlyphSink;
  paper: { ctx: CanvasRenderingContext2D; bg: HTMLCanvasElement; img: ImageData } | null;
};

/** A running page wipe: the old page's leaves fade ahead of the band core, the new page's behind it. */
type Wave = { t0: number; fromId: PageId; from: Item[]; to: Item[]; knFrom: Float32Array | null; resolve: () => void };

/** Curve opacity per page: hidden on field pages and the all-projects index. */
const lineVis = (id: PageId) => (isFieldPage(id) || id === "all" ? 0 : 1);

/** Q (signed distance across the curve) and G (its gradient) per cell (M:315–322). */
const curveField = (curve: string, below: string, cols: number, rows: number, ux: number, uy: number) => {
  const dist = makeSignedDist(sampleCurve(curve, CURVE_SAMPLES), points(below)), N = cols * rows;
  const Q = new Float32Array(N), G = new Float32Array(N);
  for (let r = 0, i = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) Q[i] = dist((c + 0.5) * ux, (r + 0.5) * uy);
  for (let r = 0, i = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
    const gx = (Q[r * cols + Math.min(cols - 1, c + 1)] - Q[r * cols + Math.max(0, c - 1)]) / (2 * ux);
    const gy = (Q[Math.min(rows - 1, r + 1) * cols + c] - Q[Math.max(0, r - 1) * cols + c]) / (2 * uy);
    G[i] = Math.max(1e-6, Math.hypot(gx, gy));
  }
  let qLo = Infinity, qHi = -Infinity;
  for (const q of Q) { qLo = Math.min(qLo, q); qHi = Math.max(qHi, q); }
  return { Q, G, frontAt: makeFront(qLo, qHi, Float32Array.from(G).sort()[N >> 1]) };
};

/** Paper wash: an offscreen COLS×ROWS image scaled onto `canvas[data-paper]`. */
const paperWash = (cv: HTMLCanvasElement | null, cols: number, rows: number, w: number, h: number) => {
  const ctx = cv?.getContext("2d");
  if (!cv || !ctx) return null;
  cv.width = w;
  cv.height = h;
  const bg = document.createElement("canvas");
  bg.width = cols;
  bg.height = rows;
  const bx = bg.getContext("2d");
  return bx ? { ctx, bg, img: bx.createImageData(cols, rows) } : null;
};

const points = (d: string): Point[] => {
  const v = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  return Array.from({ length: v.length >> 1 }, (_, k) => ({ x: v[2 * k], y: v[2 * k + 1] }));
};

/** The hero photos in PHOTOS order, decoded before the first build; a frame that fails is left out. */
const loadPhotos = async () => {
  const all = await Promise.all(
    PHOTOS.map(async ([, fy, name]): Promise<Photo | null> => {
      const src = PHOTO_FRAMES[name.toLowerCase()]?.src;
      if (!src) return null;
      const img = new Image();
      img.src = src;
      try {
        await img.decode();
        return { img, fy, name };
      } catch (error) {
        console.warn(`[field] photo ${src} failed to decode`, error);
        return null;
      }
    }),
  );
  return all.filter((p): p is Photo => p !== null);
};

const viewKey = () => `${innerWidth}x${innerHeight}@${Math.min(MAX_DPR, devicePixelRatio || 1)}`;

/**
 * The ASCII photo field on `canvas.fld` (R14 engine, M:298–467): WebGL2 when
 * available, 2D otherwise. Field pages (home, blog) draw the hero loop through
 * the shared ticker; it leaves the ticker while the tab is hidden, and under
 * reduced motion holds one static frame.
 */
export const createEngine = (root: HTMLElement, opts: { reducedMotion: boolean }): Engine => {
  const fld = root.querySelector<HTMLCanvasElement>("canvas.fld");
  if (!fld) throw new Error("createEngine: canvas.fld not found");
  const gl = fld.getContext("webgl2", GL_OPTS);
  const topCv = root.querySelector<HTMLCanvasElement>("canvas.top"), paperCv = root.querySelector<HTMLCanvasElement>("canvas[data-paper]");
  const curveEl = root.querySelector<SVGSVGElement>("svg[data-curve]");
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-paper-mono").trim() || "monospace";

  let photos: Photo[] | null = null, scene: Scene | null = null, page: { id: PageId; layer: HTMLElement } | null = null;
  let unsub: (() => void) | null = null, th = 0, shown = -1, dead = false, wave: Wave | null = null, lastWipeMs = 0;

  const buildScene = (ph: Photo[]): Scene => {
    const S = STAGES[innerWidth <= PHONE_MAX ? "phone" : "desk"], W = S.W, COLS = S.COLS, H = (W * innerHeight) / innerWidth;
    const dpr = Math.min(MAX_DPR, devicePixelRatio || 1), w = (fld.width = Math.round(innerWidth * dpr)), h = (fld.height = Math.round(innerHeight * dpr));
    const cw = w / COLS, ch = cw * ROW_ASPECT, ROWS = Math.ceil(h / ch), N = COLS * ROWS, ux = W / COLS, uy = (ch * H) / h;
    const cells = { cw, ch, aw: Math.ceil(cw) + 2, ah: Math.ceil(ch) + 2 };
    const T = new Float32Array(N), TH = new Float32Array(N).fill(th);
    for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) {
      const x = (c + 0.5) * ux, y = (r + 0.5) * uy;
      T[i] = clamp((((W - x) / W) * 0.55 + (y / H) * 0.45 - 0.12) / 0.76);
    }
    const atlases = THEMES.map((t) => buildAtlas(t, cells, family));
    const sink = (gl ? createGlBatch(gl, atlases, cells, N, TH) : create2dSink(fld, atlases, cells, TH)) ?? NO_SINK;
    if (sink === NO_SINK) console.error("[field] no renderer available");
    const lums = ph.map((p) => toLum(p.img, p.fy, COLS, ROWS, h / (ch * H), W, H, S.ART));
    const heroDist = makeSignedDist(sampleCurve(S.hero, HERO_SAMPLES), points(S.heroBelow));
    const hero = createHero({ cols: COLS, rows: ROWS, n: N, ux, uy, T }, heroDist, lums, performance.now());
    const { Q, G, frontAt } = curveField(S.curve, S.below, COLS, ROWS, ux, uy);
    if (topCv) { topCv.width = w; topCv.height = h; }
    return {
      key: viewKey(), sink, hero, TH, grid: { w, h, dpr, cols: COLS, rows: ROWS, cw, ch }, ko: S.ko, kn: new Map(),
      band: { cols: COLS, rows: ROWS, Q, G, T }, css: { cols: COLS, rows: ROWS, cw: cw / dpr, ch: ch / dpr, Q }, frontAt,
      top: (topCv && create2dSink(topCv, atlases, cells, TH)) ?? NO_SINK, paper: paperWash(paperCv, COLS, ROWS, w, h),
    };
  };

  /** The page's knockout, built once per scene from `layer`; null off field pages. */
  const knFor = (s: Scene, id: PageId, layer: HTMLElement) => {
    if (!isFieldPage(id)) return null;
    let kn = s.kn.get(id);
    if (!kn) s.kn.set(id, (kn = buildKnockout(layer, s.ko[id as "home" | "blog"], s.grid, blur)));
    return kn;
  };

  /** The paper wash riding the page front (M:478–482): accent over paper, alpha v, only while a wipe runs. */
  const washPaper = (s: Scene, pf: number | null) => {
    if (!s.paper) return;
    const { ctx, bg, img } = s.paper, px = img.data, A0 = THEMES[0].acc, A1 = THEMES[1].acc, { Q, G } = s.band;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (pf === null) return;
    for (let i = 0; i < Q.length; i++) {
      const u = (pf - Q[i]) / G[i], v = VEIL * smoothstep(-FZ, CORE / 2, u) * (1 - smoothstep(CORE / 2, CORE + FZ + TRAIL, u)), t = s.TH[i];
      for (let k = 0; k < 3; k++) px[i * 4 + k] = A0[k] + (A1[k] - A0[k]) * t;
      px[i * 4 + 3] = v * 255;
    }
    bg.getContext("2d")?.putImageData(img, 0, 0);
    ctx.drawImage(bg, 0, 0, s.grid.cols, s.grid.rows, 0, 0, s.grid.cols * s.grid.cw, s.grid.rows * s.grid.ch);
  };

  /** Curve opacity eases between the pages' visibilities as the front crosses it (M:486–487). */
  const curveAt = (wv: Wave | null, pf: number) => {
    if (!curveEl) return;
    if (!wv || !page) { curveEl.style.display = curveEl.style.opacity = ""; return; }
    const a = lineVis(wv.fromId), b = lineVis(page.id);
    const lineA = a + (b - a) * (a ? smoothstep(-FZ, CORE / 2, pf) : smoothstep(CORE / 2, CORE + FZ, pf));
    curveEl.style.display = "block";
    curveEl.style.opacity = String(lineA);
  };

  const finish = (now: number) => {
    const wv = wave;
    if (!wv) return;
    wave = null;
    lastWipeMs = now - wv.t0;
    paint(wv.from, null);
    paint(wv.to, null);
    if (scene) { scene.top.begin(); washPaper(scene, null); }
    curveAt(null, 0);
    wv.resolve();
  };

  const label = (s: Scene) => {
    const cur = s.hero.cur(), node = page?.id === "home" ? page.layer.querySelector(".edge")?.firstChild : null;
    if (!node || cur === shown || !photos?.[cur]) return;
    node.nodeValue = home.frameLabel(cur + 1, photos[cur].name);
    shown = cur;
  };

  const render = (now: number) => {
    if (!scene || !page) return;
    const done = !!wave && now - wave.t0 >= PAGE_MS;
    if (done) finish(now);
    const wv = wave, s = scene, kn = knFor(s, page.id, page.layer), ls: FieldLayer[] = [];
    if (!wv) { if (kn) ls.push([() => 1, kn]); }
    else {
      const pf = s.frontAt(Math.min(1, (now - wv.t0) / PAGE_MS)), { Q, G } = s.band, pu = (i: number) => (pf - Q[i]) / G[i];
      const vOut = (i: number) => 1 - smoothstep(-FZ, CORE / 2, pu(i)), vIn = (i: number) => smoothstep(CORE / 2, CORE + FZ, pu(i));
      if (wv.knFrom) ls.push([vOut, wv.knFrom]);
      if (kn) ls.push([vIn, kn]);
      washPaper(s, pf);
      curveAt(wv, pf);
      s.top.begin();
      drawBand(s.band, [pf], s.top.push);
      // no ghosting: the old page clears before the band core arrives, the new page appears once the core has passed
      paint(wv.from, vOut, [pu, -FZ, CORE / 2, true]);
      paint(wv.to, vIn, [pu, CORE / 2, CORE + FZ, false]);
    }
    s.sink.begin();
    if (ls.length) s.hero.draw(now, ls, s.sink.push);
    s.sink.end();
    label(s);
    if (done) sync();
  };

  /** Loop on the ticker only while a field page is visible and motion is allowed; otherwise draw once. */
  const sync = () => {
    if (!scene || dead) return;
    if (document.hidden && wave) finish(performance.now());
    const loop = !opts.reducedMotion && !document.hidden && !!page && (!!wave || isFieldPage(page.id));
    if (loop && !unsub) unsub = subscribeToTicker(render, () => 0);
    if (!loop && unsub) { unsub(); unsub = null; }
    if (!loop && !document.hidden) render(0);
  };

  const onVisibility = () => sync();
  document.addEventListener("visibilitychange", onVisibility);

  document.fonts
    .load(`${H1_WEIGHT} 20px ${family}`)
    .then(() => Promise.all(THEMES.map((t) => document.fonts.load(`${t.wt} 20px ${family}`))))
    .then(() => document.fonts.ready)
    .then(loadPhotos)
    .then((ph) => {
      if (dead) return;
      photos = ph;
      scene = buildScene(ph);
      sync();
    })
    .catch((error: unknown) => console.error("[field] engine failed to start", error));

  const setPage = (id: PageId, layer: HTMLElement) => {
    page = { id, layer };
    shown = -1;
    sync();
  };

  const settle = () => {
    if (!wave) return;
    finish(performance.now());
    sync();
  };

  /** Runs the 1.8s page wave from the `ghost` copy of the old page to `layer`; resolves when it has passed. */
  const wipe = (ghost: HTMLElement | null, layer: HTMLElement, id: PageId): Promise<void> => {
    settle();
    const s = scene, prev = page;
    if (opts.reducedMotion || document.hidden || !s || !ghost || !prev) {
      setPage(id, layer);
      return Promise.resolve();
    }
    const vp = new DOMRect(0, 0, innerWidth, innerHeight), to = prep(layer, vp, s.css);
    paint(to, () => 0);
    const knFrom = isFieldPage(prev.id) ? (s.kn.get(prev.id) ?? knFor(s, prev.id, ghost)) : null;
    return new Promise((resolve) => {
      wave = { t0: performance.now(), fromId: prev.id, from: prep(ghost, vp, s.css), to, knFrom, resolve };
      setPage(id, layer);
    });
  };

  return {
    renderer: gl ? "webgl2" : "2d",
    get ready() { return !!scene; },
    get lastWipeMs() { return lastWipeMs; },
    setPage,
    wipe,
    settle,
    toggleTheme: () => {
      th = 1 - th;
      scene?.TH.fill(th);
      if (!unsub) sync();
    },
    resize: () => {
      if (!photos || !scene || scene.key === viewKey()) return;
      settle();
      scene.sink.destroy();
      scene.top.destroy();
      scene = buildScene(photos);
      if (unsub) { unsub(); unsub = null; }
      sync();
    },
    destroy: () => {
      finish(performance.now());
      dead = true;
      unsub?.();
      unsub = null;
      scene?.sink.destroy();
      scene?.top.destroy();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
};
