// The region as a map: Granada, its two ports and the snow mountain, each where the museum's own coordinates put
// it, with a scale and north. It is a diagram of true positions and distances, not a drawn country: the coast is a
// line sketched through the coastal places the museum records, and says so. Layers lay the game's own state over
// it. The land is never mirrored: east is on the right in every language.
import type { VillageState, Scenario } from "../sim/village";
import { freeCapacity } from "../sim/economy";
import { CROPS, carries, poolCapacityOf } from "../sim/village";
import { metresBetween, onMap, type LatLon } from "../world/geography";

export interface RegionPlace {
  id: string;
  role: string;
  /** Kilometres east and north of Granada. */
  x: number;
  y: number;
  /** Straight-line kilometres from Granada. */
  km: number;
}
export type RegionLayer = "economy" | "agriculture" | "infrastructure";
export interface RegionView {
  places: RegionPlace[];
  /** The coastal places from west to east, shown or not: the coast is sketched through them. */
  coast: RegionPlace[];
  /** Where the game's invented valley is marked: in the plain west of the city. It is on no map. */
  valley: { x: number; y: number };
  /** The port the valley trades with, and the straight-line distance from the city to it, where the scenario has trade. */
  route: { to: string; km: number } | null;
  /** What each layer says, each a figure of the game as it stands. */
  facts: Record<RegionLayer, Array<{ key: string; values: Record<string, number | string> }>>;
}
type Pack = { places: Record<string, string>; records: Record<string, { coordinates?: number[] }> };

/** The places shown: the capital, the ports and the mountain. Other towns of the pack are left for later layers. */
const SHOWN = ["capital", "port", "mountain"];

export function regionView(sc: Scenario, s: VillageState, pack: Pack): RegionView {
  const at = (id: string): LatLon => pack.records[id]!.coordinates as unknown as LatLon;
  const capital = Object.entries(pack.places).find(([, role]) => role === "capital")![0];
  const origin = at(capital);
  const place = (id: string, role: string): RegionPlace => {
    const p = onMap(origin, at(id));
    return { id, role, x: Math.round(p.x / 100) / 10, y: Math.round(p.y / 100) / 10, km: Math.round(metresBetween(origin, at(id)) / 1000) };
  };
  const all = Object.entries(pack.places).filter(([id]) => pack.records[id]?.coordinates);
  const places = all.filter(([, role]) => SHOWN.includes(role)).map(([id, role]) => place(id, role));
  const coast = all.filter(([, role]) => role === "port" || role === "coast").map(([id, role]) => place(id, role)).sort((a, b) => a.x - b.x);
  const port = sc.trade ? places.find((p) => p.id === `place/${sc.trade!.port.id}`) : undefined;
  // An offer nothing could reach in time is no longer an offer.
  const first = sc.trade?.contracts[0];
  const held = first ? s.economy.contracts[first.id] : undefined;
  const contract = held && !(held.state === "offered" && s.day + sc.trade!.port.days > first!.byDay) ? held : undefined;
  const growing = sc.plots.filter((def) => s.plots[def.id]!.crop !== null);
  return {
    places,
    coast,
    valley: { x: -9, y: -1.5 },
    route: port ? { to: port.id, km: port.km } : null,
    facts: {
      economy: [
        ...(sc.trade && port ? [{ key: "region_carts", values: { used: s.carted, max: sc.trade.port.cartsPerDay } }, { key: "region_port_cash", values: { dinars: Math.floor(s.economy.markets[sc.trade.port.id]!.cash / 100) } }] : []),
        ...(contract ? [{ key: `region_contract_${contract.state}`, values: { have: contract.delivered, want: contract.units } }] : []),
        ...(s.shipments.length ? [{ key: "region_road", values: { n: s.shipments.length, units: s.shipments.reduce((n, sh) => n + sh.quantity, 0) } }] : []),
      ],
      agriculture: [
        { key: "region_fields", values: { sown: growing.length, all: sc.plots.length } },
        ...growing.map((def) => ({ key: "region_field", values: { field: def.id, crop: s.plots[def.id]!.crop!, growth: Math.floor(s.plots[def.id]!.growth / 10), good: CROPS[s.plots[def.id]!.crop!].good } })),
      ],
      infrastructure: [
        { key: "region_pool", values: { have: s.pool, max: poolCapacityOf(sc, s) } },
        { key: "region_channels", values: { flowing: sc.water.branches.filter((b) => carries(s.branches[b.id]!) > 0).length, all: sc.water.branches.length } },
        { key: "region_store", values: { free: freeCapacity(s.economy), room: s.economy.capacity } },
        { key: "region_built", values: { n: s.placed.filter((p) => p.done).length + s.built.house + s.built.granary } },
      ],
    },
  };
}

const NS = "http://www.w3.org/2000/svg";
type Attrs = Record<string, string | number>;
function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Array<SVGElement | string>): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  for (const c of children) e.append(c);
  return e;
}

/** The eight-point compass direction of a point east and north of the city. */
export const compass = (x: number, y: number): string => (["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const)[Math.round(((Math.atan2(x, y) * 180) / Math.PI + 360) / 45) % 8]!;
export interface RegionLabels {
  /** "Málaga: 89 km south-west of Granada", in the page's language. */
  from: (place: string, km: number, direction: string, city: string) => string;
  title: string;
  name: (id: string) => string;
  km: (n: number) => string;
  valley: string;
  coast: string;
  scale: string;
}
/** Draws the region. One unit of the sheet is one kilometre; north is up. */
export function drawRegion(root: SVGSVGElement, v: RegionView, layer: RegionLayer, labels: RegionLabels): void {
  const xs = [...v.places.map((p) => p.x), v.valley.x];
  const ys = [...v.places.map((p) => p.y), v.valley.y];
  const [x0, x1, y0, y1] = [Math.min(...xs) - 28, Math.max(...xs) + 28, Math.min(...ys) - 22, Math.max(...ys) + 24];
  // The sheet's y runs down, the land's north runs up.
  const X = (x: number) => x - x0;
  const Y = (y: number) => y1 - y;
  root.replaceChildren();
  root.setAttribute("viewBox", `0 0 ${Math.round(x1 - x0)} ${Math.round(y1 - y0)}`);
  root.setAttribute("role", "img");
  // For a reader who cannot see it: each place by how far it is from the city and in which direction.
  const capital = v.places.find((p) => p.role === "capital");
  root.setAttribute("aria-label", `${labels.title}. ${v.places.filter((p) => p.km > 0).map((p) => labels.from(labels.name(p.id), p.km, compass(p.x, p.y), capital ? labels.name(capital.id) : "")).join("; ")}.`);
  root.append(svg("rect", { x: 0, y: 0, width: x1 - x0, height: y1 - y0, class: "region-land" }));
  const byId = new Map(v.places.map((p) => [p.id, p]));
  const shore = v.coast;
  if (shore.length >= 2) {
    root.append(svg("path", { d: `M0,${Y(shore[0]!.y) + 3} ${shore.map((p) => `L${X(p.x)},${Y(p.y) + 3}`).join(" ")} L${x1 - x0},${Y(shore.at(-1)!.y) + 3} L${x1 - x0},${y1 - y0} L0,${y1 - y0} Z`, class: "region-sea" }));
    root.append(svg("text", { x: X((shore[0]!.x + shore.at(-1)!.x) / 2), y: y1 - y0 - 5, class: "region-note", "text-anchor": "middle" }, labels.coast));
  }
  if (layer === "economy" && v.route) {
    const to = byId.get(v.route.to)!;
    // The line is drawn from the city, because the distance beside it is the city's: the valley is invented and has none.
    const from = v.places.find((p) => p.role === "capital") ?? { x: 0, y: 0 };
    root.append(svg("path", { d: `M${X(from.x)},${Y(from.y)} L${X(to.x)},${Y(to.y)}`, class: "region-route" }));
    root.append(svg("text", { x: X((from.x + to.x) / 2) + 4, y: Y((from.y + to.y) / 2) + 5, class: "region-note", "text-anchor": "start" }, labels.km(v.route.km)));
  }
  for (const p of v.places) {
    const g = svg("g", { class: `region-place ${p.role}`, "data-place": p.id });
    if (p.role === "mountain") g.append(svg("path", { d: `M${X(p.x) - 7},${Y(p.y) + 4} L${X(p.x)},${Y(p.y) - 6} L${X(p.x) + 7},${Y(p.y) + 4} Z` }));
    else if (p.role === "capital") g.append(svg("rect", { x: X(p.x) - 3.2, y: Y(p.y) - 3.2, width: 6.4, height: 6.4 }));
    else g.append(svg("circle", { cx: X(p.x), cy: Y(p.y), r: 3 }));
    g.append(svg("text", { x: X(p.x), y: Y(p.y) + (p.role === "mountain" ? 13 : -6), class: "region-name", "text-anchor": "middle" }, labels.name(p.id)));
    root.append(g);
  }
  root.append(svg("g", { class: "region-valley", "data-place": "valley" }, svg("circle", { cx: X(v.valley.x), cy: Y(v.valley.y), r: 2.4 }), svg("text", { x: X(v.valley.x) - 5, y: Y(v.valley.y) + 2, class: "region-note", "text-anchor": "end" }, labels.valley)));
  // A scale of fifty kilometres, and north.
  root.append(svg("g", { class: "region-scale" }, svg("path", { d: "M8,14 l50,0 m-50,-2 l0,4 m25,-4 l0,4 m25,-4 l0,4" }), svg("text", { x: 33, y: 9, class: "region-note", "text-anchor": "middle" }, labels.scale)));
  root.append(svg("g", { class: "region-north", "aria-hidden": "true" }, svg("path", { d: `M${x1 - x0 - 12},16 l4,-11 l4,11 l-4,-3 z` })));
}
