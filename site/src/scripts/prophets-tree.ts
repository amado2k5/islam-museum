// The Prophets' Tree (site/src/components/ProphetsTree.astro, docs/plan/41-messengers-browser.md): the tree is fully
// drawn and linked in the HTML; this script only adds the growth from the root, the lit path from a prophet down to
// the root on hover, focus or selection, and the detail panel, whose content is cloned from the outline list on the
// page. The first click or Enter on a prophet selects it; the second opens its page, as the panel's button does.
const root = document.querySelector<HTMLElement>("[data-pt]");
const svg = root?.querySelector<SVGSVGElement>(".pt-svg");
const panel = root?.querySelector<HTMLElement>("[data-pt-panel]");
if (root && svg && panel) {
  const els = [...svg.querySelectorAll<SVGElement>("[data-k]")];
  const nodes = [...svg.querySelectorAll<SVGAElement>("a[data-id]")];
  const body = panel.querySelector<HTMLElement>("[data-pt-body]")!;
  const hint = panel.querySelector<HTMLElement>("[data-pt-hint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-pt-close]")!;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let selected: SVGAElement | null = null;

  const light = (node: SVGAElement | null) => {
    const keys = new Set((node?.dataset.lit ?? "").split(" ").filter(Boolean));
    svg.classList.toggle("has-lit", keys.size > 0);
    for (const el of els) el.classList.toggle("is-lit", keys.has(el.dataset.k ?? ""));
  };
  const select = (node: SVGAElement | null) => {
    selected?.classList.remove("is-sel");
    selected = node;
    node?.classList.add("is-sel");
    light(node);
    body.replaceChildren();
    const card = node && root.querySelector<HTMLElement>(`[data-pt-card="${node.dataset.id}"]`);
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    hint.hidden = !!card;
    close.hidden = !card;
  };

  panel.hidden = false;
  root.querySelector(".pt-wrap")?.classList.add("has-panel");
  for (const node of nodes) {
    node.addEventListener("click", (e) => {
      if (selected === node || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(node);
    });
    node.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") light(node); });
    node.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") light(selected); });
    node.addEventListener("focus", () => light(node));
    node.addEventListener("blur", () => light(selected));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back.focus(); } });

  if (!still && "IntersectionObserver" in window) {
    svg.classList.add("pt-anim");
    const grown = () => {
      svg.classList.add("pt-grown");
      // the staggered delays belong to the growth only; drop them so the lit path answers at once afterwards
      setTimeout(() => svg.classList.remove("pt-anim", "pt-grown"), 2400);
    };
    let started = false;
    const start = () => { if (!started) { started = true; io.disconnect(); setTimeout(grown, 40); } };
    const io = new IntersectionObserver((entries) => { if (entries.some((en) => en.isIntersecting)) start(); });
    io.observe(svg);
    // the tree must never stay hidden: if the observer has not answered once the tree is on screen, grow anyway
    addEventListener("scroll", () => { const r = svg.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) start(); }, { passive: true });
  }
}
