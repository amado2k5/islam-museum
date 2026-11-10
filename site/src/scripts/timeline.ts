// Browser side of the Hijri timeline (Part 3, C.2): cards on hover/click, the draggable playhead with a dual-date readout,
// the هجري/ميلادي toggle, keyboard control (arrows move the playhead; Enter opens a marker), and zoom to an era band.
// Re-layout uses the same pure functions as the build. The data comes from /timeline-data/<lang>.json, the same origin;
// without it the page keeps its build-time drawing and every event is still listed without JavaScript.
import { civilToHijri, hijriToCivil } from "../../../scripts/hijri/convert";
import { layoutBands, layoutMarkers, W, xOf, yearLabel, type TlEvent } from "../lib/timeline-layout";

interface Payload { lang: "ar" | "en" | "ur"; rtl: boolean; min: number; max: number; events: TlEvent[]; bands: { id: string; href: string; label: string; from: number; to: number }[]; early: number; t: Record<string, string> }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const svgNS = "http://www.w3.org/2000/svg";
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, text?: string) => {
  const e = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text !== undefined) e.textContent = text;
  return e;
};

async function init(root: HTMLElement) {
  let data: Payload;
  try {
    data = await fetch(root.dataset.src!).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
  } catch {
    return; // the page already shows its build-time drawing
  }
  const svg = root.querySelector<SVGSVGElement>("[data-svg]")!;
  const stage = root.querySelector<HTMLElement>("[data-stage]")!;
  const readout = root.querySelector<HTMLElement>("[data-readout]")!;
  const card = root.querySelector<HTMLElement>("[data-card]")!;
  const zoomAll = root.querySelector<HTMLButtonElement>("[data-zoom-all]")!;
  const { rtl, lang, t } = data;
  let min = data.min, max = data.max;
  let year = 1;
  const FLOOR = data.min;

  // --- calendar toggle: relabels the axis (both tick rows are in the SVG; CSS shows one)
  for (const b of root.querySelectorAll<HTMLButtonElement>("[data-cal-btn]")) b.addEventListener("click", () => {
    root.dataset.cal = b.dataset.calBtn;
    root.querySelectorAll<HTMLButtonElement>("[data-cal-btn]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
  });

  const ceOf = (y: number) => { const yy = Math.max(Math.floor(y), -5000); const c = hijriToCivil({ y: yy, m: 1, d: 1 }); return c.date.y; };
  const dual = (y: number) => `${t.year} ${yearLabel(Math.floor(y), lang)} · ${ceOf(y)}${t.ce ? " " + t.ce : ""}`;

  // --- layout (re-run on zoom)
  const TOP = 12, LANE = 9, BAND = 16;
  let axisY = 0;
  function render() {
    const events = data.events.filter((e) => e.y >= min && e.y <= max);
    const early = data.events.filter((e) => e.y < min);
    const markers = layoutMarkers(events, min, max, rtl);
    if (early.length) markers.push({ y: min, x: xOf(min, min, max, rtl), lane: markers.length ? Math.max(...markers.map((m) => m.lane)) + 1 : 0, r: 5, items: early });
    const bands = layoutBands(data.bands.filter((b) => b.to > min && b.from < max).map((b) => ({ ...b, from: Math.max(b.from, min), to: Math.min(b.to, max) })), min, max, rtl);
    const lanes = markers.length ? Math.max(...markers.map((m) => m.lane)) + 1 : 1;
    const rows = bands.length ? Math.max(...bands.map((b) => b.row)) + 1 : 0;
    axisY = TOP + lanes * LANE + 10;
    const H = axisY + 30 + rows * BAND + 6;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";
    const gb = el("g", {});
    for (const b of bands) {
      const a = el("a", { href: b.href, "data-band": b.id, "data-from": b.from, "data-to": b.to });
      a.appendChild(el("title", {}, b.label));
      a.appendChild(el("rect", { x: b.x0, y: axisY + 22 + b.row * BAND, width: Math.max(b.x1 - b.x0, 1), height: BAND - 2, rx: 3, class: "tl-band" }));
      if (b.x1 - b.x0 > 70) a.appendChild(el("text", { x: (b.x0 + b.x1) / 2, y: axisY + 22 + b.row * BAND + 11, "text-anchor": "middle", class: "tl-band-label" }, b.label));
      a.addEventListener("click", (e) => { e.preventDefault(); zoom(b.from, b.to); });
      gb.appendChild(a);
    }
    svg.appendChild(gb);
    svg.appendChild(el("line", { x1: 0, x2: W, y1: axisY, y2: axisY, class: "tl-axis" }));
    // ticks: Hijri (step by span) and CE centuries
    const span = max - min;
    const step = span > 800 ? 100 : span > 300 ? 50 : span > 120 ? 20 : span > 40 ? 10 : span > 12 ? 5 : 1;
    const gh = el("g", { class: "tl-ticks tl-ticks-h" });
    for (let y = Math.ceil(min / step) * step; y <= max; y += step) {
      const x = xOf(y, min, max, rtl);
      gh.appendChild(el("line", { x1: x, x2: x, y1: axisY - 4, y2: axisY + 4 }));
      gh.appendChild(el("text", { x, y: axisY + 16, "text-anchor": "middle" }, yearLabel(y, lang)));
    }
    svg.appendChild(gh);
    const gg = el("g", { class: "tl-ticks tl-ticks-g", "aria-hidden": "true" });
    const cmin = ceOf(min), cmax = ceOf(max);
    const cstep = cmax - cmin > 800 ? 100 : cmax - cmin > 300 ? 50 : cmax - cmin > 120 ? 20 : cmax - cmin > 40 ? 10 : cmax - cmin > 12 ? 5 : 1;
    for (let ce = Math.ceil(cmin / cstep) * cstep; ce <= cmax; ce += cstep) {
      const h = civilToHijri(ce < 1583 ? "julian" : "gregorian", { y: ce, m: 1, d: 1 }).date;
      const y = h.y + (h.m - 1) / 12;
      if (y < min || y > max) continue;
      const x = xOf(y, min, max, rtl);
      gg.appendChild(el("line", { x1: x, x2: x, y1: axisY - 4, y2: axisY + 4 }));
      gg.appendChild(el("text", { x, y: axisY + 16, "text-anchor": "middle" }, `${ce}${lang === "en" ? "" : t.ce ?? ""}`));
    }
    svg.appendChild(gg);
    const gm = el("g", {});
    for (const m of markers) {
      const a = el("a", { href: m.items[0].href, class: "tl-marker", "data-year": m.y, tabindex: 0 });
      const label = m.items.length === 1 ? `${m.items[0].label} — ${m.items[0].date}` : `${m.items.length} ${t.events} ${m.y < min + 0.001 && early.length ? t.before : yearLabel(Math.floor(m.y), lang)}`;
      a.appendChild(el("title", {}, label));
      const cy = axisY - 10 - m.lane * LANE;
      a.appendChild(el("circle", { cx: m.x, cy, r: m.r }));
      if (m.items.length > 1) a.appendChild(el("text", { x: m.x, y: cy + 2.2, "text-anchor": "middle", class: "tl-count" }, String(m.items.length)));
      const open = (e: Event) => { e.preventDefault(); showCard(m.items, m.x, cy, label); };
      a.addEventListener("click", open);
      a.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") open(e); });
      a.addEventListener("pointerenter", () => showCard(m.items, m.x, cy, label, true));
      gm.appendChild(a);
    }
    svg.appendChild(gm);
    const gp = el("g", { class: "tl-playhead", "aria-hidden": "true" });
    gp.appendChild(el("line", { x1: 0, x2: 0, y1: TOP - 4, y2: axisY + 20 + rows * BAND }));
    svg.appendChild(gp);
    setYear(Math.min(Math.max(year, min), max));
    zoomAll.hidden = min === data.min && max === data.max;
  }

  function zoom(from: number, to: number) {
    const pad = (to - from) * 0.08;
    min = Math.max(data.min, from - pad); max = Math.min(data.max, to + pad);
    hideCard();
    render();
  }
  zoomAll.addEventListener("click", () => { min = data.min; max = data.max; hideCard(); render(); });

  // --- playhead
  function setYear(y: number) {
    year = Math.min(Math.max(y, min), max);
    const x = xOf(year, min, max, rtl);
    const line = svg.querySelector<SVGLineElement>(".tl-playhead line");
    if (line) { line.setAttribute("x1", String(x)); line.setAttribute("x2", String(x)); }
    readout.hidden = false;
    readout.textContent = dual(year);
    readout.setAttribute("aria-valuenow", String(Math.floor(year)));
    readout.setAttribute("aria-valuetext", dual(year));
    readout.setAttribute("aria-valuemin", String(Math.floor(min)));
    readout.setAttribute("aria-valuemax", String(Math.floor(max)));
    // Keep the pill inside the track: clamp its centre so it never runs past either edge on narrow screens.
    const host = readout.offsetParent as HTMLElement | null;
    if (host) {
      const half = readout.offsetWidth / 2;
      const px = svg.offsetLeft + (x / W) * svg.getBoundingClientRect().width;
      const clamped = Math.min(Math.max(px, half), host.clientWidth - half);
      readout.style.insetInlineStart = "auto";
      readout.style.left = `${clamped}px`;
    }
  }
  const yearAt = (clientX: number) => {
    const r = svg.getBoundingClientRect();
    const tx = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    const u = rtl ? 1 - tx : tx;
    return min + u * (max - min);
  };
  let dragging = false;
  stage.addEventListener("pointerdown", (e) => {
    if ((e.target as Element).closest(".tl-marker, [data-band], .tl-card")) return;
    dragging = true; stage.setPointerCapture(e.pointerId); setYear(yearAt(e.clientX)); hideCard();
  });
  stage.addEventListener("pointermove", (e) => { if (dragging) setYear(yearAt(e.clientX)); });
  stage.addEventListener("pointerup", () => { dragging = false; });
  stage.addEventListener("pointercancel", () => { dragging = false; });
  readout.addEventListener("keydown", (e) => {
    const big = e.shiftKey ? 10 : 1;
    const dir = (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0) * (rtl ? -1 : 1);
    if (dir) { e.preventDefault(); setYear(year + dir * big); }
    else if (e.key === "Home") { e.preventDefault(); setYear(min); }
    else if (e.key === "End") { e.preventDefault(); setYear(max); }
  });

  // --- card
  let hoverTimer = 0;
  function showCard(items: TlEvent[], x: number, cy: number, title: string, hover = false) {
    window.clearTimeout(hoverTimer);
    const list = items.slice(0, 12).map((it) => `<li><a href="${esc(it.href)}"><strong>${esc(it.label)}</strong></a><span class="muted"> — ${esc(it.date)}</span>${it.s ? `<span class="tl-s">${esc(it.s)}</span>` : ""}</li>`).join("");
    const more = items.length > 12 ? `<li class="muted">+${items.length - 12}</li>` : "";
    card.innerHTML = `<div class="tl-card-head"><strong>${esc(title)}</strong><button type="button" class="tl-close" aria-label="${esc(t.close)}">×</button></div><ul>${list}${more}</ul>`;
    card.hidden = false;
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const px = (x / vb.width) * r.width, py = (cy / vb.height) * r.height;
    const cw = Math.min(360, r.width - 16);
    card.style.width = `${cw}px`;
    card.style.left = `${Math.min(Math.max(px - cw / 2, 0), r.width - cw)}px`;
    card.style.top = `${py + 14}px`;
    card.querySelector<HTMLButtonElement>(".tl-close")!.addEventListener("click", hideCard);
    if (hover) card.dataset.hover = "1"; else delete card.dataset.hover;
  }
  function hideCard() { card.hidden = true; }
  stage.addEventListener("pointerleave", () => { if (card.dataset.hover) hoverTimer = window.setTimeout(hideCard, 400); });
  card.addEventListener("pointerenter", () => window.clearTimeout(hoverTimer));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !card.hidden) hideCard(); });

  render();
}

for (const root of document.querySelectorAll<HTMLElement>("[data-timeline]")) void init(root);
