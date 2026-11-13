// Shared interaction of the ledger signature views (hisab, hasanat, sayyiat): hover and focus select a mark; on a touch
// screen the first tap selects it and shows the readout, the second follows its link. `onChange` receives the
// selected mark (hover wins over focus) or null.
export function bindMarks(links: HTMLAnchorElement[], onChange: (a: HTMLAnchorElement | null) => void): { refresh: () => void; select: (a: HTMLAnchorElement | null) => void } {
  let selected: HTMLAnchorElement | null = null;
  let hovered: HTMLAnchorElement | null = null;
  let touch = false;
  let wasSelected = false;
  const refresh = () => onChange(hovered ?? selected);
  for (const a of links) {
    a.addEventListener("pointerdown", (e) => { touch = e.pointerType !== "mouse"; wasSelected = selected === a; });
    a.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = a; refresh(); } });
    a.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = null; refresh(); } });
    a.addEventListener("focus", () => { selected = a; refresh(); });
    a.addEventListener("click", (e) => {
      if (touch && !wasSelected && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) { e.preventDefault(); selected = a; refresh(); }
      touch = false;
    });
  }
  const select = (a: HTMLAnchorElement | null) => { selected = a; refresh(); };
  return { refresh, select };
}
