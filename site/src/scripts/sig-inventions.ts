// The workshop timeline (site/src/components/sig/InventionsWorkshop.astro): the marks are links in the HTML. This script adds
// the readout line (each mark's own aria-label), the arcs between an invention and the inventions its record names as before
// or after it (drawn from the earlier to the later, only while a mark is hovered, focused or selected), arrow-key movement,
// and first-tap-selects, second-tap-opens on touch screens. Without it every mark is still a plain link.
const root = document.querySelector<HTMLElement>("[data-sg-iv]");
if (root) {
  const marks = [...root.querySelectorAll<HTMLAnchorElement>(".sg-iv-mark")];
  const plot = root.querySelector<HTMLElement>(".sg-iv-plot")!;
  const svg = root.querySelector<SVGSVGElement>(".sg-iv-arcs")!;
  const line = root.querySelector<HTMLElement>("[data-sg-line]");
  const rtl = getComputedStyle(root).direction === "rtl";
  const hint = root.dataset.tHint ?? "";
  const NS = "http://www.w3.org/2000/svg";
  let current = marks[0];
  let selected: HTMLAnchorElement | null = null;
  let lastType = "mouse";
  const relOf = (m: HTMLAnchorElement) => (m.dataset.rel ? m.dataset.rel.split(" ").map(Number) : []);
  const rove = (m: HTMLAnchorElement) => { if (current) current.tabIndex = -1; current = m; m.tabIndex = 0; };
  for (const m of marks) m.tabIndex = -1;
  if (current) current.tabIndex = 0;

  const centre = (m: HTMLElement, box: DOMRect) => { const r = m.getBoundingClientRect(); return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]; };
  const drawArcs = (m: HTMLAnchorElement | null) => {
    svg.querySelectorAll("path.sg-iv-arc").forEach((p) => p.remove());
    for (const x of marks) x.classList.remove("is-rel");
    if (!m) return;
    const box = plot.getBoundingClientRect();
    for (const j of relOf(m)) {
      const o = marks[j];
      if (!o) continue;
      o.classList.add("is-rel");
      // from the earlier to the later (the arrowhead is at the later one)
      const [a, b] = Number(m.dataset.at) <= Number(o.dataset.at) ? [m, o] : [o, m];
      const [x1, y1] = centre(a, box), [x2, y2] = centre(b, box);
      const bulge = Math.min(110, 24 + Math.abs(x2 - x1) * 0.22 + Math.abs(y2 - y1) * 0.1);
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", "sg-iv-arc");
      p.setAttribute("marker-end", "url(#sg-iv-head)");
      p.setAttribute("d", `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)} ${Math.max(6, Math.min(y1, y2) - bulge).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
      svg.append(p);
    }
  };
  const show = (m: HTMLAnchorElement | null) => {
    for (const x of marks) x.classList.toggle("is-on", x === m);
    drawArcs(m);
    if (!line) return;
    if (!m) { line.textContent = hint; return; }
    const open = document.createElement("a");
    open.href = m.href;
    open.textContent = root.dataset.tOpen ?? "";
    line.replaceChildren(document.createTextNode(m.getAttribute("aria-label") ?? ""), open);
    const name = (j: number) => (marks[j]?.getAttribute("aria-label") ?? "").split(" · ")[0];
    const at = Number(m.dataset.at);
    for (const [key, test] of [["tFrom", (o: number) => o < at], ["tTo", (o: number) => o >= at]] as const) {
      const names = relOf(m).filter((j) => marks[j] && test(Number(marks[j].dataset.at))).map(name);
      if (!names.length) continue;
      const rel = document.createElement("span");
      rel.className = "muted";
      rel.style.cssText = "display:block;font-weight:400";
      rel.textContent = `${root.dataset[key] ?? ""} ${names.join(rtl ? "، " : ", ")}`;
      line.append(rel);
    }
  };
  const rest = () => { const f = document.activeElement as HTMLElement | null; show(selected ?? (f && f.classList.contains("sg-iv-mark") ? (f as HTMLAnchorElement) : null)); };

  for (const m of marks) {
    m.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
    m.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(m); });
    m.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") rest(); });
    m.addEventListener("focus", () => { rove(m); show(m); });
    m.addEventListener("blur", () => setTimeout(rest, 0));
    m.addEventListener("click", (e) => {
      if (lastType === "mouse" || lastType === "pen" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (selected === m) return; // the second tap opens the invention
      e.preventDefault();
      selected = m;
      rove(m);
      show(m);
    });
    m.addEventListener("keydown", (e) => {
      const lane = Number(m.dataset.lane);
      const at = Number(m.dataset.at);
      const inLane = (l: number) => marks.filter((x) => Number(x.dataset.lane) === l);
      const near = (pool: HTMLAnchorElement[]) => pool.length ? pool.reduce((b, c) => (Math.abs(Number(c.dataset.at) - at) < Math.abs(Number(b.dataset.at) - at) ? c : b)) : undefined;
      const next = rtl ? "ArrowLeft" : "ArrowRight";
      const prev = rtl ? "ArrowRight" : "ArrowLeft";
      const mine = inLane(lane).sort((a, b) => Number(a.dataset.at) - Number(b.dataset.at));
      let to: HTMLAnchorElement | undefined;
      if (e.key === next) to = mine[mine.indexOf(m) + 1];
      else if (e.key === prev) to = mine[mine.indexOf(m) - 1];
      else if (e.key === "ArrowDown") to = near(inLane(lane + 1));
      else if (e.key === "ArrowUp") to = near(inLane(lane - 1));
      else if (e.key === "Home") to = mine[0];
      else if (e.key === "End") to = mine[mine.length - 1];
      else if (e.key === "Escape" && selected) { selected = null; show(null); return; }
      else return;
      e.preventDefault();
      to?.focus();
    });
  }
  show(null);
}
