// Line icons, drawn here so the game ships no image files and no third-party glyphs. Each is a path on a 24 by 24
// grid, stroked with the text colour. They are decoration beside a text label, never the only way to read a control.
const PATHS: Record<string, string> = {
  treasury: "M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16M12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4",
  grain: "M12 21V8M12 8c0-2 1-4 3-5M12 12c-2 0-4-1-5-3M12 12c2 0 4-1 5-3M12 16c-2 0-4-1-5-3M12 16c2 0 4-1 5-3",
  households: "M4 11l8-7l8 7M6 10v10h12V10M10 20v-5h4v5",
  welfare: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10",
  knowledge: "M4 6c3-1 6-1 8 1c2-2 5-2 8-1v12c-3-1-6-1-8 1c-2-2-5-2-8-1zM12 7v12",
  water: "M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11",
  inspect: "M3 12s3.5-6 9-6s9 6 9 6s-3.5 6-9 6s-9-6-9-6M12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5",
  canal: "M3 8c3-2 6 2 9 0s6 2 9 0M3 13c3-2 6 2 9 0s6 2 9 0M3 18c3-2 6 2 9 0s6 2 9 0",
  demolish: "M6 6l12 12M18 6L6 18",
  house: "M4 11l8-7l8 7M6 10v10h12V10M10 20v-5h4v5",
  farm: "M3 20h18M5 20l2-12M10 20l1-12M14 20l-1-12M19 20l-2-12M4 8h16",
  market: "M4 10l2-5h12l2 5M4 10c0 1.5 1.5 2.5 3 2.5S10 11.5 10 10c0 1.5 1 2.5 2 2.5s2-1 2-2.5c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5M6 13v7h12v-7",
  workshop: "M4 20V10l5 3v-3l5 3V6h4v14zM8 17h2M13 17h2",
  school: "M3 9l9-4l9 4l-9 4zM7 11v5c2 2 8 2 10 0v-5M21 9v6",
  bath: "M4 14h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM7 14V7a2 2 0 0 1 4 0M9 3v1M14 5c1 1 1 2 0 3M17 4c1 1 1 2 0 3",
  granary: "M5 20V10a7 7 0 0 1 14 0v10zM10 20v-5h4v5M9 10h6",
  library: "M5 4h4v16H5zM9 6h4v14H9zM14.5 7.5l3.8-1l3.2 12.5l-3.8 1z",
  hospital: "M5 20V9l7-5l7 5v11zM12 10v6M9 13h6",
  caravanserai: "M3 20V8h18v12M3 8l9-4l9 4M9 20v-6a3 3 0 0 1 6 0v6M6 11h2M16 11h2",
  mill: "M4 20V10h8v10M12 14a5 5 0 1 0 10 0a5 5 0 0 0-10 0M17 9v10M12 14h10M4 10l4-4l4 4",
  undo: "M9 7L4 12l5 5M4 12h10a5 5 0 0 1 0 10h-2",
  plan: "M4 4h16v16H4zM4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16",
  help: "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 16.5v.5",
  overview: "M12 3l3 6l6 3l-6 3l-3 6l-3-6l-6-3l6-3z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  left: "M15 5l-7 7l7 7",
  right: "M9 5l7 7l-7 7",
  check: "M5 12.5l4.5 4.5L19 7",
  endow: "M7 3h8l3 3v15H7zM15 3v3h3M10 10h5M10 13.5h5M12.5 17.5a1.6 1.6 0 1 0 0 0.1",
  nowater: "M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11M4.5 4.5l15 15",
  noreach: "M4 11l8-7l8 7M6 10v10h12V10M4.5 4.5l15 15",
  season: "M12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19",
};

export type IconName = keyof typeof PATHS;

export function icon(name: string, size = 20): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("icon");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", PATHS[name] ?? PATHS.inspect!);
  svg.append(path);
  return svg;
}
