/**
 * Fig. 01 for the Terps Racing dashboard case study.
 *
 * Time to first frame, before and after, drawn on one axis so the two numbers
 * are compared by length rather than by reading them. The ruler underneath is
 * a second of the running system at 60 Hz, which is the rate the driver
 * actually sees once the screen is up.
 */

const AXIS_X = 120;
const AXIS_W = 820;
const SPAN_S = 22;
const px = (seconds: number) => AXIS_X + (seconds / SPAN_S) * AXIS_W;

const BEFORE_S = 20;
const AFTER_S = 5;
const FRAME_HZ = 60;

const mono = {
  fontFamily: "var(--font-mono-family)",
  letterSpacing: "0.1em",
} as const;

export const BootSequence = () => (
  <svg
    viewBox="0 0 1000 404"
    className="w-full"
    role="img"
    aria-label="A time axis in seconds. A long bar labelled before runs to about twenty seconds; a short bar labelled after stops under five. A dimension line above marks the seventy-five percent that was removed. Below, a ruler showing one second of the running dashboard divided into sixty frames."
  >
    <defs>
      <pattern id="boot-hatch" width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={8} stroke="currentColor" strokeWidth={1} strokeOpacity={0.45} />
      </pattern>
    </defs>

    <g className="text-ink-3">
      <text x={AXIS_X} y={52} fill="currentColor" fontSize={13} style={mono}>
        TIME TO FIRST FRAME
      </text>

      {/* Before. Hatched, because it is the state that was replaced. */}
      <rect
        x={AXIS_X}
        y={96}
        width={px(BEFORE_S) - AXIS_X}
        height={46}
        fill="url(#boot-hatch)"
        stroke="currentColor"
        strokeOpacity={0.55}
      />
      <text x={112} y={125} textAnchor="end" fill="currentColor" fontSize={14} style={mono}>
        BEFORE
      </text>
      <text x={px(BEFORE_S) + 12} y={125} fill="currentColor" fontSize={14} style={mono}>
        ≈20 S
      </text>

      {/* Axis. */}
      <line x1={AXIS_X} y1={252} x2={AXIS_X + AXIS_W} y2={252} stroke="currentColor" />
      {Array.from({ length: SPAN_S / 2 + 1 }, (_, i) => i * 2).map((s) => (
        <line
          key={s}
          x1={px(s)}
          y1={252}
          x2={px(s)}
          y2={s % 4 === 0 ? 264 : 258}
          stroke="currentColor"
        />
      ))}
      {Array.from({ length: SPAN_S / 4 + 1 }, (_, i) => i * 4).map((s) => (
        <text key={s} x={px(s)} y={282} textAnchor="middle" fill="currentColor" fontSize={12} style={mono}>
          {s}
        </text>
      ))}
      <text x={AXIS_X + AXIS_W} y={282} textAnchor="end" fill="currentColor" fontSize={12} style={mono}>
        SECONDS
      </text>

      {/* One second of the running system. */}
      <line x1={AXIS_X} y1={356} x2={AXIS_X + AXIS_W} y2={356} stroke="currentColor" />
      {Array.from({ length: FRAME_HZ + 1 }, (_, i) => (
        <line
          key={i}
          x1={AXIS_X + (i / FRAME_HZ) * AXIS_W}
          y1={356}
          x2={AXIS_X + (i / FRAME_HZ) * AXIS_W}
          y2={i % 10 === 0 ? 338 : 346}
          stroke="currentColor"
          strokeOpacity={i % 10 === 0 ? 0.9 : 0.5}
        />
      ))}
      <text x={AXIS_X} y={378} fill="currentColor" fontSize={13} style={mono}>
        ONE SECOND OF THE RUNNING DASHBOARD · 60 HZ · 16.7 MS PER FRAME
      </text>
    </g>

    <g stroke="currentColor" fill="none">
      {/* After. */}
      <rect x={AXIS_X} y={170} width={px(AFTER_S) - AXIS_X} height={46} fill="currentColor" fillOpacity={0.85} stroke="none" />
      <text x={112} y={199} textAnchor="end" fill="currentColor" stroke="none" fontSize={14} style={mono}>
        AFTER
      </text>
      <text x={px(AFTER_S) + 12} y={199} fill="currentColor" stroke="none" fontSize={14} style={mono}>
        UNDER 5 S
      </text>

      <line x1={px(AFTER_S)} y1={72} x2={px(AFTER_S)} y2={252} strokeDasharray="5 4" />

      {/* Dimension line over the part that went away. */}
      <line x1={px(AFTER_S)} y1={76} x2={px(BEFORE_S)} y2={76} />
      <path d={`M${px(AFTER_S) + 9} 71 l-9 5 l9 5 z`} fill="currentColor" stroke="none" />
      <path d={`M${px(BEFORE_S) - 9} 71 l9 5 l-9 5 z`} fill="currentColor" stroke="none" />
      <text
        x={(px(AFTER_S) + px(BEFORE_S)) / 2}
        y={62}
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize={13}
        style={mono}
      >
        75 % REMOVED
      </text>
    </g>
  </svg>
);
