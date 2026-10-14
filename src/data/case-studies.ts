/**
 * Case study narratives.
 *
 * Written in John's own register, from his verified fact bank. The rules that
 * shaped this copy, taken from his voice notes:
 *
 *   No em dashes. No bold or lists inside prose. No engineered one-liners: if
 *   a sentence would work as a pull quote it is performing, and it gets cut.
 *   Narrate the causal chain instead of stating the conclusion and attaching
 *   evidence. Repeat the plain noun rather than reaching for a synonym. End
 *   flat, on a concrete consequence, never on a summary.
 *
 * Comma splices are deliberate. They are in his writing and they are not typos.
 *
 * Nothing here is invented. Where the fact bank records no obstacle for a
 * project, the copy says what is actually known instead of manufacturing a
 * struggle narrative.
 */

export interface CaseStudyBlock {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface SpecRow {
  readonly label: string;
  readonly value: string;
}

export interface CaseStudy {
  /** One sentence under the title. Sets up the problem, makes no claim. */
  readonly lede: string;
  readonly spec: readonly SpecRow[];
  readonly blocks: readonly CaseStudyBlock[];
  /** Caption printed under the page's bespoke figure. */
  readonly figureCaption: string;
}

export const caseStudies: Record<string, CaseStudy> = {
  "vla-benchmarking": {
    lede: "A lab that trains manipulation policies has to compare them, and comparing them turns out to be harder than training them.",
    spec: [
      // No "Lab" row. The masthead's WHERE already says "Stanford University,
      // NeuroAI Lab"; this said "NeuroAI Lab, Stanford University" — the same
      // fact with the words reversed, both visible in the first viewport.
      { label: "Advisor", value: "Dr. Dan Yamins" },
      { label: "Simulator", value: "RoboCasa" },
      { label: "Policy zoo", value: "LeRobot" },
    ],
    blocks: [
      {
        heading: "The problem",
        paragraphs: [
          "Policies arrive from different codebases, they expect different observation formats, and each one gets evaluated on whatever tasks its authors happened to pick. Two numbers from two papers are not comparable and everybody knows it, so the lab needed one harness that runs most LeRobot policies against the same RoboCasa tasks and produces numbers that mean the same thing.",
          "The other half of the problem was data. A vision-language-action model wants episodes paired with language, and the open datasets ship a lot of episodes with very little language attached to them.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "I built the evaluation pipelines. Most LeRobot policies now run through the same path in RoboCasa, so benchmarking a new policy is a configuration rather than a new script, and the harness stays after I leave.",
          "For the data side I auto-labeled 155,656 clips from DROID, Bridge V2, AgiBot and RH20T with a two-pass Qwen3-VL pipeline. The first pass writes atomic captions for individual steps, the second writes a global caption for the whole episode. That gave the lab a much larger multimodal pretraining set than it started with.",
          "I also built a 3D point pipeline that recovers keypoints from incomplete trajectory data, including ABC Bot and MolmoAct2 bimanual, and trained a multimodal model on 3D points, language, optical flow, depth and RGB together.",
        ],
      },
      {
        heading: "Two things that went wrong",
        paragraphs: [
          "Serving the captioner was the obvious problem. Qwen3-VL-32B in bf16 is about 64 GB of weights and an A40 holds 46, so no single card could take it. Each vLLM engine spans two cards, six cards to a node makes three engines, and the run went out across three nodes. The Bridge V2 corpus came back at 38,019 clips and roughly 235 GPU-hours with no recorded errors.",
          "The second problem was quieter and worse. The VLM was systematically wrong about lateral motion, it would describe a gripper moving sideways as though it were reaching forward. A failure like that does not look like a failure, it looks like a caption, and at that scale nobody is reading them all. I added an optical-flow check on the gripper and used it to gate those descriptions, which removed the failure.",
        ],
      },
    ],
    figureCaption:
      "Fig. 01. Evaluation harness. One observation adapter, N policies, the same task suite and the same scoring.",
  },

  "tackle-vision": {
    lede: "Youth football head injuries get screened by people watching film and forming an opinion, and two people watching the same hit can disagree.",
    spec: [
      { label: "Team", value: "1 of 2 engineers on the pipeline" },
      { label: "Input", value: "Ordinary sideline game film" },
      // No third row here.
      //
      // It was `License: Open source`, which was two errors at once. A
      // spec-sheet key must be answered by its value — "open source" is not a
      // licence, MIT or Apache-2.0 is — and the claim was not true: the GitHub
      // API reports the repository public with **no licence file**, and a
      // public repo without one is all-rights-reserved by default.
      //
      // Rewriting it to `Code: Public repository` fixed the falsehood and left
      // a worse problem: the masthead already carries the repository as a live
      // link 250px above, so the spec sheet was spending a slot restating it —
      // and the restatement was the version you could not click. Add a LICENSE
      // to the repo and a `Licence` row naming it earns its place back.
    ],
    blocks: [
      {
        heading: "The problem",
        paragraphs: [
          "There is no number to argue with. A clinician watches a collision, decides it looked bad or did not, and that judgment is the screening decision. Children's National wanted an app that scores tackle severity from ordinary game film so the decision starts from a measurement.",
        ],
      },
      {
        heading: "The pipeline",
        paragraphs: [
          "Film goes in, and the pipeline has to find the players, keep them separate through the collision, recover their poses, and turn that into something a clinician can read. Detection and tracking are YOLOv8 with ByteTrack, pose estimation is YOLOv8-pose, and VideoPose3D lifts the 2D joints into 3D.",
          "From the lifted joints I compute per-joint velocity, acceleration and jerk, normalized so clips shot from different distances are comparable, and detect the impact frame automatically rather than asking somebody to scrub to it.",
        ],
      },
      {
        heading: "Where the off-the-shelf weights stopped working",
        paragraphs: [
          "Pretrained detectors are trained on people standing upright in good light, not on twenty-two kids in pads at the bottom of a pile. Detection failed in exactly the frames the measurement depends on, which is the moment of contact.",
          "I assembled and augmented a training set of more than a thousand clips and ran supervised fine-tuning and validation on it. That work is unglamorous and it is the thing that actually moved the numbers.",
        ],
      },
    ],
    figureCaption:
      "Fig. 01. Joint kinematics across an impact. Velocity, acceleration and jerk, with the detected impact frame marked.",
  },

  "terps-dashboard": {
    lede: "Maryland's Formula SAE team builds an electric race car every year, and the driver needs to read a few of its sensors at speed.",
    spec: [
      { label: "Team", value: "Terps Racing EV, University of Maryland" },
      { label: "Reports", value: "6 engineers" },
      { label: "OS", value: "piCore, RAM only" },
      { label: "Bus", value: "CAN" },
    ],
    blocks: [
      {
        heading: "The problem",
        paragraphs: [
          "The car carries dozens of sensors on a CAN bus. Almost none of that matters to the driver in the moment, and a few pieces of it matter a great deal. I led the six engineers who built the data acquisition platform and the screen the driver actually looks at. I personally love cars, so this one was half passion and half club.",
        ],
      },
      {
        heading: "How it runs",
        paragraphs: [
          "The dashboard reads the CAN bus and renders live telemetry at 60 Hz. Everything runs on piCore, a Linux distribution that lives entirely in RAM, which matters because a race car loses power without warning and a filesystem caught mid-write does not always come back.",
          "Beyond the software I drove the technical pivots, delegated subsystems, taught the team the embedded stack, and coordinated custom hardware with fabrication and procurement.",
        ],
      },
      {
        heading: "The twenty seconds nobody wanted to own",
        paragraphs: [
          "The first build took about twenty seconds to show anything. Twenty seconds is a long time when a driver is strapped in and the car is holding up the queue, and it is the kind of number that gets tolerated because it belongs to no single subsystem. I took it, trimmed dependencies, and deferred everything that did not need to exist before the first frame. It boots in under five.",
          "The part I got wrong was scoping. I plan for the case where everything works, the team missed checkpoints because of it, and I have been padding estimates for the messy case since.",
        ],
      },
    ],
    figureCaption:
      "Fig. 01. Boot sequence, before and after. Time to first frame, in seconds.",
  },

  armtopoint: {
    lede: "A depth camera is the normal way to get a 3D position. It is also a thing you have to buy, mount and calibrate.",
    spec: [
      { label: "Project", value: "ArmToPoint (ConvPose)" },
      { label: "Data", value: "MuJoCo renders, generated for this" },
      { label: "Model", value: "Lightweight CNN, PyTorch" },
      { label: "Target", value: "On-device inference" },
    ],
    blocks: [
      {
        heading: "The question",
        paragraphs: [
          "I wanted to know how far a single RGB camera and a small model could get at the job a depth sensor normally does, which is telling an arm where a thing is.",
        ],
      },
      {
        heading: "The loop",
        paragraphs: [
          "I generated the dataset by rendering scenes in MuJoCo rather than using an existing one, trained a lightweight convolutional network in PyTorch to predict the object's 3D position from a single frame, and wrote the evaluation that decides whether it worked. The predictions feed a control loop that drives a simulated arm's end effector toward the object.",
          "It predicts position to within about five centimeters from one RGB camera, and a full video processes in under a minute on a phone.",
        ],
      },
      {
        heading: "What I take from it",
        paragraphs: [
          "The part I am proudest of is not the error number, it is that every piece of the loop is mine. I generated the data, processed it, trained the model, and built the thing that measures it, which means when a number moves I know which of those four moved it.",
          "It is still in progress.",
        ],
      },
    ],
    figureCaption:
      "Fig. 01. One camera, one frame, a position estimate and its error volume.",
  },

  "cherry-canary": {
    lede: "Blood oxygen is a late signal. By the time SpO2 drops, respiratory distress has been happening for a while.",
    spec: [
      { label: "Event", value: "Bitcamp 2026, University of Maryland" },
      { label: "Result", value: "Social Good track winner" },
      { label: "Compute", value: "ESP32" },
      { label: "Sensors", value: "MAX30102 · MPU-6050" },
      { label: "Enclosure", value: "Designed for this build" },
    ],
    blocks: [
      {
        heading: "The idea",
        paragraphs: [
          "A chest wearable that watches breathing directly and says something before the oxygen number moves. The hardware is an ESP32 with a MAX30102 pulse oximeter and an MPU-6050 accelerometer, in a housing I designed.",
        ],
      },
      {
        heading: "Getting breathing out of an accelerometer",
        paragraphs: [
          "Breathing shows up in a chest accelerometer as a small, slow oscillation buried under every other thing a body does. It started as pure math, a low pass filter that pulls the breathing rate out of the noise, and then a rule that fires when heart rate and breathing rate diverge.",
        ],
      },
      {
        heading: "The model I threw away",
        paragraphs: [
          "Rules alone were too inflexible for the edge cases, so I tried to LoRA fine-tune a Gemma model. I killed it once it was clear we did not have enough high quality, diverse data for it to generalize, and a model that has memorized six people is worse than a rule, because it is confident.",
          "What shipped is split. The onboard processor does deterministic filtering and hands up clean chunked time-series trends, and Gemini sits on top of those trends and writes the plain-language alert. There is no model anywhere in the detection path, so the detection path can be tested.",
          "It won the Social Good track at Bitcamp 2026. The win is not really the point, the useful part was finding out where a model belongs and where it does not.",
        ],
      },
    ],
    figureCaption:
      "Fig. 01. Heart rate and breathing rate over time. The alert fires on divergence, not on a threshold.",
  },
};

export const getCaseStudy = (slug: string): CaseStudy | undefined =>
  caseStudies[slug];
