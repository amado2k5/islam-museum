// Refreshes the "this day" cards to the viewer's own day (the HTML carries the build day), using the museum's converter.
// Reads the small JSON index embedded in the page; no network, no model.
import { civilToHijri } from "../../../scripts/hijri/convert";

interface DayItem { m: number; d: number; id: string; href: string; label: string; date: string }
interface Payload { h: DayItem[]; g: DayItem[]; hm: string[]; gm: string[]; lang: string; t: { nearest: string; none: string; ah: string; ce: string; today: string } }

const H_LEN = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30];
const G_LEN = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const doy = (cal: "h" | "g", m: number, d: number) => (cal === "h" ? H_LEN : G_LEN).slice(0, m - 1).reduce((a, b) => a + b, 0) + d;
const circ = (cal: "h" | "g", a: number, b: number) => { const y = cal === "h" ? 354 : 366; const x = Math.abs(a - b); return Math.min(x, y - x); };

function onDay(list: DayItem[], cal: "h" | "g", m: number, d: number) {
  const exact = list.filter((x) => x.m === m && x.d === d);
  if (exact.length || !list.length) return { items: exact, exact: true };
  const me = doy(cal, m, d);
  let best = list[0], bd = Infinity;
  for (const x of list) { const dist = circ(cal, me, doy(cal, x.m, x.d)); if (dist < bd) { bd = dist; best = x; } }
  return { items: list.filter((x) => x.m === best.m && x.d === best.d), exact: false };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(root: HTMLElement, p: Payload) {
  const now = new Date();
  const g = { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
  const h = civilToHijri("gregorian", g).date;
  const pill = root.querySelector<HTMLElement>("[data-today-pill]");
  if (pill) pill.textContent = `${p.t.today} ${h.d} ${p.hm[h.m - 1]} ${h.y} ${p.t.ah} · ${g.d} ${p.gm[g.m - 1]} ${g.y}${p.t.ce ? " " + p.t.ce : ""}`;
  const cur: Record<string, string> = {};
  const fill = (cal: "h" | "g", m: number, d: number) => {
    const box = root.querySelector<HTMLElement>(`[data-cal="${cal}"]`);
    if (!box) return;
    const r = onDay(cal === "h" ? p.h : p.g, cal, m, d);
    const full = box.dataset.full === "1";
    const items = full ? r.items : r.items.slice(0, 1);
    const note = box.querySelector<HTMLElement>("[data-note]");
    if (note) note.textContent = r.items.length ? (r.exact ? "" : p.t.nearest) : p.t.none;
    const list = box.querySelector<HTMLElement>("[data-items]");
    if (list) list.innerHTML = items.map((x) => `<li><a href="${esc(x.href)}"><strong>${esc(x.label)}</strong></a> <span class="muted">— ${esc(x.date)}</span></li>`).join("");
    const go = box.querySelector<HTMLAnchorElement>("[data-go]");
    if (go && items[0]) go.href = items[0].href;
    if (items[0]) cur[cal] = items[0].id;
  };
  fill("h", h.m, h.d);
  fill("g", g.m, g.d);
  const btn = root.querySelector<HTMLButtonElement>("[data-shuffle]");
  if (btn) btn.addEventListener("click", () => {
    const pick = (cal: "h" | "g") => {
      const list = cal === "h" ? p.h : p.g;
      if (list.length < 2) return list[0];
      let x = list[Math.floor(Math.random() * list.length)];
      while (x.id === cur[cal]) x = list[Math.floor(Math.random() * list.length)];
      return x;
    };
    const a = pick("h"), b = pick("g");
    for (const [cal, x] of [["h", a], ["g", b]] as const) {
      if (!x) continue;
      const box = root.querySelector<HTMLElement>(`[data-cal="${cal}"]`);
      const list = box?.querySelector<HTMLElement>("[data-items]");
      const note = box?.querySelector<HTMLElement>("[data-note]");
      if (list) list.innerHTML = `<li><a href="${esc(x.href)}"><strong>${esc(x.label)}</strong></a> <span class="muted">— ${esc(x.date)}</span></li>`;
      if (note) note.textContent = "";
      const go = box?.querySelector<HTMLAnchorElement>("[data-go]");
      if (go) go.href = x.href;
      cur[cal] = x.id;
    }
  });
}

for (const root of document.querySelectorAll<HTMLElement>("[data-today]")) {
  const el = root.querySelector<HTMLScriptElement>("script[type='application/json']");
  if (!el) continue;
  try { render(root, JSON.parse(el.textContent || "{}")); } catch (e) { /* the build-day cards stay */ }
}
