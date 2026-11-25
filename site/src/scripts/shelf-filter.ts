// The shelves browsers' client-side filter: progressive enhancement only — every row ships its
// searchable text in data-search and the page is fully readable without JS.
const q = document.querySelector<HTMLInputElement>("[data-shelf-filter]");
if (q) {
  const rows = [...document.querySelectorAll<HTMLElement>("[data-shelf-row]")];
  const sections = [...document.querySelectorAll<HTMLElement>("[data-shelf-section]")];
  const none = document.querySelector<HTMLElement>("[data-shelf-none]");
  const norm = (s: string) => s.toLowerCase().replace(/[ً-ٰٟۡ-ۭۨـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  const apply = () => {
    const needle = norm(q.value.trim());
    let shown = 0;
    for (const r of rows) {
      const ok = !needle || norm(r.dataset.search ?? "").includes(needle);
      r.hidden = !ok;
      if (ok) shown++;
    }
    for (const s of sections) s.hidden = !needle ? false : ![...s.querySelectorAll<HTMLElement>("[data-shelf-row]")].some((r) => !r.hidden);
    if (none) none.hidden = shown !== 0;
  };
  q.addEventListener("input", apply);
  apply();
}
export {};
