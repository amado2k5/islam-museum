// "Limits and grave sins, as the sources name them" (components/sig/HududIndex.astro). The index is complete without this
// script. It adds: toggles that hide the references of a corpus (a row's bar and count follow what is shown), the highlight
// of every copy of one passage when a reference is hovered or focused, faint lines from a passage of the "named in both"
// strip to its copies in the two panels, and the readout (reference, work, first sentence of the summary when it has one),
// all from the JSON the component wrote. On a touch screen the first tap on a reference shows it, the second opens it.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-hd]")) {
  const grid = root.querySelector<HTMLElement>("[data-sg-hd-grid]");
  const lines = root.querySelector<SVGSVGElement>("[data-sg-hd-lines]");
  const read = root.querySelector<HTMLElement>("[data-sg-hd-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-hd-hint]");
  const blob = root.querySelector("[data-sg-hd-data]")?.textContent;
  if (!grid || !lines || !read || !hint || !blob) continue;
  const J = JSON.parse(blob) as { info: Record<string, { r: string; w: string; s: string; h: string }>; numbers: string[]; ref: string; work: string };
  const max = Number(root.dataset.max) || 1;
  const chips = [...grid.querySelectorAll<HTMLAnchorElement>("a.sg-hd-chip")];
  const rows = [...grid.querySelectorAll<HTMLElement>("li.sg-hd-row")];
  root.classList.add("js");
  const off = new Set<string>();
  let pinned: string | null = null, touch = false;

  const refresh = () => {
    for (const c of chips) c.classList.toggle("is-gone", off.has(c.dataset.c!));
    for (const r of rows) {
      const n = r.querySelectorAll("a.sg-hd-chip:not(.is-gone)").length;
      const t = r.querySelector<HTMLElement>("[data-sg-hd-n]"), f = r.querySelector<HTMLElement>("[data-sg-hd-fill]");
      if (t) t.textContent = J.numbers[n] ?? String(n);
      if (f) f.style.inlineSize = `${Math.round((1000 * n) / max) / 10}%`;
    }
  };
  for (const b of root.querySelectorAll<HTMLButtonElement>(".sg-hd-tg")) {
    b.addEventListener("click", () => {
      const c = b.dataset.c!;
      if (off.has(c)) off.delete(c); else off.add(c);
      b.setAttribute("aria-pressed", String(!off.has(c)));
      refresh();
    });
  }

  const mid = (el: HTMLElement) => { const r = el.getBoundingClientRect(), g = grid.getBoundingClientRect(); return [r.left - g.left + r.width / 2, r.top - g.top + r.height / 2]; };
  const show = (id: string | null) => {
    for (const c of chips) c.classList.toggle("is-on", !!id && c.dataset.id === id);
    lines.replaceChildren();
    if (id) {
      const strip = grid.querySelector<HTMLElement>(`[data-both] a[data-id="${CSS.escape(id)}"]`);
      if (strip) {
        const [x0, y0] = mid(strip);
        for (const c of grid.querySelectorAll<HTMLElement>(`.sg-hd-rows a[data-id="${CSS.escape(id)}"]:not(.is-gone)`)) {
          const [x1, y1] = mid(c);
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", `M${x0},${y0} C${(x0 + x1) / 2},${y0} ${(x0 + x1) / 2},${y1} ${x1},${y1}`);
          lines.append(p);
        }
      }
    }
    read.replaceChildren();
    const d = id && J.info[id];
    if (!d) { read.append(hint); return; }
    const h = document.createElement("h3"); const a = document.createElement("a"); a.href = d.h; a.textContent = d.r; a.setAttribute("dir", "auto"); h.append(a);
    read.append(h);
    if (d.w) { const w = document.createElement("p"); w.className = "muted"; w.textContent = `${J.work}: ${d.w}`; w.setAttribute("dir", "auto"); read.append(w); }
    if (d.s) { const s = document.createElement("p"); s.textContent = d.s; s.setAttribute("dir", "auto"); read.append(s); }
  };
  for (const c of chips) {
    const id = c.dataset.id!;
    c.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    c.addEventListener("mouseenter", () => { if (!touch && !pinned) show(id); });
    c.addEventListener("mouseleave", () => { if (!touch && !pinned) show(null); });
    c.addEventListener("focus", () => show(id));
    c.addEventListener("blur", () => show(pinned));
    c.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (touch && e.detail > 0 && pinned !== id) { e.preventDefault(); pinned = id; show(id); }
      touch = false;
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = null; show(null); } });
  addEventListener("resize", () => show(pinned));
}
