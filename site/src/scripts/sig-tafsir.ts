// The Mushaf band of the Tafsir Browser (site/src/components/sig/MushafBand.astro): the band is drawn and linked in
// the HTML; this script adds the readout (hover, focus, first tap) and the order-of-revelation toggle, which moves
// the blocks with an animation only when motion is welcome.
const root = document.querySelector<HTMLElement>("[data-sg-taf]");
const band = root?.querySelector<HTMLElement>("[data-sg-band]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const toggle = root?.querySelector<HTMLButtonElement>("[data-sg-toggle]");
if (root && band && readout && toggle) {
  const cells = [...band.querySelectorAll<HTMLElement>(".sg-taf-cell")];
  const links = [...band.querySelectorAll<HTMLAnchorElement>("a.sg-taf-b")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const T = band.dataset;
  const fill = (tpl: string | undefined, vars: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let selected: HTMLAnchorElement | null = null;
  let hovered: HTMLAnchorElement | null = null;
  let touch = false;
  let wasSelected = false;

  const show = (a: HTMLAnchorElement | null) => {
    const d = a?.dataset;
    hint.hidden = !!d;
    detail.hidden = !d;
    if (!d) return;
    f("name").textContent = `${d.num} · ${d.name}`;
    f("place").textContent = d.place ?? "";
    f("ayahs").textContent = fill(T.tName, { n: d.verses ?? "" });
    f("cov").textContent = Number(d.k) > 0 ? fill(T.tCov, { k: d.kk ?? "", n: d.verses ?? "", p: d.pct ?? "" }) : (T.tNone ?? "");
    const read = f("read") as HTMLAnchorElement, open = f("open") as HTMLAnchorElement;
    read.hidden = !d.read;
    if (d.read) read.href = d.read;
    open.href = d.open ?? "#";
  };
  const mark = () => {
    const a = hovered ?? selected;
    for (const l of links) l.classList.toggle("is-sel", l === a);
    band.classList.toggle("has-sel", !!a);
    show(a);
  };

  readout.hidden = false;
  for (const a of links) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === a; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = a; mark(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    a.addEventListener("focus", () => { selected = a; mark(); });
    a.addEventListener("click", (e) => {
      // a touch user's first tap selects the block and shows the readout; the second opens it
      if (touch && !wasSelected && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); selected = a; mark(); }
      touch = false;
    });
  }

  // ---- order of revelation (without the script the Mushaf order stays)
  const label = root.querySelector<HTMLElement>("[data-sg-order]");
  const apply = (rev: boolean) => {
    toggle.setAttribute("aria-pressed", String(rev));
    if (label) label.textContent = rev ? (T.tRev ?? "") : (T.tMush ?? "");
    const first = new Map(cells.map((c) => [c, c.getBoundingClientRect()]));
    for (const c of cells) c.style.order = rev ? c.style.getPropertyValue("--o") : "";
    if (still) return;
    for (const c of cells) {
      const a = first.get(c)!, b = c.getBoundingClientRect();
      const dx = a.left - b.left, dy = a.top - b.top;
      c.classList.remove("moving");
      c.style.transform = dx || dy ? `translate(${dx}px, ${dy}px)` : "";
    }
    void band.offsetWidth;
    for (const c of cells) {
      if (!c.style.transform) continue;
      c.classList.add("moving");
      c.style.transform = "";
      c.addEventListener("transitionend", () => c.classList.remove("moving"), { once: true });
    }
  };
  toggle.hidden = false;
  toggle.addEventListener("click", () => apply(toggle.getAttribute("aria-pressed") !== "true"));
}
