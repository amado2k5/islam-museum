// The overlap chart of the Jinn & Devils Browser (site/src/components/sig/JinnOverlap.astro): a column is a button. With
// this script pressing it fills the panel below with that combination's records, cloned from the outline list (which is
// the text alternative and stays on the page); pressing it again, the close button or Escape empties the panel.
const root = document.querySelector<HTMLElement>("[data-sg-j]");
const panel = root?.querySelector<HTMLElement>("[data-sg-jpanel]");
if (root && panel) {
  const cols = [...root.querySelectorAll<HTMLButtonElement>("button.sg-j-col")];
  const body = panel.querySelector<HTMLElement>("[data-sg-jbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-jhint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-jclose]")!;
  let selected: HTMLButtonElement | null = null;

  const select = (col: HTMLButtonElement | null) => {
    selected?.setAttribute("aria-pressed", "false");
    selected = col;
    body.replaceChildren();
    const card = col && root.querySelector<HTMLElement>(`[data-sg-card="${col.dataset.k}"]`);
    if (col && card) { col.setAttribute("aria-pressed", "true"); body.append(...[...card.cloneNode(true).childNodes]); }
    hint.hidden = !!card;
    close.hidden = !card;
  };

  panel.hidden = false;
  for (const col of cols) {
    col.setAttribute("aria-pressed", "false");
    col.addEventListener("click", () => select(selected === col ? null : col));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back?.focus(); } });
}
