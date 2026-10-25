// Little Time Machine client: era select → 600ms whoosh overlay → era screen,
// visited-era stars persisted in localStorage. Dependency-free, guarded JSON.
// Without JS everything stays server-rendered and readable; this script runs
// only when JS is available and collapses the page into the interactive flow.
// Reduced motion: overlay skipped entirely, the era screen just appears.
const VISITED_KEY = "kids-eras-visited";
const TRAVEL_MS = 600;

function init(root: HTMLElement) {
  const select = root.querySelector<HTMLElement>("[data-era-select]")!;
  const screens = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>("[data-era-screen]").forEach((el) => {
    const slug = el.dataset.eraScreen;
    if (slug) screens.set(slug, el);
  });
  const overlay = root.querySelector<HTMLElement>("[data-travel-overlay]")!;
  const finale = root.querySelector<HTMLElement>("[data-tm-finale]")!;
  const gotoBtns = [...root.querySelectorAll<HTMLButtonElement>("[data-era-goto]")];
  const backBtns = [...root.querySelectorAll<HTMLButtonElement>("[data-travel-back]")];
  const againBtn = root.querySelector<HTMLButtonElement>("[data-tm-again]");
  const reduceMotion = (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.getAttribute("data-motion") === "reduce");
  const scrollOpts: ScrollIntoViewOptions = { block: "start", behavior: reduceMotion ? "auto" : "smooth" };

  let visited: string[] = [];
  try {
    const raw = JSON.parse(localStorage.getItem(VISITED_KEY) || "[]");
    visited = Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string") : [];
  } catch { visited = []; }

  const markVisited = (slug: string) => {
    if (!visited.includes(slug)) {
      visited.push(slug);
      try { localStorage.setItem(VISITED_KEY, JSON.stringify(visited)); } catch { /* storage unavailable */ }
    }
  };

  const paint = () => {
    gotoBtns.forEach((b) => {
      const done = visited.includes(b.dataset.eraGoto || "");
      const star = b.querySelector<HTMLElement>("[data-era-star]");
      if (star) star.hidden = !done;
      b.classList.toggle("done", done);
    });
    finale.hidden = visited.length < screens.size || screens.size === 0;
  };

  const show = (slug: string | null, scroll = true) => {
    screens.forEach((el, s) => { el.hidden = s !== slug; });
    select.hidden = slug !== null;
    paint();
    const target = slug !== null ? screens.get(slug) ?? select : select;
    if (scroll) {
      target.scrollIntoView(scrollOpts);
      const h = target.querySelector("h2");
      if (h instanceof HTMLElement && slug !== null) h.focus({ preventScroll: true });
    }
  };

  const travel = (slug: string) => {
    markVisited(slug);
    if (reduceMotion || !screens.has(slug)) { show(slug); return; }
    overlay.hidden = false;
    window.setTimeout(() => { overlay.hidden = true; show(slug); }, TRAVEL_MS);
  };

  gotoBtns.forEach((b) => b.addEventListener("click", () => {
    const slug = b.dataset.eraGoto;
    if (slug) travel(slug);
  }));
  backBtns.forEach((b) => b.addEventListener("click", () => show(null)));
  againBtn?.addEventListener("click", () => show(null));

  // Collapse into the interactive flow only once JS is confirmed running.
  show(null, false);
}

document.querySelectorAll("[data-timemachine]").forEach((el) => init(el as HTMLElement));
