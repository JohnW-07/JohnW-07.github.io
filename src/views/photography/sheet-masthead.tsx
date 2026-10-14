"use client";

import Link from "next/link";
import TextEngine from "spring-text-engine";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { ease, heavy, textTiming } from "@/lib/motion";

interface SheetFact {
  readonly label: string;
  readonly value: string;
}

interface SheetMastheadProps {
  rollCode: string;
  lede: string;
  note: string;
  facts: readonly SheetFact[];
}

/**
 * The top of the darkroom compartment.
 *
 * Deliberately the same skeleton as a case-study masthead — running head, big
 * clipped title, flat facts left, sentence right — because the two
 * compartments are the same person's document printed on different paper. The
 * only thing that changes is that the lights are off.
 *
 * The title is set one step larger than a case study's. It is a single word and
 * it is the first thing behind the door, so it gets to be the largest type on
 * the page. `TextEngine` emits its own visually hidden copy (`seo` defaults to
 * true), so this is a real `h1`.
 */
export const SheetMasthead = ({
  rollCode,
  lede,
  note,
  facts,
}: SheetMastheadProps) => (
  <header className="px-gutter pt-24 pb-12 lg:px-page lg:pt-28 lg:pb-16">
    <Reveal
      shift="none"
      className="flex items-baseline justify-between gap-4 pb-6"
    >
      <Link
        href="/"
        className="label-mono border-b border-transparent pb-1 text-ink-3 hover:border-safelight hover:text-ink"
      >
        ← Lab
      </Link>
      <MonoLabel tone="signal">Sheet {rollCode}</MonoLabel>
    </Reveal>

    <div className="border-b border-line-strong pb-3">
      <TextEngine
        tag="h1"
        mode="once"
        overflow
        wrapLineClassName="line-mask"
        className="text-display-xl descender-room block font-display text-ink"
        lineIn={{ y: "0%", opacity: 1 }}
        lineOut={{ y: "104%", opacity: 0 }}
        lineStagger={textTiming.lineStagger}
        lineConfig={heavy}
      >
        Photography
      </TextEngine>
    </div>

    <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 lg:mt-10 lg:grid-cols-12">
      <Reveal shift="none" delay={160} className="self-start lg:col-span-3">
        <dl className="grid grid-cols-2 gap-x-6 border-t border-line lg:grid-cols-1 lg:border-t-0">
          {facts.map((fact) => (
            <div key={fact.label} className="border-b border-line py-3 lg:py-2.5">
              <MonoLabel as="dt">{fact.label}</MonoLabel>
              <dd className="text-fine mt-1.5 text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="lg:col-span-8 lg:col-start-5">
        <TextEngine
          tag="p"
          mode="once"
          className="text-display-sm block max-w-[30ch] font-display text-ink lg:max-w-[34ch]"
          wordIn={{ y: 0, opacity: 1 }}
          wordOut={{ y: 12, opacity: 0 }}
          wordStagger={textTiming.wordStagger}
          wordConfig={ease}
          delayIn={280}
        >
          {lede}
        </TextEngine>

        <Reveal delay={420} className="mt-8 max-w-[46ch]">
          <p className="text-body text-ink-2">{note}</p>
        </Reveal>
      </div>
    </div>
  </header>
);
