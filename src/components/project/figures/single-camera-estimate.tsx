/**
 * Fig. 01 for the ArmToPoint case study.
 *
 * Drawn as an orthographic sheet rather than a diagram, because the thing
 * being described is a geometric claim: one camera, one frame, a position, and
 * a tolerance around it. A depth sensor would put a second ray into this
 * drawing. There is only one.
 */

const LENS_X = 168;
const AXIS_Y = 250;
const FAR_X = 860;
const HALF_H = 130;

const POINT_X = 680;
const POINT_Y = 210;
const ERROR_R = 40;

const mono = {
  fontFamily: "var(--font-mono-family)",
  letterSpacing: "0.1em",
} as const;

/**
 * Knocks the plate colour out behind a label so the geometry appears to break
 * around it, which is what a drafting program does with dimension text.
 */
const halo = {
  ...mono,
  paintOrder: "stroke",
  stroke: "var(--paper-2)",
  strokeWidth: 7,
  strokeLinejoin: "round",
} as const;

const stage = (label: string, x: number, w: number) => ({ label, x, w });

const PIPELINE = [
  stage("MUJOCO RENDER", 40, 168),
  stage("CNN, PYTORCH", 244, 156),
  stage("X  Y  Z", 436, 120),
  stage("CONTROL LOOP", 592, 168),
] as const;

/** Half-height of the frustum at a given x. */
const spread = (x: number) => ((x - LENS_X) / (FAR_X - LENS_X)) * HALF_H;

export const SingleCameraEstimate = () => (
  <svg
    viewBox="0 0 1000 472"
    className="w-full"
    role="img"
    aria-label="An orthographic drawing. A pipeline strip across the top runs from MuJoCo render to a convolutional network to an x y z position to a control loop. Below, a single RGB camera projects one frustum through an image plane toward an object. The predicted point carries a dashed tolerance circle dimensioned at plus or minus five centimetres, and the depth to the object is dimensioned back to the lens. A title block sits in the lower right."
  >
    <g className="text-ink-3">
      {/* Pipeline strip. */}
      {PIPELINE.map((item, i) => (
        <g key={item.label}>
          <rect x={item.x} y={30} width={item.w} height={38} fill="none" stroke="currentColor" strokeOpacity={0.6} />
          <text
            x={item.x + item.w / 2}
            y={54}
            textAnchor="middle"
            fill="currentColor"
            fontSize={12}
            style={mono}
          >
            {item.label}
          </text>
          {i < PIPELINE.length - 1 ? (
            <>
              <line
                x1={item.x + item.w}
                y1={49}
                x2={PIPELINE[i + 1].x - 8}
                y2={49}
                stroke="currentColor"
              />
              <path
                d={`M${PIPELINE[i + 1].x - 9} 44 l8 5 l-8 5 z`}
                fill="currentColor"
              />
            </>
          ) : null}
        </g>
      ))}
      <line x1={40} y1={92} x2={960} y2={92} stroke="currentColor" strokeOpacity={0.5} />

      {/* Camera body and lens. */}
      <rect x={70} y={AXIS_Y - 28} width={98} height={56} fill="none" stroke="currentColor" strokeWidth={1.4} />
      <path
        d={`M${LENS_X} ${AXIS_Y - 20} L${LENS_X + 20} ${AXIS_Y - 12} L${LENS_X + 20} ${AXIS_Y + 12} L${LENS_X} ${AXIS_Y + 20} Z`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
      <text x={70} y={AXIS_Y - 40} fill="currentColor" fontSize={13} style={mono}>
        RGB CAMERA
      </text>

      {/* Frustum and optical axis. */}
      <path
        d={`M${LENS_X} ${AXIS_Y} L${FAR_X} ${AXIS_Y - HALF_H} L${FAR_X} ${AXIS_Y + HALF_H} Z`}
        fill="currentColor"
        fillOpacity={0.06}
        stroke="currentColor"
        strokeOpacity={0.55}
      />
      <line
        x1={LENS_X}
        y1={AXIS_Y}
        x2={FAR_X + 40}
        y2={AXIS_Y}
        stroke="currentColor"
        strokeDasharray="14 4 2 4"
        strokeOpacity={0.8}
      />

      {/* Image plane. */}
      <line x1={300} y1={AXIS_Y - spread(300) - 14} x2={300} y2={AXIS_Y + spread(300) + 14} stroke="currentColor" strokeWidth={1.4} />
      {/* Set below the axis: above it, the diverging frustum edge runs through the text. */}
      <text x={310} y={AXIS_Y + spread(300) + 26} fill="currentColor" fontSize={12} style={halo}>
        IMAGE PLANE · ONE FRAME
      </text>

      {/* Depth dimension, lens to object. */}
      <line x1={LENS_X} y1={AXIS_Y + 6} x2={LENS_X} y2={352} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={POINT_X} y1={POINT_Y + ERROR_R + 6} x2={POINT_X} y2={352} stroke="currentColor" strokeOpacity={0.5} />
      <line x1={LENS_X} y1={340} x2={POINT_X} y2={340} stroke="currentColor" />
      <path d={`M${LENS_X + 9} 335 l-9 5 l9 5 z`} fill="currentColor" />
      <path d={`M${POINT_X - 9} 335 l9 5 l-9 5 z`} fill="currentColor" />
      <text x={(LENS_X + POINT_X) / 2} y={332} textAnchor="middle" fill="currentColor" fontSize={13} style={halo}>
        DEPTH, INFERRED
      </text>

      {/* Legend. Swatches are drawn with the accent layer below. */}
      <text x={64} y={415} fill="currentColor" fontSize={12} style={mono}>
        TRUE POSITION
      </text>
      <text x={64} y={443} fill="currentColor" fontSize={12} style={mono}>
        PREDICTED
      </text>

      {/* Title block. */}
      <g fill="none" stroke="currentColor" strokeOpacity={0.7}>
        <rect x={700} y={396} width={260} height={64} />
        <line x1={700} y1={418} x2={960} y2={418} />
        <line x1={700} y1={440} x2={960} y2={440} />
        <line x1={836} y1={418} x2={836} y2={440} />
      </g>
      <text x={710} y={412} fill="currentColor" fontSize={12} style={mono}>
        ARMTOPOINT · CONVPOSE
      </text>
      <text x={710} y={434} fill="currentColor" fontSize={12} style={mono}>
        SCALE  NTS
      </text>
      <text x={846} y={434} fill="currentColor" fontSize={12} style={mono}>
        UNITS  CM
      </text>
      <text x={710} y={456} fill="currentColor" fontSize={12} style={mono}>
        ONE CAMERA · NO DEPTH SENSOR
      </text>
    </g>

    {/* Accent layer: the estimate and its tolerance. */}
    <g stroke="currentColor" fill="none">
      <circle cx={48} cy={410} r={5} fill="currentColor" stroke="none" opacity={0.9} />
      <circle cx={48} cy={438} r={5} strokeWidth={1.6} />

      <circle cx={POINT_X + 16} cy={POINT_Y + 14} r={5} fill="currentColor" stroke="none" opacity={0.9} />
      <circle cx={POINT_X} cy={POINT_Y} r={5} strokeWidth={1.6} />
      <circle cx={POINT_X} cy={POINT_Y} r={ERROR_R} strokeDasharray="5 4" strokeWidth={1.2} />

      <line x1={POINT_X - ERROR_R} y1={POINT_Y - 8} x2={POINT_X - ERROR_R} y2={150} strokeOpacity={0.6} />
      <line x1={POINT_X + ERROR_R} y1={POINT_Y - 8} x2={POINT_X + ERROR_R} y2={150} strokeOpacity={0.6} />
      <line x1={POINT_X - ERROR_R} y1={158} x2={POINT_X + ERROR_R} y2={158} />
      <path d={`M${POINT_X - ERROR_R + 9} 153 l-9 5 l9 5 z`} fill="currentColor" stroke="none" />
      <path d={`M${POINT_X + ERROR_R - 9} 153 l9 5 l-9 5 z`} fill="currentColor" stroke="none" />
      <text x={POINT_X} y={144} textAnchor="middle" fill="currentColor" fontSize={13} style={halo}>
        ± 5 CM
      </text>
    </g>
  </svg>
);
