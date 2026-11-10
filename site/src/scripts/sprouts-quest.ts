// Sprout Quest client: one giant screen at a time, "next" advances,
// "again" restarts. Stateless — no storage, no scores, no failure states.
// Dependency-free. No-JS users get the static <ol> in <noscript>.
function init(root: HTMLElement) {
  const panels = [...root.querySelectorAll("[data-panel]")] as HTMLElement[];
  const finale = root.querySelector("[data-finale]") as HTMLElement;
  let current = 0;

  const show = (n: number) => {
    current = n;
    panels.forEach((p, k) => { p.hidden = k !== n; });
    finale.hidden = n < panels.length;
    const visible = n < panels.length ? panels[n] : finale;
    visible.querySelector(".quest-next")?.scrollIntoView({ block: "nearest" });
  };

  root.querySelectorAll("[data-next]").forEach((b) =>
    b.addEventListener("click", () => show(Math.min(current + 1, panels.length)))
  );
  root.querySelector("[data-again]")!.addEventListener("click", () => show(0));

  root.hidden = false;
  show(0);
}

document.querySelectorAll("[data-quest]").forEach((el) => init(el as HTMLElement));

// Module scope: keep this script's globals out of the site-wide script scope.
export {};
