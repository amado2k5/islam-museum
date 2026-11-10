// Prophet Quest client: one stop at a time, choice → Hudhud feedback + star,
// stars persisted in localStorage, finale after the last stop. Dependency-free.
const STARS_KEY = "kids-quest-stars";
const SCORE_KEY = "kids-bee-score";

function init(root: HTMLElement) {
  const cards = [...root.querySelectorAll("[data-card]")] as HTMLElement[];
  const route = [...root.querySelectorAll("[data-goto]")] as HTMLButtonElement[];
  const starsEl = root.querySelector("[data-stars]") as HTMLElement;
  const finale = root.querySelector("[data-finale]") as HTMLElement;
  const starsT = root.dataset.i18nStars || "{n}";
  const eraseBtn = root.querySelector("[data-erase]") as HTMLButtonElement;
  const eraseMsg = root.querySelector("[data-erase-msg]") as HTMLElement;
  const reduceMotion = () => (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");
  const scrollOpts: ScrollIntoViewOptions = { block: "start", behavior: reduceMotion() ? "auto" : "smooth" };

  let earned: string[] = [];
  try { earned = JSON.parse(localStorage.getItem(STARS_KEY) || "[]"); } catch { earned = []; }
  const slugOf = (i: number) => (cards[i].id || "").replace(/^stop-/, "");
  const isDone = (i: number) => earned.includes(slugOf(i));

  const paint = () => {
    const n = earned.length;
    starsEl.textContent = `${starsT.replace("{n}", String(n))} ${"★".repeat(n)}${"☆".repeat(Math.max(0, cards.length - n))}`;
    route.forEach((b, i) => {
      b.classList.toggle("done", isDone(i));
      b.classList.toggle("now", i === current);
    });
    cards.forEach((c, i) => {
      const done = isDone(i);
      (c.querySelector("[data-feedback]") as HTMLElement).hidden = !done;
      c.querySelectorAll("[data-choices] button").forEach((x) => { (x as HTMLButtonElement).disabled = done; });
    });
  };

  let current = 0;
  const show = (i: number, scroll = true) => {
    current = Math.max(0, Math.min(cards.length - 1, i));
    cards.forEach((c, j) => { c.hidden = j !== current; });
    finale.hidden = earned.length !== cards.length;
    paint();
    if (scroll) (finale.hidden ? cards[current] : finale).scrollIntoView(scrollOpts);
  };

  route.forEach((b, i) => b.addEventListener("click", () => show(i)));

  cards.forEach((c, i) => {
    c.querySelectorAll("[data-choices] button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slug = slugOf(i);
        if (!earned.includes(slug)) {
          earned.push(slug);
          try { localStorage.setItem(STARS_KEY, JSON.stringify(earned)); } catch { /* storage unavailable */ }
        }
        show(i);
      });
    });
    c.querySelector("[data-next]")?.addEventListener("click", () => show(i + 1));
    c.querySelector("[data-prev]")?.addEventListener("click", () => show(i - 1));
  });

  root.querySelector("[data-restart]")!.addEventListener("click", () => {
    earned = [];
    try { localStorage.removeItem(STARS_KEY); } catch { /* storage unavailable */ }
    show(0);
  });

  // Erase: two-step confirm, clears ALL Kids' Wing progress (stars + bee score).
  const eraseLabel = eraseBtn.textContent || "";
  const eraseConfirm = eraseBtn.dataset.confirm || eraseLabel;
  const eraseDone = root.dataset.i18nEraseDone || "";
  let armed = false;
  let timer: number | undefined;
  const disarm = () => {
    armed = false;
    eraseBtn.textContent = eraseLabel;
    if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
  };
  eraseBtn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      eraseBtn.textContent = eraseConfirm;
      timer = window.setTimeout(disarm, 5000);
      return;
    }
    disarm();
    try { localStorage.removeItem(STARS_KEY); localStorage.removeItem(SCORE_KEY); } catch { /* storage unavailable */ }
    earned = [];
    eraseMsg.textContent = eraseDone;
    show(0);
  });
  eraseBtn.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });

  // Start at the first unfinished stop (or the finale, if already complete).
  const firstOpen = cards.findIndex((_, i) => !isDone(i));
  show(firstOpen === -1 ? cards.length - 1 : firstOpen, false);
}

document.querySelectorAll("[data-quest]").forEach((el) => init(el as HTMLElement));
