// The valley as a plan: river, pool, channel and branches, the three fields, the village and the store, drawn as
// SVG from the state of the game. It is the game's accessible view and its whole picture where there is no WebGPU:
// every field is a button with its condition in words, and nothing is told by colour alone. The land is never
// mirrored: east is on the right in every language.
import type { FieldCard } from "./model";

const NS = "http://www.w3.org/2000/svg";
type Attrs = Record<string, string | number>;
function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Array<SVGElement | string>): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  for (const c of children) e.append(c);
  return e;
}

export interface MapView {
  fields: FieldCard[];
  poolPct: number;
  storePct: number;
  houses: number;
  housesUnderWay: number;
  granary: "none" | "under-way" | "built";
  channelWork: boolean;
  season: number;
  rain: boolean;
  selected: string | null;
  labels: { title: string; river: string; pool: string; village: string; store: string; market: string; mountain: string; fieldLabel: (f: FieldCard) => string; channel: Record<"flowing" | "weak" | "none", string> };
}

// Where things are on the plan (a 1000 by 560 sheet).
export const FIELD_SHAPE: Record<string, { points: string; label: [number, number]; rows: Array<[number, number, number, number]> }> = {
  "river-meadow": { points: "150,178 470,160 492,262 168,282", label: [320, 228], rows: [[178, 200, 462, 184], [182, 222, 470, 206], [186, 244, 478, 228], [190, 266, 484, 250]] },
  "mill-field": { points: "120,340 452,322 474,468 138,490", label: [296, 412], rows: [[146, 362, 448, 346], [150, 390, 454, 374], [154, 418, 460, 402], [158, 446, 466, 430], [162, 474, 470, 458]] },
  "olive-terrace": { points: "724,300 962,286 972,452 736,468", label: [848, 384], rows: [[742, 326, 958, 314], [746, 366, 962, 354], [750, 406, 966, 394], [754, 446, 968, 434]] },
};
const BRANCH_PATH: Record<string, string> = {
  west: "M640,300 C560,318 500,318 452,340",
  east: "M640,300 C690,306 700,330 730,346",
  meadow: "M640,232 C580,226 540,214 484,214",
};
const FIELD_FILL: Record<string, string> = { fallow: "#8a6f4d", spent: "#9a8358", wheat_growing: "#7f9a4a", wheat_ripe: "#d9b24a", vegetables_growing: "#5f8f45", vegetables_ripe: "#4f9a3c", olives_growing: "#a8955e", olives_ripe: "#a8955e" };

export function drawMap(root: SVGSVGElement, v: MapView, onField: (id: string) => void): void {
  root.replaceChildren();
  root.setAttribute("viewBox", "0 0 1000 560");
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", v.labels.title);
  const winter = v.season === 3;
  root.append(
    svg("defs", {}, svg("clipPath", { id: "pool-clip" }, svg("ellipse", { cx: 640, cy: 196, rx: 62, ry: 38 }))),
    // Land, the far hills and the snow mountain to the south-east.
    svg("rect", { x: 0, y: 0, width: 1000, height: 560, fill: winter ? "#b9b29a" : v.season === 1 ? "#c9b77f" : "#b9b877" }),
    svg("path", { d: "M560,96 L700,26 L790,70 L860,14 L1000,84 L1000,0 L560,0 Z", fill: "#8e8f86" }),
    svg("path", { d: "M700,26 L728,40 L748,32 L770,58 L790,70 L818,44 L860,14 L892,36 L918,30 L952,60 L1000,84 L1000,0 L560,0 L560,60 Z", fill: "#f1f0ea", opacity: 0.9 }),
    svg("text", { x: 846, y: 108, class: "map-label far", "text-anchor": "middle" }, v.labels.mountain),
    // The river, from the mountains in the east down to the west.
    svg("path", { d: "M1000,118 C820,98 720,138 560,124 C400,110 240,138 0,120 L0,150 C240,170 400,142 560,156 C720,170 820,130 1000,150 Z", fill: "#3d7f95" }),
    svg("path", { d: "M1000,134 C820,114 720,154 560,140 C400,126 240,154 0,136", class: "flow river", fill: "none" }),
    svg("text", { x: 96, y: 112, class: "map-label" }, v.labels.river),
  );

  // The pool, filled to its level, with the intake from the river and the main channel below it.
  const level = 234 - Math.round((76 * Math.max(0, Math.min(100, v.poolPct))) / 100);
  root.append(
    svg("path", { d: "M640,150 L640,160", class: "channel flowing" }),
    svg("ellipse", { cx: 640, cy: 196, rx: 66, ry: 42, fill: "#6d5a3c" }),
    svg("ellipse", { cx: 640, cy: 196, rx: 62, ry: 38, fill: "#c9bf9f" }),
    svg("rect", { x: 574, y: level, width: 132, height: 240 - level, fill: "#3d86a0", "clip-path": "url(#pool-clip)" }),
    svg("text", { x: 640, y: 201, class: "map-label on-water", "text-anchor": "middle" }, `${v.labels.pool} ${v.poolPct}%`),
    svg("path", { d: "M640,238 L640,300", class: `channel ${v.poolPct > 0 ? "flowing" : "dry"}` }),
  );
  if (v.poolPct > 0) root.append(svg("path", { d: "M640,238 L640,300", class: "flow", fill: "none" }));

  // Branches: flowing, broken or not there, and said in words as well as drawn.
  for (const f of v.fields) {
    const d = BRANCH_PATH[f.branch.id];
    if (!d) continue;
    const g = svg("g", {}, svg("title", {}, v.labels.channel[f.branch.state]));
    g.append(svg("path", { d, class: `channel ${f.branch.state}` }));
    if (f.branch.state === "flowing" && v.poolPct > 0) g.append(svg("path", { d, class: "flow", fill: "none" }));
    if (f.branch.state === "weak") {
      // A break across the branch.
      const [x, y] = f.branch.id === "east" ? [692, 318] : [540, 322];
      g.append(svg("path", { d: `M${x - 9},${y - 9} L${x + 9},${y + 9} M${x + 9},${y - 9} L${x - 9},${y + 9}`, class: "break" }));
    }
    if (v.channelWork && (f.branch.state !== "flowing" || f.branch.id === "meadow")) g.append(svg("circle", { cx: f.branch.id === "east" ? 692 : f.branch.id === "meadow" ? 560 : 540, cy: f.branch.id === "east" ? 318 : f.branch.id === "meadow" ? 220 : 322, r: 13, class: "work-mark" }));
    root.append(g);
  }

  // Fields: each a button, with its crop and state in its label.
  for (const f of v.fields) {
    const shape = FIELD_SHAPE[f.id];
    if (!shape) continue;
    const look = f.crop === null ? "fallow" : f.stage === "spent" ? (f.crop === "olives" ? "olives_ripe" : "spent") : `${f.crop}_${f.stage === "growing" ? "growing" : "ripe"}`;
    const g = svg("g", { class: `field${v.selected === f.id ? " selected" : ""}${f.spoilsIn !== null && f.spoilsIn <= 0 ? " spoiling" : ""}`, tabindex: 0, role: "button", "aria-label": v.labels.fieldLabel(f), "data-field": f.id });
    g.append(svg("polygon", { points: shape.points, fill: FIELD_FILL[look] ?? FIELD_FILL.fallow!, class: "ground" }));
    if (f.crop === "olives") {
      for (const [x0, y0, x1, y1] of shape.rows) {
        g.append(svg("path", { d: `M${x0 - 10},${y0 + 14} L${x1 + 6},${y1 + 14}`, class: "terrace" }));
        for (let i = 0; i <= 6; i++) g.append(svg("circle", { cx: x0 + ((x1 - x0) * i) / 6, cy: y0 + ((y1 - y0) * i) / 6, r: 9 + (f.growth > 60 ? 2 : 0), class: `tree${f.stage === "ripe" || f.stage === "harvesting" ? " laden" : ""}` }));
      }
    } else if (f.crop !== null && f.stage !== "spent") {
      const part = f.stage === "harvesting" && f.yielded > 0 ? f.standing / f.yielded : 1;
      for (const [x0, y0, x1, y1] of shape.rows) g.append(svg("path", { d: `M${x0},${y0} L${x0 + (x1 - x0) * part},${y0 + (y1 - y0) * part}`, class: `rows ${f.crop} ${f.stage === "growing" ? "young" : "ripe"}`, "stroke-dasharray": f.crop === "vegetables" ? "10 8" : "none", "stroke-width": f.stage === "growing" ? 2 + Math.round(f.growth / 20) : 9 }));
    } else {
      for (const [x0, y0, x1, y1] of shape.rows) g.append(svg("path", { d: `M${x0},${y0} L${x1},${y1}`, class: "furrow" }));
    }
    const [lx, ly] = shape.label;
    g.append(svg("text", { x: lx, y: ly, class: "map-label field-name", "text-anchor": "middle" }, v.labels.fieldLabel(f).split(":")[0]!));
    g.addEventListener("click", () => onField(f.id));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onField(f.id);
      }
    });
    root.append(g);
  }

  // The village: one house drawn for every ten households of housing, the store with its fill, the market.
  const house = (x: number, y: number, cls: string) => svg("g", { class: cls }, svg("rect", { x, y, width: 34, height: 24 }), svg("path", { d: `M${x - 4},${y} L${x + 17},${y - 14} L${x + 38},${y} Z`, class: "roof" }));
  const spots: Array<[number, number]> = [[572, 434], [612, 430], [652, 434], [532, 438], [692, 438], [572, 484], [612, 480], [652, 484], [532, 488], [692, 488]];
  spots.slice(0, v.houses + v.housesUnderWay).forEach(([x, y], i) => root.append(house(x, y, i < v.houses ? "house" : "house building")));
  root.append(svg("text", { x: 650, y: 540, class: "map-label", "text-anchor": "middle" }, v.labels.village));
  root.append(
    svg("g", { class: "store" }, svg("rect", { x: 500, y: 362, width: 62, height: 40 }), svg("rect", { x: 504, y: 402 - Math.round((36 * v.storePct) / 100), width: 54, height: Math.round((36 * v.storePct) / 100), class: "fill" }), svg("path", { d: "M494,362 L531,340 L568,362 Z", class: "roof" })),
    svg("text", { x: 531, y: 418, class: "map-label small", "text-anchor": "middle" }, `${v.labels.store} ${v.storePct}%`),
  );
  if (v.granary !== "none") root.append(svg("g", { class: `store granary${v.granary === "under-way" ? " building" : ""}` }, svg("rect", { x: 576, y: 372, width: 50, height: 30 }), svg("path", { d: "M570,372 L601,354 L632,372 Z", class: "roof" })));
  root.append(svg("g", { class: "market" }, svg("path", { d: "M800,496 L852,496 L846,480 L806,480 Z" }), svg("rect", { x: 806, y: 496, width: 40, height: 16 })), svg("text", { x: 826, y: 530, class: "map-label small", "text-anchor": "middle" }, v.labels.market));
  if (v.rain) for (let i = 0; i < 26; i++) root.append(svg("path", { d: `M${(i * 211) % 1000},${(i * 97) % 520} l-6,16`, class: "rain" }));
  // North, so nobody has to guess which way the valley lies.
  root.append(svg("g", { class: "north", "aria-hidden": "true" }, svg("path", { d: "M40,52 L48,24 L56,52 L48,46 Z" })));
}
