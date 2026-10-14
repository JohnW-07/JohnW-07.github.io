"use client";

import TextEngine from "spring-text-engine";

import { Inview } from "@/components/animation/springs/in-view";
import { AssetFrame } from "@/components/ui/asset-frame";
import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { education, links, profile, publication } from "@/data/profile";
import { ease, heavy, textTiming } from "@/lib/motion";

/**
 * First screen.
 *
 * A masthead grid: the name set as large as the page can carry, a rule under
 * it, then the portrait and the statement sharing one twelve-column band so
 * the face and the claim arrive together rather than in sequence.
 *
 * The portrait develops. A paper-coloured curtain sits over the frame and
 * wipes upward on load, which is what a print does in a tray and the only
 * animation on this screen that is doing anything other than fading.
 */
/** Whether there is a real portrait to build the two-column fold around. */
const hasPortrait = profile.headshot.kind === "image";

export const Hero = () => (
  <section
    id="profile"
    data-rail-section="Profile"
    aria-labelledby="profile-title"
    className="px-gutter pt-24 pb-12 lg:px-page lg:pt-28 lg:pb-16"
  >
    {/* Running head. Sets the document up as a printed thing.
        ----------------------------------------------------------------------
        The right slot used to repeat the availability line. That sentence is
        already the serif block below and the whole point of the contact
        section, so on a phone a visitor met it twice inside two screens. The
        publication was at the other extreme — buried in the last column of the
        last section — so the two swapped places. */}
    <Reveal shift="none" className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-6">
      <MonoLabel>Portfolio · 2026</MonoLabel>
      {/* Neutral, not `tone="signal"`. Promoting this out of the Awards column
          was right; making it the only saturated element above the fold was
          not. In rust it was the loudest thing on the first screen, pointing at
          a 2024 cloud-seeding paper, while "Stanford's NeuroAI Lab" sat
          unemphasised in body prose below it. It belongs here; it does not
          belong at the top of the visual hierarchy. */}
      <MonoLabel>
        {publication.label} · {publication.venue}
      </MonoLabel>
    </Reveal>

    <h1 id="profile-title" className="sr-only">
      {profile.name}, {profile.discipline}
    </h1>

    {/* Masthead. The name is a line-clipped slide, everything else fades. */}
    <div aria-hidden="true" className="border-b border-line-strong pb-2">
      <TextEngine
        tag="span"
        mode="once"
        overflow
        wrapLineClassName="line-mask"
        className="text-display-xl descender-room block font-display text-ink"
        lineIn={{ y: "0%", opacity: 1 }}
        lineOut={{ y: "104%", opacity: 0 }}
        lineStagger={textTiming.lineStagger}
        lineConfig={heavy}
      >
        {profile.name}
      </TextEngine>
    </div>

    <Reveal shift="none" delay={220} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-3">
      <MonoLabel tone="loud">{profile.title}</MonoLabel>
      {/* No GPA here. Education states it, and stating it twice on one page
          weights it above everything between the two mentions. */}
      <MonoLabel>B.S. {education.graduation.replace("Expected ", "")}</MonoLabel>
    </Reveal>

    {/* Portrait + statement.
        ----------------------------------------------------------------------
        The portrait column only exists when there is a portrait. An empty
        4:5 frame is the second-largest element on the first screen and, on a
        phone, very nearly a whole screen of nothing — so while the slot is
        unfilled the statement runs the full width instead and the fold reads
        as a finished page rather than an unfinished one.

        This is deliberately driven off the data, not commented out: drop the
        file into `profile.headshot` and the two-column composition comes back
        on its own, caption and all, with no layout work. */}
    <div
      className={`mt-12 grid grid-cols-1 gap-x-8 gap-y-12 lg:mt-14 ${
        hasPortrait ? "lg:grid-cols-12" : ""
      }`}
    >
      {hasPortrait ? (
      <figure className="relative lg:col-span-3">
        <div className="relative overflow-hidden">
          <AssetFrame
            asset={profile.headshot}
            ratio="4 / 5"
            publicLabel="Portrait"
            priority
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
          {/* The develop curtain. Wipes up off the frame. */}
          <Inview
            tag="span"
            mode="once"
            delayIn={320}
            config={heavy}
            className="pointer-events-none absolute inset-0 block bg-paper"
            style={{ transformOrigin: "bottom center" }}
            from={{ scaleY: 1 }}
            to={{ scaleY: 0 }}
          />
        </div>
          <figcaption className="mt-3 flex items-baseline justify-between gap-3">
            <MonoLabel>{profile.name}</MonoLabel>
            <MonoLabel tone="signal">Fig. 01</MonoLabel>
          </figcaption>
      </figure>
      ) : null}

      {/* With no portrait column the statement would sit in a narrow measure
          against half a screen of nothing, so the fold becomes its own 12-column
          composition: statement left, availability set against it on the right
          rather than stacked underneath. With a portrait, the original single
          stack is correct and this collapses back to it. */}
      <div
        className={`flex flex-col ${
          hasPortrait
            ? "lg:col-span-8 lg:col-start-5 lg:block"
            : "lg:grid lg:grid-cols-12 lg:gap-x-8"
        }`}
      >
        <TextEngine
          tag="p"
          mode="once"
          className={`text-lede block text-ink-2 ${
            hasPortrait ? "max-w-[44rem]" : "lg:col-span-7"
          }`}
          wordIn={{ y: 0, opacity: 1 }}
          wordOut={{ y: 10, opacity: 0 }}
          wordStagger={textTiming.wordStagger}
          wordConfig={ease}
          delayIn={420}
        >
          {profile.statement.join(" ")}
        </TextEngine>

        <Reveal
          delay={520}
          className={`mt-8 flex flex-wrap gap-x-6 gap-y-3 ${
            hasPortrait ? "" : "lg:col-span-7 lg:col-start-1"
          }`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="label-mono border-b border-line-strong pb-1 text-ink hover:border-safelight hover:text-safelight"
            >
              {link.label}
            </a>
          ))}
        </Reveal>

        {/* Availability, stated once and at a size worth reading.
            ------------------------------------------------------------------
            A six-cell readout used to sit here — Based, Degree, Minors, Most
            recent, Open to. Every one of those five facts is stated again in
            full further down the page: the degree in the masthead rule and in
            Education, the minors in Education, the most recent post as the
            first row of Positions, the location in the footer. So the block
            cost a screen of small type and told a reader nothing new.

            What it did contain that mattered is the last row, and that row was
            set at label size in a corner. This is the one sentence on the site
            with a job to do, so it gets the display face and the accent. */}
        {/* First on a phone, beside the statement on a desktop.
            ------------------------------------------------------------------
            On desktop this sits in the right-hand column, level with the top of
            the statement — read within the first screen either way. Stacked on
            a phone it fell to the very bottom, behind a twelve-line paragraph
            and the link row: the sentence that answers "should I email this
            person" began in the last 4% of the fold and was cut mid-sentence.
            A hiring manager opening this from a message is on a phone. Order
            here, not a second copy of the sentence. */}
        <Reveal
          shift="none"
          delay={600}
          className={`order-first mb-10 lg:order-none lg:mb-0 ${
            hasPortrait
              ? "lg:mt-12"
              : "lg:col-span-4 lg:col-start-9 lg:row-start-1"
          }`}
        >
          <p className="text-sub border-t border-line-strong pt-5 font-display text-ink">
            Open to{" "}
            <span className="text-safelight">Summer 2027 internships</span> in
            robotics, computer vision and applied machine learning.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
