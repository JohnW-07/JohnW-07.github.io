import { contact } from "@/data/contact";
import {
  PLACEHOLDER,
  type AssetSlot,
  type Credential,
  type ExperienceEntry,
  type ExternalLink,
  type SkillGroup,
} from "@/data/types";

/**
 * Identity and the first-screen readout.
 *
 * Copy is written to John's own register: plain nouns repeated rather than
 * varied, causal chains rather than conclusions-first, no engineered one-liners.
 * If you edit this file, read `obsidian/frontend/voice.md` first.
 */

export const profile = {
  name: "John Wu",
  /** Sits under the name. Says what he is, not what he aspires to. */
  title: "Computer science, University of Maryland",
  /** The single-line positioning statement used in metadata and the footer. */
  discipline: "Machine learning and computer vision for systems that sense the physical world",

  /**
   * Hero paragraph. Three sentences of setup, one sentence of motive. No
   * summary line at the end, by design.
   */
  statement: [
    "I work on machine learning for systems that sense the physical world.",
    "Right now that is vision-language-action models for robot manipulation at Stanford's NeuroAI Lab.",
    "Before that it was a pose pipeline scoring youth football head impacts from game film, and a race car dashboard reading dozens of CAN sensors at 60 Hz.",
    "What keeps pulling me back is the gap between what is happening physically and what a machine can detect in time to act on it.",
  ],

  /* Annotated as the full `AssetSlot` union rather than left to infer.
     With `satisfies` alone plus the outer `as const`, this narrows to the
     placeholder arm, and any consumer asking `headshot.kind === "image"` — the
     hero does, to decide whether to print a caption — fails to type-check
     against a variant the data is expected to take as soon as the file lands. */
  headshot: {
    kind: "placeholder",
    note: "Drop a portrait at public/assets/portrait/john-wu.jpg (3:4, min 1200px tall)",
  } as AssetSlot,
} as const;

/** The instrument readout beside the portrait. Facts only, no adjectives. */
/* `status` was removed here rather than left unused. It held six hero readout
   rows — Based, Degree, Minors, Most recent, Open to — every one of which is
   already stated in full elsewhere on the same page (Education, Positions, the
   masthead rule, the footer). Restating them cost a screen of small type and
   made the page read as longer than it is. If a hero fact block comes back,
   it should carry something no other section says. */

export const links: readonly ExternalLink[] = [
  { label: "Email", href: `mailto:${contact.email.primary}` },
  { label: "GitHub", href: contact.github, external: true },
  { label: "LinkedIn", href: contact.linkedin, external: true },
];

/** Résumé download. Edit it in `@/data/contact`. */
export const resume = contact.resume;

export const education = {
  school: contact.school,
  degree: "B.S. Computer Science",
  graduation: "Expected Spring 2028",
  gpa: "3.73",
  minors: ["Robotics & Autonomous Systems", "Technology Entrepreneurship & Corporate Innovation"],
  program: "College Park Scholars, Public Leadership",
  coursework: [
    "Algorithms",
    "Computer Systems (C / Assembly)",
    "Programming Languages",
    "Data Structures & OOP",
    "Discrete Structures",
    "Linear Algebra",
    "Data Science",
    "Robotics (ENME480)",
  ],
} as const;

/**
 * The co-authored paper, promoted out of `credentials`.
 *
 * For anyone reading this site to decide whether to interview John for a
 * research role, a conference co-authorship is the single most credentialing
 * item on it. It was the third row of a four-row Awards column at the very
 * bottom of the home page, in the smallest and lightest type used anywhere —
 * ranked below a hackathon track win by position. It now runs in the hero's
 * running head, which is the first line of the document.
 *
 * It is not restated in `credentials`. The work itself still has its own card
 * under "Also", which is a different claim: that is the project, this is the
 * publication.
 */
export const publication = {
  label: "Co-author",
  venue: "US–Korea Conference 2024",
  detail: "Cloud-seeding drone study, presented November 2024",
} as const;

export const credentials: readonly Credential[] = [
  {
    label: "Bitcamp 2026, Social Good track winner",
    detail: "University of Maryland",
    year: "2026",
  },
  {
    label: "President's Scholarship",
    detail: "University of Maryland merit award",
    year: PLACEHOLDER,
  },
  {
    label: "Semester Academic Honors",
    detail: "Fall 2025 and Spring 2026",
    year: "2026",
  },
];

export const experience: readonly ExperienceEntry[] = [
  {
    org: "Stanford University, NeuroAI Lab",
    role: "Research Intern",
    period: "May 2026 – Aug 2026",
    location: "Stanford, CA",
    note: "Evaluation harness and multimodal pretraining data for vision-language-action policies.",
    project: "vla-benchmarking",
  },
  {
    org: "Children's National Hospital",
    role: "ML Engineering Intern",
    period: "Feb 2026 – May 2026",
    location: "Washington, DC",
    note: "One of two engineers on the computer vision pipeline behind a head-injury screening app.",
    project: "tackle-vision",
  },
  {
    org: "Terps Racing EV",
    role: "Lead Engineer, Vehicle Dashboard",
    period: "Sep 2025 – Dec 2025",
    location: "College Park, MD",
    note: "Led six engineers building the CAN data acquisition platform and driver interface.",
    project: "terps-dashboard",
  },
  {
    org: "Leuterio Thomas",
    role: "Intern",
    period: "Jul 2025 – Aug 2025",
    location: "National Harbor, MD",
    note: "Revit plugins in C# that cut physical model production from about three hours to fifteen minutes.",
  },
  {
    org: "PBG Consulting",
    role: "CTO Intern",
    period: "Jun 2022 – Aug 2022",
    location: "Tysons Corner, VA",
    note: "Internal full-stack tools, and a seat next to the CTO for architecture and deployment calls.",
  },
];

export const skills: readonly SkillGroup[] = [
  {
    heading: "Languages",
    items: ["Python", "C", "C#", "Java", "TypeScript", "SQL"],
  },
  {
    heading: "Learning",
    items: ["PyTorch", "scikit-learn", "NumPy", "LoRA", "W8A16 quantization", "Multi-GPU sharding"],
  },
  {
    heading: "Vision",
    items: ["OpenCV", "YOLOv8", "ByteTrack", "VideoPose3D", "Optical flow", "VLM / VLA"],
  },
  {
    heading: "Simulation & robotics",
    items: ["MuJoCo", "RoboCasa", "LeRobot", "ROS-style control loops", "Unity3D"],
  },
  {
    heading: "Embedded",
    items: ["ESP32", "CAN bus", "piCore Linux", "Sensor fusion", "CAD", "CFD"],
  },
  {
    heading: "Working with",
    items: ["Linux", "Git", "REST APIs", "PyAV", "MLX", "Roboflow"],
  },
];

/*
 * An `aside.photography` line used to sit here. It was a third phrasing of
 * what `photography.ts` already says twice, on the door and on the sheet, and
 * nothing ever rendered it. Saying one thing three slightly different ways is
 * the tell, so it was deleted rather than wired up.
 */
