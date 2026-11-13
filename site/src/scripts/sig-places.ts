// The sacred geography (site/src/components/sig/PlacesGeography.astro): the map is fully drawn and linked in the HTML;
// this script only adds the readout card (cloned from the text outline below the map), the section toggles that dim the
// other sections, a floating name beside the mark under the pointer, and the highlight of the matching card in the page's
// list. The first tap or Enter on a mark selects it; the second opens its page, as the card's button does.
const root = document.querySelector<HTMLElement>("[data-sg-pl]");
const svg = root?.querySelector<SVGSVGElement>(".sg-pl-svg");
const panel = root?.querySelector<HTMLElement>("[data-sg-pl-panel]");
if (root && svg && panel) {
  const marks = [...svg.querySelectorAll<SVGAElement>("a.sg-pl-m")];
  const labels = [...svg.querySelectorAll<SVGTextElement>("text.sg-pl-lab[data-p]")];
  const tip = svg.querySelector<SVGTextElement>(".sg-pl-tip");
  const body = panel.querySelector<HTMLElement>("[data-sg-pl-body]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-pl-hint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-pl-close]")!;
  let selected = "";
  let shown = "";
  const pressed = new Set<string>();

  const slugOf = (a: Element) => a.getAttribute("data-p") ?? "";
  const secOf = (a: Element) => a.getAttribute("data-s") ?? "";
  const TRANSLATE = /translate\(([-\d.]+) ([-\d.]+)\)/;
  const show = (slug: string) => {
    if (slug === shown) return;
    shown = slug;
    for (const m of marks) m.classList.toggle("is-on", !!slug && slugOf(m) === slug);
    document.querySelectorAll(".sg-pl-hl").forEach((el) => el.classList.remove("sg-pl-hl"));
    if (slug) document.getElementById(`place-${slug}`)?.classList.add("sg-pl-hl");
    body.replaceChildren();
    const card = slug ? root.querySelector<HTMLElement>(`[data-sg-pl-card="${slug}"]`) : null;
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    hint.hidden = !!card;
    panel.classList.toggle("has-card", !!card);
    close.hidden = !selected || !card;
  };
  // a name beside the mark under the pointer, for the places whose name is not printed on the map
  const tipAt = (m: SVGAElement | null) => {
    if (!tip) return;
    const t = m?.getAttribute("transform")?.match(TRANSLATE);
    if (!m || !t || labels.some((l) => l.dataset.p === slugOf(m))) { tip.setAttribute("visibility", "hidden"); return; }
    const frame = m.closest(".sg-pl-frame");
    const a = frame?.getAttribute("transform")?.match(TRANSLATE);
    const b = frame?.querySelector(":scope > g[transform]")?.getAttribute("transform")?.match(TRANSLATE);
    const dx = (a ? +a[1] : 0) + (b ? +b[1] : 0), dy = (a ? +a[2] : 0) + (b ? +b[2] : 0);
    const r = +(m.querySelector(".sg-pl-shape")?.getAttribute("r") ?? 14);
    const vb = svg.viewBox.baseVal;
    tip.textContent = m.querySelector("title")?.textContent ?? "";
    tip.setAttribute("x", String(Math.max(vb.x + 100, Math.min(vb.x + vb.width - 100, dx + +t[1]))));
    tip.setAttribute("y", String(dy + +t[2] - r - 12));
    tip.removeAttribute("visibility");
  };
  const dim = () => {
    svg.classList.toggle("has-dim", pressed.size > 0);
    for (const m of marks) m.classList.toggle("is-dim", pressed.size > 0 && !pressed.has(secOf(m)));
    const sectionOf = new Map(marks.map((m) => [slugOf(m), secOf(m)]));
    for (const l of labels) l.classList.toggle("is-dim", pressed.size > 0 && !pressed.has(sectionOf.get(l.dataset.p ?? "") ?? ""));
  };
  const select = (slug: string, back?: SVGAElement) => {
    selected = slug;
    for (const m of marks) m.classList.toggle("is-sel", !!slug && slugOf(m) === slug);
    shown = "\u0000";
    show(slug);
    if (!slug) back?.focus();
  };

  panel.hidden = false;
  root.querySelector(".sg-pl-wrap")?.classList.add("has-panel");
  for (const m of marks) {
    const slug = slugOf(m);
    m.addEventListener("click", (e) => {
      if (selected === slug || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(slug);
      tipAt(m);
    });
    m.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { show(slug); tipAt(m); } });
    m.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { show(selected); tipAt(null); } });
    m.addEventListener("focus", () => { show(slug); tipAt(m); });
    m.addEventListener("blur", () => { show(selected); tipAt(null); });
  }
  const clear = () => select("", marks.find((m) => slugOf(m) === selected));
  close.addEventListener("click", clear);
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) clear(); });

  // the legend: each section becomes a toggle button that dims the marks of the other sections
  for (const li of root.querySelectorAll<HTMLElement>("[data-sg-pl-sec]")) {
    const id = li.dataset.sgPlSec!;
    const inner = li.querySelector<HTMLElement>(".sg-pl-legi");
    if (!inner) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sg-pl-leg";
    btn.setAttribute("aria-pressed", "false");
    btn.append(...[...inner.childNodes]);
    inner.replaceWith(btn);
    btn.addEventListener("click", () => {
      if (pressed.has(id)) pressed.delete(id); else pressed.add(id);
      btn.setAttribute("aria-pressed", String(pressed.has(id)));
      dim();
    });
  }
}
