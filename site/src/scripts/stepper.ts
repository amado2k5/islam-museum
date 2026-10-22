// Stepper client: prev/next navigation, progress, keyboard.
{
function init(root: HTMLElement) {
  const cards = [...root.querySelectorAll("[data-card]")] as HTMLElement[];
  const bar = root.querySelector("[data-bar]") as HTMLElement;
  const count = root.querySelector("[data-count]")!;
  let i = 0;
  const rtl = document.documentElement.dir === "rtl";
  const show = (n: number) => {
    i = Math.max(0, Math.min(cards.length - 1, n));
    cards.forEach((c, k) => { c.hidden = k !== i; });
    bar.style.width = `${((i + 1) / cards.length) * 100}%`;
    count.textContent = `${i + 1} / ${cards.length}`;
  };
  root.querySelector("[data-prev]")!.addEventListener("click", () => show(i - 1));
  root.querySelector("[data-next]")!.addEventListener("click", () => show(i + 1));
  root.addEventListener("keydown", (e) => {
    // Keys follow the screen: the previous step is on the left, or on the right in RTL.
    if (e.key === "ArrowLeft") show(i + (rtl ? 1 : -1));
    if (e.key === "ArrowRight") show(i + (rtl ? -1 : 1));
  });
  show(0);
}
document.querySelectorAll("[data-stepper]").forEach((r) => init(r as HTMLElement));
}
