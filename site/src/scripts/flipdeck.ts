{
// FlipDeck client: card flip, prev/next navigation, progress bar, keyboard.
function init(root: HTMLElement) {
  const cards = [...root.querySelectorAll("[data-card]")] as HTMLElement[];
  const bar = root.querySelector("[data-bar]") as HTMLElement;
  const count = root.querySelector("[data-count]")!;
  let i = 0;
  const rtl = document.documentElement.dir === "rtl";

  const show = (n: number) => {
    i = (n + cards.length) % cards.length;
    cards.forEach((c, k) => {
      c.hidden = k !== i;
      c.querySelector("[data-inner]")?.classList.remove("flipped");
    });
    bar.style.width = `${((i + 1) / cards.length) * 100}%`;
    count.textContent = `${i + 1} / ${cards.length}`;
  };
  const flip = () => cards[i].querySelector("[data-inner]")?.classList.toggle("flipped");

  root.querySelector("[data-prev]")!.addEventListener("click", () => show(i - 1));
  root.querySelector("[data-next]")!.addEventListener("click", () => show(i + 1));
  root.querySelectorAll("[data-inner]").forEach((el) => {
    el.addEventListener("click", flip);
    el.addEventListener("keydown", (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === " " || k === "Enter") { e.preventDefault(); flip(); }
      // Keys follow the screen: the previous card is on the left, or on the right in RTL.
      if (k === "ArrowLeft") show(i + (rtl ? 1 : -1));
      if (k === "ArrowRight") show(i + (rtl ? -1 : 1));
    });
  });
  // Touch swipe
  let x0 = 0;
  const stage = root.querySelector(".fd-stage")!;
  stage.addEventListener("touchstart", (e) => { x0 = (e as TouchEvent).touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const dx = (e as TouchEvent).changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
}

document.querySelectorAll("[data-flipdeck]").forEach((r) => init(r as HTMLElement));

}
