"use client";

import Link from "next/link";
import TextEngine from "spring-text-engine";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { ease, heavy, textTiming } from "@/lib/motion";

interface BlogMastheadProps {
  lede: string;
  postCount: number;
}

/**
 * The top of `/blog`: running head, clipped title, one sentence. The same
 * skeleton as the photography masthead, minus the facts column, because a list
 * of posts has nothing to tabulate. `TextEngine` emits its own visually hidden
 * copy (`seo` defaults to true), so this is a real `h1`.
 */
export const BlogMasthead = ({ lede, postCount }: BlogMastheadProps) => (
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
      <MonoLabel tone="signal">
        {postCount} {postCount === 1 ? "post" : "posts"}
      </MonoLabel>
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
        Blog
      </TextEngine>
    </div>

    <TextEngine
      tag="p"
      mode="once"
      className="text-display-sm mt-8 block max-w-[30ch] font-display text-ink lg:mt-10 lg:max-w-[34ch]"
      wordIn={{ y: 0, opacity: 1 }}
      wordOut={{ y: 12, opacity: 0 }}
      wordStagger={textTiming.wordStagger}
      wordConfig={ease}
      delayIn={280}
    >
      {lede}
    </TextEngine>
  </header>
);
