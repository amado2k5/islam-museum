// The Cosmos orrery's read-out (docs/site/signature-views.md): the dot a visitor hovers or focuses is spoken in one
// line beneath the drawing. Without JavaScript every dot is still a link and the numbered key lists every orbit.
const root = document.querySelector<HTMLElement>("[data-cs-orrery]");
const line = root?.querySelector<HTMLElement>("[data-cs-line]");
if (root && line) {
  const hint = line.dataset.hint ?? "";
  const show = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.("a[data-read]") as HTMLElement | null;
    line.textContent = a?.dataset.read ?? hint;
  };
  root.addEventListener("pointerover", show);
  root.addEventListener("focusin", show);
  root.addEventListener("pointerleave", () => { line.textContent = hint; });
}
