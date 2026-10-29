export type Point = { x: number; y: number };

const PIECES = 64;

const cubic = (a: number, b: number, c: number, d: number, t: number) => {
  const s = 1 - t;
  return s * s * s * a + 3 * s * s * t * b + 3 * s * t * t * c + t * t * t * d;
};

/** Arc-length resample of an `M x y C … C …` path into `n` evenly spaced points. */
export const sampleCurve = (d: string, n: number): Point[] => {
  const v = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const poly: Point[] = [{ x: v[0], y: v[1] }];
  for (let i = 2; i + 5 < v.length; i += 6) {
    const p0 = poly[poly.length - 1];
    for (let k = 1; k <= PIECES; k++) {
      const t = k / PIECES;
      poly.push({ x: cubic(p0.x, v[i], v[i + 2], v[i + 4], t), y: cubic(p0.y, v[i + 1], v[i + 3], v[i + 5], t) });
    }
  }
  const cum = [0];
  for (let i = 1; i < poly.length; i++) cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].y - poly[i - 1].y));
  const L = cum[cum.length - 1];
  let j = 1;
  return Array.from({ length: n }, (_, i) => {
    const s = (L * i) / (n - 1);
    while (j < poly.length - 1 && cum[j] < s) j++;
    const f = (s - cum[j - 1]) / (cum[j] - cum[j - 1] || 1);
    return { x: poly[j - 1].x + (poly[j].x - poly[j - 1].x) * f, y: poly[j - 1].y + (poly[j].y - poly[j - 1].y) * f };
  });
};

export const nearestDist = (pts: Point[], x: number, y: number) => {
  let best = 1e9;
  for (const p of pts) best = Math.min(best, (p.x - x) ** 2 + (p.y - y) ** 2);
  return Math.sqrt(best);
};

/** Even-odd ray cast. */
export const pointInPolygon = (poly: Point[], x: number, y: number) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};

/** Distance to the curve, positive inside the region `pts ++ closing` (M:155–156). */
export const makeSignedDist = (pts: Point[], closing: Point[]) => {
  const poly = [...pts, ...closing];
  return (x: number, y: number) => nearestDist(pts, x, y) * (pointInPolygon(poly, x, y) ? 1 : -1);
};

export const yAt = (pts: Point[], x: number) =>
  pts.reduce((b, p) => (Math.abs(p.x - x) < Math.abs(b.x - x) ? p : b)).y;
