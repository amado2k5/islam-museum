// The ladder of multiplication (site/src/components/sig/HisabLadder.astro): the ladder is drawn and every mark is a
// real link in the HTML; this script adds the readout (hover, focus, first tap), cloned from the hidden records store.
import { bindMarks } from "./sig-readout";

const root = document.querySelector<HTMLElement>("[data-sg-hl]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const store = root?.querySelector<HTMLElement>("[data-sg-store]");
if (root && readout && store) {
  const links = [...root.querySelectorAll<HTMLAnchorElement>("a[data-i]")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const plot = root.querySelector<HTMLElement>("[data-sg-plot]");
  readout.hidden = false;
  bindMarks(links, (a) => {
    const i = a?.dataset.i;
    for (const l of links) l.classList.toggle("is-sel", !!i && l.dataset.i === i);
    plot?.classList.toggle("has-sel", !!i);
    const src = i ? store.querySelector<HTMLElement>(`[data-d="${i}"]`) : null;
    hint.hidden = !!src;
    detail.hidden = !src;
    if (src) detail.innerHTML = src.innerHTML;
  });
}
