/**
 * Fig. 01 for the VLA benchmarking case study.
 *
 * Two coverage matrices on the same axes. The left one is what the literature
 * hands you: every policy reports on whichever tasks its own paper picked, so
 * the cells that overlap between any two rows are few and comparing the
 * numbers in them is not really comparing anything. The right one is what the
 * harness produces, every policy against the whole suite through one
 * observation adapter.
 *
 * The pattern on the left is illustrative of the raggedness, not a record of
 * any particular paper's coverage. Nothing in this drawing is a score.
 */

const POLICIES = ["ACT", "DIFFUSION", "PI0", "SMOLVLA", "VQ-BET", "TDMPC"] as const;

/** Which cells the left matrix fills. Ragged on purpose. */
const PUBLISHED = [
  "1.1..1..",
  "..11...1",
  "1...1.1.",
  ".1..1..1",
  "11....1.",
  "...1.11.",
] as const;

const COLS = 8;
const CELL = 30;
const STEP = 36;
const TOP = 96;
const LEFT_X = 125;
const RIGHT_X = 558;

const mono = {
  fontFamily: "var(--font-mono-family)",
  letterSpacing: "0.1em",
} as const;

const cellX = (origin: number, c: number) => origin + c * STEP;
const cellY = (r: number) => TOP + r * STEP;

export const EvaluationMatrix = () => (
  <svg
    viewBox="0 0 891 386"
    className="w-full"
    role="img"
    aria-label="Two coverage matrices of six robot policies against eight tasks. On the left, labelled as published, each policy covers a scattered handful of tasks and few cells overlap between rows. An observation adapter sits between the two. On the right, labelled one harness, every policy covers every task."
  >
    {/* Neutral layer: rules, empty cells, the as-published state. */}
    <g className="text-ink-3" fill="none" stroke="currentColor">
      {POLICIES.map((policy, r) => (
        <text
          key={policy}
          x={112}
          y={cellY(r) + 20}
          textAnchor="end"
          fill="currentColor"
          stroke="none"
          fontSize={14}
          style={mono}
        >
          {policy}
        </text>
      ))}

      {PUBLISHED.map((row, r) =>
        row.split("").map((cell, c) => (
          <rect
            key={`p-${r}-${c}`}
            x={cellX(LEFT_X, c)}
            y={cellY(r)}
            width={CELL}
            height={CELL}
            fill={cell === "1" ? "currentColor" : "none"}
            fillOpacity={cell === "1" ? 0.5 : 0}
            strokeOpacity={cell === "1" ? 0 : 0.4}
          />
        )),
      )}

      <text x={LEFT_X} y={64} fill="currentColor" stroke="none" fontSize={13} style={mono}>
        AS PUBLISHED
      </text>
      <text x={LEFT_X} y={340} fill="currentColor" stroke="none" fontSize={13} style={mono}>
        WHICHEVER TASKS EACH PAPER CHOSE
      </text>
      <text x={LEFT_X} y={362} fill="currentColor" stroke="none" fontSize={13} style={mono} opacity={0.75}>
        TWO ROWS RARELY SHARE A CELL
      </text>
    </g>

    {/* Accent layer: the adapter, the complete matrix, the scoring bracket. */}
    <g stroke="currentColor" fill="none">
      {/* Adapter, with the flow through it. */}
      <path d="M420 210 h28" strokeWidth={1.5} />
      <path d="M441 205 l8 5 l-8 5 z" fill="currentColor" stroke="none" />
      <rect x={456} y={88} width={36} height={222} strokeWidth={1.5} />
      <text
        x={474}
        y={199}
        fill="currentColor"
        stroke="none"
        fontSize={13}
        textAnchor="middle"
        transform="rotate(-90 474 199)"
        style={mono}
      >
        OBSERVATION ADAPTER
      </text>
      <path d="M500 210 h30" strokeWidth={1.5} />
      <path d="M523 205 l8 5 l-8 5 z" fill="currentColor" stroke="none" />

      {POLICIES.map((policy, r) =>
        Array.from({ length: COLS }, (_, c) => (
          <rect
            key={`h-${policy}-${c}`}
            x={cellX(RIGHT_X, c)}
            y={cellY(r)}
            width={CELL}
            height={CELL}
            fill="currentColor"
            fillOpacity={0.78}
            stroke="none"
          />
        )),
      )}

      <text x={RIGHT_X} y={64} fill="currentColor" stroke="none" fontSize={13} style={mono}>
        ONE HARNESS
      </text>

      {/* Task ruler under the complete matrix. */}
      <path d={`M${RIGHT_X} 318 H${cellX(RIGHT_X, COLS - 1) + CELL}`} strokeWidth={1} opacity={0.6} />
      {Array.from({ length: COLS }, (_, c) => (
        <text
          key={`t-${c}`}
          x={cellX(RIGHT_X, c) + CELL / 2}
          y={334}
          fill="currentColor"
          stroke="none"
          fontSize={11}
          textAnchor="middle"
          opacity={0.75}
          style={mono}
        >
          {String(c + 1).padStart(2, "0")}
        </text>
      ))}
      <text x={RIGHT_X} y={362} fill="currentColor" stroke="none" fontSize={13} style={mono}>
        ROBOCASA TASK SUITE · SAME SCORING
      </text>
    </g>
  </svg>
);
