# Design overhaul — running status

Last updated: 2026-08-10. Read this first when picking the work back up.

The task: John's assessment was that the site looked poor graphically — "serif fonts
too compressed together, too much small text, too few visual cues." The working method
he asked for is **iterate, and have an independent judge agent grade each iteration
ruthlessly.**

---

## State

`yarn build` and `yarn lint` are clean. All 12 routes prerender static.

Judge trajectory across independent agents (each sees only screenshots + a rubric,
never the rationale): **C− → C− → C+ → C+ → C+ → B → B+ → A− → B+ → A− → A− → A− → A−**.

The three flat C+ rounds were not wasted — they fixed structure and craft, and the grade
moved once the *content* problems started getting fixed rather than the layout ones.
Judge 8 was explicit that the remaining ceiling is content depth, not craft. The
blockers below are that ceiling; none of them can be resolved without John.

Every judge round is recorded in [[changelog]] under its date, newest first, with what
it found and what was done.

**The design work is closed.** Judge 13 — asked directly what separates the site from an
A, with explicit permission to say the design was finished — answered *"roughly
one-third design, two-thirds content"*, named the design third, and closed with **"I do
not think you should keep commissioning design rounds."** That third was then closed, and
judge 14 ran as a verification pass rather than a critique sweep: **no regressions across
all twelve page/viewport combinations**, A on typographic hierarchy, colour discipline,
craft and finish and anti-generic, and the verdict **"No. This is finished pending the
owner's content."**

Its verdict on the rest is worth quoting, because it is the argument for prioritising the
blocked list below over any further craft work:

> The site has exactly one visual register. Drawn vector, cream plate, ink and rust, from
> the first fold to the last. It is beautifully consistent and it is also monotonous by
> the fourth index row. The fix for monotony is tonal range: a face, a photograph, a
> texture, something that is not a diagram. **Twelve real photographs would do more for
> this site than any layout change available to you.** The empty-state handling is the
> best possible design response to having nothing, and it is still nothing.

Do not open another design round before the blocked items land. The next agent's job is
to wire in content, not to find more defects.

The one dip, A− → B+, was a regression introduced by a fix: the metrics band kept three
columns at 390px and drew its numerals on top of each other. It is the single most
instructive failure of the session — see the geometry trap below.

**Judges are frequently wrong, and checking first has never once been wasted.** A
representative sample:

| Claim | Reality |
|---|---|
| Duplicated fact tables on both case studies | Already fixed. That judge graded `shots-v7`, captured 90 seconds before the fix landed. Check capture time against file mtime before acting on any finding. |
| A tonal seam at y≈900 on every page | The film grain is `position: fixed`, so a full-page capture composites it over the first viewport only. A capture artifact. |
| Mobile page truncated, "do not ship" | The 16384px Chromium screenshot cap. |
| The accent system is arbitrary | It follows a documented rule in `accent.ts` and all five pages obey it; the "third hue" is the same token re-valued for the dark theme. |
| The `TRACKED JOINT` leader points at nothing | It stops 12 units short of the VELOCITY panel at a y inside it — a standard leader standoff. |
| Font sizes measured as too small | Measured off 2× images. |

The judge also suspected the smallest type failed contrast. That one was **half right**,
and only measurement separated the halves: `--safelight` on `--paper-2` really was
4.12:1, under AA, on every mono annotation inside every figure. The `ALERT` chip that a
naive script reports at 1.11:1 is a false positive — it is paper-coloured text on an SVG
`<rect>` fill, and an SVG fill is not a DOM ancestor, so a walk up `parentElement` never
sees it. Real value there is 4.73:1.

---

## Blocked on John — nothing else can resolve these

1. **A portrait.** Drop a file and set `profile.headshot` in `src/data/profile.ts` to
   `{ kind: "image", src: "...", alt: "..." }`. The hero already handles both states:
   with no portrait it composes as a full-width fold; the two-column layout and the
   `Fig. 01` caption return automatically when the data changes. No layout work needed.
2. **Photography frames.** `/photography` ships 12 empty frames. Every judge has ranked
   this in its top findings. `src/data/photography.ts` documents the drop-in path.
   The standing alternative, if the frames are not coming soon, is to pull Photography
   from the nav until it has content.
3. **`PyAV` in the stack list** (`projects.ts`, `profile.ts`). The cluster crawl found
   ffmpeg / cv2 / qwen_vl_utils and could not confirm PyAV. Not disproven — imports were
   never grepped — but it is John's own toolchain claim to confirm or drop.
4. **A résumé PDF.** `resume.available` is `false` in `profile.ts`, so no résumé link
   ships anywhere. Judge 4 rated this a top-three defect for the actual audience: a
   research recruiter looks for a CV, and the header wordmark reads "ML · CV · Vision
   systems", which puts the letters *CV* exactly where that eye lands meaning something
   else entirely. Drop `public/john-wu-resume.pdf` and flip the flag; the footer link is
   already wired and the header is one line away.
5. **A real result for tackle-vision.** Its stats band carries one figure, `1,000+ clip
   training set`, which is an input count. The band is now labelled **Scope** rather than
   Measured so it does not claim to be a result — that is a holding position, not a fix.
   Any verified accuracy, error rate or inter-rater agreement number would fix it;
   inventing one is not an option.
6. **An outcome for `cherry-canary`.** Every other case study now leads with a real one:
   `vla-benchmarking` rig IoU 0.564 → 0.658, `terps-dashboard` boot time 20s → under 5s,
   `armtopoint` ±5cm position error. Cherry has nothing beyond a hackathon track win.
   This and item 5 are the ceiling — judge 8 was explicit that what caps the grade now is
   content depth, not craft, and no amount of design work substitutes for it.

---

## Two open design decisions — John's call, not the next agent's

Judge 9 was asked to rule on both as a designer. Its answers are strong but neither is
mine to execute unilaterally: one conflicts with a principle enforced all session, and
the other means either building a feature or deleting the site's signature interaction.

**1. The case-study hanging margin.** Measured at 1440: margin column 437px, body 640px,
then 203px of nothing before the plate edge. The margin holds a section number and a
two-word heading, then 400+px of blank per section, so the device pays its full cost and
collects nothing.

> The judge's verdict: **keep it, do not recentre** — "a centred 640px column under a
> 1280px figure is a Medium post" — but *populate* the margin with values currently
> buried in the prose (38,019 clips; 235 GPU-hours; 64 GB of weights against an A40's
> 46). Then the asymmetry becomes a reading instrument and the case study can be skimmed
> by its margin. "If you do neither, recentre — an unresolved asymmetry is worse than
> symmetry."

**The caveat it did not weigh:** those numbers are *in the prose two inches away*.
Hanging them in the margin puts the same figure twice within ~100px, which is the exact
defect class this session spent four rounds removing (the email three times, the
availability line twice, four separate year echoes). It only works if the margin note is
a different register from the sentence — a reference or a unit, not a restatement — and
that is a copy decision, not a layout one.

**2. The scroll rail on case studies.** It runs on the home page only, which is the
*shortest* scroll of the three route types.

> The judge's verdict: **extend it or delete it.** The case studies are where a reader
> needs position, the readout already exists (`01 SPEC / 02.1 / 02.2 / 02.3 / 03`), and a
> rail that displays `02.2` as you pass it "is not decoration, it is the instrument the
> whole aesthetic is claiming to be". Home-only "reads as a mannerism: you announce a
> system on page one and withdraw it on page two, which a careful reader — the kind
> you're recruiting — notices."

Extending it means adding `data-rail-section` to the case-study sections; `ScrollRail`
already picks those up automatically. **Verify the rail's clearance first** — it sits at
x≈1390 against content ending at 1360, and that 30px gap is untested at narrower desktop
widths.

---

## Traps that cost real time. Do not fall into them again.

**Screenshot the production build, never the dev server.** `AssetFrame` prints its
drop-in path only when `NODE_ENV === "development"`. Two full judge rounds were spent
on "build instructions shipped to production" and a dev-tools badge, neither of which
exists in a real build.

**Chromium silently truncates screenshots past 16384px** and returns white below the
cut. The mobile home page is ~9500 CSS px, so at `deviceScaleFactor: 2` it exceeds the
cap and looks like a crashed page. `shot.mjs` now captures fold shots at 2× and
full-page shots at 1×, and warns if a document still exceeds the cap.

**`pkill -f "next start"` does not kill the server.** It leaves the old process holding
the port, so `yarn start` fails with `EADDRINUSE` and the stale build keeps serving —
including CSS hashes that no longer exist in the rebuilt `.next`, which renders the page
completely unstyled. Always `kill -9 $(lsof -ti :3100)`.

**Verify the thing that was broken, not a proxy for it.** The descender clipping was
reported fixed once when only the *rule position* had been checked; the glyphs were
still severed. Zoom in on the letterforms.

**`.next/cache/images` serves a stale image forever.** Next's optimizer caches by source
*path*, not by content, and the cache survives `yarn build`. Desaturated frames were
written to `public/`, the site rebuilt and the server restarted, and the page still
rendered the old fluorescent originals — the verification would have passed against an
image no longer on disk. `rm -rf .next/cache/images` before checking any image swap.

**Geometry cannot see overlapping text.** The worst defect of the whole session — the
flagship results band rendering as "155,656235" on a phone — survived nine judge rounds
and every script written to date, because a grid cell does not clip its overflow. The
bounding boxes were correct and non-overlapping while the glyphs inside them were drawn
on top of each other. `rules.mjs` and `contrast.mjs` are both box-based and are both
blind to it. **Crop the region and look at the image.** The same applies to the
horizontal clipping of the contact address, which a box measurement declared a perfect
fit while `.edu` was being amputated.

---

## Harness

Scratchpad: `/private/tmp/claude-501/.../b298457d-.../scratchpad/`
(`shot.mjs`, `measure.mjs`, `descender.mjs`, `encode.mjs`, `lab-figure-data.json`,
`lab-figures/`, `shots-v*/`).

```bash
yarn build && kill -9 $(lsof -ti :3100) 2>/dev/null; PORT=3100 yarn start &
node shot.mjs shots-vN / /work/vla-benchmarking /work/tackle-vision /photography
node contrast.mjs /          # WCAG AA audit of every type step under 15px
node rules.mjs /work/...     # hairline pairs bracketing empty page
node sweep.mjs               # metric-band overflow across 14 viewport widths
```

`shot.mjs` captures **desktop 1440 / tablet 768 / mobile 390**. Tablet was missing for
the first sixteen rounds, so every layout decision before v17 was made against two
widths — and the `sm` stacking fix landed exactly on that untested boundary. Anything
that changes a responsive variant needs the sweep, not just the three fixed widths.

`rules.mjs <route>` scans computed borders for near-full-width pairs less than 60px
apart with nothing between them. That shape — two hairlines bracketing empty page — is
this design's characteristic defect, because so many blocks carry their own top rule;
it found the duplicate masthead hairline on mobile and the over-padded section headers.
Run it after any change to a rule or a section header.

`contrast.mjs` sits in the scratchpad beside `shot.mjs`. Two things it gets right that a first attempt
got wrong, both worth preserving if it is rewritten: colours are resolved through a
**canvas**, because Tailwind v4 emits `color-mix(in oklab, …)` for every `/opacity`
utility and regexing the first three numbers out of an `oklab()` string reads a
lightness as a red channel and invents failures; and backdrops are **composited up the
whole ancestor chain**, because a translucent bar over paper is not the colour of either
one. Its blind spot is SVG: fills are siblings, not ancestors, so any text inside a
drawing that sits on a shape gets scored against the plate instead. Check those by hand.

---

## Judge loop

Dispatch a general-purpose agent, model opus, that reads only the screenshots and a
rubric — no code, no rationale. The prompt must state the capture conditions (production
build, mixed devicePixelRatio, full pages are complete) and list any already-decided
constraints (currently: the portrait and the empty contact sheet), or the judge spends
its best findings re-reporting them.

**Judges are wrong sometimes.** Verify any concrete claim before acting: one asserted a
"do not ship" mobile truncation that was the 16384px cap, and another measured font sizes
off 2× images. Both were disproven by measuring the DOM.

---

## Content accuracy — the cluster crawl

A subagent crawled `ccn2_8` (`/ccn2/u/johnwu07/`) read-only. Findings and provenance are
in `scratchpad/lab-figure-data.json`. **The single most valuable thing it found:**
`/ccn2/u/johnwu07/global_docs/` is a 16-file, 4,015-line, provenance-tracked report John
already wrote, including 75 curated figures. Prefer it over re-deriving anything.

Corrected on the site this round:

| Claim | Resolution |
|---|---|
| "7 GPU checkpoint shards" | **False.** Checkpoint is 14 safetensors shards, served at `TP=2`. Replaced with 235 GPU-h / 0 errors (Bridge V2), from batch metadata |
| "100k+ episodes" | Now exact: 155,656 clips; reconciled with the 38,019 Bridge V2 figure |
| "quantized to W8A16" | Removed — bf16 + `TP=2` evidence contradicts it |
| tackle-vision "License: Open source" | **False.** The GitHub API reports `JohnW-07/tackle-vision-ML` public with **no licence file**, and a public repo without one is all-rights-reserved. Now "Code / Public repository". **Add a LICENSE and the row can name it** — this is the cheapest of the open items |

Still open from the crawl, for John to decide:

- The **RoboCasa harness has zero surviving eval outputs** — it was built and merged but
  never produced retained measurements. The project title is defensible ("standardizing
  how a lab *measures*" — the harness is the deliverable), but no metric on that page may
  come from harness results. Any figure for it must be a schematic.
- The site describes **one** Stanford project; the cluster shows several distinct threads
  (ABC point tracking, bimanual rig calibration, CoT failure analysis). RoboCasa/LeRobot
  and the Qwen3-VL cluster work share no code or data — presenting them as one integrated
  stack overstates the connection.
- A **live Next.js + FastAPI dataset viewer** running on node8 is arguably the most
  demo-able artifact of the summer and appears nowhere on the site.
- The recurring thesis across every project — *distrusting success-shaped output*, with
  five separate campaigns that reported themselves healthy while producing nothing — is a
  stronger portfolio angle than the current framing, and is evidence-backed.

**Never publish:** collaborator names, the internal "blocked on PI" table, `cliona_test`
(BabyView child-video pilot — John excluded it explicitly), or `learnedSignal` (personal
trading research, references credential env vars). Verified absent from the repo by grep;
re-check before any future publish.

---

## Where the work is documented

Vault is the source of truth and is in sync as of this note:
`decisions-log.md` ADR-0022 (fixed root font-size), ADR-0023 (Fraunces),
ADR-0024 (figure registry; drawing vs capture) · `design-system.md` (type scale,
descender allowances) · `tech-stack.md` · `components/common.md` · `changelog.md`.
