/** Months since `origin` (ISO `YYYY-MM`): tick 2025 at 0, 2026 at 5, now at NOW_M. */
export const monthIndex = (iso: string, origin = "2025-08") => {
  const [y, m] = iso.split("-").map(Number);
  const [oy, om] = origin.split("-").map(Number);
  return (y - oy) * 12 + (m - om);
};

export const xAt = (m: number) => 80 + 96 * m;
