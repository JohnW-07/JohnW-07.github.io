import type { Metric } from "@/data/types";

/** "75%", "60 Hz", "0.658": a metric's value with its unit. */
export const metricValue = ({ value, unit }: Metric) => (unit ? `${value}${unit === "%" ? "" : " "}${unit}` : value);

/** "May 2026 – Aug 2026" → "May – Aug 2026": a same-year period keeps one year. */
export const shortPeriod = (period: string) => period.replace(/^(\w+) (\d{4}) – (\w+) \2$/, "$1 – $3 $2");
