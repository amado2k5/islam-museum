// A generation, year by year (site/src/components/sig/CompanionsGeneration.astro): the dot plot is fully drawn and linked in
// the HTML. This script adds the circle buttons (one circle lit in gold, the rest dimmed, the lit count per decade) and the
// decade panel: a tap or Enter on a decade selects it and fills the panel with that decade's Companions, cloned from the
// text outline below the chart; a second tap opens the decade's page, as the panel's button does.
const root = document.querySelector<HTMLElement>("[data-sg-dc]");
const svg = root?.querySelector<SVGSVGElement>(".sg-dc-svg");
const panel = root?.querySelector<HTMLElement>("[data-sg-dc-panel]");
if (root && svg && panel) {
  const body = panel.querySelector<HTMLElement>("[data-sg-dc-body]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-dc-hint]")!;
  const live = root.querySelector<HTMLElement>("[data-sg-dc-lit]");
  const toggles = root.querySelector<HTMLElement>("[data-sg-dc-toggles]");
  const counts = [...root.querySelectorAll<HTMLElement>(".sg-dc-counts li")];
  const dots = [...svg.querySelectorAll<SVGAElement>("a.sg-dc-dot")];
  const links = [...root.querySelectorAll<HTMLAnchorElement | SVGAElement>("a[data-dc]")];
  const nf = new Intl.NumberFormat(root.dataset.nf || undefined);
  const has = (el: Element, g: string) => (el.getAttribute("data-g") ?? "").includes(g);
  let circle = "";
  let selected = "";

  const lit = (g: string) => {
    circle = g;
    svg.classList.toggle("has-lit", !!g);
    for (const d of dots) d.classList.toggle("is-lit", !!g && has(d, g));
    for (const li of counts) {
      const k = li.dataset.k!;
      const n = g ? dots.filter((d) => d.parentElement?.getAttribute("data-d") === k && has(d, g)).length : Number(li.dataset.n);
      li.textContent = nf.format(n);
      li.classList.toggle("is-lit", !!g && n > 0);
      li.classList.toggle("is-zero", !!g && n === 0);
    }
    root.querySelectorAll<HTMLElement>(".sg-dc-names li[data-g]").forEach((li) => li.classList.toggle("is-lit", !!g && has(li, g)));
    panel.querySelectorAll<HTMLElement>(".sg-dc-names li[data-g]").forEach((li) => li.classList.toggle("is-lit", !!g && has(li, g)));
    if (live) {
      const btn = toggles?.querySelector<HTMLElement>(`button[data-g="${g}"]`);
      live.textContent = g && btn ? `${btn.textContent}` : "";
    }
  };
  const select = (k: string) => {
    selected = k;
    for (const a of links) a.classList.toggle("is-sel", !!k && a.getAttribute("data-dc") === k);
    body.replaceChildren();
    const sec = k ? root.querySelector<HTMLElement>(`[data-sg-dc-sec="${k}"]`) : null;
    if (sec) {
      const clone = sec.cloneNode(true) as HTMLElement;
      clone.removeAttribute("aria-labelledby");
      clone.querySelector("h3")?.removeAttribute("id");
      body.append(clone);
      const open = document.createElement("a");
      open.className = "ui sg-dc-open";
      open.href = (sec.querySelector("h3 a") as HTMLAnchorElement).href;
      open.textContent = root.dataset.open || open.href;
      open.hidden = !root.dataset.open;
      if (root.dataset.open) { const p = document.createElement("p"); p.className = "ui"; p.append(open); body.append(p); }
      clone.querySelectorAll<HTMLElement>(".sg-dc-names li[data-g]").forEach((li) => li.classList.toggle("is-lit", !!circle && has(li, circle)));
    }
    hint.hidden = !!sec;
  };

  panel.hidden = false;
  for (const a of links) {
    a.addEventListener("click", (e) => {
      const k = a.getAttribute("data-dc") ?? "";
      const me = e as MouseEvent;
      if (selected === k || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
      e.preventDefault();
      select(k);
    });
  }
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) select(""); });

  if (toggles) {
    toggles.hidden = false;
    const buttons = [...toggles.querySelectorAll<HTMLButtonElement>("button[data-g]")];
    for (const b of buttons) {
      b.addEventListener("click", () => {
        const on = b.getAttribute("aria-pressed") !== "true";
        for (const o of buttons) o.setAttribute("aria-pressed", String(o === b && on));
        lit(on ? b.dataset.g! : "");
      });
    }
  }
}
