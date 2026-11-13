// The minbar timeline and the voices (site/src/components/sig/KhutabMinbar.astro): the marks and rings are links in the
// HTML. This script adds the readout line under the timeline (title, type, speaker, Hijri and Gregorian year), arrow-key
// movement between marks, a first-tap-selects, second-tap-opens behaviour on touch screens, and it opens the speaker's
// group in the list below when a ring is followed. Without it everything is still reachable.
const root = document.querySelector<HTMLElement>("[data-sg-kt]");
if (root) {
  const marks = [...root.querySelectorAll<HTMLAnchorElement>(".sg-kt-mark")];
  const line = root.querySelector<HTMLElement>("[data-sg-line]");
  const rtl = getComputedStyle(root).direction === "rtl";
  let current = marks[0];
  let selected: HTMLAnchorElement | null = null;
  let lastType = "mouse";
  const hint = root.dataset.tHint ?? "";
  const rove = (m: HTMLAnchorElement) => { if (current) current.tabIndex = -1; current = m; m.tabIndex = 0; };
  for (const m of marks) m.tabIndex = -1;
  if (current) current.tabIndex = 0;

  const show = (m: HTMLAnchorElement | null) => {
    for (const x of marks) x.classList.toggle("is-on", x === m);
    if (!line) return;
    if (!m) { line.textContent = hint; return; }
    const open = document.createElement("a");
    open.href = m.href;
    open.textContent = root.dataset.tOpen ?? "";
    line.replaceChildren(document.createTextNode(m.dataset.read ?? ""), open);
  };
  const rest = () => { const f = document.activeElement as HTMLElement | null; show(selected ?? (f && f.classList.contains("sg-kt-mark") ? (f as HTMLAnchorElement) : null)); };

  for (const m of marks) {
    m.addEventListener("pointerdown", (e) => { lastType = e.pointerType; });
    m.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") show(m); });
    m.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") rest(); });
    m.addEventListener("focus", () => { rove(m); show(m); });
    m.addEventListener("blur", () => setTimeout(rest, 0));
    m.addEventListener("click", (e) => {
      if (lastType === "mouse" || lastType === "pen" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (selected === m) return; // the second tap opens the sermon
      e.preventDefault();
      selected = m;
      rove(m);
      show(m);
    });
    m.addEventListener("keydown", (e) => {
      const i = marks.indexOf(m);
      const next = rtl ? "ArrowLeft" : "ArrowRight";
      const prev = rtl ? "ArrowRight" : "ArrowLeft";
      let to: HTMLAnchorElement | undefined;
      if (e.key === next) to = marks[i + 1];
      else if (e.key === prev) to = marks[i - 1];
      else if (e.key === "Home") to = marks[0];
      else if (e.key === "End") to = marks[marks.length - 1];
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const row = Number(m.dataset.row) + (e.key === "ArrowUp" ? 1 : -1);
        const at = Number(m.dataset.at);
        const pool = marks.filter((x) => Number(x.dataset.row) === row);
        if (pool.length) to = pool.reduce((b, c) => (Math.abs(Number(c.dataset.at) - at) < Math.abs(Number(b.dataset.at) - at) ? c : b));
      } else if (e.key === "Escape" && selected) { selected = null; show(null); return; }
      else return;
      e.preventDefault();
      to?.focus();
    });
  }
  show(null);

  // a ring points at a speaker's group, which is a closed <details> when it is long
  const openGroup = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const d = id ? document.getElementById(id) : null;
    if (d instanceof HTMLDetailsElement) { d.open = true; d.scrollIntoView(); }
  };
  addEventListener("hashchange", openGroup);
  openGroup();
}
