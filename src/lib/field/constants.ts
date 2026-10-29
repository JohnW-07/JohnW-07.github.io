// Copied verbatim from docs/mockups/home/home-contact-r14.html — never retune.
import { hex, type RGB } from "./math";

export const W = 1600, H = 1000, COLS = 240, HUES = 32;
export const RAMP = " .,:;-~=+*xoa#%@", GLYPHS = "01<>/\\|_-=+*#%@", ALL = RAMP + GLYPHS;
export const CURVE = "M-80 640 C 260 620, 520 570, 800 540 C 1080 510, 1300 400, 1700 270";
export const HERO_CURVE = "M1660 -80 C 1250 120, 1290 470, 860 540 C 470 600, 330 790, -60 980";
export const PH_CURVE = "M-40 1180 C 160 1160, 320 1090, 400 990 C 470 900, 540 850, 640 830";
export const PH_HERO = "M680 -60 C 420 200, 520 520, 300 680 C 100 820, 160 1100, -60 1360";

// locked hero/toggle wave constants (design units, 1600 wide)
export const FZ = 46, BOLD = 0.8, SCAT = 64, NOISE_BAND = 90, CORE = 44, TRAIL = 22, BCORE = 2, BRAD = 6;
export const THEME_MS = 3500, PAGE_MS = 1800, VEIL = 0.1;

// knockout bubble [core, blur radius, edge fade] in columns, lerped by font size in columns
export const KO_SM: RGB = [1, 3, 2.5], KO_LG: RGB = [2, 5, 4.5], KO_FC: [number, number] = [2.5, 28];
export const HZA = 0.69, HZV = 0.75, HSWEEP = 3500, HHOLD = 2500, HBOLD = 0.48, GLOW = 18, BAMP = 0.06;

export const NOW_M = 14, LABEL_W = 16.5 * 16, GAP = 40;

/** [file, focus, original name] */
export const PHOTOS: [string, number, string][] = [
  ["ph-5.jpg", 0.5, "P8223146"], ["ph-4.jpg", 0.55, "P6189270"], ["ph-2.jpg", 0.6, "IMG_3628"],
  ["ph-3.jpg", 0.62, "P6147377"], ["ph-6.jpg", 0.38, "P8223358"], ["ph-1.jpg", 0.55, "IMG_1990"],
];

type ThemeSrc = { grad: string[]; wt: number; dim: number; paper: string; mid: string; mute: string; acc: string; grain: number };
export type Theme = Omit<ThemeSrc, "grad" | "paper" | "mid" | "mute" | "acc"> & { grad: RGB[]; paper: RGB; mid: RGB; mute: RGB; acc: RGB };

const THEME_SRC: ThemeSrc[] = [
  { grad: ["#4f8dff", "#3d5cf0", "#2131b0", "#0a1330"], wt: 720, dim: 0.9, paper: "#f7f8fc", mid: "#0a1330", mute: "#5d6b98", acc: "#3d5cf0", grain: 0.12 },
  { grad: ["#5472e4", "#9eb1ff", "#d6e1ff", "#f7f9ff"], wt: 800, dim: 1.2, paper: "#182449", mid: "#d6e1ff", mute: "#9eb1ff", acc: "#9eb1ff", grain: 0.09 },
];
export const THEMES: Theme[] = THEME_SRC.map((t) => ({
  ...t, grad: t.grad.map(hex), paper: hex(t.paper), mid: hex(t.mid), mute: hex(t.mute), acc: hex(t.acc),
}));

export type StageSpec = {
  W: number; H?: number; COLS: number; ART?: [number, number];
  curve: string; below: string; hero: string; heroBelow: string;
  ko: Record<"home" | "blog", string>;
};

const PH_BAR = ".bar > span:first-child, .bar .links > button, .bar .tg", FIELD_KO = ", .sub, .idx li, .foot";

export const STAGES: Record<"desk" | "phone", StageSpec> = {
  desk: {
    W, H, COLS, curve: CURVE, below: " L1700 1000 L-80 1000 Z", hero: HERO_CURVE, heroBelow: " L1660 980 L1660 -80 Z",
    ko: { home: ".bar > span, .chipl, .box, .edge", blog: ".bar > span" + FIELD_KO },
  },
  phone: {
    W: 600, COLS: 110, ART: [0.2, 0.74], curve: PH_CURVE, below: " L640 1360 L-40 1360 Z", hero: PH_HERO, heroBelow: " L680 1360 L680 -60 Z",
    ko: { home: PH_BAR + ", .chipl, .box, .edge", blog: PH_BAR + FIELD_KO },
  },
};
