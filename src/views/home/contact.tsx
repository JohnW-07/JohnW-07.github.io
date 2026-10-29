"use client";

import TextEngine from "spring-text-engine";

import { MonoLabel } from "@/components/ui/mono-label";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { contact } from "@/data/contact";
import { links } from "@/data/profile";
import { ease, textTiming } from "@/lib/motion";

const EMAIL = contact.email.primary;

/**
 * Contact.
 *
 * One address, set large enough to read across a room, and the two profiles
 * worth linking. No form: a form on a personal site is a mail client that
 * loses your draft and cannot be replied to from a phone.
 */
export const Contact = ({ className }: { className?: string }) => (
  <Section
    className={className}
    id="contact"
    index="04"
    title="Contact"
    annotation={contact.based}
  >
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {/* The address has no break opportunity — no spaces, and a browser will
            not break at "@" or "." — so it cannot wrap. It has to be set at a
            size that fits the measure, or `overflow: hidden` on the line mask
            silently amputates the end of it: at 30px on a 390px viewport this
            shipped as "johnwu07@terpmail.umd", with ".edu" cut off. The primary
            call to action on the site was an unusable address.

            `line-mask` is the same descender fix the masthead and hero carry.
            The mask is exactly one line-box tall, so without it the "j" tail is
            sliced flat. */}
        <a
          href={`mailto:${EMAIL}`}
          className="group inline-block max-w-full text-ink hover:text-safelight"
        >
          <TextEngine
            tag="span"
            mode="once"
            overflow
            wrapLineClassName="line-mask"
            className="text-sub descender-room block font-display sm:text-display-sm lg:text-display"
            lineIn={{ y: "0%", opacity: 1 }}
            lineOut={{ y: "104%", opacity: 0 }}
            lineStagger={textTiming.lineStagger}
            lineConfig={ease}
          >
            {EMAIL}
          </TextEngine>
        </a>
        {/* Does not restate the hero.
            ------------------------------------------------------------------
            This opened "I am looking for Summer 2027 internships in robotics,
            computer vision, and applied machine learning" — eleven consecutive
            words identical to the hero's availability line, on the same page.
            The hero states the ask; by the time a reader is down here they have
            read it, and what is useful is what to write about. */}
        <p className="text-body mt-6 max-w-[36rem] text-ink-2">
          If you are working on systems that have to perceive something and then
          act on it, I would like to hear about it. Papers, harnesses, half-built
          rigs that do not work yet, all of it.
        </p>
      </div>

      <Reveal shift="none" delay={120} tag="div" className="lg:col-span-3 lg:col-start-10">
        <dl className="border-t border-line">
          {links
            .filter((link) => link.external)
            .map((link) => (
              <div key={link.href} className="border-b border-line py-3">
                <MonoLabel as="dt">{link.label}</MonoLabel>
                <dd className="mt-1.5">
                  {/* Underlined, like every other external link on the site.
                      These were the only ones set as plain text — on the one
                      section whose entire job is contact, the two links that
                      leave the site had the weakest affordance on the page. */}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fine border-b border-line-strong pb-0.5 text-ink hover:border-safelight hover:text-safelight"
                  >
                    {link.href.replace("https://", "")}
                  </a>
                </dd>
              </div>
            ))}
        </dl>
      </Reveal>
    </div>
  </Section>
);
