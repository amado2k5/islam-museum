// The themes-by-collections matrix of the Hadith Qudsi Browser (site/src/components/sig/QudsiMatrix.astro). Every cell
// is a link to the theme's section of the page; with this script a click fills the panel below with the hadiths of that
// theme in that collection, cloned from the outline list (the text alternative), and hover or focus lights the row
// and the column.
const root = document.querySelector<HTMLElement>("[data-sg-q]");
const panel = root?.querySelector<HTMLElement>("[data-sg-qpanel]");
if (root && panel) {
  const table = root.querySelector<HTMLTableElement>("table")!;
  const cells = [...table.querySelectorAll<HTMLAnchorElement>("a.sg-q-cell")];
  const body = panel.querySelector<HTMLElement>("[data-sg-qbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-qhint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-qclose]")!;
  let selected: HTMLAnchorElement | null = null;

  const light = (cell: HTMLAnchorElement | null) => {
    table.querySelectorAll(".hl").forEach((el) => el.classList.remove("hl"));
    if (!cell) return;
    const { r, c } = cell.dataset;
    table.querySelector(`tbody tr[data-r="${r}"]`)?.classList.add("hl");
    table.querySelectorAll(`[data-c="${c}"]`).forEach((el) => el.classList.add("hl"));
  };
  const select = (cell: HTMLAnchorElement | null) => {
    selected?.removeAttribute("aria-current");
    selected = cell;
    cell?.setAttribute("aria-current", "true");
    body.replaceChildren();
    const card = cell && root.querySelector<HTMLElement>(`[data-sg-card="${cell.dataset.cell}"]`);
    if (card) body.append(...[...card.cloneNode(true).childNodes]);
    hint.hidden = !!card;
    close.hidden = !card;
    light(cell);
  };

  panel.hidden = false;
  for (const cell of cells) {
    cell.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      select(selected === cell ? null : cell);
    });
    cell.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") light(cell); });
    cell.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") light(selected); });
    cell.addEventListener("focus", () => light(cell));
    cell.addEventListener("blur", () => light(selected));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back?.focus(); } });
}
