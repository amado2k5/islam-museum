// Museum passport (docs/delegation/education-master-plan.md E1). One localStorage key, `edu-passport`, that
// aggregates the progress the existing activities already keep under their own keys: the rules in edu/stamps.yaml
// say which key and which condition earns each stamp. No name, no age, no account; everything inside try/catch so
// a browser without storage still shows the page (with every stamp unearned).
import { mountShareBox, type ShareOpts } from "./share";

interface Rule { id: string; band: string; key: string; rule: string }
interface Passport { v: 1; band?: string; stamps: Record<string, string> }
const PP = "edu-passport";
const SRS = "edu-srs";

const get = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };
const keys = (): string[] => { try { const out: string[] = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k) out.push(k); } return out; } catch { return []; } };
const today = () => new Date().toISOString().slice(0, 10);
const truthyCount = (o: unknown) => (o && typeof o === "object" ? Object.values(o as Record<string, unknown>).filter(Boolean).length : 0);

function earned(r: Rule): boolean {
  const [name, arg] = r.rule.split(":");
  const n = Number(arg || 0);
  if (name === "prefix-any") return keys().some((k) => k.startsWith(r.key));
  if (name === "prefix-keys-min") return keys().filter((k) => k.startsWith(r.key)).some((k) => { try { return truthyCount(JSON.parse(get(k) || "{}")) >= n; } catch { return false; } });
  const v = get(r.key);
  if (v == null) return false;
  if (name === "number-min") return Number(v) >= n;
  try {
    const o = JSON.parse(v);
    if (name === "list-min") return Array.isArray(o) && o.length >= n;
    if (name === "keys-min") return truthyCount(o) >= n;
  } catch { /* not JSON */ }
  return false;
}

function load(): Passport {
  try { const p = JSON.parse(get(PP) || "null"); if (p && p.v === 1 && p.stamps && typeof p.stamps === "object") return p; } catch { /* fresh */ }
  return { v: 1, stamps: {} };
}
const save = (p: Passport) => { try { localStorage.setItem(PP, JSON.stringify(p)); } catch { /* storage unavailable */ } };

function dueToday(): number {
  try {
    const s = JSON.parse(get(SRS) || "{}") as Record<string, Record<string, { due?: string }>>;
    const t = today();
    let n = 0;
    for (const deck of Object.values(s)) for (const it of Object.values(deck)) if (it && it.due && it.due <= t) n++;
    return n;
  } catch { return 0; }
}

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

function init() {
  const payload = document.querySelector("[data-passport-rules]");
  if (!payload) return;
  let rules: Rule[] = [];
  try { rules = JSON.parse(payload.textContent || "[]"); } catch { rules = []; }
  let pp = load();

  const compute = () => {
    const now = today();
    let changed = false;
    for (const r of rules) {
      if (earned(r) && !pp.stamps[r.id]) { pp.stamps[r.id] = now; changed = true; }
    }
    if (changed) save(pp);
  };

  const paint = () => {
    const ids = rules.map((r) => r.id);
    const total = ids.length;
    const n = ids.filter((id) => pp.stamps[id]).length;
    document.querySelectorAll<HTMLElement>("[data-stamp]").forEach((el) => {
      const on = !!pp.stamps[el.dataset.stamp || ""];
      el.classList.toggle("on", on);
      const lbl = on ? el.dataset.onLabel : el.dataset.offLabel;
      if (lbl) el.setAttribute("aria-label", lbl);
      const st = el.parentElement?.querySelector<HTMLElement>("[data-stamp-state]");
      if (st && lbl) st.textContent = lbl;
    });
    document.querySelectorAll<HTMLElement>("[data-passport-count]").forEach((el) => {
      const scope = el.dataset.band;
      const sIds = scope ? rules.filter((r) => r.band === scope).map((r) => r.id) : ids;
      const sn = sIds.filter((id) => pp.stamps[id]).length;
      el.textContent = fill(el.dataset.tpl || "{n}/{total}", { n: String(sn), total: String(sIds.length) });
    });
    document.querySelectorAll<HTMLElement>("[data-passport-empty]").forEach((el) => { el.hidden = n > 0; });
    document.querySelectorAll<HTMLElement>("[data-stamps]").forEach((el) => {
      const need = (el.dataset.stamps || "").split(",").filter(Boolean);
      el.classList.toggle("done", need.length > 0 && need.every((id) => pp.stamps[id]));
    });
    // next step: the first activity whose stamps are not all earned
    document.querySelectorAll<HTMLElement>("[data-next-step]").forEach((sec) => {
      const cands = [...sec.querySelectorAll<HTMLElement>("[data-next-for]")];
      const pick = cands.find((c) => !(c.dataset.nextFor || "").split(",").filter(Boolean).every((id) => pp.stamps[id]));
      cands.forEach((c) => { c.hidden = c !== pick; });
      sec.hidden = !pick;
      const done = sec.parentElement?.querySelector<HTMLElement>("[data-all-done]");
      if (done) done.hidden = !!pick;
    });
    const due = dueToday();
    document.querySelectorAll<HTMLElement>("[data-due]").forEach((el) => {
      el.hidden = due === 0;
      const tgt = el.querySelector<HTMLElement>("[data-due-text]") ?? el;
      tgt.textContent = fill(el.dataset.tpl || "{n}", { n: String(due) });
    });
    return { n, total };
  };

  compute();
  let counts = paint();

  // erase: two-step confirm, clears the passport, the review schedule, the study results and every key a rule reads
  const erase = document.querySelector<HTMLButtonElement>("[data-passport-erase]");
  if (erase) {
    const label = erase.textContent || "";
    let armed = false; let timer: number | undefined;
    const disarm = () => { armed = false; erase.textContent = label; erase.classList.remove("armed"); if (timer) { clearTimeout(timer); timer = undefined; } };
    erase.addEventListener("click", () => {
      if (!armed) { armed = true; erase.textContent = erase.dataset.confirm || label; erase.classList.add("armed"); timer = window.setTimeout(disarm, 6000); return; }
      disarm();
      try {
        const exact = new Set(rules.filter((r) => !r.rule.startsWith("prefix")).map((r) => r.key));
        const prefixes = rules.filter((r) => r.rule.startsWith("prefix")).map((r) => r.key).concat(["edu-study:", "edu-practice:", "edu-dilemma:", "edu-detective:"]);
        for (const k of keys()) if (exact.has(k) || prefixes.some((p) => k.startsWith(p))) localStorage.removeItem(k);
        localStorage.removeItem(PP); localStorage.removeItem(SRS);
      } catch { /* storage unavailable */ }
      pp = { v: 1, stamps: {} };
      counts = paint();
      const msg = document.querySelector<HTMLElement>("[data-passport-msg]");
      if (msg) msg.textContent = erase.dataset.done || "";
    });
    erase.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  }

  // share: a card with the count and the earned icons
  const shareBtn = document.querySelector<HTMLButtonElement>("[data-passport-share]");
  const box = document.querySelector<HTMLElement>("[data-share-box]");
  if (shareBtn && box) {
    shareBtn.addEventListener("click", () => {
      const icons = rules.filter((r) => pp.stamps[r.id]).map((r) => document.querySelector<HTMLElement>(`[data-stamp="${r.id}"]`)?.textContent?.trim() || "").filter(Boolean);
      const d = shareBtn.dataset;
      const o: ShareOpts = {
        title: d.title || "",
        line: fill(d.line || "{n}/{total}", { n: String(counts.n), total: String(counts.total) }),
        icons,
        text: fill(d.text || "{title} · {n}/{total}", { title: d.title || "", n: String(counts.n), total: String(counts.total) }) + "\n" + (d.url || ""),
        url: (d.url || "").replace(/^https?:\/\//, ""),
        rtl: document.documentElement.dir === "rtl",
        fileName: "islam-museum-passport.png",
      };
      mountShareBox(box, o, { image: d.image || "PNG", copy: d.copy || "Copy", copied: d.copied || "", note: d.note || "" });
    });
  }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
