import type { Metric } from "@/data/types";

/** "75%", "60 Hz", "0.658": a metric's value with its unit. */
export const metricValue = ({ value, unit }: Metric) => (unit ? `${value}${unit === "%" ? "" : " "}${unit}` : value);
