// The Hasanat and Sayyi'at Ledger's page script (docs/plan/50-hisab-browser.md). Three small
// enhancements over a page that is complete without them: the calculator multiplies the
// visitor's counts by the figures each text states and shows the sums (a range where the text
// gives a range, the worded result where it gives no number); the counter keeps a tally in
// this browser's localStorage and nowhere else; the list filter narrows the cards by words and
// by ledger kind. Nothing is sent anywhere.
const lang = document.documentElement.lang || "ar";
const nf = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : lang === "ur" ? "ur-PK-u-nu-latn" : "en");
const fmtN = (n: number) => nf.format(n);

// ── calculator ────────────────────────────────────────────────────────────────
const calc = document.querySelector<HTMLElement>("[data-hisab-calc]");
if (calc) {
  const rows = [...calc.querySelectorAll<HTMLTableRowElement>("[data-hisab-row]")];
  const totals = calc.querySelector<HTMLElement>("[data-hisab-totals]");
  const out = (k: string) => calc.querySelector<HTMLElement>(`[data-hisab-out="${k}"]`);
  const worded = calc.querySelector<HTMLElement>("[data-hisab-worded]");
  const wordedList = calc.querySelector<HTMLElement>("[data-hisab-worded-list]");
  const inputs = rows.map((r) => r.querySelector<HTMLInputElement>("[data-hisab-n]")!);
  for (const i of inputs) i.disabled = false;
  if (totals) totals.hidden = false;
  const recompute = () => {
    let h = 0, hmax = 0, s = 0, e = 0, d = 0;
    const lines: [string, number, string][] = [];
    rows.forEach((r, idx) => {
      const n = Math.max(0, Math.floor(Number(inputs[idx].value) || 0));
      if (!n) return;
      h += n * Number(r.dataset.h); hmax += n * Number(r.dataset.hmax);
      s += n * Number(r.dataset.s); e += n * Number(r.dataset.e); d += n * Number(r.dataset.d);
      if (r.dataset.worded === "1") lines.push([r.dataset.name ?? "", n, r.dataset.result ?? ""]);
    });
    out("hasanat")!.textContent = hmax > h ? `${fmtN(h)} – ${fmtN(hmax)}` : fmtN(h);
    out("sayyiat")!.textContent = fmtN(s);
    out("erased")!.textContent = fmtN(e);
    out("degrees")!.textContent = fmtN(d);
    if (worded && wordedList) {
      worded.hidden = lines.length === 0;
      wordedList.replaceChildren(...lines.map(([name, n, result]) => {
        const li = document.createElement("li");
        const b = document.createElement("strong");
        b.textContent = `${name} × ${fmtN(n)}: `;
        li.append(b, result);
        li.dir = "auto";
        return li;
      }));
    }
  };
  for (const i of inputs) i.addEventListener("input", recompute);
  calc.querySelector("[data-hisab-reset]")?.addEventListener("click", () => { for (const i of inputs) i.value = "0"; recompute(); });
  recompute();
}

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
