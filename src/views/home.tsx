import { Contact } from "@/views/home/contact";
import { DarkroomDoor } from "@/views/home/darkroom-door";
import { Experience } from "@/views/home/experience";
import { Hero } from "@/views/home/hero";
import { Toolkit } from "@/views/home/toolkit";
import { WorkIndex } from "@/views/home/work-index";

/**
 * Home — the professional compartment.
 *
 * Order is deliberate. The face and the claim first, the evidence second, the
 * record third, the reference material fourth. The photography door sits
 * between the work and the record because that is where a reader who came for
 * the research is most likely to be willing to look at something else.
 */
export const HomeView = () => (
  <main>
    <Hero />
    <WorkIndex className="mt-section" />
    <DarkroomDoor />
    <Experience className="mt-section" />
    <Toolkit className="mt-section" />
    <Contact className="mt-section" />
  </main>
);
