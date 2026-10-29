import { WipeLink } from "@/components/stage/wipe-link";
import type { Project } from "@/data/types";
import { CURVE, GAP, LABEL_W } from "@/lib/field/constants";
import { sampleCurve, yAt } from "@/lib/field/curve";
import { monthIndex, xAt } from "@/lib/field/timeline";
import { u } from "@/lib/field/units";
import { metricValue } from "@/lib/format";

const PTS = sampleCurve(CURVE, 800);
const curveY = (x: number) => yAt(PTS, x);

/** One project on the curve (M:167–171): label starts at its month and clears the line across its width. */
export const TimelineEntry = ({ p }: { p: Project }) => {
  const x = xAt(monthIndex(p.start)), y = curveY(x), up = p.discipline === "research";
  const edge = (up ? Math.min : Math.max)(y, curveY(x + LABEL_W));
  const top = up ? edge - GAP : edge + GAP;
  const m = p.metrics[0];
  return (
    <article
      className="pj ko"
      data-kind={up ? "research" : "engineering"}
      style={{ left: u(x), top: u(top), transform: up ? "translateY(-100%)" : undefined }}
    >
      <pre className="pd" data-c="mute">{p.period.toUpperCase()}</pre>
      <h2 className="t" data-c="mid">
        <WipeLink href={`/work/${p.slug}`}>{p.title}</WipeLink>
      </h2>
      <p data-c="mid">
        {p.role} <span data-c="mute">· {p.org}</span>
      </p>
      {m && <p data-c="acc">{`${metricValue(m)} ${m.label}`}</p>}
      <i className="ld" data-p="mute" style={{ top: up ? "100%" : u(y - top), height: u(Math.abs(y - top)) }} />
      <i className="node" data-p="acc" style={{ top: up ? `calc(100% + ${u(y - top)})` : u(y - top) }} />
    </article>
  );
};

/** Year tick and label on the curve (M:172–173). */
export const Tick = ({ m, text, c }: { m: number; text: string; c: string }) => {
  const x = xAt(m), y = curveY(x);
  return (
    <>
      <i className="tk" data-p={c} style={{ left: u(x), top: u(y) }} />
      <pre className="lab" data-c={c} style={{ left: u(x), top: u(y + 16) }}>{text}</pre>
    </>
  );
};
