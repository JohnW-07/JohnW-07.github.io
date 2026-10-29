import { CORE, FZ, SCAT, TRAIL } from "./constants";
import { easeOut } from "./math";

/** Wave front position over progress p ∈ [0, 1], clearing the field on both ends (M:323–324). */
export const makeFront = (qLo: number, qHi: number, gMed: number) => {
  const lead = (FZ + SCAT / 2) * gMed;
  const tail = (CORE + FZ + TRAIL + SCAT / 2) * gMed;
  return (p: number) => qLo - lead + easeOut(p) * (qHi - qLo + lead + tail);
};
