import type { Project } from "@/data/types";

/**
 * Project index.
 *
 * Ordering is by weight, not by date: the work that best represents what John
 * does goes first. Every metric here is drawn from his verified fact bank.
 * Unverified numbers from working repos are deliberately absent.
 */
export const projects: readonly Project[] = [
  {
    slug: "vla-benchmarking",
    start: "2026-05",
    index: "01",
    title: "Standardizing how a lab measures a robot policy",
    org: "Stanford University, NeuroAI Lab",
    role: "Research Intern",
    period: "May – Aug 2026",
    location: "Stanford, CA",
    discipline: "research",
    summary:
      "Evaluation harness for vision-language-action policies in RoboCasa, plus the multimodal pretraining data the lab trains them on.",
    stack: ["RoboCasa", "LeRobot", "Qwen3-VL", "PyTorch", "PyAV", "Multi-GPU"],
    metrics: [
      // An outcome against a baseline, and the only one on this page. It led
      // with three counts — clips, parameters, GPU-hours — every one of which
      // measures how much work happened rather than whether the work landed.
      // A reader who opens a section headed "Measured" and finds only volume
      // has learned that the author was busy.
      //
      // Per-arm silhouette IoU on ep_001053 at 40k point density, before and
      // after the rig baseline was re-solved. Both arms rose (0.564 → 0.658 and
      // 0.550 → 0.671) and precision and recall rose with them, so this is
      // alignment rather than a point cloud shrunk to fit. Same numbers as the
      // Fig. 02 caption, where they used to appear only as figure chrome.
      { value: "0.658", label: "rig IoU, up from 0.564" },
      // Exact count from the 8B captioning fleet across DROID, Bridge V2,
      // AgiBot and RH20T as of 2026-06-21. Previously rounded to "100k+",
      // which was true but understated the run by a third.
      { value: "155,656", label: "clips captioned" },
      // Replaces "7 GPU checkpoint shards", which nothing on the cluster
      // supported: the 32B checkpoint ships as 14 safetensors shards and was
      // served at tensor_parallel_size=2. This is the Bridge V2 32B recaption
      // campaign, whose batch metadata records 38,019 clips and 0 errors.
      { value: "235", unit: "GPU-h", label: "Bridge V2 recaption, 0 errors" },
    ],
    links: [],
    hasPage: true,
  },
  {
    slug: "tackle-vision",
    start: "2026-02",
    index: "02",
    title: "Scoring a hit from game film",
    org: "Children's National Hospital",
    role: "ML Engineering Intern",
    period: "Feb – May 2026",
    location: "Washington, DC",
    discipline: "research",
    summary:
      "Turning youth football game film into per-joint kinematics so clinicians have an objective early signal for head injury.",
    stack: ["YOLOv8", "ByteTrack", "YOLOv8-pose", "VideoPose3D", "Roboflow", "PyTorch"],
    metrics: [
      // "3D lifted joint tracks" used to sit here as a third figure. "3D" is a
      // word split to look like a number, and the panel is labeled "verified
      // figures only", so it went.
      //
      // "2 engineers on the pipeline" went for a different reason: team size is
      // not an achievement, and setting it in the same display numerals as the
      // training-set size invited a reader to weigh the two the same way. It is
      // still on the page, once, in the spec sheet under TEAM — which is where
      // a fact about staffing belongs.
      { value: "1,000+", label: "clip training set" },
    ],
    links: [
      {
        label: "github.com/JohnW-07/tackle-vision-ML",
        href: "https://github.com/JohnW-07/tackle-vision-ML",
        external: true,
      },
    ],
    hasPage: true,
  },
  {
    slug: "terps-dashboard",
    start: "2025-09",
    index: "03",
    title: "Live telemetry for a Formula SAE car",
    org: "Terps Racing EV",
    role: "Lead Engineer, Vehicle Dashboard",
    period: "Sep – Dec 2025",
    location: "College Park, MD",
    discipline: "systems",
    summary:
      "CAN bus data acquisition and the driver interface for Maryland's Formula SAE electric car, built by a team of six.",
    stack: ["piCore Linux", "CAN bus", "Python", "Embedded UI", "Custom hardware"],
    metrics: [
      // Outcome first. This led with the 60 Hz refresh rate, which is a spec of
      // the thing rather than a result of the work — and since the work index
      // shows `metrics[0]`, the row for this project advertised a sample rate.
      // The boot time is the actual result: twenty seconds down to under five,
      // on a car that was holding up the queue while the driver sat strapped in.
      { value: "75", unit: "%", label: "boot time removed, 20s → <5s" },
      { value: "60", unit: "Hz", label: "live telemetry" },
      { value: "6", label: "engineers led" },
    ],
    links: [],
    hasPage: true,
  },
  {
    slug: "armtopoint",
    start: "2025-09",
    index: "04",
    title: "One RGB camera, a position in three dimensions",
    org: "Personal research",
    role: "ML Engineer",
    period: "Sep 2025 – present",
    location: "College Park, MD",
    discipline: "research",
    summary:
      "A small convolutional network trained on MuJoCo renders that predicts where an object is well enough to drive an arm toward it.",
    stack: ["PyTorch", "MuJoCo", "NumPy", "Edge inference"],
    metrics: [
      { value: "±5", unit: "cm", label: "position error" },
      { value: "<1", unit: "min", label: "full video, on phone" },
      { value: "1", label: "camera, no depth" },
    ],
    links: [],
    hasPage: true,
  },
  {
    slug: "cherry-canary",
    start: "2026-04",
    index: "05",
    title: "Catching respiratory distress before SpO2 drops",
    org: "Bitcamp 2026",
    role: "Signal & ML Engineer",
    period: "Apr 2026",
    location: "College Park, MD",
    discipline: "hardware",
    summary:
      "A chest wearable that reads breathing off an accelerometer, and a model that only speaks once the rules have already decided something is wrong.",
    stack: ["ESP32", "MAX30102", "MPU-6050", "Signal processing", "Gemini", "CAD"],
    metrics: [
      { value: "1st", label: "Social Good track" },
      { value: "2", label: "sensors, one enclosure" },
      { value: "0", label: "models in the detection path" },
    ],
    links: [],
    hasPage: true,
  },
];

/** Work that is real and verified but does not carry a full case study. */
export const additionalWork: readonly {
  title: string;
  org: string;
  period: string;
  note: string;
}[] = [
  {
    title: "Cloud-seeding drone for drought relief",
    org: "US–Korea Conference 2024, with Desert Research Institute",
    period: "May – Nov 2024",
    note: "Co-authored the study. Iterated dozens of CAD designs and CFD-validated a physical scale model.",
  },
  // The Revit automation work used to have a card here. It was a near-verbatim
  // restatement of its own Positions row (Leuterio Thomas, same period, same
  // three-hours-to-fifteen-minutes result), so the page made one internship
  // look like two pieces of work. Positions owns it.
  {
    title: "Homelab telemetry dashboard",
    org: "Personal",
    period: "Ongoing",
    note: "A small Flask service reading CPU temperature and network counters off a Raspberry Pi, because the server should be able to tell you how it is doing.",
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const getAdjacentProjects = (slug: string) => {
  const pages = projects.filter((project) => project.hasPage);
  const at = pages.findIndex((project) => project.slug === slug);
  if (at === -1) return { previous: undefined, next: undefined };
  return {
    previous: at > 0 ? pages[at - 1] : pages[pages.length - 1],
    next: at < pages.length - 1 ? pages[at + 1] : pages[0],
  };
};
