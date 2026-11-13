// The road of the signs (site/src/components/sig/SignsRoad.astro): hover, focus or a tap on a milestone fills the read-out
// with that step's description, its counts and the museum's own records of the step, all read from the markup, and lights
// that step's waymarks. Without this script every milestone and waymark is still a link.
const root = document.querySelector<HTMLElement>("[data-sg-sr]");
const panel = root?.querySelector<HTMLElement>("[data-sg-srpanel]");
if (root && panel) {
  const road = root.querySelector<HTMLElement>(".sg-sr-road")!;
  const body = panel.querySelector<HTMLElement>("[data-sg-srbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-srhint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-srclose]")!;
  const stations = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-sr-st")];
  const ways = [...root.querySelectorAll<HTMLAnchorElement>("a.sg-sr-way")];
  let selected: HTMLAnchorElement | null = null;
  const el = (tag: string, text?: string, cls?: string) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };
  const light = (st: HTMLAnchorElement | null) => {
    road.classList.toggle("on", !!st);
    for (const w of ways) w.classList.toggle("hl", !!st && w.dataset.for === st.dataset.step);
  };
  const select = (st: HTMLAnchorElement | null) => {
    selected?.removeAttribute("aria-current");
    selected = st;
    st?.setAttribute("aria-current", "true");
    body.replaceChildren();
    if (st) {
      body.append(el("h3", st.querySelector("b")?.textContent ?? ""), el("p", st.dataset.desc), el("p", st.dataset.counts, "muted"));
      const mine = ways.filter((w) => w.dataset.for === st.dataset.step);
      if (mine.length) {
        const ul = el("ul");
        for (const w of mine) { const li = el("li"); const a = el("a", w.getAttribute("aria-label") ?? ""); a.setAttribute("href", w.getAttribute("href") ?? "#"); li.append(a); ul.append(li); }
        body.append(el("p", root.dataset.records, "muted"), ul);
      } else body.append(el("p", root.dataset.none, "muted"));
      const go = el("a", root.dataset.go, "sg-sr-go"); go.setAttribute("href", st.getAttribute("href") ?? "#");
      body.append(go);
    }
    hint.hidden = !!st; close.hidden = !st;
    light(st);
  };
  panel.hidden = false;
  for (const st of stations) {
    st.addEventListener("click", (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); select(selected === st ? null : st); });
    st.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") light(st); });
    st.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") light(selected); });
    st.addEventListener("focus", () => light(st));
    st.addEventListener("blur", () => light(selected));
  }
  close.addEventListener("click", () => { const back = selected; select(null); back?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); back?.focus(); } });
}
