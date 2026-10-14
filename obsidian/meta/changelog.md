---
tags: [meta, changelog]
updated: 2026-10-14
---

# Changelog

Chronological log of notable changes to the project. Newest first.
This is a human-curated log — not a mirror of `git log`.

## 2026-10-14 — deployed as a static site on GitHub Pages

- `next.config.ts`: `output: "export"`, `images.unoptimized: true`.
- `robots.ts` / `sitemap.ts`: `export const dynamic = "force-static"`.
- New `.github/workflows/deploy.yml` — build + deploy `out/` to
  `https://johnw-07.github.io` on push to `main`.
- Verified locally: `yarn build` emits all 10 routes as static HTML plus `404.html`;
  `robots.txt`, `sitemap.xml` and canonical URLs carry the production origin; `yarn lint`
  clean. See ADR-0028.

## 2026-08-10 — design work closed out

Judge round 14 was a verification pass, not a critique sweep. **No regressions found**
across all twelve page/viewport combinations plus targeted native-resolution crops.
Grades: A on typographic hierarchy, colour discipline, craft and finish, and
anti-generic; A− on scale contrast, cue density and spatial rhythm. Overall **A−**, with
the sole B+ axis ("wins the interview") attributed entirely to owner-blocked content.

Asked whether anything remained worth another round, it answered: **"No. This is
finished pending the owner's content."**

- **Coursework uses the dot separator**, closing the one inconsistency the verification
  pass raised: it sat directly under Minors, which had just moved to spaced dots, so a
  single column carried two separator conventions one row apart. Commas are defensible
  for prose-length course names on their own — not next to a dot list.
- The lead row's air was measured off rule positions in the raw pixels rather than
  eyeballed: **81px against 41px** at desktop, 49 against 33 at tablet and mobile,
  symmetric top and bottom. It does not read as detached from the list, because the row
  is still bounded by the same continuous rules at the same weight and its figure panel
  matches every sibling's width — the extra space is *inside* a bounded cell.

> [!note] Checked and confirmed correct — do not "discover" these later
> - **Figure corner registration ticks follow the page accent**, and are the same colour
>   at both corners of a plate: rust `(168,62,18)` on `tackle-vision`, steel
>   `(28,76,107)` on `vla-benchmarking`. They differ *between* pages by design.
> - **The contact email headline has no underline, deliberately.** Every other external
>   link on the site carries one; an underline beneath 72px Fraunces would fight the
>   section rules, and a bare address at that size is unambiguously actionable.

## 2026-08-10 — separators, affordance, and ranking the index by space

Judge round 13 graded **A−** and confirmed the desaturated compare plate "reads as
gouache adjacent to the page palette, not tool output". Asked directly what still
separates the site from an A, it answered: roughly one third design, two thirds content.
These are the design third.

- **Dot separators in the reference lists carry real margin.** They were joined with a
  plain `" · "`. That reads generously in the tracked mono layer — "ML · CV · VISION
  SYSTEMS" — but these lists are set in the untracked sans at `text-fine`, so the same
  string bound up: "Python·C·C#·Java" read as one token, worst around the
  one-character items. New local `DotList` puts the margin on the separator; widening
  `word-spacing` would also have stretched the space inside "Multi-GPU sharding".
- **The Contact section's external links are underlined**, like every other external
  link on the site. They were the only ones set as plain text — on the section whose
  entire job is contact, the two links that leave the site had the weakest affordance
  on the page.
- **The lead index row gained air** (`py-12 lg:py-20` against `py-8 lg:py-10`). Its
  title was already a measured 1.53× the siblings' cap height and its metric runs at
  readout scale, but every row occupied the same footprint, so the page presented the
  Stanford work and the hackathon at the same weight. Space is the cheapest ranking
  device available and the only one that needs no new component.

> [!note] Two judges disagreed here, and the measurement settled it
> Round 12 measured the lead row as clearly distinguished at every breakpoint (title cap
> 1.53× desktop, 1.50× tablet, 1.45× mobile) and called the index "not too repetitive".
> Round 13 called the rows "identical weight", which is measurably false. The true part
> of the complaint was narrower — the *footprint* was identical and nothing tapered — so
> the response was to widen the space gap, not to restructure the component a fourth
> time. Where judges contradict each other, measure before rebuilding.

## 2026-08-10 — the one place the colour system broke

Judge round 12 graded **high A−** and verified the previous round's four changes to the
pixel, including the compare plate at 768px: both panes' image content now occupies
y 313–489, a **0px** offset where it had been ~17px.

- **The compare plate's segmentation overlay was desaturated.** It was raw tool output —
  fluorescent cyan, magenta, yellow, orange and green per-link point clouds — dropped
  into a page built from cream, ink, rust and slate. It was the loudest element on the
  site, it sat on the flagship case study, and on mobile the panes stack into two large
  neon blocks. Re-encoded at `saturation: 0.4`, chosen by comparing 1.0 / 0.55 / 0.4 /
  0.28: below ~0.3 the sage and slate parts start to converge. **Hue is untouched**, so
  every part keeps its identity and the figure still says exactly what it said — this
  changed how loud the evidence is, not what it shows. Script: `recolor.mjs`.
- **Nav marks "Work" current on the case studies.** `/#work` and `/#contact` are in-page
  jumps and still mark nothing on the home page, but the five `/work/*` routes are real
  pages, they are the deepest reads on the site, and their nav was pixel-identical to
  the home page's — a reader two thousand pixels into a case study had nothing telling
  them which section they were in.
- **The index meta separator hides below `sm`.** Added last round to stop "NEUROAI LAB
  MAY – AUG 2026" reading as one string, it then orphaned as its own flex item when the
  row wrapped on a phone — opening line two on one row, closing line one on the next.
  The wrap already separates the fields there, so it has no work to do.
- **Two figures' viewBoxes were tightened to their ink** (1000→891 and 1000→950 units),
  with the registry `ratio` values updated to match. Both carried dead right margin —
  133 and 70 units — so in the index those drawings sat visibly left of centre while the
  three balanced figures below them did not. Measured after: 24/24 and 20/20.

> [!warning] `.next/cache/images` will serve a stale image forever
> The desaturated frames were written to `public/`, the site rebuilt, the server
> restarted — and the page still rendered the fluorescent originals. Next's image
> optimizer caches by **source path**, not by content, so changing an image's bytes
> without changing its filename serves the old optimized version indefinitely. It
> survives `yarn build`. `rm -rf .next/cache/images` before verifying any image swap,
> or the check passes against an image that is no longer on disk.

## 2026-08-10 — desktop was the worst presentation of the work

Judge round 11 held at **A−**, and the tablet capture added the round before immediately
earned itself: it found a defect that exists at exactly one breakpoint, and it exposed
that the *widest* viewport was doing the least with its width.

- **One structure for all five index rows** ([[decisions-log]] ADR-0027). Rows 02–05 put the figure in a 4-of-12
  column — **395px at desktop**, where the drawings' internal mono annotations land at
  ~5px and stop resolving — while a 768px tablet rendered the same SVG at **711px**,
  fully legible. The figure now leads every row at full width: 1248 / 711 / 334 at the
  three breakpoints, identical across rows. Unifying also removed a second defect
  reported twice: with two row constructions a reader had to relearn where the number
  and the chips lived between row 01 and row 02. `isLead` now changes only scale — title
  size, metric size, chip count.
  > Capping rows 02–05 at 58rem was tried first and reverted: it read better in
  > isolation and worse on the page, because the figure then ended at x=928 while the
  > title, summary, metric and rules all ran to 1360 — a fifth right edge in a layout
  > whose entire claim is that things line up.
- **The stats band lost its single-figure special case.** That case had been
  special-cased twice — onto the heading rule, then off the right edge and back — and
  each attempt left `tackle-vision` and `vla-benchmarking` reading as two different
  components in the same slot, which is worse than the emptiness being solved. One
  construction now. `MetricReadout` already stops a lone value from stretching, and a
  section with one number looking like a section with one number is the point of
  labelling it "Scope".
- **Compare-plate headers stack below `lg`.** At 768px the left pane's longer strings
  wrapped to two lines while the right pane's fitted on one, pushing the two video
  frames ~17px out of vertical alignment — on the figure that carries the page's
  headline number, where shared top and bottom edges are the entire point. Tablet-only,
  and invisible until tablet was photographed.
- Non-breaking spaces bind "Bridge V2 recaption, 0 errors" and "University of Maryland
  merit award".

## 2026-08-10 — the accent rule becomes visible, and tablet gets photographed

Judge round 10 graded **A−**, ship-blocker gone with nothing equivalent replacing it.

- **Index ordinals carry each project's own accent.** The site encodes rust for work on
  physical things moving in real time and Prussian blue for measurement and inference —
  but every ordinal in the work index was a blanket rust, so the one page that
  introduces all five projects was the one page where the rule was invisible, and a
  reader met the blue for the first time inside a case study with nothing to tie it to.
- **An explicit `·` between the index eyebrow's fields.** They were separated only by an
  18px gap against an 11px word space — 1.6×, same colour, size and weight — so
  "NEUROAI LAB MAY – AUG 2026" read as one run-on string.
- **The single-figure band left-aligns beside its heading.** It was `justify-between`,
  throwing the lone value to the far right edge while the three-figure band left-aligns
  under its label: one component reading two opposite ways across two case studies.
- **Non-breaking spaces** bind "GPA 3.73" and the Fig. 02 caption's "0.620 m", "0.52 m"
  and "40k point". Same defect class as the `whitespace-nowrap` work in the readouts,
  in prose this time.
- **Tablet (768px) added to the capture harness.** It had never been photographed, so
  every layout decision to date was made against desktop and mobile only — and the
  `sm` stacking fix from the previous round landed exactly on that untested boundary.
  Swept the metrics band at 14 widths from 390 to 1440: it stacks below 640, runs three
  columns above, and no value overflows its cell anywhere. The tightest case, 640px,
  needs 184px in a 200px cell. A judge had inferred a crowding failure there; it does
  not exist.

> [!note] The mobile index thumbnails stay illegible, on purpose
> Two reviews proposed giving them `FigurePlate`'s horizontal-scroll treatment. Not
> applied: **the thumbnail sits inside the row's navigation `<Link>`**, and a scroll
> region inside a link makes a touch drag ambiguous between scrolling the figure and
> following the link. The case-study plates can scroll because nothing wraps them. If
> the trade stops being acceptable, lift the figure out of the link or drop it below
> `sm` — do not nest a scroller in a link. Recorded in `figure-thumb.tsx`.

## 2026-08-10 — numerals drawn on top of each other, and how it hid

Judge round 9 graded **B+, down from A−**, on one genuine rendering failure. Worth
recording in full because of *why* it survived nine rounds of checking.

- **The flagship results band was unreadable on a phone.** `MetricReadout` set
  `grid-cols-3` unconditionally, so at 390px each reading got a ~110px cell while the
  numerals are `text-readout` — "155,656" needs about 130px. It drew straight over its
  neighbour: the band rendered as "155,656235", with the unit broken to "GPU-" and an
  orphaned "H" on its own line. Bands now stack below `sm` with horizontal rules, and
  the divider turns with the axis (top rule stacked, left rule side-by-side).
  > **A grid cell does not clip its overflow.** Every automated check to date measured
  > bounding boxes, and the boxes were correct and non-overlapping — 20→121, 154→237,
  > 270→354 — while the glyphs inside them were superimposed. Measuring geometry cannot
  > see this class of defect. Crop the region and look at it.
- **Values are bound to their units** with `whitespace-nowrap`, here and in
  `ComparePlate`, whose "Stock CAD · 0.620 m" was wrapping to leave a lone "m". A
  measurement that breaks between numeral and unit stops being a measurement.
- **The lead index item's metric is back in the scan column.** Two corrections landed on
  this block in succession: it began in the row's utility band at the same size as the
  subordinate rows (strongest figure, weakest slot), moving it under the title fixed the
  scale and stepped it out of the right-hand column a reader scans — so that edge read
  1,000+ / 75% / ±5cm / 1st and never met 0.658. Now readout scale *and* on the edge.
- **The spec band at two rows uses two columns.** The previous round's fix covered 3, 4
  and 6 rows and left 2 drawing two cells under a three-column rule.
- **Positions writes "May – Aug 2026"**, matching the case studies, via `compactPeriod`.
  Unit-tested including four inputs that must not change (year-crossing spans, "present",
  single dates).

## 2026-08-10 — the call to action moves up the phone fold

Judge round 8 graded **A−**. Its highest-payoff finding was one flex-order change.

- **The availability line began at 96% of the mobile fold, cut mid-sentence.** On desktop
  it sits in the right-hand column level with the statement, read within the first
  screen; stacked on a phone it fell behind a twelve-line bio and the link row. The
  sentence that answers *should I email this person* was effectively not on the first
  screen, and a hiring manager opening a link from a message is on a phone. Reordered
  with `order-first` rather than by adding a second copy of the sentence. Measured after:
  **38% of the mobile fold, 46% on desktop, fully inside both.**
- **The year echo is now a shared rule**, `utils/echoed-year.ts`. "Bitcamp 2026" sat beside
  "Apr 2026" and the "Also" card said "US–Korea Conference 2024" over "May – Nov 2024".
  This is the **fourth** attempt at this defect: three previous fixes each corrected the
  rows in front of them and missed the ones elsewhere. `withoutEchoedYear(text, context)`
  strips a year the neighbouring field already states, along with the punctuation it
  leaves behind. Unit-tested against six real pairs including two that must NOT change.
  > Note the direction matters. Awards use `creditLine()` instead, which drops the
  > *appended* year — running `withoutEchoedYear` on an award's detail would turn
  > "Fall 2025 and Spring 2026" into "Fall 2025 and Spring".
- **The figure plate's corner note is hidden on phones.** "SCHEMATIC" landed ~30px above
  the drawing's own top-right annotation, both rust mono, the lower one faded and cut
  mid-word by the scroll edge — the only thing on the site that read as broken rather
  than sparse. The note is plate metadata; the drawing's own labels win the corner.
- **The spec band's column count follows its row count.** Three specs drew across the
  left half of a hard-coded six-column grid and left the right 45% blank — a six-slot
  datasheet with three slots missing. Same failure the "Also" grid had.
- **`Code / Public repository` deleted.** Correcting the false `License / Open source`
  left a row restating the repository that the masthead already carries as a live link
  250px above — and the restatement was the version you could not click.

## 2026-08-10 — a false licence claim, and a rule instead of another patch

Judge round 7 graded **B+**. It caught one fix that had failed and one that had created
a new defect, both worth recording because of what they say about method.

- **A false claim was on the site: `License / Open source`.** Two errors in one spec
  row. A spec-sheet key must be answered by its value — "open source" is not a licence,
  `MIT` or `Apache-2.0` is — and the claim was not true: the GitHub API reports
  `JohnW-07/tackle-vision-ML` public with **no licence file**, and a public repository
  without one is all-rights-reserved by default. Now `Code / Public repository`. Adding
  a LICENSE would let the row name it. *(Third factual correction found this way, after
  the "7 GPU checkpoint shards" and "W8A16" claims. Check assertions against the source,
  not against memory of the source.)*
- **Award years are decided by a rule now, not per row.** Appending the year
  unconditionally printed "Bitcamp 2026, Social Good track winner" over
  "UNIVERSITY OF MARYLAND · 2026", and "Fall 2025 and Spring 2026 · 2026". Both were
  patched individually and the patch kept missing rows, because per-entry editing cannot
  see the pattern. `creditLine()` now suppresses a year that the label or detail already
  states — **a year already in the string is not a fact, it is an echo** — so a new award
  gets this right with nobody remembering the rule.
- **The lead index row's number moved to its title.** It sat in the utility band at the
  foot of the row beside the tech list, at the same size as the four subordinate rows'
  numbers — the strongest figure in the index, in its weakest slot, while the rows below
  it got the prominent right-hand rail. It now runs at `text-readout` under the title.
- **Index tech lists are bordered chips**, the same idiom the case studies use for the
  same data. Bare mono words separated by a gap meant a right-aligned list that wrapped
  read as one run-on string: "CAN BUS PYTHON" is two tools or three, and nothing said
  which.
- **The contact paragraph shared eleven consecutive words with the hero.** It now says
  what to write about instead of restating the ask.
- **Section headers were a ~100px band between two rules** holding a single 14px mono
  line, because several sections open with content carrying its own top rule. Halved.
  The header is a caption on a rule, not a band.
- **Case-study mastheads dropped a duplicate mobile hairline** — the metadata list's
  `border-t` drew a second full-width rule 32px under the title's own, with nothing
  between. Found by scanning computed borders for near-full-width pairs under 60px
  apart, which is worth repeating: `scripts` in the job tmp dir, `rules.mjs`.

## 2026-08-10 — evidence on the fold, and one superscript instead of two

Judge round 6 graded **B**, up from C+ after three flat rounds. Its headline finding was
that the flagship case study spent its whole first viewport on metadata and put the one
number that decides whether a reader keeps going at 85% page depth.

- **The result now appears on the first screen.** `ProjectMasthead` takes an optional
  `headline` metric, set under the standfirst. The full three-figure band stays at the
  end — a case study that opens with three big numbers is asking to be skimmed — so the
  split is one figure at the top, three at the bottom. **Pass it only when the figure is
  an outcome**: `tackle-vision` passes nothing, which is the same reason its band says
  Scope. See [[decisions-log]] ADR-0026 and [[components/common]].
- **vla stated its affiliation twice on one screen.** The masthead's WHERE said
  "Stanford University, NeuroAI Lab" and a spec row said "NeuroAI Lab, Stanford
  University" — the same fact with the words reversed, both in the first viewport. The
  spec row is gone.
- **One superscript treatment, and the accent came off the unit.** The work index and
  `MetricReadout` had drifted to two different unit styles, so `60Hz` in the index and
  `235 GPU-H` in a case study read as two components. Worse, the unit was
  `text-safelight`: the only saturated thing in the vla band was "GPU-H" on the compute
  cost, while the outcome beside it got no emphasis at all. A unit symbol is the least
  important glyph in a readout and it was the loudest.
- **A one-figure band sits on its heading rule**, not under it. Stacking is right for
  three figures and wrong for one: the rule runs the full page width, the lone value
  sizes to its content, and the band reads ~88% empty.
- **Figures got a scroll affordance.** The horizontal-scroll fix shipped with no hint,
  so a drawing cut off mid-word at the screen edge read as broken rather than scrollable.
  New `.scroll-fade` mask softens the cut edge, and the plate carries a "Scroll →" label
  below `sm`. Verified on device-width capture: the scroller is 576px in a 348px box.
- **The footer colophon is deleted.** It restated the email a third time (64px Fraunces
  in Contact, an "Email" link in the footer nav, then the address again in mono under a
  rule) and the location a second time, all within one screen.
- **Prev/next dropped its bottom border**, which drew a second rule a section-gap above
  the footer's own — a ruled band ~120px tall containing nothing, at the end of every
  case study.
- The publication line in the running head is no longer rust; it was the only saturated
  element above the fold, pointing at a 2024 paper. Awards no longer appends a year the
  detail line already states. The home→photography door no longer near-verbatim restates
  the photography page's lede.

## 2026-08-10 — a result instead of a volume, and a contact address that renders

Judge round 5 held at C+ and found a craft regression at the contact block.

- **The contact address was broken and is fixed.** Its `TextEngine` had `overflow` but
  no `wrapLineClassName="line-mask"`, so the "j" descender was sliced flat — the same
  defect fixed on the masthead and hero, missed here. Worse, at `text-display-sm` on a
  390px viewport the address is wider than the measure and has no break opportunity (a
  browser will not break at `@` or `.`), so `overflow: hidden` amputated it: the site's
  primary call to action shipped as `johnwu07@terpmail.umd`. Now `text-sub` on phones,
  stepping up at `sm` and `lg`. Verified by 4× crop at both breakpoints, not by eye.
- **`vla-benchmarking`'s stats band leads with an outcome.** It opened with clips
  captioned, params served and GPU-hours — three measures of how much work happened.
  The one real result on the site, per-arm silhouette IoU 0.564 → 0.658 after the rig
  baseline was re-solved, existed only as Fig. 02 figure chrome. It is now the lead
  figure in the band. `32B params served` came out; the prose already explains the
  serving topology in full.
- **`terps-dashboard` reordered to lead with its outcome too.** It opened with the 60 Hz
  refresh rate, which is a spec of the thing rather than a result of the work — and
  since the work index renders `metrics[0]`, that project's index row was advertising a
  sample rate. Boot time (20s → under 5s) leads now. `armtopoint` already led with ±5cm.
- **`ProjectMetrics` takes a `label`.** "Measured" is a promise that the figures under
  it are outcomes. `tackle-vision` can substantiate only the size of its fine-tuning
  set, which is an input, so that page says **Scope**. See [[components/common]].
- **Figures scroll sideways on phones.** A ~1000-unit-wide drawing fitted to a 390px
  screen renders its 11px internal annotations at about 4px, so the centrepiece of each
  case study was grey texture — while the plate chrome around it, being HTML, stayed
  full size and dwarfed the labels inside the drawing it annotated.
- **Case-study numbering resolves.** The spec block is `01`, prose is `02.x`, the stats
  band is `03`. Previously the first number a reader met was `02.1`, implying a `01` and
  `02` that were never shown.
- **Awards dropped the year column** — populated three rows out of four, and a hole
  reads as broken whether it is left blank or filled with an em dash. Both were tried
  and both were called out. The year joins the detail line.
- **The Positions cross-link was mislabelled.** It read "In selected work, above",
  which describes scrolling up; it opens the case study. Now "Case study →".
- GPA no longer appears twice on the home page.

> [!note] Two judge findings were checked and rejected
> The accent system was called arbitrary: it is not. `accent.ts` documents rust for
> work about a physical thing moving in real time and Prussian blue for work about
> measurement and inference, and all five pages follow it. The "third hue" on
> `/photography` is the same rust token re-valued for the darkroom theme. Separately,
> the `TRACKED JOINT` leader was called a line pointing at nothing; it stops 12 units
> short of the VELOCITY panel at a y inside that panel, which is a leader standoff.

## 2026-08-10 — one case-study template, numbers in the index, AA on the accent

Judge round 4 graded the site C+ and its three headline findings were all structural.
Everything here comes from that critique. See [[decisions-log]] ADR-0025.

- **All five case studies now use one template.** `vla-benchmarking` was the exception:
  a sticky spec rail in a left column with headings stacked inline, where the other four
  use a spec band under the masthead and hang headings in the margin. The rail ran out
  of content a third of the way down the page, so the left of the document was empty for
  thousands of pixels while the prose ran as a narrow ribbon right of centre — and it
  meant the set was two different documents rather than one. It now matches the other
  four exactly.
- **Every work-index row carries one hard number**, taken from `metrics[0]` (each
  project's list is already ordered strongest-first, so this needs no new data). The
  index previously carried no quantity at all: the only figures on the site were
  thousands of pixels down inside a case study. Row titles went up a step to
  `text-display-sm`, and the lead row to `text-display`.
- **The conference co-authorship moved to the running head.** It was the third row of a
  four-row Awards column at the very bottom of the home page, in the lightest type used
  anywhere — ranked below a hackathon track win by position alone. New `publication`
  export in `data/profile.ts`; removed from `credentials` so it is stated once.
- **The rust accent was darkened, `#bc4718` → `#a83e12`.** Measured 4.12:1 on
  `--paper-2`, which is the substrate under every figure plate, so every mono annotation
  inside a drawing sat under WCAG AA. Now 4.97:1 measured. See [[decisions-log]]
  ADR-0021 for the same treatment applied to `--ink-3`.
- **Availability is stated twice, not three times** — the hero running head gave up its
  copy of the line to the publication.
- **Positions rows are two columns, not three.** The third column held a cross-reference
  on the rows with case studies and a paragraph of prose on the rows without: one column
  position, two unrelated content types, no header.
- **Smaller craft fixes.** `ProjectNav` respects the page margin (its titles sat at x=40
  while the whole document above sat at x=80); the masthead badge dropped the project
  ordinal, which collided with the body's own `02.1` section numbering; the Tools column
  is underlined rows like the two columns beside it rather than a bordered box grid; an
  unknown award year prints an em dash instead of a hole; the work-row call to action is
  ruled off from the tag list it was being read as part of.

## 2026-08-10 — figures, hierarchy, and a corrected metric

- **The work index leads with figures.** Every project already had a hand-drawn SVG
  explaining its mechanism, and every one was buried inside its own case study — so
  the section whose entire job is to make a visitor open a case study was five blocks
  of prose at one grey value. New `FigureThumb` + `figure-registry.ts` render the same
  components small in the index. The first row runs full-width at a larger title size:
  the index is ordered by weight, so the lead project should not match the homelab
  dashboard four rows down. See [[components/common]].
- **Real lab imagery on `/work/vla-benchmarking`.** New `ComparePlate` component and
  a Fig. 02 showing the bimanual rig calibration before and after the baseline was
  re-solved (per-arm IoU 0.564/0.550 → 0.658/0.671). Five figures pulled from the
  cluster and encoded to WebP in `public/assets/work/` (269 KB total).
- **A metric was wrong and is now corrected.** "7 GPU checkpoint shards" could not be
  substantiated anywhere — the Qwen3-VL-32B checkpoint ships as **14** safetensors
  shards and was served at `tensor_parallel_size=2`, three engines to a node, across
  three nodes. Replaced with the Bridge V2 recaption campaign (235 GPU-h, 0 recorded
  errors) and the exact caption count (155,656, previously rounded to "100k+"). The
  matching case-study sentence was rewritten; an unverifiable "quantized to W8A16"
  claim went with it, since the bf16 + TP=2 evidence contradicts it.
- **Duplication removed.** The hero readout strip (Based / Degree / Minors / Most
  recent / Open to) restated five facts the page already carried in full, and is gone;
  availability is now a single display-face line instead of 12px mono in a corner.
  Positions cross-references the work index rather than restating three project
  summaries. The `ALSO` Revit card duplicated its own Positions row. Footer build-stack
  credits replaced with an email address.
- **Descender clipping on every display heading, fixed properly.** Display leading is
  below 1.0, so glyphs are taller than their line-box, and two separate things were
  cutting them. `TextEngine`'s `overflow` prop puts `overflow: hidden` on a per-line
  mask exactly one line-box tall, which severed every descender mid-glyph —
  "Photography" lost the tails of its p, g, p and y, "…measures a robot policy" lost
  the y. New `line-mask` utility, passed through the library's own `wrapLineClassName`,
  pads that mask and gives the space back with a negative margin. Separately,
  `descender-room` keeps a container's rule from sitting on the descenders now that
  they render. **Both are needed** — an earlier pass added only `descender-room`,
  which moved the rule clear and left the glyphs just as clipped. See
  [[design-system]].
- **Case-study spec sheets stopped repeating the masthead.** `ProjectMasthead` already
  prints Role / Where / Period / Location from `project`, and every `spec` array in
  `case-studies.ts` restated Role and Period (and, on tackle-vision, Organization)
  about 600px lower on the same page. Ten duplicated rows removed; each spec sheet now
  carries only what the masthead does not (Lab, Advisor, Simulator, Team, Bus, …).
- **Clip counts reconciled.** The VLA case study said "more than 100,000 episodes" in
  one paragraph, "38,019 clips" in another, and the metric band said "155,656 clips
  captioned" — three numbers with no relationship stated. The first is now the exact
  155,656 (the same figure the band shows), and 38,019 is explicitly the Bridge V2
  campaign rather than a competing total.
- **`MetricReadout` sizes to its content below three figures.** With one metric it
  spanned the full page width and read as a three-slot row with two slots missing.
- **Craft fixes.** The `ALSO` grid takes its
  column count from its item count: the cards are drawn by letting a `bg-line` parent
  show through 1px gaps, so a hard-coded third column with no card in it painted as a
  solid block of rule colour once the list dropped to two.
- **The hero fold adapts to whether a portrait exists.** `profile.headshot` is still a
  placeholder, and an empty 4:5 frame was the second-largest element on the first
  screen — close to a full screen of nothing on a phone. While the slot is unfilled the
  statement and availability compose as their own 12-column fold and the frame is not
  rendered at all; when a real image lands in `profile.headshot`, the original
  two-column composition returns on its own, caption included, with no layout work.
  `profile.headshot` is now annotated `as AssetSlot` rather than inferred, or the
  `kind === "image"` branch cannot type-check against a variant the data will take.

## 2026-08-10 — typographic overhaul

- **The root font-size no longer scales with the viewport.** The `vw`-based `html`
  media queries from ADR-0008 only produced the intended size *at* each breakpoint;
  in between they shrank everything. Measured: body 12.8px and mono labels 8.8px at
  a 1150px viewport, against a 16px/11px design. This was the dominant cause of the
  site reading as "too much small text", and it also broke browser font-size
  preferences (WCAG 1.4.4). Root is now a fixed 16px and every type step and spacing
  token carries its own `clamp()`. See [[decisions-log]] ADR-0022 and [[design-system]].
- **Display face: Instrument Serif → Fraunces** (variable, `opsz`/`SOFT`/`WONK`).
  Headlines read as compressed because a single narrow cut was being scaled across
  the whole range *and* tracked in twice (`-0.022em` on `.font-display`, another
  `-0.03em` at `text-display-xl`). Fraunces is recut per size via `opsz`, set per
  type step; all blanket negative tracking is deleted. `WONK` pinned to 0 to keep
  the instrument register. See [[decisions-log]] ADR-0023 and [[tech-stack]].
- **Type scale rebuilt with a middle register.** Added `text-sub` (22 → 28px), which
  the scale previously lacked — nothing sat between 21px and 38px, so every label and
  description fell to 11–16px. Raised the floor throughout: `label-mono` 11 → 12.5px
  at `0.1em` tracking (was `0.14em`), `text-fine` 13 → 14px, `text-body` 15/16 → 16/17px,
  `text-lede` 21 → 24px. `text-readout` gained tabular lining numerals.

## 2026-08-10

- **Project repurposed as John Wu's personal portfolio.** The starter is no longer
  generic. Full build plan, aesthetic direction, conventions and remaining work live in
  `docs/portfolio-build-plan.md`, which is the status file to read first.
- **Design system replaced** — the placeholder `--background` / `--foreground` pair is
  gone. `globals.css` now carries the "lab bench / darkroom" token set: `paper`,
  `paper-2`, `paper-3`, `line`, `line-strong`, `ink`, `ink-2`, `ink-3`, `safelight`,
  `cyanotype`, each with a light (lab) and a `[data-theme="darkroom"]` value. Added a
  full type scale via `@utility`, a `.grain` plate, `.safelight-bloom`, and
  `.field-rules`. Details in [[design-system]], ADRs [[decisions-log]] ADR-0015 / 0016.
- **Fonts changed** — Onest replaced by **Instrument Serif** (display),
  **Instrument Sans** (body/UI) and **IBM Plex Mono** (telemetry). The variable
  classNames moved from `<body>` to `<html>`; leaving them on `<body>` made every face
  silently fall back to a system font. See [[decisions-log]] ADR-0017 and [[tech-stack]].
- **New content layer** — `src/data/` (`types`, `profile`, `projects`, `case-studies`,
  `photography`). No component hardcodes copy, and a `PLACEHOLDER` sentinel plus an
  `AssetSlot` union model content John has not supplied yet.
- **New UI kit** — `src/components/ui/` (`Reveal`, `MonoLabel`, `Section`,
  `MetricReadout`, `AssetFrame`) and `src/components/site/` (`SiteHeader`,
  `SiteFooter`, `ScrollRail`, `ThemeSync`). Catalogued in [[components/common]].
- **`src/lib/motion.ts`** — the only four spring configs used site-wide (`ease`,
  `heavy`, `react`, `snap`) plus text timings, so the whole page moves as one mechanism.
- **Home view built** — hero with headshot slot, work index, a full-bleed darkroom band
  that links to the photography compartment, positions, reference, contact.
- **Cookie banner unmounted** from the root layout. See [[decisions-log]] ADR-0014.
- **SEO** — `siteConfig` filled in for John; root JSON-LD switched from
  `Organization` + `WebSite` to `Person` + `WebSite`, with a
  `getProjectStructuredData` helper for case-study pages. See [[seo-metadata]].
- **Five case-study pages built** — `/work/vla-benchmarking`, `/work/tackle-vision`,
  `/work/terps-dashboard`, `/work/armtopoint`, `/work/cherry-canary`. One route and one
  view each rather than a `[slug]` template, so each page composes the shared
  scaffolding in its own order. [[decisions-log]] ADR-0019.
- **New `src/components/project/`** — `ProjectMasthead`, `SpecSheet`, `CaseStudyBody`,
  `FigurePlate`, `ProjectMetrics`, `ProjectNav`, `ProjectSchema`, plus `accent.ts`.
  Catalogued in [[components/common]].
- **Five hand-authored SVG figures** in `components/project/figures/`, server-rendered,
  no chart library, no client JS. [[decisions-log]] ADR-0018.
- **Sitemap** now derives case-study entries from `projects.filter(hasPage)` instead of
  listing only the home route.
- **Fixed:** `Reveal tag="dl"` does not type-check (`Tags` has no `dl`). Both the hero
  readout and the project masthead now wrap a real `<dl>` inside a `Reveal` div.
- **Photography compartment built** — `/photography`, the darkroom side of the site.
  `views/photography.tsx` plus `views/photography/` (`SheetMasthead`, `ContactSheet`,
  `metadata.ts`). The whole roll prints as one contact sheet: two six-frame strips,
  square frames butted on hairlines, film edge numbers in the rebate. Every frame is
  unexposed until John loads one. [[decisions-log]] ADR-0020.
- **`CompartmentDoor` extracted** to `components/site/`. The home page's darkroom band
  and the new lab band at the foot of `/photography` are now the same component seen
  from either side, with copy for both directions in `data/photography.ts → doors`.
- **Fixed: `[data-theme="lab"]` was not a real selector.** `globals.css` declared the
  lab palette on bare `:root` only, so a lab-themed band nested inside a darkroom page
  inherited the darkroom values and never lit up. The lab tokens now sit on
  `:root, [data-theme="lab"]`. See [[design-system]].
- **Sitemap** gained the `/photography` entry; per-page metadata comes from
  `views/photography/metadata.ts`. See [[seo-metadata]].

### Critical review pass (the AI-slop audit)

Every page read as rendered pixels and as extracted copy, then swept for
duplicated claims, controls that do nothing, figures that are not measurements, and
dead code. What changed:

- **`--ink-3` raised to WCAG AA in both compartments.** It was `#837e70` / `#6f6a5e`,
  which is 3.59:1 and 3.67:1 against `--paper` — a fail for small text, and this token
  carries nearly every label, caption and annotation on the site. Now `#625e54` /
  `#898374`, clearing 4.5:1 on `paper`, `paper-2` and `paper-3` in both themes.
  `--safelight` was measured and left alone: 4.59:1 on `paper`, and the sub-4.5 case
  (`signal` tone over `paper-2` in the lab) does not occur in the markup.
  See [[design-system]].
- **Fixed: two nav items marked "current" at once.** `isActive` returned true for both
  `/#work` and `/#contact` whenever `pathname === "/"`, so the home page permanently lit
  two of three links. Hash links are in-page jumps and now never take an active state;
  only real routes do.
- **Three "metrics" were not measurements.** `MetricReadout`'s `unit` slot renders as a
  superscript unit, so `{value:"7", unit:"GPU"}` printed `7ᴳᴾᵁ` and `{value:"32",
  unit:"B"}` printed `32ᴮ`. Both were folded back into the value and label. The third,
  `3ᴰ lifted joint tracks`, was a word split to look like a number in a panel headed
  "verified figures only", and was deleted. `MetricReadout` now picks its column count
  from `metrics.length` instead of hardcoding `grid-cols-3`.
- **Deleted `src/app/api/contact/route.ts`.** The site has no contact form by design
  ([[decisions-log]] ADR-0013), so this was an unreferenced public `POST` endpoint that
  console-logged submitted names, emails and messages. Nothing shipped calls it. Every
  route is now static — the build has no `ƒ` entries left. `lib/api`, `api-client.ts`
  and `env.ts` stay as the documented convention. See [[api-architecture]].
- **Deleted `src/components/common/Cookie/`** (7 files). ADR-0014 unmounted the banner
  in June; the module had been unreferenced ever since.
- **Footer rewritten.** It repeated `profile.discipline` verbatim under the name, which
  is already the hero subtitle, the header tagline and the metadata description; it
  carried a third Photography link that self-linked on `/photography`; and it signed off
  "Built in Next.js. Every motion is a spring.", which is an aphorism. Now: the name, the
  contact links, and a plain colophon. It also renders a Résumé link the moment
  `profile.resume.available` flips true — that flag existed but nothing read it, so the
  documented "never ship a link to a 404" guard was not actually wired to anything.
- **Copy fixes.** `Fig. 01 — …` became `Fig. 01. …` in all five figure captions (no em
  dashes in John's prose); the VLA figure note "Coverage, not scores" became "Task
  coverage" (antithesis); "too inflexible to edge cases" → "too inflexible for the edge
  cases"; the dead `profile.aside.photography` line was deleted rather than wired up,
  since `photography.ts` already carries that thought twice.
- **Removed labels that report what is already visible.** `SpecSheet`'s "N rows"
  counter, the duplicate `FIG. 01` marker inside the hero portrait (the figcaption
  already says it), and `/photography`'s "12 frames · 0 printed" section annotation,
  which restated two rows of the masthead readout on the same screen.
- **Hardcoded GPA** in the hero now reads `education.gpa`; external links carry
  `rel="noopener noreferrer"`.

Verified afterwards: `yarn lint` and `tsc --noEmit` clean, `yarn build` clean with
10 static routes, one `<h1>` per page on all seven pages, and both compartments
re-screenshotted.

## 2026-06-07

- **Fixed `<Inview>` standalone reveal + spring resize gating** — `<Inview>`
  never animated unless an external `trigger` ref was passed. The JSX `ref`
  callback wrote `inViewRef.current = node`, but that tuple slot is a *callback
  ref* (`setNode`), so the element was never observed and the `node` stayed
  `null`. Now calls `setInViewNode(node)`. This was also a build-breaking type
  error. Additionally, `<Inview>`, `<Spring>`, and `<Hover>` tracked `width` as a
  hook dependency but never passed it to `isMobileDisabled` — fixed by passing the
  tracked `width`, restoring resize re-evaluation and clearing the
  `react-hooks/exhaustive-deps` warnings. `yarn build` and `yarn lint` are now
  clean. See [[decisions-log]] ADR-0013 and [[components/animation-springs]].

## 2026-06-05

- **Home view emptied** — removed the animation showcase (`src/views/home-showcase.tsx`
  deleted) and reduced `HomeView` to an empty `<main>`. The home view is now the
  blank starting point for new work. Documented the convention — *if the project
  is empty and no other instructions are provided, start developing in the home
  view on route `/`* — in [[ai-agent-guide]] and [[new-page]].

## 2026-05-23

- **README — setup + Vercel deploy steps added** — *Getting started* expanded
  into a four-step flow (clone the template → delete bundled `.git` →
  initialise your own GitHub repo → install & run), with a macOS hint for
  revealing the hidden `.git` folder (`⇧ + ⌘ + .`). Added a *🚀 Deploy to
  Vercel* section covering the CLI flow (`vercel` / `vercel --prod`) and the
  dashboard import path, plus an `env pull` pointer to
  [[environment-variables]].
- **README rewritten to lead with the AI workflow** — root `README.md`
  reorganised so the AI usage guide is the first section: how the three
  `.claude/settings.json` hooks (`SessionStart`, `UserPromptSubmit`, `Stop`)
  enforce the vault workflow automatically, how to write a good request
  against this convention layer, and a cost-expectations note recommending
  **Claude Max (5×)** as the minimum plan (the vault-fan-out + hook
  re-injection on every turn is token-intensive by design). Technical
  *Getting started* and the existing AI-agents entry-point pointer stay
  below.

## 2026-05-22

- **Styling-placement convention added** — to stop `globals.css` accumulating
  hundreds of component-specific classes, styling now follows a strict
  placement order: one-offs are Tailwind utilities, repeated patterns become
  **React components** (not `@layer components` classes), and `@layer
  components` is reserved strictly for pseudo-elements and third-party
  overrides. `globals.css` stays bounded — `@import`, tokens, base resets only.
  No CSS Modules. Codified in [[decisions-log]] ADR-0012; [[design-system]]
  (new *Where a style goes* section) and [[component-conventions]] updated.
- **Semantic-HTML / SEO-markup convention added** — new [[html-semantics]]
  rulebook: landmarks, one `<h1>` + heading outline, native elements over
  `div`s, forms/images/ARIA, JSON-LD over microdata, a `data-*` convention, and
  passing a semantic `tag` to animation components. Codified as AGENTS.md hard
  rule #10; cross-linked from [[component-conventions]] and [[new-page]]. Fixed
  the demo (`home-showcase.tsx`) to a single `<h1>` to follow it.
- **API layer added** — a convention for reaching external services.
  `app/api/<resource>/route.ts` Route Handlers own their logic and read secret
  env vars directly (safe — route files never reach the browser). New: `zod`
  dependency; `src/env.ts` (validated env, public/server split); `src/lib/api/`
  (`handle` wrapper + `ApiError` + `{ data }`/`{ error }` envelope);
  `src/lib/api-client.ts` (typed same-origin fetch); example
  `app/api/contact/route.ts`. Codified as AGENTS.md hard rule #9. See
  [[decisions-log]] ADR-0011 and [[api-architecture]].

## 2026-05-21

- **Asset convention added** — site content assets (images, videos) now live
  under `public/assets/<section>/`, one folder per section; meta/PWA/SEO assets
  stay at the `public/` root. Documented in [[folder-structure]],
  [[component-conventions]], and the [[new-page]] playbook; `public/assets/`
  created with a `.gitkeep`.
- **SEO & performance hardening** — a broad pass on the starter. **SEO:** new
  `src/lib/site.ts` config (single source of truth, fed by `NEXT_PUBLIC_SITE_URL`);
  `metadataBase` is now always set (relative OG/canonical URLs resolve);
  `themeColor` moved to a `viewport` export; added `app/robots.ts`,
  `app/sitemap.ts`, and an `Organization`+`WebSite` JSON-LD helper; OG image
  dimensions corrected to match the asset; dead `keywords`/`other` tags dropped.
  **Performance:** populated `next.config.ts` (`removeConsole` in prod,
  AVIF/WebP, `next/image` breakpoints aligned to the grid, `poweredByHeader:
  false`); fixed a `requestAnimationFrame` leak in `ScrollLayout` (Lenis loop
  never cancelled on unmount); `HomeView` is now a Server Component with the
  animation demo split into the `HomeShowcase` client leaf; added
  `<ReducedMotion>` (honours `prefers-reduced-motion` via react-spring's global
  `skipAnimation`); removed a per-frame `console.log` from the demo; added
  `app/loading.tsx` / `error.tsx` / `not-found.tsx`. See [[decisions-log]]
  ADR-0010, [[seo-metadata]], and [[environment-variables]].
- **Animation engine — lint pass** — cleared all 13 pre-existing ESLint problems
  in the engine (2 errors + 11 warnings), an authorized engine edit (ADR-0009).
  `isMobileDisabled` now takes an optional `viewportWidth` argument, so the
  `active` memos in `<Spring>` / `<Hover>` / `<Inview>` / the trigger hooks
  depend on it genuinely. Added missing `disableOnMobile` effect deps; fixed a
  `trigger.current`-in-cleanup hazard in `<Hover>`; ref-stabilised `<Handle>`'s
  transition effects. **API change:** `useProgressTrigger` now returns `progress`
  as a `RefObject<number>` (read `.current`) instead of a render-time ref read —
  no consumer was affected (`<ProgressTrigger>` discards the return).
- **Animation engine — performance refactor** — fixed load issues that scaled
  with the number of animated components. Added `src/lib/animation/ticker.ts`, a
  single reference-counted `requestAnimationFrame` loop; `useLoop` (and all loop
  hooks) now subscribe to it instead of each starting its own rAF. `useWindowWidth`
  / `Height` / `Size` now share one debounced `resize` listener via a
  `useSyncExternalStore` store (the `debounceDelay` param was dropped — unused).
  `useDynamicInView` rewritten without the per-render `Proxy`/observer churn.
  Fixed a stale-closure bug in `useLoop`. `mode="forward"` scroll listeners made
  `passive`. This was an **authorized edit to `#do-not-modify` engine files** —
  hard rule #2 amended. See [[decisions-log]] ADR-0009 and [[animation-system]].
- **`spring-text-engine` updated** — bumped `^0.1.3` → `^0.1.5` (latest). The
  public API, types, and dependencies are unchanged between these versions
  (verified) — an internal-only patch bump, no code changes required.
- **Adaptive scaling grid added** — a root-font-size scaling system landed in
  `src/components/common/grid/` (`<AdaptiveGrid>` + `useAdaptiveGrid` hook +
  `grid.config.ts`), with `vw` media queries in `globals.css` for scale-down.
  It was dropped into `common/` as a `styled-components` system; ported to the
  project stack — config-driven TS + CSS-only Tailwind, no `styled-components`.
  The unused dropped files (`colors.ts`, `fonts.ts`, `utils.ts`, `index.ts`,
  the `styled-components` `grid.tsx`) were removed. Mounted via `<AdaptiveGrid>`
  in the root layout. See [[components/common]] and [[decisions-log]] ADR-0008.
- **Vault created** — `obsidian/` Obsidian vault initialised as the project's
  second brain. Architecture, frontend, and workflow docs populated. See [[decisions-log]] ADR-0001.
- **Root README rewritten** — replaced `create-next-app` boilerplate with a real
  project README that points into this vault.
- **`generic-layout-prompt.md` moved** — relocated from repo root to
  `obsidian/workflows/` as [[generic-layout-prompt]].
- **Navigation convention resolved** — standard `next/link` confirmed; the unbuilt
  `<AnimLink>` / `useAnimRouter()` convention dropped. See [[decisions-log]] ADR-0005.
- **Docs consolidated into the vault** — `project-specs.md` deleted (decomposed into
  vault notes + new [[environment-variables]]); `text-engine-docs.md` moved in as
  [[text-engine-reference]]. `AGENTS.md` rewritten as a thin shim; `.cursorrules`
  repointed to `@AGENTS.md`. The vault is now the single source of truth.
  See [[decisions-log]] ADR-0006.
- **Vault renamed & restructured** — vault folder `getlayers.io/` → `obsidian/`;
  number prefixes dropped from section folders (`00-meta` → `meta`, etc.). Project
  name standardised to **`next16-claude-starter`** across docs and `package.json`.
- **Components linked to docs** — every file in `src/components/` now carries a
  `// 📖 Docs:` pointer comment to its catalog note, so agents can jump from code
  to docs and back.
- **Vault workflow automated** — added `.claude/settings.json` with `SessionStart`,
  `UserPromptSubmit`, and `Stop` hooks that make agents read the vault first,
  follow the relevant guide, and update docs after every change — with no manual
  reminder. See [[decisions-log]] ADR-0007 and [[ai-agent-guide]].
- **Cookie component replaced** — the `react-cookie-consent`-based `cookie.tsx`
  was replaced by an in-house `Cookie/` component (banner + category preferences
  modal + Zustand store). `react-cookie-consent` removed from dependencies. The
  component shipped using `styled-components` + an external design system; it was
  ported to the project stack — Tailwind v4 tokens and `@react-spring/web` motion.
  Mounted via `<LazyCookie>`. See [[components/common]].
- **Fixed TextEngine spring type mismatch** — the `mode="once"` heading in
  `views/home.tsx` mixed `lineIn={{ y: 0 }}` (number) with `lineOut={{ y: "100%" }}`
  (string), throwing *"Cannot animate between _AnimatedString and _AnimatedValue"*.
  Changed to `y: "0%"`. The buggy pattern in [[text-engine]] / [[text-engine-reference]]
  examples was corrected and a type-matching gotcha note added.

## Project baseline (git history)

| Commit | Description |
|--------|-------------|
| `94b0870` | feat: update starter |
| `5280ef2` | fix: linter errors & build |
| `b2b84e6` | initial — `next16-claude-starter` scaffold |

> [!note]
> The starter shipped with: Next.js 16.2, React 19.2, Tailwind v4, `@react-spring/web`,
> `spring-text-engine`, Lenis, and Zustand. See [[tech-stack]] for the current state.
