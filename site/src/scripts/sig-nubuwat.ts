// The star chart of the Nubuwat Browser (site/src/components/sig/NubuwatStar.astro). The chart is drawn and linked in the
// HTML; this script lights an axis (hover, focus, first tap) with its chords, fills the read-out from the outline (the
// text alternative), turns the legend into toggles that isolate one corpus, and sends a second tap or Enter on a theme
// to the page's filter box.
const root = document.querySelector<HTMLElement>("[data-sg-nb]");
const chart = root?.querySelector<HTMLElement>("[data-sg-chart]");
const panel = root?.querySelector<HTMLElement>("[data-sg-nbpanel]");
if (root && chart && panel) {
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a[data-a]")].filter((a) => !a.closest(".sg-nb-outline"));
  const axes = [...chart.querySelectorAll<SVGLineElement>("line.sg-nb-axis")];
  const chords = [...chart.querySelectorAll<SVGPathElement>("path.sg-nb-chord")];
  const hint = panel.querySelector<HTMLElement>("[data-sg-nbhint]")!;
  const body = panel.querySelector<HTMLElement>("[data-sg-nbbody]")!;
  let hovered: string | null = null;
  let selected: string | null = null;
  let touch = false;
  let wasSelected = false;
  let corpus: string | null = null;

  const show = (a: string | null) => {
    hint.hidden = !!a;
    body.hidden = !a;
    body.replaceChildren();
    const card = a !== null ? root.querySelector<HTMLElement>(`[data-sg-card="${a}"]`) : null;
    if (card) {
      body.append(...[...card.cloneNode(true).childNodes]);
      body.querySelectorAll<HTMLElement>("[data-s]").forEach((li) => li.classList.toggle("keep", corpus === null || li.dataset.s === corpus));
    }
  };
  const mark = () => {
    const a = hovered ?? selected;
    for (const l of links) l.classList.toggle("on", l.dataset.a === a);
    for (const x of axes) x.classList.toggle("on", x.dataset.a === a);
    for (const c of chords) c.classList.toggle("on", a !== null && (c.dataset.a === a || c.dataset.b === a));
    chart.classList.toggle("has-sel", a !== null);
    show(a);
  };

  panel.hidden = false;
  for (const l of links) {
    l.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === l.dataset.a; });
    l.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = l.dataset.a ?? null; mark(); } });
    l.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    l.addEventListener("focus", () => { selected = l.dataset.a ?? null; mark(); });
    l.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (touch && !wasSelected) { e.preventDefault(); selected = l.dataset.a ?? null; mark(); touch = false; return; }
      touch = false;
      toFilter(l, e);
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && (selected || hovered)) { selected = null; hovered = null; mark(); } });

  // the legend's entries become toggles: one corpus alone, or all
  const isolate = (k: string | null) => {
    corpus = k;
    chart.classList.toggle("iso", k !== null);
    chart.querySelectorAll<SVGElement>("[data-s]").forEach((el) => el.classList.toggle("keep", el.dataset.s === k));
    root.querySelectorAll<HTMLButtonElement>(".sg-nb-key").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.s === k)));
    show(hovered ?? selected);
  };
  root.querySelectorAll<HTMLElement>(".sg-nb-legend > li").forEach((li) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sg-nb-key";
    b.dataset.s = li.dataset.s;
    b.setAttribute("aria-pressed", "false");
    b.append(...[...li.childNodes]);
    li.append(b);
    b.addEventListener("click", () => isolate(corpus === b.dataset.s ? null : (b.dataset.s ?? null)));
  });

  const toFilter = (a: HTMLElement, e: Event) => {
    const input = document.querySelector<HTMLInputElement>("[data-nubuwat-filter]");
    if (!input || !a.dataset.q) return;
    e.preventDefault();
    input.value = a.dataset.q;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    input.focus({ preventScroll: true });
  };
  panel.addEventListener("click", (e) => { const c = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-q]"); if (c) toFilter(c, e); });
}
