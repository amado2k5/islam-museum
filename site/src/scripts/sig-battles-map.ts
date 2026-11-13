// The campaign map of the Battles Browser (components/sig/BattlesCampaignMap.astro). Every dot and every list row is a
// real link in the HTML; this script only links the two: hovering or focusing one highlights the other, and on a touch
// screen the first tap on a dot selects it (and scrolls its row into view) while the second opens the page.
for (const root of document.querySelectorAll<HTMLElement>("[data-sg-bm]")) {
  const svg = root.querySelector<SVGSVGElement>(".sg-bm-svg");
  const list = root.querySelector<HTMLElement>("[data-sg-bm-list]");
  if (!svg || !list) continue;
  const dots = new Map([...svg.querySelectorAll<SVGAElement>("a[data-i]")].map((a) => [a.dataset.i!, a]));
  const rows = new Map([...list.querySelectorAll<HTMLElement>("li[data-i]")].map((li) => [li.dataset.i!, li]));
  let hot: string | null = null;
  let touched = false;
  const set = (i: string | null, scroll = false) => {
    if (hot) { dots.get(hot)?.classList.remove("is-hot"); rows.get(hot)?.classList.remove("is-hot"); }
    hot = i;
    svg.classList.toggle("has-hot", !!(i && dots.has(i)));
    if (!i) return;
    dots.get(i)?.classList.add("is-hot");
    const row = rows.get(i);
    row?.classList.add("is-hot");
    if (scroll && row) list.scrollTo({ top: Math.max(0, row.offsetTop - list.clientHeight / 2 + row.clientHeight / 2), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  for (const [i, a] of dots) {
    a.addEventListener("pointerdown", (e) => { touched = e.pointerType === "touch"; });
    a.addEventListener("mouseenter", () => { if (!touched) set(i, true); });
    a.addEventListener("mouseleave", () => { if (!touched) set(null); });
    a.addEventListener("focus", () => { if (!touched) set(i, true); });
    a.addEventListener("blur", () => { if (!touched) set(null); });
    a.addEventListener("click", (e) => {
      if (touched && hot !== i) { e.preventDefault(); set(i, true); }
      touched = false;
    });
  }
  for (const [i, li] of rows) {
    li.addEventListener("mouseenter", () => set(i));
    li.addEventListener("mouseleave", () => set(null));
    li.addEventListener("focusin", () => set(i));
    li.addEventListener("focusout", () => set(null));
  }
}
