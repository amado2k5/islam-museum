// The night sky of the Dream Browser (site/src/components/sig/DreamsSky.astro). Every star is a link in the HTML; this
// script fills the read-out on hover, focus and a touch user's first tap (the second tap opens the record), and
// brightens the line of the star's group.
const root = document.querySelector<HTMLElement>("[data-sg-dr]");
const panel = root?.querySelector<HTMLElement>("[data-sg-drpanel]");
if (root && panel) {
  const stars = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-dr-s")];
  const hint = panel.querySelector<HTMLElement>("[data-sg-drhint]")!;
  const body = panel.querySelector<HTMLElement>("[data-sg-drbody]")!;
  const f = (k: string) => body.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  let hovered: HTMLAnchorElement | null = null;
  let selected: HTMLAnchorElement | null = null;
  let touch = false;
  let wasSelected = false;

  const mark = () => {
    const a = hovered ?? selected;
    hint.hidden = !!a;
    body.hidden = !a;
    for (const s of stars) s.classList.toggle("is-sel", s === a);
    for (const l of root.querySelectorAll<SVGElement>(".sg-dr-line")) l.classList.toggle("on", !!a && l.dataset.g === a.dataset.g && l.closest(".sg-dr-c") === a.closest(".sg-dr-c"));
    if (!a) return;
    f("name").textContent = a.getAttribute("aria-label") ?? "";
    f("where").textContent = a.dataset.w ?? "";
    const line = f("line");
    line.textContent = a.dataset.s ?? "";
    line.hidden = !a.dataset.s;
    (f("open") as HTMLAnchorElement).href = a.href;
  };

  panel.hidden = false;
  for (const a of stars) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === a; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = a; mark(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    a.addEventListener("focus", () => { selected = a; mark(); });
    a.addEventListener("click", (e) => {
      if (touch && !wasSelected && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); selected = a; mark(); }
      touch = false;
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && (selected || hovered)) { selected = null; hovered = null; mark(); } });
}
