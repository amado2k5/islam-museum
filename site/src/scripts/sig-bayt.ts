// "The household" (site/src/components/sig/BaytHousehold.astro): the chart is complete and linked in the HTML; this script
// only adds the highlight of a person's immediate relations (and the sibling lines, which are drawn on selection), the
// toggles of the four household groups, and the readout, cloned from the outline under the chart. With a mouse a click
// opens the page; on a touch screen the first tap selects (the readout shows, with its own button to the page) and the
// second tap opens it.
const root = document.querySelector<HTMLElement>("[data-sgb]");
const svg = root?.querySelector<SVGSVGElement>(".sgb-svg");
const panel = root?.querySelector<HTMLElement>("[data-sgb-panel]");
if (root && svg && panel) {
  const items = [...svg.querySelectorAll<SVGAElement>("a.sgb-p[data-id]")];
  const edges = [...svg.querySelectorAll<SVGPathElement>(".sgb-e")];
  const body = panel.querySelector<HTMLElement>("[data-sgb-body]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sgb-close]")!;
  let selected: SVGAElement | null = null;
  let touch = false;

  const show = (node: SVGAElement | null) => {
    body.replaceChildren();
    const card = node && root.querySelector<HTMLElement>(`[data-sgb-card="${node.dataset.id}"]`);
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    panel.hidden = !card;
  };
  const light = (node: SVGAElement | null) => {
    const id = node?.dataset.id ?? "";
    const rel = new Set<string>();
    for (const e of edges) {
      const on = !!id && (e.dataset.a === id || e.dataset.b === id);
      e.classList.toggle("is-on", on);
      e.classList.toggle("is-quiet", !!id && !on);
      if (on) { rel.add(e.dataset.a ?? ""); rel.add(e.dataset.b ?? ""); }
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

  svg.classList.add("sgb-js");
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

  // the four household groups: a toggle dims every person who is not a member of a chosen group
  const active = new Set<string>();
  const apply = () => {
    for (const it of items) {
      const gs = (it.dataset.g ?? "").split(" ").filter(Boolean);
      it.classList.toggle("is-dim", active.size > 0 && !gs.some((g) => active.has(g)));
    }
  };
  for (const li of root.querySelectorAll<HTMLElement>("[data-sgb-groups] li[data-g]")) {
    const g = li.dataset.g!;
    const sw = li.querySelector<HTMLElement>(".sgb-sw")!;
    const link = li.querySelector<HTMLAnchorElement>("a")!;
    const count = li.querySelector<HTMLElement>(".muted");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sgb-g";
    btn.setAttribute("aria-pressed", "false");
    btn.append(sw.cloneNode(true), document.createTextNode(link.textContent ?? ""));
    if (count) btn.append(document.createTextNode(" "), count.cloneNode(true));
    btn.addEventListener("click", () => {
      if (active.has(g)) active.delete(g); else active.add(g);
      btn.setAttribute("aria-pressed", String(active.has(g)));
      apply();
    });
    li.replaceChildren(btn, Object.assign(document.createElement("a"), { href: link.href, textContent: "↗", className: "sgb-gl", ariaLabel: link.textContent ?? "" }));
  }
}
