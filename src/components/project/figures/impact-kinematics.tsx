import { at, bell, step, trace, type TraceBox } from "@/components/project/figures/trace";

/**
 * Fig. 01 for the tackle-vision case study.
 *
 * A lifted pose on the left, and on the right the three quantities the
 * pipeline computes from one of its joints. The point of the drawing is the
 * bottom panel: velocity and acceleration both change smoothly enough that a
 * person scrubbing a video could argue about where the hit was, and jerk does
 * not, so the impact frame falls out of the signal rather than out of somebody
 * pausing at the right moment.
 *
 * The traces are schematic. They are the shape of the signal, not a recording.
 */

const BOX_X = 330;
const BOX_W = 600;
const PANEL_H = 100;
const IMPACT = 0.55;
const SAMPLES = 320;

const panels: readonly { label: string; y: number; fn: (t: number) => number }[] = [
  {
    label: "VELOCITY",
    y: 70,
    fn: (t) => 0.28 + 0.5 * step(t, 0.22, 14) - 0.62 * step(t, IMPACT, 45) + 0.16 * step(t, 0.72, 10),
  },
  {
    label: "ACCELERATION",
    y: 190,
    fn: (t) => 0.5 + 0.22 * bell(t, 0.28, 0.1) - 0.42 * bell(t, IMPACT, 0.026) + 0.12 * bell(t, 0.62, 0.05),
  },
  {
    label: "JERK",
    y: 310,
    fn: (t) =>
      0.5 +
      0.42 * bell(t, 0.528, 0.022) -
      0.46 * bell(t, 0.574, 0.022) +
      0.1 * bell(t, 0.63, 0.03) -
      0.06 * bell(t, 0.3, 0.06),
  },
];

/** Joint positions for the drawn pose, in viewBox units. */
const JOINTS = {
  head: [138, 112],
  neck: [138, 152],
  lSh: [108, 162],
  rSh: [170, 160],
  lEl: [78, 202],
  rEl: [200, 198],
  lWr: [64, 244],
  rWr: [222, 236],
  hip: [140, 250],
  lHi: [118, 254],
  rHi: [164, 252],
  lKn: [100, 316],
  rKn: [180, 318],
  lAn: [90, 380],
  rAn: [206, 374],
} as const;

type Joint = keyof typeof JOINTS;

const BONES: readonly (readonly [Joint, Joint])[] = [
  ["head", "neck"],
  ["neck", "lSh"],
  ["neck", "rSh"],
  ["lSh", "lEl"],
  ["lEl", "lWr"],
  ["rSh", "rEl"],
  ["rEl", "rWr"],
  ["neck", "hip"],
  ["hip", "lHi"],
  ["hip", "rHi"],
  ["lHi", "lKn"],
  ["lKn", "lAn"],
  ["rHi", "rKn"],
  ["rKn", "rAn"],
];

const mono = {
  fontFamily: "var(--font-mono-family)",
  letterSpacing: "0.1em",
} as const;

const skeleton = (dx: number, dy: number) =>
  BONES.map(([a, b]) => {
    const [ax, ay] = JOINTS[a];
    const [bx, by] = JOINTS[b];
    return `M${ax + dx} ${ay + dy} L${bx + dx} ${by + dy}`;
  }).join(" ");

const impactX = at({ x: BOX_X, y: 0, w: BOX_W, h: 0 }, IMPACT);

export const ImpactKinematics = () => (
  <svg
    viewBox="0 0 950 460"
    className="w-full"
    role="img"
    aria-label="A lifted three-dimensional pose skeleton on the left. On the right, three stacked traces for one joint over the frames of a play: velocity, acceleration and jerk. A marked vertical line shows the detected impact frame, where velocity falls, acceleration dips and jerk spikes sharply in both directions."
  >
    <g className="text-ink-3">
      {/* The 2D pose, and the lift offset behind it. */}
      <path d={skeleton(18, -12)} stroke="currentColor" strokeWidth={1} opacity={0.28} fill="none" />
      <path d={skeleton(0, 0)} stroke="currentColor" strokeWidth={1.6} fill="none" />
      {(Object.keys(JOINTS) as Joint[]).map((joint) => (
        <circle
          key={joint}
          cx={JOINTS[joint][0]}
          cy={JOINTS[joint][1]}
          r={3.5}
          fill="currentColor"
        />
      ))}
      <text x={20} y={424} fill="currentColor" fontSize={13} style={mono}>
        YOLOV8-POSE → VIDEOPOSE3D
      </text>
      <text x={20} y={446} fill="currentColor" fontSize={13} opacity={0.75} style={mono}>
        2D JOINTS LIFTED TO 3D
      </text>

      {/* Panels. */}
      {panels.map((panel) => (
        <g key={panel.label}>
          <rect
            x={BOX_X}
            y={panel.y}
            width={BOX_W}
            height={PANEL_H}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.35}
          />
          <line
            x1={BOX_X}
            y1={panel.y + PANEL_H / 2}
            x2={BOX_X + BOX_W}
            y2={panel.y + PANEL_H / 2}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeDasharray="2 5"
          />
          <text x={BOX_X} y={panel.y - 8} fill="currentColor" fontSize={13} style={mono}>
            {panel.label}
          </text>
        </g>
      ))}
      <text x={BOX_X + BOX_W} y={446} textAnchor="end" fill="currentColor" fontSize={13} style={mono}>
        FRAMES →
      </text>
    </g>

    {/* Accent layer: the tracked joint, the impact frame, the traces. */}
    <g stroke="currentColor" fill="none">
      <circle cx={JOINTS.head[0]} cy={JOINTS.head[1]} r={15} strokeWidth={1.5} />
      <path
        d={`M${JOINTS.head[0] + 18} ${JOINTS.head[1] - 4} L${BOX_X - 12} 96`}
        strokeWidth={1}
        strokeDasharray="3 4"
        opacity={0.7}
      />
      <text
        x={JOINTS.head[0] + 26}
        y={JOINTS.head[1] - 16}
        fill="currentColor"
        stroke="none"
        fontSize={13}
        style={mono}
      >
        TRACKED JOINT
      </text>

      <line
        x1={impactX}
        y1={54}
        x2={impactX}
        y2={418}
        strokeWidth={1.2}
        strokeDasharray="5 4"
      />
      <text
        x={impactX}
        y={40}
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize={13}
        style={mono}
      >
        IMPACT FRAME, DETECTED
      </text>

      {panels.map((panel) => {
        const box: TraceBox = { x: BOX_X, y: panel.y, w: BOX_W, h: PANEL_H };
        return (
          <polyline
            key={panel.label}
            points={trace(panel.fn, box, SAMPLES)}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  </svg>
);
