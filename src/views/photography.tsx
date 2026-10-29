import { CompartmentDoor } from "@/components/site/compartment-door";
import { doors, sheetFrames as frames, loadedCount, sheet } from "@/data/photography";
import { projects } from "@/data/projects";
import { ContactSheet } from "@/views/photography/contact-sheet";
import { SheetMasthead } from "@/views/photography/sheet-masthead";

/**
 * Facts about the sheet, not about the photographer.
 *
 * The fact bank records that John shoots and nothing else — no genre, no
 * camera, no body of work. So the masthead states what is actually knowable
 * here: how many frames the sheet holds and how many have been printed.
 */
const facts = [
  { label: "Sheet", value: sheet.rollCode },
  { label: "Frames", value: String(frames.length) },
  { label: "Printed", value: String(loadedCount) },
  { label: "Compartment", value: "Darkroom" },
] as const;

/**
 * Photography — the darkroom compartment.
 *
 * Three parts and no filler: the sheet's masthead, the sheet, and the door
 * back. There is no artist statement and no "selected works" carousel, because
 * inventing either would mean writing copy about work that has not been
 * published yet.
 *
 * The whole page runs in the darkroom theme, stamped on `<html>` before first
 * paint by the bootstrap script in the root layout, so there is no flash of
 * the lab palette on the way in. See `components/site/theme-sync.tsx`.
 */
export const PhotographyView = () => (
  <main>
    <SheetMasthead
      rollCode={sheet.rollCode}
      lede={sheet.lede}
      note={sheet.note}
      facts={facts}
    />
    <ContactSheet className="mt-4 lg:mt-8" />
    <CompartmentDoor
      theme="lab"
      href="/#work"
      code={`Index · ${projects.length} projects`}
      {...doors.toLab}
    />
  </main>
);
