// "What people ask about" (site/src/components/sig/QuestionField.astro): the field is fully drawn and linked in the HTML;
// this script adds the readout (cloned from the list under the drawing) and the source toggles that dim the subjects with
// no fatwa from the chosen source(s). With a mouse a click opens the subject; on a touch screen the first tap selects it
// (the readout shows, with its own button) and the second opens it.
const root = document.querySelector<HTMLElement>("[data-sgf]");
const svg = root?.querySelector<SVGSVGElement>(".sgf-svg");
const panel = root?.querySelector<HTMLElement>("[data-sgf-panel]");
if (root && svg && panel) {
  const circles = [...svg.querySelectorAll<SVGAElement>("a.sgf-c[data-id]")];
  const body = panel.querySelector<HTMLElement>("[data-sgf-body]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sgf-hint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sgf-close]")!;
  const wide = matchMedia("(min-width: 1100px)"); // the readout has its own column there and always shows its hint
  const toggles = [...root.querySelectorAll<HTMLButtonElement>(".sgf-tog")];
  let selected: SVGAElement | null = null;
  let touch = false;

  const show = (node: SVGAElement | null) => {
    body.replaceChildren();
    const card = node && root.querySelector<HTMLElement>(`[data-sgf-card="${node.dataset.id}"]`);
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    hint.hidden = !!card;
    panel.hidden = !card && !wide.matches;
  };
  const select = (node: SVGAElement | null) => {
    selected?.classList.remove("is-sel");
    selected = node;
    node?.classList.add("is-sel");
    show(node);
    close.hidden = !node;
  };
  wide.addEventListener("change", () => show(selected));
  svg.classList.add("sgf-js");
  show(null);
  root.querySelector(".sgf-wrap")?.classList.add("has-panel");
  for (const c of circles) {
    c.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
    c.addEventListener("click", (e) => {
      if (!touch || selected === c || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(c);
    });
    c.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(c); });
    c.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") show(selected); });
    c.addEventListener("focus", () => show(c));
    c.addEventListener("blur", () => show(selected));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back.focus(); } });

  const tip = root.querySelector<HTMLElement>("[data-sgf-tip]");
  for (const t of toggles) t.hidden = false;
  if (tip) tip.hidden = false;
  const refresh = () => {
    const on = new Set(toggles.filter((t) => t.getAttribute("aria-pressed") === "true").map((t) => t.dataset.src ?? ""));
    for (const c of circles) {
      const has = (c.dataset.src ?? "").split(" ").some((s) => on.has(s));
      c.classList.toggle("is-dim", on.size > 0 && !has);
    }
  };
  for (const t of toggles) t.addEventListener("click", () => { t.setAttribute("aria-pressed", String(t.getAttribute("aria-pressed") !== "true")); refresh(); });
}
