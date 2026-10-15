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

// Shuffled deck, as on /wander: every option is shown once before any repeats. The deck and its position
// live in sessionStorage so they survive navigation; a reshuffle happens only once the deck is exhausted.
function shuffleDeck(n: number): number[] {
  const d = Array.from({ length: n }, (_, i) => i);
  for (let k = n - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [d[k], d[j]] = [d[j], d[k]]; }
  return d;
}
function nextFromDeck<T extends { id: string }>(key: string, pool: T[], skip: Set<string> = new Set()): T | undefined {
  if (!pool.length) return undefined;
  const k = `today-deck-v1-${key}-${pool.length}`;
  let s: { deck: number[]; pos: number } | null = null;
  try { const v = JSON.parse(sessionStorage.getItem(k) || "null"); if (v && Array.isArray(v.deck) && v.deck.length === pool.length && v.pos < pool.length) s = v; } catch (e) { /* no storage: a fresh deck each time */ }
  if (!s) s = { deck: shuffleDeck(pool.length), pos: 0 };
  // take the next option not already on screen; if every option is, take the next one anyway
  let pick = pool[s.deck[s.pos]];
  for (let guard = 0; guard < pool.length && skip.has(pick.id); guard++) { s.pos = (s.pos + 1) % pool.length; pick = pool[s.deck[s.pos]]; }
  s.pos++;
  try { sessionStorage.setItem(k, JSON.stringify(s)); } catch (e) { /* ignore */ }
  return pick;
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
  const fullMode = !!root.querySelector("[data-cal][data-full='1']");
  if (btn && fullMode) btn.addEventListener("click", () => {
    // the today page: jump to a random day that has events, in each calendar, and list all of them
    for (const cal of ["h", "g"] as const) {
      const list = cal === "h" ? p.h : p.g;
      const days = [...new Set(list.map((x) => `${x.m}-${x.d}`))].filter((k) => !(cur[cal] ?? "").startsWith(k + "|"));
      if (!days.length) continue;
      const day = nextFromDeck(`day-${cal}`, days.map((k) => ({ id: k })));
      if (!day) continue;
      const [m, d] = day.id.split("-").map(Number);
      fill(cal, m, d);
      cur[cal] = `${m}-${d}|${cur[cal]}`;
    }
  });
  if (btn && !fullMode) btn.addEventListener("click", () => {
    // neither card may show an event that is on screen now (in either card)
    const onScreen = new Set(Object.values(cur));
    const pick = (cal: "h" | "g") => {
      const list = cal === "h" ? p.h : p.g;
      const x = nextFromDeck(`item-${cal}`, list, onScreen) ?? list[0];
      if (!x) return x;
      onScreen.add(x.id);
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
