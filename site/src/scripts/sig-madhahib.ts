// "Four schools, side by side in time" (site/src/components/sig/FourSchools.astro): the drawing is complete and linked in
// the HTML; this script only adds the readout (cloned from the list under the drawing) and the teacher-to-student arcs
// on hover, focus or selection. With a mouse, a click opens the page; on a touch screen the first tap selects (the readout
// shows, with its own button to the page) and the second tap opens it.
const root = document.querySelector<HTMLElement>("[data-sg]");
const svg = root?.querySelector<SVGSVGElement>(".sg-svg");
const panel = root?.querySelector<HTMLElement>("[data-sg-panel]");
if (root && svg && panel) {
  const items = [...svg.querySelectorAll<SVGAElement>("a.sg-it[data-id]")];
  const arcs = [...svg.querySelectorAll<SVGPathElement>(".sg-arc")];
  const body = panel.querySelector<HTMLElement>("[data-sg-body]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-close]")!;
  let selected: SVGAElement | null = null;
  let touch = false;

  const show = (node: SVGAElement | null) => {
    body.replaceChildren();
    const card = node && root.querySelector<HTMLElement>(`[data-sg-card="${node.dataset.id}"]`);
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    panel.hidden = !card;
  };
  const light = (node: SVGAElement | null) => {
    const id = node?.dataset.id ?? "";
    const rel = new Set<string>();
    for (const a of arcs) {
      const on = !!id && (a.dataset.t === id || a.dataset.s === id);
      a.classList.toggle("is-on", on);
      if (on) { rel.add(a.dataset.t ?? ""); rel.add(a.dataset.s ?? ""); }
    }
    for (const it of items) it.classList.toggle("is-rel", rel.has(it.dataset.id ?? "") && it.dataset.id !== id);
  };
  const select = (node: SVGAElement | null) => {
    selected?.classList.remove("is-sel");
    selected = node;
    node?.classList.add("is-sel");
    light(node);
    show(node);
    close.hidden = !node;
  };

  svg.classList.add("sg-js");
  for (const it of items) {
    it.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    it.addEventListener("click", (e) => {
      if (!touch || selected === it || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(it);
    });
    it.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { light(it); show(it); } });
    it.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { light(selected); show(selected); } });
    it.addEventListener("focus", () => { light(it); show(it); });
    it.addEventListener("blur", () => { light(selected); show(selected); });
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back.focus(); } });
}
