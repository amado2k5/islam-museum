// StoryPlayer client: tick rail + prev/next navigation.
{
function init(root: HTMLElement) {
  const panels = [...root.querySelectorAll("[data-panel]")] as HTMLElement[];
  const ticks = [...root.querySelectorAll("[data-tick]")] as HTMLButtonElement[];
  const count = root.querySelector("[data-count]")!;
  let i = 0;
  const show = (n: number) => {
    i = Math.max(0, Math.min(panels.length - 1, n));
    panels.forEach((p, k) => { p.hidden = k !== i; });
    ticks.forEach((tk, k) => tk.setAttribute("aria-selected", k === i ? "true" : "false"));
    count.textContent = `${i + 1} / ${panels.length}`;
  };
  ticks.forEach((tk, k) => tk.addEventListener("click", () => show(k)));
  root.querySelector("[data-prev]")!.addEventListener("click", () => show(i - 1));
  root.querySelector("[data-next]")!.addEventListener("click", () => show(i + 1));
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(i + 1);
    if (e.key === "ArrowRight") show(i - 1);
  });
  show(0);
}
document.querySelectorAll("[data-story]").forEach((r) => init(r as HTMLElement));
}
