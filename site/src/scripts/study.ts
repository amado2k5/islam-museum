// Study modes for a card deck (docs/delegation/education-master-plan.md E1): match, type and test, next to the
// existing flip deck. Everything runs on the visitor's device: the deck items come from the page's JSON payload,
// the answers are checked here, a passed test writes `edu-study:<deck>` (a passport stamp) and the review
// schedule `edu-srs` (a light spaced repetition: boxes of 1, 3, 7 and 14 days). Keyboard: every control is a
// native button or input; arrow keys move between match tiles.
import { mountShareBox } from "./share";

interface Item { title: string; body: string; accept?: string[] }
interface Payload { slug: string; lang: string; items: Item[]; url: string; title: string }
interface T { [k: string]: string }

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d: string, n: number) => { const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const BOXES = [1, 3, 7, 14];

/** Lenient comparison for typed answers: diacritics, tatweel, hamza seats, ta marbuta, alef maqsura, Urdu forms, case, punctuation. */
export function norm(s: string): string {
  return s
    .normalize("NFKC")
    .replace(/[ً-ْٰـۖ-ۭ]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/[ىی]/g, "ي").replace(/ک/g, "ك").replace(/ہ|ھ/g, "ه").replace(/ے/g, "ي").replace(/ۃ/g, "ه")
    .replace(/^(ال|the )/i, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
/** exact | close | wrong */
export function grade(answer: string, item: Item): "exact" | "close" | "wrong" {
  const a = norm(answer);
  if (!a) return "wrong";
  const targets = [item.title, ...(item.accept ?? [])].map(norm);
  if (targets.includes(a)) return "exact";
  for (const t of targets) {
    if (t.length >= 5 && (t.includes(a) && a.length >= Math.ceil(t.length * 0.6))) return "close";
    if (levenshtein(a, t) <= (t.length >= 8 ? 2 : 1)) return "close";
  }
  return "wrong";
}

// deterministic-enough shuffle for a study session (randomness is fine on the client; never at build)
function shuffle<T>(arr: T[]): T[] { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const clip = (s: string, n = 70) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function srsLoad(): Record<string, Record<string, { box: number; due: string }>> { try { return JSON.parse(localStorage.getItem("edu-srs") || "{}"); } catch { return {}; } }
function srsSave(s: unknown) { try { localStorage.setItem("edu-srs", JSON.stringify(s)); } catch { /* storage unavailable */ } }
function srsMark(slug: string, index: number, right: boolean) {
  const s = srsLoad();
  const deck = (s[slug] ??= {});
  const cur = deck[String(index)] ?? { box: 0, due: today() };
  const box = right ? Math.min(cur.box + 1, BOXES.length - 1) : 0;
  deck[String(index)] = { box, due: addDays(today(), BOXES[box]) };
  srsSave(s);
}
/** Items due today first, then the rest, so review happens by itself. */
function orderDue(slug: string, n: number): number[] {
  const deck = srsLoad()[slug] ?? {};
  const t = today();
  const due: number[] = [], rest: number[] = [];
  for (let i = 0; i < n; i++) ((deck[String(i)]?.due ?? t) <= t ? due : rest).push(i);
  return shuffle(due).concat(shuffle(rest));
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
}

function init(root: HTMLElement) {
  const payload = JSON.parse(root.querySelector("[data-study-payload]")!.textContent || "{}") as Payload;
  const t = JSON.parse(root.querySelector("[data-study-i18n]")!.textContent || "{}") as T;
  const items = payload.items;
  const stage = root.querySelector<HTMLElement>("[data-study-stage]")!;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-mode]")];
  const flipDeck = document.querySelector<HTMLElement>("[data-flipdeck]");
  root.hidden = false;
  root.querySelector<HTMLElement>("[data-study-nojs]")?.remove();

  const setMode = (mode: string) => {
    tabs.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    if (flipDeck) flipDeck.hidden = mode !== "flip";
    stage.innerHTML = "";
    stage.hidden = mode === "flip";
    if (mode === "match") match();
    if (mode === "type") type();
    if (mode === "test") test();
  };
  tabs.forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode || "flip")));

  // ---- match: six pairs, two columns, tap one from each
  function match() {
    const lede = el("p", "muted", t.match_lede); stage.appendChild(lede);
    const timeEl = el("p", "ui", fill(t.match_time, { s: "0" })); timeEl.setAttribute("role", "timer"); stage.appendChild(timeEl);
    const pick = shuffle(items.map((_, i) => i)).slice(0, Math.min(6, items.length));
    const left = el("div", "match-col"), right = el("div", "match-col");
    const grid = el("div", "match-grid"); grid.append(left, right); stage.appendChild(grid);
    let sel: HTMLButtonElement | null = null, done = 0, secs = 0;
    const timer = window.setInterval(() => { secs++; timeEl.textContent = fill(t.match_time, { s: String(secs) }); }, 1000);
    const mk = (col: HTMLElement, idx: number, text: string, side: string) => {
      const b = el("button", "match-tile", text); b.type = "button"; b.dataset.idx = String(idx); b.dataset.side = side; b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        if (b.disabled) return;
        if (!sel) { sel = b; b.setAttribute("aria-pressed", "true"); return; }
        if (sel === b) { sel.setAttribute("aria-pressed", "false"); sel = null; return; }
        if (sel.dataset.side === b.dataset.side) { sel.setAttribute("aria-pressed", "false"); sel = b; b.setAttribute("aria-pressed", "true"); return; }
        const ok = sel.dataset.idx === b.dataset.idx;
        const a = sel; sel = null; a.setAttribute("aria-pressed", "false");
        if (ok) { a.disabled = b.disabled = true; a.classList.add("ok"); b.classList.add("ok"); srsMark(payload.slug, idx, true); done++; }
        else { a.classList.add("no"); b.classList.add("no"); setTimeout(() => { a.classList.remove("no"); b.classList.remove("no"); }, 500); srsMark(payload.slug, idx, false); }
        if (done === pick.length) {
          clearInterval(timer);
          const p = el("p", "study-result", fill(t.match_done, { n: String(done), s: String(secs) })); p.setAttribute("role", "status");
          const again = el("button", "btn btn-lapis", t.match_again); again.type = "button"; again.addEventListener("click", () => setMode("match"));
          stage.append(p, again);
        }
      });
      col.appendChild(b);
    };
    pick.forEach((i) => mk(left, i, items[i].title, "l"));
    shuffle(pick).forEach((i) => mk(right, i, clip(items[i].body), "r"));
    grid.addEventListener("keydown", (e) => {
      const tiles = [...grid.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
      const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); tiles[(i + 1) % tiles.length].focus(); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); tiles[(i - 1 + tiles.length) % tiles.length].focus(); }
    });
  }

  // ---- type: read the body, type the title
  function type() {
    stage.appendChild(el("p", "muted", t.type_lede));
    const order = orderDue(payload.slug, items.length);
    let k = 0, right = 0;
    const q = el("p", "study-q"); const form = el("form", "study-form");
    const input = el("input"); input.type = "text"; input.placeholder = t.type_placeholder; input.autocomplete = "off"; input.setAttribute("aria-label", t.type_placeholder);
    const check = el("button", "btn btn-lapis", t.type_check); check.type = "submit";
    const fb = el("p", "study-fb"); fb.setAttribute("role", "status"); fb.setAttribute("aria-live", "polite");
    const next = el("button", "btn btn-outline", t.type_next); next.type = "button"; next.hidden = true;
    form.append(input, check); stage.append(q, form, fb, next);
    const show = () => {
      if (k >= order.length) { q.textContent = fill(t.type_done, { n: String(right), total: String(order.length) }); form.hidden = true; next.hidden = true; fb.textContent = ""; return; }
      q.textContent = items[order[k]].body; input.value = ""; fb.textContent = ""; fb.className = "study-fb"; next.hidden = true; form.hidden = false; check.disabled = false; input.focus();
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const item = items[order[k]];
      const g = grade(input.value, item);
      if (g === "exact") { right++; fb.textContent = t.type_correct; fb.classList.add("ok"); }
      else if (g === "close") { fb.textContent = fill(t.type_close, { a: item.title }); fb.classList.add("close"); }
      else { fb.textContent = fill(t.type_wrong, { a: item.title }); fb.classList.add("no"); }
      srsMark(payload.slug, order[k], g === "exact");
      check.disabled = true; next.hidden = false; next.focus();
    });
    next.addEventListener("click", () => { k++; show(); });
    show();
  }

  // ---- test: ten questions, four options, self-marked
  function test() {
    stage.appendChild(el("p", "muted", t.test_lede));
    const start = el("button", "btn btn-lapis", t.test_start); start.type = "button"; stage.appendChild(start);
    start.addEventListener("click", () => {
      stage.innerHTML = "";
      const order = orderDue(payload.slug, items.length).slice(0, Math.min(10, items.length));
      let k = 0, score = 0;
      const head = el("p", "ui muted"); const q = el("p", "study-q"); const opts = el("div", "study-opts"); const fb = el("p", "study-fb"); fb.setAttribute("role", "status"); fb.setAttribute("aria-live", "polite");
      const next = el("button", "btn btn-outline", t.type_next); next.type = "button"; next.hidden = true;
      stage.append(head, q, opts, fb, next);
      const ask = () => {
        if (k >= order.length) return finish();
        head.textContent = fill(t.test_q, { i: String(k + 1), n: String(order.length) });
        const idx = order[k]; q.textContent = items[idx].body; opts.innerHTML = ""; fb.textContent = ""; fb.className = "study-fb"; next.hidden = true;
        const distract = shuffle(items.map((_, i) => i).filter((i) => i !== idx)).slice(0, 3);
        shuffle([idx, ...distract]).forEach((i, n) => {
          const b = el("button", "study-opt", `${n + 1}. ${items[i].title}`); b.type = "button"; b.dataset.i = String(i);
          b.addEventListener("click", () => {
            const ok = i === idx;
            if (ok) score++;
            srsMark(payload.slug, idx, ok);
            opts.querySelectorAll<HTMLButtonElement>("button").forEach((x) => { x.disabled = true; if (x.dataset.i === String(idx)) x.classList.add("ok"); else if (x === b) x.classList.add("no"); });
            fb.textContent = ok ? t.type_correct : fill(t.type_wrong, { a: items[idx].title });
            next.hidden = false; next.focus();
          });
          opts.appendChild(b);
        });
      };
      document.addEventListener("keydown", (e) => { if (/^[1-4]$/.test(e.key) && !next.hidden === false) opts.querySelectorAll<HTMLButtonElement>("button")[Number(e.key) - 1]?.click(); });
      next.addEventListener("click", () => { k++; ask(); });
      const finish = () => {
        head.textContent = ""; q.textContent = fill(t.test_result, { n: String(score), total: String(order.length) }); opts.innerHTML = ""; next.hidden = true;
        const passed = score >= Math.ceil(order.length * 0.7);
        fb.textContent = passed ? t.test_pass : t.test_review; fb.className = "study-fb " + (passed ? "ok" : "close");
        if (passed) { try { localStorage.setItem(`edu-study:${payload.slug}`, today()); } catch { /* storage unavailable */ } }
        const box = el("div", "share-box"); stage.appendChild(box);
        mountShareBox(box, {
          title: payload.title,
          line: fill(t.test_result, { n: String(score), total: String(order.length) }),
          icons: order.map((_, i) => (i < score ? "🟩" : "⬜")),
          text: fill(t.share_text, { title: payload.title, n: String(score), total: String(order.length) }) + "\n" + order.map((_, i) => (i < score ? "🟩" : "⬜")).join("") + "\n" + payload.url,
          url: payload.url.replace(/^https?:\/\//, ""),
          rtl: document.documentElement.dir === "rtl",
          fileName: `islam-museum-${payload.slug}.png`,
        }, { image: t.share_image, copy: t.share_copy, copied: t.share_copied, note: t.share_note });
        const again = el("button", "btn btn-lapis", t.test_again); again.type = "button"; again.addEventListener("click", () => setMode("test")); stage.appendChild(again);
      };
      ask();
    });
  }

  setMode("flip");
}

document.querySelectorAll<HTMLElement>("[data-study]").forEach(init);
