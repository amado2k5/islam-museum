// The journeys map (components/sig/JourneysMap.astro). The map with every route and the kind-grouped list of links are
// complete in the HTML; this script adds: the kind filter (real buttons, aria-pressed), and bringing one journey forward
// on hover, focus or tap, with its stations as numbered dots and names and a readout cloned from the page. On a touch
// screen the first tap on a route or a name selects it and the second opens the journey.
const NS = "http://www.w3.org/2000/svg";
const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

for (const root of document.querySelectorAll<HTMLElement>("[data-sg-jm]")) {
  const svg = root.querySelector<SVGSVGElement>("[data-sg-jm-svg]");
  const front = root.querySelector<SVGGElement>("[data-sg-jm-front]");
  const read = root.querySelector<HTMLElement>("[data-sg-jm-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-jm-hint]");
  const list = root.querySelector<HTMLElement>("[data-sg-jm-list]");
  const filters = root.querySelector<HTMLElement>("[data-sg-jm-filters]");
  const legend = root.querySelector<HTMLElement>("[data-sg-jm-legend]");
  if (!svg || !front || !read || !hint || !list) continue;
  const routes = new Map([...svg.querySelectorAll<SVGAElement>("a.sg-jm-route")].map((a) => [a.dataset.j!, a]));
  const links = new Map([...list.querySelectorAll<HTMLAnchorElement>("a[data-j]")].map((a) => [a.dataset.j!, a]));
  const full = { x: 0, y: 0, w: svg.viewBox.baseVal.width, h: svg.viewBox.baseVal.height };
  let view = { ...full };
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  // a short route on a map this wide is a cluster of overlapping dots: the view eases in on the route, and back out when none is chosen
  const zoomTo = (to: typeof full) => {
    cancelAnimationFrame(raf);
    const from = { ...view };
    view = to;
    const set = (b: typeof full) => svg.setAttribute("viewBox", `${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.w.toFixed(1)} ${b.h.toFixed(1)}`);
    if (still) { set(to); return; }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 380), e = 1 - Math.pow(1 - p, 3);
      set({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e, h: from.h + (to.h - from.h) * e });
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  const [wx, wy, ww, wh] = (svg.dataset.world ?? "").split(" ").map(Number);
  const world = ww ? { x: wx, y: wy, w: ww, h: wh } : full;
  const frameFor = (pts: number[][]) => {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const ratio = full.h / full.w;
    let w = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) / ratio) * 1.35 + 60;
    w = Math.max(w, 260);
    // a route that sits inside the default frame and fills most of it keeps the default frame; one that leaves it eases out to its whole
    const inside = Math.min(...xs) >= full.x && Math.max(...xs) <= full.x + full.w && Math.min(...ys) >= full.y && Math.max(...ys) <= full.y + full.h;
    if (inside && w > full.w * 0.7) return { ...full };
    w = Math.min(w, world.w);
    const h = w * ratio;
    // keep the view inside the land where it can be; a long, flat route needs more height than the land has, so it is centred and the band beyond is bare
    const fit = (c: number, len: number, lo: number, size: number) => (len >= size ? lo + size / 2 - len / 2 : Math.min(Math.max(c - len / 2, lo), lo + size - len));
    return { x: fit(cx, w, world.x, world.w), y: fit(cy, h, world.y, world.h), w, h };
  };
  let hover: string | null = null, pinned: string | null = null, touched = false, shown: string | null = null, hoverZoom = true;

  const render =() => {
    const id = hover ?? pinned;
    if (id === shown && id === null) return;
    shown = id;
    front.replaceChildren();
    if (!id) zoomTo(full);
    svg.classList.toggle("has-active", !!id);
    for (const [k, a] of routes) a.classList.toggle("is-active", k === id);
    for (const [k, a] of links) a.classList.toggle("is-hot", k === id);
    read.replaceChildren();
    const card = id && root.querySelector<HTMLElement>(`[data-sg-jm-card="${CSS.escape(id)}"]`);
    if (!id || !card) { read.append(hint); return; }
    read.append(...[...card.cloneNode(true).childNodes]);
    const route = routes.get(id)!;
    const pts = (route.querySelector(".sg-jm-line")?.getAttribute("points") ?? "").trim().split(/\s+/).map((p) => p.split(",").map(Number));
    const names = [...card.querySelectorAll("li")].map((li) => li.textContent ?? "");
    // pointing at a route on the map must not move it from under the pointer, so only the list, the keyboard and a pinned route zoom
    zoomTo(hover && !hoverZoom ? full : frameFor(pts));
    const k = view.w / (svg.getBoundingClientRect().width || view.w); // map units per screen pixel
    const line = route.querySelector(".sg-jm-line")!.cloneNode(true) as SVGElement;
    front.append(line);
    const g = el("g", { class: "sg-jm-st" });
    const dotR = 10 * k;
    const boxes: { x0: number; y0: number; x1: number; y1: number }[] = pts.map(([x, y]) => ({ x0: x - dotR, y0: y - dotR, x1: x + dotR, y1: y + dotR }));
    const fits = (b: { x0: number; y0: number; x1: number; y1: number }, skip: number) =>
      b.x0 >= view.x && b.y0 >= view.y && b.x1 <= view.x + view.w && b.y1 <= view.y + view.h && !boxes.some((o, i) => i !== skip && b.x0 < o.x1 && b.x1 > o.x0 && b.y0 < o.y1 && b.y1 > o.y0);
    const labels: SVGElement[] = [];
    pts.forEach(([x, y], i) => {
      const w = (names[i]?.length ?? 0) * 7.2 * k, h = 15 * k;
      const tries = [
        { x: x + dotR + 3 * k, y: y + 4.5 * k, a: "start", b: [x + dotR + 3 * k, y - h / 2, x + dotR + 3 * k + w, y + h / 2] },
        { x: x - dotR - 3 * k, y: y + 4.5 * k, a: "end", b: [x - dotR - 3 * k - w, y - h / 2, x - dotR - 3 * k, y + h / 2] },
        { x: x - w / 2, y: y - dotR - 4 * k, a: "start", b: [x - w / 2, y - dotR - 4 * k - h, x + w / 2, y - dotR - 4 * k + 3 * k] },
        { x: x - w / 2, y: y + dotR + 12 * k, a: "start", b: [x - w / 2, y + dotR, x + w / 2, y + dotR + 16 * k] },
      ];
      for (const t of tries) {
        const box = { x0: t.b[0], y0: t.b[1], x1: t.b[2], y1: t.b[3] };
        if (!fits(box, i)) continue;
        boxes.push(box);
        const text = el("text", { x: t.x, y: t.y, class: "sg-jm-nm", "text-anchor": t.a });
        text.style.fontSize = `${13 * k}px`;
        text.style.strokeWidth = `${4 * k}px`;
        text.textContent = names[i] ?? "";
        labels.push(text);
        break;
      }
    });
    g.append(...labels);
    pts.forEach(([x, y], i) => {
      const c = el("circle", { cx: x, cy: y, r: dotR });
      c.style.strokeWidth = `${1.6 * k}px`;
      const n = el("text", { x, y, class: "sg-jm-n" });
      n.style.fontSize = `${12 * k}px`;
      n.textContent = String(i + 1);
      g.append(c, n);
    });
    front.append(g);
  };

  const attach = (target: Element, id: string, onMap: boolean) => {
    target.addEventListener("pointerdown", (e) => { touched = (e as PointerEvent).pointerType === "touch"; });
    target.addEventListener("mouseenter", () => { if (touched) return; hover = id; hoverZoom = !onMap; render(); });
    target.addEventListener("mouseleave", () => { if (touched) return; hover = null; render(); });
    target.addEventListener("focus", () => { if (touched) return; hover = id; hoverZoom = true; render(); });
    target.addEventListener("blur", () => { if (touched) return; hover = null; render(); });
    target.addEventListener("click", (e) => {
      if (touched && (hover ?? pinned) !== id) { e.preventDefault(); pinned = id; hover = null; render(); }
      touched = false;
    });
  };
  for (const [id, a] of routes) attach(a, id, true);
  for (const [id, a] of links) attach(a, id, false);
  svg.addEventListener("click", (e) => { if (!(e.target as Element).closest("a")) { pinned = null; render(); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && pinned) { pinned = null; render(); } });
  let w = svg.getBoundingClientRect().width;
  addEventListener("resize", () => { const n = svg.getBoundingClientRect().width; if (n !== w) { w = n; shown = "";  render(); } });

  // kind filter
  if (filters) {
    filters.hidden = false;
    if (legend) legend.hidden = true;
    const chips = [...filters.querySelectorAll<HTMLButtonElement>("button[data-kind]")];
    const sections = [...list.querySelectorAll<HTMLElement>("section[data-kind]")];
    const apply = (kind: string | null) => {
      svg.classList.toggle("has-kind", !!kind);
      for (const c of chips) c.setAttribute("aria-pressed", String(c.dataset.kind === kind));
      for (const a of routes.values()) a.classList.toggle("is-kind", a.dataset.kind === kind);
      for (const s of sections) s.classList.toggle("is-dim", !!kind && s.dataset.kind !== kind);
    };
    for (const c of chips) c.addEventListener("click", () => apply(c.getAttribute("aria-pressed") === "true" ? null : c.dataset.kind!));
  }
}
