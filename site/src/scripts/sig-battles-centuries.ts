// The century histogram of the Battles Browser (components/sig/BattlesCenturies.astro). The chart and its table are
// complete without this script; it adds the readout: hover or focus previews a column, a click or tap keeps it
// selected (click again to clear), and the counts are cloned from the cards rendered in the page.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-bc]")) {
  const chart = root.querySelector<HTMLElement>("[data-sg-bc-chart]");
  const read = root.querySelector<HTMLElement>("[data-sg-bc-read]");
  const hint = root.querySelector<HTMLElement>("[data-sg-bc-hint]");
  if (!chart || !read || !hint) continue;
  const cols = [...chart.querySelectorAll<HTMLButtonElement>(".sg-bc-col")];
  let pinned: HTMLButtonElement | null = null;
  const show = (col: HTMLButtonElement | null) => {
    const card = col && chart.querySelector<HTMLElement>(`[data-sg-bc-card="${col.dataset.c}"]`);
    read.replaceChildren();
    if (card) read.append(...[...card.cloneNode(true).childNodes]);
    else read.append(hint);
    for (const c of cols) c.classList.toggle("is-sel", c === (pinned ?? col));
    chart.classList.toggle("has-sel", !!(pinned ?? col));
  };
  for (const col of cols) {
    col.addEventListener("mouseenter", () => { if (!pinned) show(col); });
    col.addEventListener("mouseleave", () => { if (!pinned) show(null); });
    col.addEventListener("focus", () => { if (!pinned) show(col); });
    col.addEventListener("blur", () => { if (!pinned) show(null); });
    col.addEventListener("click", () => { pinned = pinned === col ? null : col; show(col); });
  }
}
