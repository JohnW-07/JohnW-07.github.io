import { accentTone, type Accent } from "@/components/project/accent";
import { MetricReadout } from "@/components/ui/metric-readout";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import type { Metric } from "@/data/types";

interface ProjectMetricsProps {
  metrics: readonly Metric[];
  accent: Accent;
  className?: string;
  /**
   * Heading for the band. Defaults to "Measured", which is a promise: the
   * figures under it are outcomes. A page whose numbers describe the size of
   * the work rather than its result must say so — pass "Scope" instead. Do not
   * leave the default on and hope nobody reads it.
   */
  label?: string;
}

/**
 * The numbers, at the end rather than the top.
 *
 * A case study that opens with three big figures is asking to be skimmed. By
 * the time a reader is here they know what each of these counted.
 */
export const ProjectMetrics = ({
  metrics,
  accent,
  className = "",
  label = "Measured",
}: ProjectMetricsProps) => (
  <Reveal shift="none" className={`px-gutter lg:px-page ${className}`}>
    {/* "verified figures only" used to sit at the end of this rule. It was
        meant as a discipline note and read as a disclaimer — it answered a
        doubt no reader had yet had, and drew attention to the doubt in doing
        so. The heading "Measured" already makes the same promise, and the
        figures either keep it or they do not. */}
    {/* One construction, whatever the figure count.
        ----------------------------------------------------------------------
        A single figure was special-cased twice: first onto the heading rule
        (because a lone value under a full-width rule looked like a three-slot
        row with two slots missing), then off the right edge and back to the
        left. Both attempts left `tackle-vision` and `vla-benchmarking` reading
        as two different components in the same slot, which is a worse problem
        than the one being solved. The heading always gets its own row; the
        readout always sits under it, and `MetricReadout` already stops a lone
        value from stretching across the page (`max-w-xs`). A section with one
        number looks like a section with one number — that is honest, and it is
        the point of labelling it "Scope". */}
    <div className="rule-t flex items-baseline gap-6 pt-4 pb-8 lg:pb-10">
      <MonoLabel tone={accentTone[accent]}>03</MonoLabel>
      <h2 className="label-mono text-ink">{label}</h2>
    </div>
    <MetricReadout metrics={metrics} />
  </Reveal>
);
