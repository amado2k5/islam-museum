// "Marriages on record" (site/src/components/sig/UsraKnots.astro): the diagram is complete and linked in the HTML; this
// script adds the readout of a marriage (the two spouses, the sources written on the edge, and the edge's own note when it
// is in the page language) and the light on the two spouses. A note is shown only when its script matches the page: Arabic
// notes on the Arabic page, Latin-script notes on the English page.
const root = document.querySelector<HTMLElement>("[data-sgu]");
const panel = root?.querySelector<HTMLElement>("[data-sgu-panel]");
if (root && panel) {
  const lang = root.dataset.lang ?? "en";
  const labels = root.querySelector<HTMLElement>("[data-sgu-labels]")!.dataset;
  const table = (labels.table ?? "").split("|");
  const body = panel.querySelector<HTMLElement>("[data-sgu-body]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sgu-close]")!;
  const arcs = [...root.querySelectorAll<SVGElement>(".sgu-arc[data-a]")];
  const nodeOf = (k: string | undefined) => root.querySelector<HTMLAnchorElement>(`a.sgu-n[data-k="${k}"]`);
  let selected: SVGElement | null = null;
  let touch = false;

  const light = (arc: SVGElement | null) => {
    for (const n of root.querySelectorAll(".sgu-n.is-rel")) n.classList.remove("is-rel");
    if (!arc) return;
    nodeOf(arc.dataset.a)?.classList.add("is-rel");
    nodeOf(arc.dataset.b)?.classList.add("is-rel");
  };
  const show = (arc: SVGElement | null) => {
    body.replaceChildren();
    light(arc);
    panel.hidden = !arc;
    if (!arc) return;
    const a = nodeOf(arc.dataset.a), b = nodeOf(arc.dataset.b);
    const h = document.createElement("h4");
    const link = (n: HTMLAnchorElement | null) => { const x = document.createElement("a"); x.href = n?.href ?? "#"; x.textContent = n?.textContent?.trim() ?? ""; return x; };
    h.append(link(a), document.createTextNode(` ${labels.and} `), link(b));
    body.append(h);
    if (arc.dataset.s) { const p = document.createElement("p"); p.className = "ui"; const t = document.createElement("b"); t.textContent = `${labels.sources} `; p.append(t, document.createTextNode(arc.dataset.s.split(",").map((k) => table[Number(k)] ?? "").join(labels.sep ?? "; "))); body.append(p); }
    const note = arc.dataset.n;
    if (note) {
      const arabicScript = /[؀-ۿ]/.test(note);
      if ((arabicScript && lang === "ar") || (!arabicScript && lang === "en")) {
        const p = document.createElement("p"); p.className = "ui"; p.dir = "auto";
        const t = document.createElement("b"); t.textContent = `${labels.note} `;
        p.append(t, document.createTextNode(note)); body.append(p);
      }
    }
  };
  const select = (arc: SVGElement | null) => {
    selected?.classList.remove("is-sel");
    selected = arc;
    arc?.classList.add("is-sel");
    show(arc);
    close.hidden = !arc;
  };
  for (const arc of arcs) {
    arc.addEventListener("pointerdown", (e) => { touch = (e as PointerEvent).pointerType !== "mouse"; });
    arc.addEventListener("click", () => select(arc === selected ? null : arc));
    arc.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter" || (e as KeyboardEvent).key === " ") { e.preventDefault(); select(arc === selected ? null : arc); } });
    arc.addEventListener("pointerenter", (e) => { if ((e as PointerEvent).pointerType === "mouse" && !selected) show(arc); });
    arc.addEventListener("pointerleave", (e) => { if ((e as PointerEvent).pointerType === "mouse") show(selected); });
    arc.addEventListener("focus", () => { show(arc); });
    arc.addEventListener("blur", () => show(selected));
  }
  void touch;
  close.addEventListener("click", () => { const back = selected; select(null); (back as unknown as HTMLElement)?.focus?.(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) select(null); });
}
