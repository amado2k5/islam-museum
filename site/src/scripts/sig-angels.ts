// The ring of offices of the Angels Browser (site/src/components/sig/AngelsRing.astro): hover, focus or a tap on a disc fills
// the read-out with the record's name, its section, the first sentence of its summary and its date (events only; an event
// sector record without one is marked undated), all read from the markup, and lights the sector. Without this script every
// disc is still a link.
const root = document.querySelector<HTMLElement>("[data-sg-ar]");
const panel = root?.querySelector<HTMLElement>("[data-sg-arpanel]");
if (root && panel) {
  const body = panel.querySelector<HTMLElement>("[data-sg-arbody]")!;
  const hint = panel.querySelector<HTMLElement>("[data-sg-arhint]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-sg-arclose]")!;
  const nodes = [...root.querySelectorAll<SVGAElement>("a.sg-ar-n")];
  const wedges = [...root.querySelectorAll<SVGPathElement>(".sg-ar-w")];
  let selected: SVGAElement | null = null;
  const fill = (tpl: string | undefined, key: string, v: string) => (tpl ?? "").replace(`{${key}}`, v);
  const el = (tag: string, text?: string, cls?: string) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };
  const light = (n: SVGAElement | null) => { for (const w of wedges) w.style.fillOpacity = n && w.dataset.sec !== n.dataset.sec ? ".35" : ""; };
  const show = (n: SVGAElement | null) => {
    body.replaceChildren();
    if (n) {
      body.append(el("h3", n.getAttribute("aria-label") ?? ""), el("p", fill(root.dataset.tplSec, "s", n.dataset.st ?? ""), "muted"));
      if (n.dataset.first) body.append(el("p", n.dataset.first));
      const d = n.dataset.date || (n.dataset.sec === "events" ? root.dataset.undated : "");
      if (d) body.append(el("p", n.dataset.date ? fill(root.dataset.tplDate, "d", d) : d, "muted"));
      const go = el("a", root.dataset.open, "sg-ar-go"); go.setAttribute("href", n.getAttribute("href") ?? "#");
      body.append(go);
    }
    hint.hidden = !!n; close.hidden = !n;
  };
  const select = (n: SVGAElement | null) => {
    selected?.removeAttribute("aria-current");
    selected = n;
    n?.setAttribute("aria-current", "true");
    show(n); light(n);
  };
  panel.hidden = false;
  for (const n of nodes) {
    n.addEventListener("click", (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); select(selected === n ? null : n); });
    n.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { show(n); light(n); } });
    n.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { show(selected); light(selected); } });
    n.addEventListener("focus", () => { show(n); light(n); });
    n.addEventListener("blur", () => { show(selected); light(selected); });
  }
  close.addEventListener("click", () => { const back = selected; select(null); (back as unknown as HTMLElement | null)?.focus(); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape" && selected) { const back = selected; select(null); (back as unknown as HTMLElement).focus(); } });
}
