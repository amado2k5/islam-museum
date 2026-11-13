// The two-abodes chart (site/src/components/sig/TwoAbodes.astro): the bars are drawn and linked in the HTML; this script
// adds the readout (hover, focus, first tap) and the toggle that brings both sides to full tone.
const root = document.querySelector<HTMLElement>("[data-sg-ta]");
const grid = root?.querySelector<HTMLElement>("[data-sg-grid]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const toggle = root?.querySelector<HTMLButtonElement>("[data-sg-toggle]");
if (root && grid && readout) {
  const T = grid.dataset;
  const digits = [...(T.digits ?? "")];
  const dig = (n: number | string) => String(n).replace(/\d/g, (d) => digits[+d] ?? d);
  const fill = (tpl: string | undefined, vars: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const cells = [...grid.querySelectorAll<HTMLElement>(".sg-ta-c")];
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  let selected: HTMLElement | null = null;
  let hovered: HTMLElement | null = null;
  let touch = false;
  let wasSelected = false;

  const refs = (into: HTMLElement, sura: string, list: string | undefined) => {
    into.replaceChildren();
    for (const a of (list ?? "").split(",").filter(Boolean)) {
      const link = document.createElement("a");
      link.href = `${T.ayah}${sura}-${a}/`;
      const b = document.createElement("bdi");
      b.dir = "ltr";
      b.textContent = `${dig(sura)}:${dig(a)}`;
      link.append(b);
      into.append(link);
    }
  };
  const show = (c: HTMLElement | null) => {
    hint.hidden = !!c;
    detail.hidden = !c;
    if (!c) return;
    const d = c.dataset;
    f("name").textContent = `${dig(d.s ?? "")} · ${d.name}`;
    f("jt").textContent = `${T.tJ}:`;
    f("nt").textContent = `${T.tN}:`;
    f("jc").textContent = Number(d.cj) > 0 ? fill(T.tCount, { n: dig(d.cj ?? "0") }) : (T.tNone ?? "");
    f("nc").textContent = Number(d.ck) > 0 ? fill(T.tCount, { n: dig(d.ck ?? "0") }) : (T.tNone ?? "");
    refs(f("jr"), d.s ?? "", d.j);
    refs(f("nr"), d.s ?? "", d.k);
    const other = f("other") as HTMLAnchorElement;
    other.href = T.other ?? "#";
    other.textContent = T.tOther ?? "";
  };
  const mark = () => {
    const c = hovered ?? selected;
    for (const x of cells) x.classList.toggle("is-sel", x === c);
    show(c);
  };

  readout.hidden = false;
  for (const c of cells) {
    c.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === c; });
    c.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = c; mark(); } });
    c.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; mark(); } });
    c.addEventListener("focusin", () => { selected = c; mark(); });
    c.addEventListener("click", (e) => {
      // a touch user's first tap selects the surah and shows the readout; the second opens the bar's ayah
      if (touch && !wasSelected && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault();
        selected = c;
        mark();
      }
      touch = false;
    });
  }

  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const on = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", String(on));
      root.classList.toggle("all", on);
    });
  }
}
