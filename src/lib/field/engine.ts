import { home } from "@/data/home";
import { frames as PHOTO_FRAMES } from "@/data/photography";
import { subscribeToTicker } from "@/lib/animation/ticker";

import { buildAtlas, type GlyphSink } from "./atlas";
import { drawBand, type BandGrid } from "./band";
import { CORE, FZ, PAGE_MS, PHOTOS, SCAT, STAGES, THEME_MS, THEMES, TRAIL, VEIL } from "./constants";
import { makeSignedDist, sampleCurve, type Point } from "./curve";
import { create2dSink } from "./draw2d";
import { makeFront } from "./front";
import { createGlBatch } from "./gl-batch";
import { createHero, type FieldLayer } from "./hero";
import { buildKnockout, type KnockoutGrid } from "./knockout";
import { blur, toLum } from "./luminance";
import { paint, prep, tint, type CellGrid, type Item } from "./masks";
import { clamp, hash, smoothstep } from "./math";
import { isFieldPage, zoneOf, type PageId } from "./page-id";
import { createThemeQueue, ZONE_THEMES, type Theme } from "./theme-queue";

export type Engine = {
  setPage: (id: PageId, layer: HTMLElement) => void;
  /** Starts the page wave on the click, from the frozen `ghost`, before the route commits. */
  launch: (ghost: HTMLElement) => void;
  wipe: (ghost: HTMLElement | null, layer: HTMLElement, id: PageId) => Promise<void>;
  /** Flips the current zone's theme; returns the theme it now wants. */
  toggleTheme: () => Theme;
  /** The current zone's wanted theme (the toggle label). */
  readonly want: Theme;
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

/** A page wave whose route has not committed by then gives up and puts the old page back. */
const NAV_STALL_MS = 10_000;
const PHONE_MAX = 640, MAX_DPR = 2, ROW_ASPECT = 1.75, HERO_SAMPLES = 300, CURVE_SAMPLES = 800, H1_WEIGHT = 800;
const GL_OPTS: WebGLContextAttributes = { premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: process.env.NEXT_PUBLIC_E2E === "1" };
const NO_SINK: GlyphSink = { push: () => {}, begin: () => {}, end: () => {}, destroy: () => {} };

type Photo = { img: HTMLImageElement; fy: number; name: string };

type Scene = {
  key: string;
  sink: GlyphSink;
  hero: ReturnType<typeof createHero>;
  /** Per-cell theme: TH for glyphs (scattered), BT for paper and text, S_* where the running theme wave started. */
  TH: Float32Array;
  BT: Float32Array;
  S_TH: Float32Array;
  S_BT: Float32Array;
  grid: KnockoutGrid;
  ko: Record<"home" | "blog", string>;
  kn: Map<PageId, Float32Array>;
  band: BandGrid;
  css: CellGrid;
  frontAt: (p: number) => number;
  top: GlyphSink;
  paper: { ctx: CanvasRenderingContext2D; bg: HTMLCanvasElement; img: ImageData } | null;
};

/** A running page wipe: the old page's leaves fade ahead of the band core, the new page's behind it (`to` is null until the route commits). */
type Wave = {
  t0: number; fromId: PageId; ghost: HTMLElement; from: Item[]; to: Item[] | null; knFrom: Float32Array | null; done: Promise<void>; resolve: () => void;
};

/** A running theme wave toward `queue.to`. */
type ThemeWave = { ts: number; dur: number };

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

const viewport = () => new DOMRect(0, 0, innerWidth, innerHeight);
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
  const curveEl = root.querySelector<SVGSVGElement>("svg[data-curve]"), grainEl = root.querySelector<SVGSVGElement>("svg.grain");
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-paper-mono").trim() || "monospace";

  let photos: Photo[] | null = null, scene: Scene | null = null, page: { id: PageId; layer: HTMLElement } | null = null;
  let unsub: (() => void) | null = null, th: Theme = 0, shown = -1, dead = false, wave: Wave | null = null, lastWipeMs = 0;
  const queue = createThemeQueue(ZONE_THEMES);
  let tw: ThemeWave | null = null, themeItems: Item[] | null = null;

  const buildScene = (ph: Photo[]): Scene => {
    const S = STAGES[innerWidth <= PHONE_MAX ? "phone" : "desk"], W = S.W, COLS = S.COLS, H = (W * innerHeight) / innerWidth;
    const dpr = Math.min(MAX_DPR, devicePixelRatio || 1), w = (fld.width = Math.round(innerWidth * dpr)), h = (fld.height = Math.round(innerHeight * dpr));
    const cw = w / COLS, ch = cw * ROW_ASPECT, ROWS = Math.ceil(h / ch), N = COLS * ROWS, ux = W / COLS, uy = (ch * H) / h;
    const cells = { cw, ch, aw: Math.ceil(cw) + 2, ah: Math.ceil(ch) + 2 };
    const T = new Float32Array(N), [TH, BT, S_TH, S_BT] = [0, 1, 2, 3].map(() => new Float32Array(N).fill(th));
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
      key: viewKey(), sink, hero, TH, BT, S_TH, S_BT, grid: { w, h, dpr, cols: COLS, rows: ROWS, cw, ch }, ko: S.ko, kn: new Map(),
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

  /**
   * The paper canvas (M:476–482): opaque paper lerped by BT while the theme moves, plus the accent wash riding the
   * page front. Idle, it is clear and `html` paints the paper.
   */
  const washPaper = (s: Scene, pf: number | null) => {
    if (!s.paper) return;
    const { ctx, bg, img } = s.paper, px = img.data, { Q, G } = s.band, opaque = !!tw;
    const P0 = THEMES[0].paper, P1 = THEMES[1].paper, A0 = THEMES[0].acc, A1 = THEMES[1].acc;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (pf === null && !opaque) return;
    for (let i = 0; i < Q.length; i++) {
      const u = pf === null ? -Infinity : (pf - Q[i]) / G[i], v = VEIL * smoothstep(-FZ, CORE / 2, u) * (1 - smoothstep(CORE / 2, CORE + FZ + TRAIL, u)), t = s.BT[i];
      for (let k = 0; k < 3; k++) {
        const a = A0[k] + (A1[k] - A0[k]) * t, p = P0[k] + (P1[k] - P0[k]) * t;
        px[i * 4 + k] = opaque ? p + (a - p) * v : a;
      }
      px[i * 4 + 3] = opaque ? 255 : v * 255;
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
    if (wv.to) paint(wv.to, null);
    if (page) page.layer.style.visibility = "";
    themeItems = tw ? wv.to : null;
    if (scene) { scene.top.begin(); washPaper(scene, null); }
    curveAt(null, 0);
    wv.resolve();
  };

  /** The leaves the theme colours: the wave's two pages, or the current one. */
  const tintSets = () => (wave ? [wave.from, wave.to ?? []] : themeItems ? [themeItems] : []);

  /** Lands the theme wave: the stylesheet takes over, then a queued follow-up pass starts (M:469). */
  const finishTheme = (now: number) => {
    if (!tw) return;
    tw = null;
    th = queue.to;
    if (scene) for (const a of [scene.TH, scene.BT, scene.S_TH, scene.S_BT]) a.fill(th);
    document.documentElement.dataset.theme = th ? "dark" : "light";
    if (queue.onWipeEnd()) { startTheme(now, THEME_MS); return; }
    for (const items of tintSets()) tint(items, null);
    themeItems = null;
    if (grainEl) grainEl.style.opacity = "";
    if (scene) { scene.top.begin(); washPaper(scene, null); }
  };

  /** Starts a theme wave to `queue.to` over `dur` ms (M:520, M:394); lands at once when nothing can animate. */
  const startTheme = (now: number, dur: number) => {
    const s = scene;
    tw = { ts: now, dur };
    if (!s || !page || dur <= 0 || dead || opts.reducedMotion || document.hidden) { finishTheme(now); return; }
    s.S_TH.set(s.TH);
    s.S_BT.set(s.BT);
    if (!wave) themeItems = prep(page.layer, viewport(), s.css);
    sync();
  };

  /** Steps TH (scattered, for glyphs) and BT (for paper and text) behind the theme front (M:470–473). */
  const themeFront = (s: Scene, now: number) => {
    if (!tw) return null;
    const tf = s.frontAt(clamp((now - tw.ts) / tw.dur)), { Q, G } = s.band, to = queue.to;
    for (let i = 0; i < Q.length; i++) {
      const uu = (tf - Q[i]) / G[i];
      s.TH[i] = s.S_TH[i] + (to - s.S_TH[i]) * smoothstep(-FZ, CORE + FZ, uu + (hash(i, 0) - 0.5) * SCAT);
      s.BT[i] = s.S_BT[i] + (to - s.S_BT[i]) * smoothstep(-FZ, CORE + FZ, uu);
    }
    return tf;
  };

  const label = (s: Scene) => {
    const cur = s.hero.cur(), node = page?.id === "home" ? page.layer.querySelector(".edge")?.firstChild : null;
    if (!node || cur === shown || !photos?.[cur]) return;
    node.nodeValue = home.frameLabel(cur + 1, photos[cur].name);
    shown = cur;
  };

  const render = (now: number) => {
    if (!scene || !page) return;
    const themeDone = !!tw && now - tw.ts >= tw.dur;
    if (themeDone) finishTheme(now);
    // until the new page attaches, the wave holds with the old page cleared; a route that never commits gives up
    const age = wave ? now - wave.t0 : 0, stalled = !!wave && !wave.to && age >= NAV_STALL_MS;
    if (stalled) wave!.ghost.remove();
    const done = !!wave && age >= PAGE_MS && (!!wave.to || stalled);
    if (done) finish(now);
    const wv = wave, s = scene, kn = knFor(s, page.id, page.layer), ls: FieldLayer[] = [], tf = themeFront(s, now);
    const fronts = tf === null ? [] : [tf];
    let pf: number | null = null;
    if (!wv) { if (kn) ls.push([() => 1, kn]); }
    else {
      const f = (pf = s.frontAt(Math.min(1, (now - wv.t0) / PAGE_MS))), { Q, G } = s.band, pu = (i: number) => (f - Q[i]) / G[i];
      const vOut = (i: number) => 1 - smoothstep(-FZ, CORE / 2, pu(i)), vIn = (i: number) => smoothstep(CORE / 2, CORE + FZ, pu(i));
      if (wv.knFrom) ls.push([vOut, wv.knFrom]);
      if (kn && wv.to) ls.push([vIn, kn]);
      curveAt(wv, f);
      fronts.push(f);
      // no ghosting: the old page clears before the band core arrives, the new page appears once the core has passed
      paint(wv.from, vOut, [pu, -FZ, CORE / 2, true]);
      if (wv.to) paint(wv.to, vIn, [pu, CORE / 2, CORE + FZ, false]);
    }
    if (tw) {
      for (const items of tintSets()) tint(items, s.BT);
      const g0 = THEMES[0].grain, bt = s.BT[s.BT.length >> 1];
      if (grainEl) grainEl.style.opacity = String(g0 + (THEMES[1].grain - g0) * bt);
    }
    if (fronts.length) {
      washPaper(s, pf);
      s.top.begin();
      drawBand(s.band, fronts, s.top.push);
    }
    s.sink.begin();
    if (ls.length) s.hero.draw(now, ls, s.sink.push);
    s.sink.end();
    label(s);
    if (done || themeDone) sync();
  };

  /** Loop on the ticker only while a field page is visible and motion is allowed; otherwise draw once. */
  const sync = () => {
    if (!scene || dead) return;
    if (document.hidden && wave) finish(performance.now());
    if (document.hidden && tw) finishTheme(performance.now());
    const loop = !opts.reducedMotion && !document.hidden && !!page && (!!wave || !!tw || isFieldPage(page.id));
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
    queue.enter(zoneOf(id));
    // the zone's theme rides the page wave when no theme wave is running (M:394)
    if (!tw && queue.to !== th) startTheme(wave?.t0 ?? performance.now(), wave ? PAGE_MS : 0);
    sync();
  };

  const settle = () => {
    if (!wave) return;
    finish(performance.now());
    sync();
  };

  /** Starts the 1.8s page wave from the `ghost` copy of the old page; the live layer hides behind its copy until `wipe` attaches the new page. */
  const launch = (ghost: HTMLElement) => {
    settle();
    const s = scene, prev = page;
    if (opts.reducedMotion || document.hidden || !s || !prev) return;
    const knFrom = isFieldPage(prev.id) ? (s.kn.get(prev.id) ?? knFor(s, prev.id, ghost)) : null;
    let resolve = () => {};
    const done = new Promise<void>((r) => (resolve = r));
    wave = { t0: performance.now(), fromId: prev.id, ghost, from: prep(ghost, viewport(), s.css), to: null, knFrom, done, resolve };
    prev.layer.style.visibility = "hidden";
    sync();
  };

  /** Brings `layer` in behind the wave launched from `ghost` (launching it now if the click did not); resolves when it has passed. */
  const wipe = (ghost: HTMLElement | null, layer: HTMLElement, id: PageId): Promise<void> => {
    if (ghost && (wave?.ghost !== ghost || wave.to)) launch(ghost);
    const wv = wave, s = scene;
    if (!ghost || !wv || wv.ghost !== ghost || !s) {
      settle();
      setPage(id, layer);
      return Promise.resolve();
    }
    layer.style.visibility = "";
    const to = prep(layer, viewport(), s.css);
    paint(to, () => 0);
    // a route that committed after the wave ran out sweeps in over the already cleared field
    const now = performance.now(), late = now - wv.t0 >= PAGE_MS;
    wave = late ? { ...wv, to, t0: now, from: [], knFrom: null } : { ...wv, to };
    setPage(id, layer);
    return wv.done;
  };

  return {
    renderer: gl ? "webgl2" : "2d",
    get ready() { return !!scene; },
    get lastWipeMs() { return lastWipeMs; },
    setPage,
    launch,
    wipe,
    settle,
    get want() { return queue.want; },
    toggleTheme: () => {
      if (queue.toggle()) startTheme(performance.now(), THEME_MS);
      return queue.want;
    },
    resize: () => {
      if (!photos || !scene || scene.key === viewKey()) return;
      settle();
      scene.sink.destroy();
      scene.top.destroy();
      scene = buildScene(photos);
      // a running theme wave carries on in the new scene (it started from uniform `th`); re-measure its leaves
      if (tw && page) themeItems = prep(page.layer, viewport(), scene.css);
      if (unsub) { unsub(); unsub = null; }
      sync();
    },
    destroy: () => {
      dead = true;
      finishTheme(performance.now());
      finish(performance.now());
      unsub?.();
      unsub = null;
      scene?.sink.destroy();
      scene?.top.destroy();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
};
