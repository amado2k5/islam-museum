// From the rules' state to what each plot should look like. This is the only place the view reads the rules.
import { BATH_REACH, PLOTS, distance, has, seasonOfYear, servedByWater, wateredPlots, xyOf, type BuildingType, type State } from "../rules";
import type { PlotLook } from "./board";
import { canalMasks } from "./layout";

/** Figures a building puts on its lanes, apart from houses (which show their households). */
const FIGURES: Record<BuildingType, number> = { house: 0, farm: 1, market: 8, workshop: 4, school: 5, bath: 3, granary: 2, library: 5, hospital: 4, caravanserai: 6, mill: 2, fountain: 2, cistern: 1, papermill: 4 };

export function looksOf(s: State): { looks: PlotLook[]; walkers: number[] } {
  const wet = wateredPlots(s);
  const masks = canalMasks(s.canals);
  const baths: number[] = [];
  let houses = 0;
  for (let p = 0; p < PLOTS; p++) {
    if (s.plots[p] === "bath" && servedByWater(wet, p)) baths.push(p);
    if (s.plots[p] === "house") houses++;
  }
  const perHouse = houses === 0 ? 0 : s.households / houses;
  // The water wheel, once built, stands at the westernmost intake.
  let wheelPlot = -1;
  if (has(s, "water-wheel")) for (let p = 0; p < PLOTS && wheelPlot < 0; p++) if (xyOf(p)[1] === 0 && masks[p] !== 0) wheelPlot = p;
  const soy = seasonOfYear(s.season);
  const looks: PlotLook[] = [];
  const walkers: number[] = [];
  for (let p = 0; p < PLOTS; p++) {
    const type = s.plots[p] ?? null;
    const served = servedByWater(wet, p);
    const onBank = xyOf(p)[1] === 0;
    looks.push({
      type,
      canal: masks[p]! | (onBank && masks[p] !== 0 ? 4 : 0),
      served,
      bathed: type === "house" && served && baths.some((b) => distance(p, b) <= BATH_REACH),
      soy,
      lined: has(s, "lined-canals"),
      rotation: has(s, "crop-rotation"),
      wheel: p === wheelPlot,
      endowed: s.endowed.includes(p),
    });
    walkers.push(type === null || s.households === 0 ? 0 : type === "house" ? Math.max(1, Math.min(12, Math.round(perHouse / 3))) : FIGURES[type]);
  }
  return { looks, walkers };
}
