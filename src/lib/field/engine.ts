import { home } from "@/data/home";
import { frames as PHOTO_FRAMES } from "@/data/photography";
import { subscribeToTicker } from "@/lib/animation/ticker";

import { buildAtlas, type GlyphSink } from "./atlas";
import { PHOTOS, STAGES, THEMES } from "./constants";
import { makeSignedDist, sampleCurve, type Point } from "./curve";
import { create2dSink } from "./draw2d";
import { createGlBatch } from "./gl-batch";
import { createHero, type FieldLayer } from "./hero";
import { buildKnockout, type KnockoutGrid } from "./knockout";
import { blur, toLum } from "./luminance";
import { clamp } from "./math";
import { isFieldPage, type PageId } from "./page-id";

export type Engine = {
  setPage: (id: PageId, layer: HTMLElement) => void;
  wipe: (ghost: HTMLElement | null, layer: HTMLElement, id: PageId) => Promise<void>;
  toggleTheme: () => void;
  resize: () => void;
  destroy: () => void;
  readonly renderer: "webgl2" | "2d";
};

const PHONE_MAX = 640, MAX_DPR = 2, ROW_ASPECT = 1.75, HERO_SAMPLES = 300, H1_WEIGHT = 800;
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
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-paper-mono").trim() || "monospace";

  let photos: Photo[] | null = null, scene: Scene | null = null, page: { id: PageId; layer: HTMLElement } | null = null;
  let unsub: (() => void) | null = null, th = 0, shown = -1, dead = false;

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
    return { key: viewKey(), sink, hero, TH, grid: { w, h, dpr, cols: COLS, rows: ROWS, cw, ch }, ko: S.ko, kn: new Map() };
  };

  const layers = (s: Scene): FieldLayer[] => {
    if (!page || !isFieldPage(page.id)) return [];
    const id = page.id as "home" | "blog";
    let kn = s.kn.get(id);
    if (!kn) s.kn.set(id, (kn = buildKnockout(page.layer, s.ko[id], s.grid, blur)));
    return [[() => 1, kn]];
  };

  const label = (s: Scene) => {
    const cur = s.hero.cur(), node = page?.id === "home" ? page.layer.querySelector(".edge")?.firstChild : null;
    if (!node || cur === shown || !photos?.[cur]) return;
    node.nodeValue = home.frameLabel(cur + 1, photos[cur].name);
    shown = cur;
  };

  const render = (now: number) => {
    if (!scene) return;
    const ls = layers(scene);
    scene.sink.begin();
    if (ls.length) scene.hero.draw(now, ls, scene.sink.push);
    scene.sink.end();
    label(scene);
  };

  /** Loop on the ticker only while a field page is visible and motion is allowed; otherwise draw once. */
  const sync = () => {
    if (!scene || dead) return;
    const loop = !opts.reducedMotion && !document.hidden && !!page && isFieldPage(page.id);
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

  return {
    renderer: gl ? "webgl2" : "2d",
    setPage,
    wipe: (_ghost, layer, id) => {
      setPage(id, layer);
      return Promise.resolve();
    },
    toggleTheme: () => {
      th = 1 - th;
      scene?.TH.fill(th);
      if (!unsub) sync();
    },
    resize: () => {
      if (!photos || !scene || scene.key === viewKey()) return;
      scene.sink.destroy();
      scene = buildScene(photos);
      if (unsub) { unsub(); unsub = null; }
      sync();
    },
    destroy: () => {
      dead = true;
      unsub?.();
      unsub = null;
      scene?.sink.destroy();
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
};
