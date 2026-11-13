// The river of reigns (site/src/components/sig/KhulafaRiver.astro): the chart is fully drawn and linked in the HTML. This
// script adds the readout line (name, caliphate, years in both calendars, length), the vertical hairline with the segments
// it crosses in the other lanes, arrow-key movement along and between lanes, and a first-tap-selects, second-tap-opens
// behaviour on touch screens. Without it every reign is still a link with its full text as its label.
const root = document.querySelector<HTMLElement>("[data-sg-kh]");
if (root) {
  const segs = [...root.querySelectorAll<HTMLAnchorElement>(".sg-kh-seg")];
  const hair = root.querySelector<HTMLElement>("[data-sg-hair]")!;
  const grid = root.querySelector<HTMLElement>(".sg-kh-grid")!;
  const line = root.querySelector<HTMLElement>("[data-sg-line]")!;
  const others = root.querySelector<HTMLElement>("[data-sg-others]")!;
  const d = root.dataset;
  const min = Number(d.min), max = Number(d.max);
  const nf = new Intl.NumberFormat(d.num);
  const rtl = getComputedStyle(root).direction === "rtl";
  const PAD = 26;
  const rows: HTMLAnchorElement[][] = [];
  for (const s of segs) (rows[Number(s.dataset.lane)] ??= []).push(s);
  const range = (s: HTMLElement) => { const a = Number(s.dataset.s); const b = s.dataset.e === "" ? a : Number(s.dataset.e); return [a, Math.max(b, a + 0.5)] as const; };
  const mid = (s: HTMLElement) => { const [a, b] = range(s); return (a + b) / 2; };

  let current: HTMLAnchorElement = segs[0];
  let selected: HTMLAnchorElement | null = null;
  const rove = (to: HTMLAnchorElement) => { current.tabIndex = -1; current = to; current.tabIndex = 0; };
  for (const s of segs) s.tabIndex = -1;
  current.tabIndex = 0;

  const clear = () => {
    root.classList.remove("has-moment");
    hair.hidden = true;
    for (const s of segs) s.classList.remove("is-cross", "is-on");
    line.textContent = d.tHint ?? "";
    others.textContent = "";
  };
  const show = (seg: HTMLAnchorElement, t: number) => {
    root.classList.add("has-moment");
    hair.hidden = false;
    hair.style.setProperty("--f", String(Math.min(1, Math.max(0, (t - min) / (max - min)))));
    const crossing: HTMLAnchorElement[] = [];
    for (const s of segs) {
      const on = s === seg;
      const [a, b] = range(s);
      const cross = !on && s.dataset.lane !== seg.dataset.lane && a <= t && t <= b;
      s.classList.toggle("is-on", on);
      s.classList.toggle("is-cross", cross);
      if (cross) crossing.push(s);
    }
    line.replaceChildren(document.createTextNode(seg.dataset.read ?? ""));
    const open = document.createElement("a");
    open.href = seg.href;
    open.textContent = d.tOpen ?? "";
    line.append(open);
    const ah = `${nf.format(Math.floor(t))} ${d.era}`;
    others.textContent = (crossing.length
      ? (d.tOthers ?? "").replace("{ah}", ah).replace("{list}", crossing.map((s) => `${s.dataset.name} · ${s.dataset.pol}`).join(rtl ? "؛ " : "; "))
      : (d.tNone ?? "").replace("{ah}", ah));
  };
  const atPointer = (seg: HTMLAnchorElement, x: number) => {
    const r = grid.getBoundingClientRect();
    const w = r.width - 2 * PAD;
    const f = rtl ? (r.right - PAD - x) / w : (x - r.left - PAD) / w;
    const [a, b] = range(seg);
    return Math.min(b, Math.max(a, min + f * (max - min)));
  };

  let lastType = "mouse";
  for (const s of segs) {
    s.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
    s.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(s, atPointer(s, e.clientX)); });
    s.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") show(s, atPointer(s, e.clientX)); });
    s.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { if (selected) show(selected, mid(selected)); else if (!root.contains(document.activeElement) || !(document.activeElement as HTMLElement).classList.contains("sg-kh-seg")) clear(); else show(document.activeElement as HTMLAnchorElement, mid(document.activeElement as HTMLAnchorElement)); } });
    s.addEventListener("focus", () => { rove(s); show(s, mid(s)); });
    s.addEventListener("blur", () => { setTimeout(() => { if (!root.contains(document.activeElement) || !(document.activeElement as HTMLElement).classList.contains("sg-kh-seg")) { if (selected) show(selected, mid(selected)); else clear(); } }, 0); });
    s.addEventListener("click", (e) => {
      if (lastType === "mouse" || lastType === "pen") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (selected === s) return; // the second tap opens the page
      e.preventDefault();
      selected = s;
      rove(s);
      show(s, atPointer(s, e.clientX));
    });
    s.addEventListener("keydown", (e) => {
      const lane = Number(s.dataset.lane);
      const list = rows[lane];
      const i = list.indexOf(s);
      let to: HTMLAnchorElement | undefined;
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const back = rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) to = list[i + 1];
      else if (e.key === back) to = list[i - 1];
      else if (e.key === "Home") to = list[0];
      else if (e.key === "End") to = list[list.length - 1];
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const step = e.key === "ArrowDown" ? 1 : -1;
        let l = lane + step;
        while (rows[l] && rows[l].length === 0) l += step;
        const target = rows[l];
        if (target) { const t = mid(s); to = target.reduce((best, c) => (Math.abs(mid(c) - t) < Math.abs(mid(best) - t) ? c : best)); }
      } else if (e.key === "Escape" && selected) { selected = null; clear(); return; }
      else return;
      e.preventDefault();
      if (to) to.focus();
    });
  }
  line.textContent = d.tHint ?? "";
}
