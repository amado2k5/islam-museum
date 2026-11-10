// Kindness Quest client: tap a day to earn its sticker (one-way), stickers persist
// in localStorage, progress painted on load. Erase uses the same two-step
// confirm shape as quest.ts (armed state, confirm label swap, 5s auto-disarm,
// Escape cancels). Dependency-free.
const KEY = "kids-kindness";

function init(root: HTMLElement) {
  const days = [...root.querySelectorAll("[data-day].day-btn")] as HTMLButtonElement[];
  const boxes = [...root.querySelectorAll("[data-box]")] as HTMLElement[];
  const progressEl = root.querySelector("[data-progress]") as HTMLElement;
  const bar = root.querySelector("[data-bar]") as HTMLProgressElement | null;
  const earnMsg = root.querySelector("[data-earn-msg]") as HTMLElement | null;
  const eraseBtn = root.querySelector("[data-erase]") as HTMLButtonElement | null;
  const eraseMsg = root.querySelector("[data-erase-msg]") as HTMLElement | null;
  const dayT = root.dataset.i18nDay || "Day {n}";
  const tapT = root.dataset.i18nTap || "";
  const progressT = root.dataset.i18nProgress || "{n} of 30";
  const doneT = root.dataset.i18nDone || "";

  let earned: number[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    earned = Array.isArray(raw) ? raw.filter((n) => typeof n === "number" && n >= 1 && n <= 30) : [];
  } catch { earned = []; }

  const dayNum = (b: HTMLButtonElement) => Number(b.dataset.day);
  const iconOf = new Map<number, string>();
  days.forEach((b) => iconOf.set(dayNum(b), (b.querySelector(".sticker")?.textContent || "⭐").trim()));

  const paint = () => {
    days.forEach((b) => {
      const n = dayNum(b);
      const on = earned.includes(n);
      b.classList.toggle("earned", on);
      b.setAttribute("aria-pressed", String(on));
      const deed = (b.querySelector(".deed-text")?.textContent || "").trim();
      b.setAttribute("aria-label", on
        ? `${dayT.replace("{n}", String(n))} — ${deed}`
        : `${dayT.replace("{n}", String(n))} — ${tapT}`);
    });
    boxes.forEach((box) => {
      const n = Number(box.dataset.box);
      box.textContent = earned.includes(n) ? (iconOf.get(n) || "⭐") : "☐";
    });
    progressEl.textContent = progressT.replace("{n}", String(earned.length));
    if (bar) bar.value = earned.length;
  };

  days.forEach((b) => b.addEventListener("click", () => {
    const n = dayNum(b);
    if (earned.includes(n)) return; // one-way: no un-earning
    earned.push(n);
    try { localStorage.setItem(KEY, JSON.stringify(earned)); } catch { /* storage unavailable */ }
    if (earnMsg) earnMsg.textContent = doneT;
    paint();
  }));

  root.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  // Erase: two-step confirm, same shape as quest.ts.
  if (eraseBtn && eraseMsg) {
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
      try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
      earned = [];
      if (earnMsg) earnMsg.textContent = "";
      eraseMsg.textContent = eraseDone;
      paint();
    });
    eraseBtn.addEventListener("keydown", (e) => { if (e.key === "Escape" && armed) disarm(); });
  }

  paint();
}

document.querySelectorAll("[data-kindness]").forEach((el) => init(el as HTMLElement));
