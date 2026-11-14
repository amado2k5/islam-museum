// The Hasanat and Sayyi'at Ledger's page script (docs/plan/50-hisab-browser.md). Small
// enhancements over a page that is complete without them: the count (the cards with their
// "Add" buttons, the list of what was added and the bar of sums) multiplies the visitor's
// numbers by the figures each text states (a range where the text gives a range, the worded
// result where it gives no number); the count and the counter's tally are kept in this
// browser's localStorage and nowhere else; the list filter narrows the cards by words and by
// ledger kind; a link to a part folded under "More on this page" opens it. Nothing is sent
// anywhere.
const lang = document.documentElement.lang || "ar";
const nf = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : lang === "ur" ? "ur-PK-u-nu-latn" : "en");
const fmtN = (n: number) => nf.format(n);

// ── the count: cards, what was added, sums ────────────────────────────────────
const hc = document.querySelector<HTMLElement>("[data-hc]");
if (hc) {
  const KEY = "hisab-cart-v1";
  const MAX = 1_000_000;
  const T = hc.dataset;
  const cards = [...hc.querySelectorAll<HTMLElement>("[data-hc-deed]")];
  const one = <E extends HTMLElement>(sel: string, root: ParentNode = hc) => root.querySelector<E>(sel)!;
  const lines = one("[data-hc-lines]"), empty = one("[data-hc-empty]"), clear = one("[data-hc-clear]"), count = one("[data-hc-n]");
  const qty = new Map<string, number>();
  const clamp = (v: unknown) => Math.min(MAX, Math.max(0, Math.floor(Number(v) || 0)));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (saved && typeof saved === "object") for (const c of cards) { const n = clamp(saved[c.dataset.id!]); if (n) qty.set(c.dataset.id!, n); }
  } catch { /* a private window without storage still counts for the visit */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(qty))); } catch { /* not saved */ } };
  const tpl = (t: string | undefined, v: Record<string, number>) => (t ?? "").replace(/\{(\w)\}/g, (_, k: string) => fmtN(v[k] ?? 0));
  const render = () => {
    let h = 0, hmax = 0, s = 0, e = 0, d = 0;
    const rows: HTMLElement[] = [];
    for (const c of cards) {
      const id = c.dataset.id!, n = qty.get(id) ?? 0, x = c.dataset;
      const input = one<HTMLInputElement>("[data-hc-qty]", c);
      if (document.activeElement !== input) input.value = String(n);
      one<HTMLButtonElement>("[data-hc-minus]", c).disabled = n === 0;
      c.toggleAttribute("data-on", n > 0);
      if (!n) continue;
      const ch = n * Number(x.h), chmax = n * Number(x.hmax), cs = n * Number(x.s), ce = n * Number(x.e), cd = n * Number(x.d);
      h += ch; hmax += chmax; s += cs; e += ce; d += cd;
      const parts: string[] = [];
      if (ch) parts.push(chmax > ch ? tpl(T.tRange, { a: ch, b: chmax }) : tpl(T.tHasanat, { n: ch }));
      if (cs) parts.push(tpl(T.tSayyiat, { n: cs }));
      if (ce) parts.push(tpl(T.tErased, { n: ce }));
      if (cd) parts.push(tpl(T.tDegrees, { n: cd }));
      if (x.worded === "1" || parts.length === 0) parts.push(x.result ?? "");
      const li = document.createElement("li"), name = document.createElement("strong"), res = document.createElement("span"), del = document.createElement("button");
      li.className = "hc-line"; li.dataset.k = x.k ?? "";
      name.textContent = `${x.name ?? ""} × ${fmtN(n)}`;
      res.textContent = parts.join(" · "); res.dir = "auto";
      del.type = "button"; del.textContent = "×"; del.dataset.hcDel = id; del.setAttribute("aria-label", `${T.tRemove ?? ""}: ${x.name ?? ""}`);
      const head = document.createElement("span"); head.append(name);
      li.append(head, res, del);
      rows.push(li);
    }
    lines.replaceChildren(...rows);
    empty.hidden = rows.length > 0; clear.hidden = rows.length === 0;
    count.textContent = fmtN(rows.length);
    one('[data-hc-out="hasanat"]').textContent = hmax > h ? `${fmtN(h)} – ${fmtN(hmax)}` : fmtN(h);
    one('[data-hc-out="sayyiat"]').textContent = fmtN(s);
    one('[data-hc-out="erased"]').textContent = fmtN(e);
    one('[data-hc-out="degrees"]').textContent = fmtN(d);
    one('[data-hc-opt="erased"]').hidden = e === 0;
    one('[data-hc-opt="degrees"]').hidden = d === 0;
  };
  const set = (id: string, n: number) => { n = clamp(n); if (n) qty.set(id, n); else qty.delete(id); save(); render(); };
  hc.addEventListener("click", (ev) => {
    const t = ev.target as HTMLElement;
    const id = t.closest<HTMLElement>("[data-hc-deed]")?.dataset.id;
    const del = t.closest<HTMLElement>("[data-hc-del]");
    const tab = t.closest<HTMLButtonElement>("[data-hc-tab]");
    if (id && t.closest("[data-hc-plus]")) set(id, (qty.get(id) ?? 0) + 1);
    else if (id && t.closest("[data-hc-minus]")) set(id, (qty.get(id) ?? 0) - 1);
    else if (del) { set(del.dataset.hcDel!, 0); one("#mine-title").focus(); }
    else if (t.closest("[data-hc-clear]")) { qty.clear(); save(); render(); one("#mine-title").focus(); }
    else if (tab) {
      const k = tab.dataset.hcTab ?? "";
      for (const b of hc.querySelectorAll<HTMLElement>("[data-hc-tab]")) b.setAttribute("aria-pressed", String(b === tab));
      for (const c of cards) c.hidden = k !== "" && c.dataset.k !== k;
    }
  });
  hc.addEventListener("input", (ev) => {
    const input = (ev.target as HTMLElement).closest<HTMLInputElement>("[data-hc-qty]");
    const id = input?.closest<HTMLElement>("[data-hc-deed]")?.dataset.id;
    if (input && id) set(id, Number(input.value));
  });
  hc.addEventListener("focusout", (ev) => { const i = (ev.target as HTMLElement).closest<HTMLInputElement>("[data-hc-qty]"); if (i) i.value = String(qty.get(i.closest<HTMLElement>("[data-hc-deed]")?.dataset.id ?? "") ?? 0); });
  for (const sel of ["[data-hc-tabs]", "[data-hc-mine]", "[data-hc-bar]"]) one(sel).hidden = false;
  for (const c of hc.querySelectorAll<HTMLElement>("[data-hc-ctl]")) c.hidden = false;
  render();
}

// ── a link to a folded part opens it ──────────────────────────────────────────
const openTarget = () => {
  let target: HTMLElement | null = null;
  try { target = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch { /* not an id */ }
  const fold = target?.closest("details");
  if (target && fold && !fold.open) { fold.open = true; target.scrollIntoView(); }
};
openTarget();
addEventListener("hashchange", openTarget);

// ── counter ───────────────────────────────────────────────────────────────────
const counter = document.querySelector<HTMLElement>("[data-hisab-counter]");
if (counter) {
  const KEY = "hisab-counter-v1";
  const box = counter.querySelector<HTMLElement>("[data-hisab-counter-ui]")!;
  const what = counter.querySelector<HTMLSelectElement>("[data-hisab-what]")!;
  const tally = counter.querySelector<HTMLElement>("[data-hisab-tally]")!;
  const target = counter.querySelector<HTMLElement>("[data-hisab-target]")!;
  const reached = counter.querySelector<HTMLElement>("[data-hisab-reached]")!;
  let state: Record<string, number> = {};
  let selected = "free";
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (saved && typeof saved === "object") { state = saved.counts ?? {}; selected = saved.selected ?? "free"; }
  } catch { /* a private window without storage still counts for the visit */ }
  if ([...what.options].some((o) => o.value === selected)) what.value = selected;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ counts: state, selected: what.value })); } catch { /* not saved */ } };
  const render = () => {
    const opt = what.selectedOptions[0];
    const n = state[what.value] ?? 0;
    const goal = Number(opt?.dataset.target ?? 0);
    tally.textContent = fmtN(n);
    target.textContent = goal ? ` / ${fmtN(goal)}` : "";
    const rounds = goal ? Math.floor(n / goal) : 0;
    reached.hidden = rounds === 0;
    if (rounds > 0 && opt) {
      const a = document.createElement("a");
      a.href = opt.dataset.href ?? "#calculator";
      a.textContent = opt.textContent ?? "";
      reached.replaceChildren(`${(counter.dataset.reached ?? "").replace("{n}", fmtN(rounds))} `, a, `: ${opt.dataset.result ?? ""}`);
    }
  };
  const bump = (by: number) => { state[what.value] = Math.max(0, (state[what.value] ?? 0) + by); save(); render(); };
  counter.querySelector("[data-hisab-add]")?.addEventListener("click", () => bump(1));
  counter.querySelector("[data-hisab-undo]")?.addEventListener("click", () => bump(-1));
  counter.querySelector("[data-hisab-zero]")?.addEventListener("click", () => { state[what.value] = 0; save(); render(); });
  what.addEventListener("change", () => { save(); render(); });
  box.hidden = false;
  render();
}

// ── list filter ───────────────────────────────────────────────────────────────
const input = document.querySelector<HTMLInputElement>("[data-hisab-filter]");
const items = [...document.querySelectorAll<HTMLElement>("[data-hisab-item]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-hisab-section]")];
const none = document.querySelector<HTMLElement>("[data-hisab-none]");
const kindBar = document.querySelector<HTMLElement>("[data-hisab-kinds]");
const kindButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-hisab-kind]")];
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟـ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();
const haystack = new Map(items.map((i) => [i, norm(i.dataset.search ?? "")]));
let kind = "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const item of items) {
    const hit = (q === "" || haystack.get(item)!.includes(q)) && (kind === "" || (item.dataset.kinds ?? "").split(" ").includes(kind));
    item.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-hisab-item]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
};
input?.addEventListener("input", apply);
if (kindBar) kindBar.hidden = false;
for (const b of kindButtons) b.addEventListener("click", () => {
  kind = b.dataset.hisabKind ?? "";
  for (const x of kindButtons) x.setAttribute("aria-pressed", String(x === b));
  apply();
});
