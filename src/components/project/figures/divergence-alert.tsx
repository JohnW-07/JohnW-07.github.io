import { at, step, trace, type TraceBox } from "@/components/project/figures/trace";

/**
 * Fig. 01 for the Cherry Canary case study.
 *
 * The top half is why the device exists: breathing rate pulls away from heart
 * rate, the rule fires on that gap, and blood oxygen does not move until
 * later. The bottom half is where the model ended up, which is outside the
 * dashed boundary. Everything that decides something is deterministic.
 *
 * The traces are schematic. They are the shape of the signals, not a recording.
 */

const AXIS_X = 130;
const AXIS_W = 740;
const ALERT_T = 0.62;
const DROP_T = 0.86;

const rateBox: TraceBox = { x: AXIS_X, y: 66, w: AXIS_W, h: 170 };
const spo2Box: TraceBox = { x: AXIS_X, y: 262, w: AXIS_W, h: 110 };

const breathing = (t: number) => 0.42 + 0.03 * Math.sin(t * 26) + 0.44 * step(t, 0.52, 12);
const heart = (t: number) => 0.4 + 0.025 * Math.sin(t * 26 + 1) + 0.1 * step(t, 0.6, 8);
/** Steep on purpose: a gradual slope would put the marker mid-fall and blur the lead. */
const spo2 = (t: number) => 0.78 - 0.55 * step(t, DROP_T, 55);

/** Region between the two rate traces. Thin while they track, wide once they do not. */
const divergenceBand = [
  trace(breathing, rateBox, 200),
  trace(heart, rateBox, 200).split(" ").reverse().join(" "),
].join(" ");

const chainRow = (label: string, x: number, w: number, y: number) => ({ label, x, w, y });

const CHAIN = [
  chainRow("MPU-6050", 24, 112, 486),
  chainRow("LOW-PASS FILTER", 160, 132, 486),
  chainRow("BREATHING RATE", 316, 124, 486),
  chainRow("MAX30102", 24, 112, 530),
  chainRow("PEAK DETECT", 160, 132, 530),
  chainRow("HEART RATE", 316, 124, 530),
] as const;

const ROW_H = 36;

const mono = {
  fontFamily: "var(--font-mono-family)",
  letterSpacing: "0.1em",
} as const;

const alertX = at(rateBox, ALERT_T);
const dropX = at(rateBox, DROP_T);

export const DivergenceAlert = () => (
  <svg
    viewBox="0 0 1000 596"
    className="w-full"
    role="img"
    aria-label="Above, breathing rate and heart rate track each other and then separate; a marked line shows where the rule fires on that gap. Blood oxygen, plotted below, does not fall until noticeably later. Beneath the plots, a signal chain: accelerometer through a low-pass filter to breathing rate, pulse oximeter through peak detection to heart rate, both into a divergence rule and an alert. A dashed boundary labelled detection path encloses everything up to the alert; Gemini sits outside it and writes the plain-language message."
  >
    <g className="text-ink-3">
      <text x={AXIS_X} y={56} fill="currentColor" fontSize={13} style={mono}>
        RATES, NORMALIZED
      </text>

      <rect
        x={rateBox.x}
        y={rateBox.y}
        width={rateBox.w}
        height={rateBox.h}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <rect
        x={spo2Box.x}
        y={spo2Box.y}
        width={spo2Box.w}
        height={spo2Box.h}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
      />

      <polyline points={trace(heart, rateBox, 200)} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <polyline points={trace(spo2, spo2Box, 220)} fill="none" stroke="currentColor" strokeWidth={1.6} />

      <text x={878} y={152} fill="currentColor" fontSize={12} style={mono}>
        HEART
      </text>
      <text x={878} y={351} fill="currentColor" fontSize={12} style={mono}>
        SpO2
      </text>

      <line x1={dropX} y1={250} x2={dropX} y2={410} stroke="currentColor" strokeDasharray="4 4" />
      <text x={dropX} y={244} textAnchor="middle" fill="currentColor" fontSize={13} style={mono}>
        SpO2 DROPS
      </text>

      {/* Time axis. */}
      <line x1={AXIS_X} y1={410} x2={AXIS_X + AXIS_W} y2={410} stroke="currentColor" />
      <text x={AXIS_X + AXIS_W} y={430} textAnchor="end" fill="currentColor" fontSize={12} style={mono}>
        TIME →
      </text>

      <line x1={14} y1={452} x2={986} y2={452} stroke="currentColor" strokeOpacity={0.5} />

      {/* Signal chain. */}
      {CHAIN.map((box, i) => (
        <g key={box.label}>
          <rect x={box.x} y={box.y} width={box.w} height={ROW_H} fill="none" stroke="currentColor" strokeOpacity={0.7} />
          <text
            x={box.x + box.w / 2}
            y={box.y + 23}
            textAnchor="middle"
            fill="currentColor"
            fontSize={11}
            style={mono}
          >
            {box.label}
          </text>
          {i % 3 < 2 ? (
            <>
              <line x1={box.x + box.w} y1={box.y + 18} x2={CHAIN[i + 1].x - 8} y2={box.y + 18} stroke="currentColor" />
              <path d={`M${CHAIN[i + 1].x - 9} ${box.y + 13} l8 5 l-8 5 z`} fill="currentColor" />
            </>
          ) : null}
        </g>
      ))}

      {/* Both branches join the rule. */}
      <path
        d="M440 504 H462 V526 H470 M440 548 H462 V526"
        fill="none"
        stroke="currentColor"
      />
      <path d="M469 521 l8 5 l-8 5 z" fill="currentColor" />
    </g>

    {/* Accent layer: breathing, the rule, and everything it triggers. */}
    <g stroke="currentColor" fill="none">
      <polygon points={divergenceBand} fill="currentColor" fillOpacity={0.12} stroke="none" />
      <polyline points={trace(breathing, rateBox, 200)} strokeWidth={1.8} />
      <text x={878} y={94} fill="currentColor" stroke="none" fontSize={12} style={mono}>
        BREATHING
      </text>

      <line x1={alertX} y1={52} x2={alertX} y2={410} strokeDasharray="5 4" strokeWidth={1.2} />
      <text x={alertX} y={44} textAnchor="middle" fill="currentColor" stroke="none" fontSize={13} style={mono}>
        RULE FIRES
      </text>

      {/* How much earlier. Deliberately undimensioned; no number was measured. */}
      <line x1={alertX} y1={394} x2={dropX} y2={394} strokeOpacity={0.8} />
      <path d={`M${alertX + 9} 389 l-9 5 l9 5 z`} fill="currentColor" stroke="none" />
      <path d={`M${dropX - 9} 389 l9 5 l-9 5 z`} fill="currentColor" stroke="none" />
      <text
        x={(alertX + dropX) / 2}
        y={386}
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize={12}
        style={mono}
      >
        LEAD
      </text>

      <rect x={478} y={506} width={132} height={40} strokeWidth={1.4} />
      <text x={544} y={531} textAnchor="middle" fill="currentColor" stroke="none" fontSize={11} style={mono}>
        DIVERGENCE RULE
      </text>
      <line x1={610} y1={526} x2={626} y2={526} />
      <path d="M625 521 l8 5 l-8 5 z" fill="currentColor" stroke="none" />
      <rect x={634} y={506} width={96} height={40} fill="currentColor" fillOpacity={0.9} stroke="none" />
      <text x={682} y={531} textAnchor="middle" className="text-paper" fill="currentColor" stroke="none" fontSize={11} style={mono}>
        ALERT
      </text>

      <rect x={14} y={474} width={734} height={104} strokeDasharray="6 5" strokeOpacity={0.7} />
      <text x={14} y={468} fill="currentColor" stroke="none" fontSize={12} style={mono}>
        DETECTION PATH · NO MODEL, SO IT CAN BE TESTED
      </text>

      <line x1={748} y1={526} x2={772} y2={526} />
      <path d="M771 521 l8 5 l-8 5 z" fill="currentColor" stroke="none" />
      <rect x={782} y={506} width={206} height={40} strokeOpacity={0.7} />
      <text x={885} y={531} textAnchor="middle" fill="currentColor" stroke="none" fontSize={11} style={mono}>
        GEMINI · WRITES THE ALERT
      </text>
    </g>
  </svg>
);
