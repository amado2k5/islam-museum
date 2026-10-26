// Story in 12 cards — player (E5): tick rail, prev/next, and auto-play at
// 2.8 s per card (the Surah Map engine pattern). Auto-play stops on any
// pointer press or key inside the player, and the full card list always
// renders server-side for no-JS reading.
{
function init(root: HTMLElement) {
  const player = root.querySelector("[data-sc-player]") as HTMLElement;
  const panels = [...player.querySelectorAll("[data-sc-panel]")] as HTMLElement[];
  const ticks = [...player.querySelectorAll("[data-sc-tick]")] as HTMLButtonElement[];
  const count = player.querySelector("[data-sc-count]")!;
  const playBtn = player.querySelector("[data-sc-play]") as HTMLButtonElement;
  const list = root.querySelector(".sc-list") as HTMLElement;
  const playLabel = playBtn.textContent!.trim();
  const stopLabel = playBtn.dataset.stop ?? "⏸";
  let i = 0;
  let timer: number | null = null;

  list.hidden = panels.length > 0;
  const show = (n: number) => {
    i = ((n % panels.length) + panels.length) % panels.length;
    panels.forEach((p, k) => { p.hidden = k !== i; });
    ticks.forEach((tk, k) => tk.setAttribute("aria-selected", k === i ? "true" : "false"));
    count.textContent = `${i + 1} / ${panels.length}`;
  };
  const stopPlay = () => {
    if (timer) { clearInterval(timer); timer = null; playBtn.classList.remove("on"); playBtn.textContent = playLabel; }
  };
  playBtn.addEventListener("click", () => {
    if (timer) { stopPlay(); return; }
    playBtn.classList.add("on"); playBtn.textContent = stopLabel;
    timer = window.setInterval(() => show(i + 1), 2800);
  });
  ticks.forEach((tk, k) => tk.addEventListener("click", () => { stopPlay(); show(k); }));
  player.querySelector("[data-sc-prev]")!.addEventListener("click", () => { stopPlay(); show(i - 1); });
  player.querySelector("[data-sc-next]")!.addEventListener("click", () => { stopPlay(); show(i + 1); });
  player.addEventListener("pointerdown", (e) => { if (e.target !== playBtn) stopPlay(); });
  player.addEventListener("keydown", (e) => {
    if (e.target !== playBtn) stopPlay();
    if (e.key === "ArrowLeft") show(i + 1);
    if (e.key === "ArrowRight") show(i - 1);
  });
  show(0);
}
document.querySelectorAll("[data-storycards]").forEach((r) => init(r as HTMLElement));
}
