// The palace a measurement run asks the game to draw. `default` is no URL flag: the palace the game itself shows,
// now granada/p1. `a` must be passed explicitly; since p1 became the default, an absent flag no longer means Set A.
export type PalaceMeasurementSet = "default" | "a" | "c" | "c1" | "c2";

const SETS: readonly PalaceMeasurementSet[] = ["default", "a", "c", "c1", "c2"];

export function parsePalaceMeasurementSets(argument: string): PalaceMeasurementSet[] {
  const sets = argument.split(",").map((part) => part.trim()) as PalaceMeasurementSet[];
  const bad = sets.filter((set) => !SETS.includes(set));
  if (bad.length > 0 || sets.length === 0) throw new Error(`unknown palace measurement set: ${bad.join(",") || "(empty)"}; use ${SETS.join(",")}`);
  return sets;
}

export function palaceArtQuery(set: PalaceMeasurementSet): string {
  return set === "default" ? "" : `&art=${set}`;
}
