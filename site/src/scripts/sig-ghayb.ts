// The eight doors of the Ghayb Browser (site/src/components/sig/GhaybDoors.astro): with this script, choosing a doorway's
// name opens its description in the read-out (read from the markup) with a link to its section inside; without it the name
// is simply that link. Every record in a doorway is a link either way.
const root = document.querySelector<HTMLElement>("[data-sg-gd]");
const panel = root?.querySelector<HTMLElement>("[data-sg-gdpanel]");
if (root && panel) {
  const body = panel.querySelector<HTMLElement>("[data-sg-gdbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-gdhint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-gdclose]")!;
  const heads = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-gd-head")];
  let selected: HTMLAnchorElement | null = null;
  const el = (tag: string, text?: string, cls?: string) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };
  const select = (h: HTMLAnchorElement | null) => {
    selected?.removeAttribute("aria-current");
    selected?.closest(".sg-gd-door")?.classList.remove("on");
    selected = h;
    body.replaceChildren();
    if (h) {
      h.setAttribute("aria-current", "true");
      h.closest(".sg-gd-door")?.classList.add("on");
      const go = el("a", root.dataset.go, "sg-gd-go"); go.setAttribute("href", h.getAttribute("href") ?? "#");
      body.append(el("h3", h.querySelector("b")?.textContent ?? ""), el("p", h.dataset.desc), el("p", h.dataset.count, "muted"), go);
    }
    hint.hidden = !!h; close.hidden = !h;
  };
  panel.hidden = false;
  for (const h of heads) h.addEventListener("click", (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); select(selected === h ? null : h); });
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back?.focus(); } });
}
