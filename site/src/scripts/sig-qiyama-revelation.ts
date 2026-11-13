// The revelation-order chart of the Resurrection and Reckoning browser (site/src/components/sig/QiyamaRevelation.astro):
// the dots are drawn and linked in the HTML; this script adds the cursor that follows the pointer or the focus across the
// three bands, the readout, the arrow keys along a band, and the toggle between the order of revelation and the Mushaf.
const root = document.querySelector<HTMLElement>("[data-sg-qr]");
const stage = root?.querySelector<HTMLElement>("[data-sg-stage]");
const readout = root?.querySelector<HTMLElement>("[data-sg-readout]");
const toggle = root?.querySelector<HTMLButtonElement>("[data-sg-toggle]");
const axis = root?.querySelector<HTMLElement>("[data-sg-axis]");
if (root && stage && readout && axis) {
  const T = stage.dataset;
  const digits = [...(T.digits ?? "")];
  const dig = (n: number | string) => String(n).replace(/\d/g, (d) => digits[+d] ?? d);
  const fill = (tpl: string | undefined, vars: Record<string, string>) => (tpl ?? "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  const rtl = getComputedStyle(stage).direction === "rtl";
  const hint = readout.querySelector<HTMLElement>("[data-sg-hint]")!;
  const detail = readout.querySelector<HTMLElement>("[data-sg-detail]")!;
  const f = (k: string) => detail.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const rows = [...stage.querySelectorAll<HTMLElement>("[data-sg-row]")];
  let mush = false;
  let pos = 0; // the cursor's 1-based column, 0 when there is none

  const cells = () => [...axis.children] as HTMLElement[]; // always in column order
  const show = (col: number) => {
    stage.style.setProperty("--i", String(col));
    stage.classList.toggle("has-cursor", col > 0);
    hint.hidden = col > 0;
    detail.hidden = col === 0;
    if (col === 0) return;
    const c = cells()[col - 1];
    const d = c.dataset;
    const counts = (d.c ?? "").split(",").map(Number);
    const firsts = (d.a ?? "").split(",").map(Number);
    f("name").textContent = `${dig(d.m ?? "")} · ${d.name}`;
    f("place").textContent = d.p === "m" ? (T.tMeccan ?? "") : (T.tMedinan ?? "");
    f("info").textContent = fill(T.tInfo, { rev: dig(d.r ?? ""), mushaf: dig(d.m ?? "") });
    counts.forEach((n, i) => {
      const li = f(`l-${["baath", "yawm", "hisab"][i]}`);
      const [t, cEl, rEl] = [...li.children] as HTMLElement[];
      t.textContent = `${T[`tK${i}`]}:`;
      cEl.textContent = n > 0 ? fill(T.tCount, { n: dig(n) }) : (T.tNone ?? "");
      rEl.replaceChildren();
      if (n > 0) {
        const a = document.createElement("a");
        a.href = `${T.ayah}${d.m}-${firsts[i]}/`;
        const b = document.createElement("bdi");
        b.dir = "ltr";
        b.textContent = `${dig(d.m ?? "")}:${dig(firsts[i])}`;
        a.append(b);
        rEl.append(a);
      }
    });
  };
  const colAt = (clientX: number) => {
    const r = stage.getBoundingClientRect();
    const x = rtl ? r.right - clientX : clientX - r.left;
    return Math.min(114, Math.max(1, Math.floor((x / r.width) * 114) + 1));
  };
  const colOf = (el: HTMLElement) => Number(el.dataset[mush ? "m" : "r"]);

  readout.hidden = false;
  stage.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { pos = colAt(e.clientX); show(pos); } });
  stage.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") show(0); });
  let touch = false;
  let tapped = 0;
  stage.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; });
  stage.addEventListener("click", (e) => {
    // a touch user's first tap on a dot moves the cursor to its surah and shows the readout; a second tap on it opens the ayah
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.sg-qr-dot");
    if (touch && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) {
      const col = a ? colOf(a) : colAt(e.clientX);
      if (a && tapped !== col) e.preventDefault();
      tapped = col;
      pos = col;
      show(col);
    }
    touch = false;
  });
  stage.addEventListener("focusin", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.sg-qr-dot");
    if (a) { pos = colOf(a); show(pos); }
  });
  stage.addEventListener("keydown", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a.sg-qr-dot");
    if (!a || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
    const row = a.parentElement!;
    const list = [...row.querySelectorAll<HTMLAnchorElement>("a.sg-qr-dot")];
    const step = (e.key === "ArrowRight") === !rtl ? 1 : -1; // visually right is the next column in a left-to-right page
    const next = list[list.indexOf(a) + step];
    if (next) { e.preventDefault(); next.focus(); }
  });

  // ---- order of revelation (without the script it stays) or the Mushaf; the DOM is reordered so tabbing follows the picture
  const label = root.querySelector<HTMLElement>("[data-sg-order]");
  const apply = (m: boolean) => {
    mush = m;
    stage.classList.toggle("sg-qr-mush", m);
    const key = m ? "m" : "r";
    for (const row of [...rows, axis]) {
      const kids = [...row.children] as HTMLElement[];
      kids.sort((x, y) => Number(x.dataset[key]) - Number(y.dataset[key]));
      row.append(...kids);
    }
    toggle?.setAttribute("aria-pressed", String(m));
    if (label) label.textContent = m ? (T.tMush ?? "") : (T.tRev ?? "");
    show(0);
  };
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", () => apply(toggle.getAttribute("aria-pressed") !== "true"));
  }
}
