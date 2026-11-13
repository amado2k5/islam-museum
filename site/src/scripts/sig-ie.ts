// "Coin, deed and endowment through time" (components/sig/IeLedgers.astro). Every mark is a real link and the ledgers are
// complete without this script; it adds the readout (label, date in both calendars as the record shows it, class and the
// first sentence of the summary, all from the JSON the component wrote), a faint tie between the two marks of a record
// that belongs to two topics, and the touch rule: the first tap on a mark shows it, the second opens the record.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-ie]")) {
  const plot = root.querySelector<HTMLElement>("[data-sg-ie-plot]");
  const ties = root.querySelector<SVGSVGElement>("[data-sg-ie-ties]");
  const read = root.querySelector<HTMLElement>("[data-sg-ie-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-ie-hint]");
  const blob = root.querySelector("[data-sg-ie-data]")?.textContent;
  if (!plot || !ties || !read || !hint || !blob) continue;
  const J = JSON.parse(blob) as { info: Record<string, { t: string; d: string; k: string; s: string; also: string[]; h: string }>; also: string };
  const marks = [...plot.querySelectorAll<HTMLAnchorElement>("a.sg-ie-m")];
  let pinned: HTMLAnchorElement | null = null, touch = false;

  const centre = (a: HTMLElement) => { const r = a.getBoundingClientRect(), p = plot.getBoundingClientRect(); return [r.left - p.left + r.width / 2, r.top - p.top + r.height / 2]; };
  const draw = (a: HTMLAnchorElement | null) => {
    ties.replaceChildren();
    for (const m of marks) m.classList.remove("is-mate");
    if (!a) return;
    const mates = marks.filter((m) => m !== a && m.dataset.id === a.dataset.id);
    const [x0, y0] = centre(a);
    for (const m of mates) {
      const [x1, y1] = centre(m);
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", `M${x0},${y0} C${x0},${(y0 + y1) / 2} ${x1},${(y0 + y1) / 2} ${x1},${y1}`);
      ties.append(p);
      m.classList.add("is-mate");
    }
  };
  const show = (a: HTMLAnchorElement | null) => {
    for (const m of marks) m.classList.toggle("is-on", m === a);
    draw(a);
    read.replaceChildren();
    const d = a && J.info[a.dataset.id!];
    if (!d) { read.append(hint); return; }
    const h = document.createElement("h3"); const link = document.createElement("a"); link.href = d.h; link.textContent = d.t; link.setAttribute("dir", "auto"); h.append(link);
    const meta = document.createElement("p"); meta.className = "muted"; meta.textContent = [d.d, d.k].filter(Boolean).join(" · ");
    read.append(h, meta);
    if (d.s) { const s = document.createElement("p"); s.textContent = d.s; s.setAttribute("dir", "auto"); read.append(s); }
    if (d.also.length > 1) { const t = document.createElement("p"); t.className = "muted"; t.textContent = d.also.join(" · "); read.append(t); }
  };
  for (const a of marks) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    a.addEventListener("mouseenter", () => { if (!touch && !pinned) show(a); });
    a.addEventListener("mouseleave", () => { if (!touch && !pinned) show(null); });
    a.addEventListener("focus", () => show(a));
    a.addEventListener("blur", () => show(pinned));
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (touch && e.detail > 0 && pinned?.dataset.id !== a.dataset.id) { e.preventDefault(); pinned = a; show(a); }
      touch = false;
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = null; show(null); } });
  addEventListener("resize", () => draw(root.querySelector<HTMLAnchorElement>("a.sg-ie-m.is-on")));
}
