// Learn chooser (docs/plan/19-tour-learn.md §3): chip filters over the pathway
// catalogue — goal kind, region, audience. Groups AND together, chips inside a
// group OR; a group with nothing selected passes every card. Without JS every
// card stays visible.
{
document.querySelectorAll("[data-chooser]").forEach((chooser) => {
  const wrap = chooser.closest("[data-chooser-wrap]") ?? chooser.parentElement;
  if (!wrap) return;
  const cards = [...wrap.querySelectorAll("[data-card]")] as HTMLElement[];
  const sel: Record<string, Set<string>> = {};

  const apply = () => {
    cards.forEach((c) => {
      const show = Object.entries(sel).every(([f, s]) => {
        if (!s.size) return true;
        const vals = (c.dataset[f] ?? "").split(" ").filter(Boolean);
        return vals.some((v) => s.has(v));
      });
      c.hidden = !show;
    });
  };

  chooser.querySelectorAll("[data-f]").forEach((el) => {
    el.addEventListener("click", () => {
      const f = el.getAttribute("data-f")!, v = el.getAttribute("data-v")!;
      const s = (sel[f] ??= new Set());
      if (s.has(v)) { s.delete(v); el.setAttribute("aria-pressed", "false"); }
      else { s.add(v); el.setAttribute("aria-pressed", "true"); }
      apply();
    });
  });
  chooser.querySelector("[data-reset]")?.addEventListener("click", () => {
    Object.keys(sel).forEach((f) => sel[f].clear());
    chooser.querySelectorAll("[aria-pressed]").forEach((el) => el.setAttribute("aria-pressed", "false"));
    apply();
  });
});
}
