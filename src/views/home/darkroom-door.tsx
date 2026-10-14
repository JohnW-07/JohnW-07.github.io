import { CompartmentDoor } from "@/components/site/compartment-door";
import { doors, sheet } from "@/data/photography";

/** The way out of the professional compartment. Mirrored by the lab door on `/photography`. */
export const DarkroomDoor = () => (
  <CompartmentDoor
    theme="darkroom"
    href="/photography"
    code={`Roll ${sheet.rollCode}`}
    {...doors.toDarkroom}
  />
);
