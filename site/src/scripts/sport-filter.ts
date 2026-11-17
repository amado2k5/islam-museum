// The Sport Browser's client-side filter (docs/plan/66): progressive enhancement only — every
// row ships its searchable text in data-search and the page is fully readable without JS.
const q = document.querySelector<HTMLInputElement>("[data-sport-filter]");
if (q) {
  const rows = [...document.querySelectorAll<HTMLElement>("[data-sport-row]")];
  const sections = [...document.querySelectorAll<HTMLElement>("[data-sport-section]")];
  const none = document.querySelector<HTMLElement>("[data-sport-none]");
  const norm = (s: string) => s.toLowerCase().replace(/[\u064B-\u0652\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
  const apply = () => {
    const needle = norm(q.value.trim());
    let shown = 0;
    for (const r of rows) {
      const ok = !needle || norm(r.dataset.search ?? "").includes(needle);
      r.hidden = !ok;
      if (ok) shown++;
    }
    for (const s of sections) s.hidden = !needle ? false : ![...s.querySelectorAll<HTMLElement>("[data-sport-row]")].some((r) => !r.hidden);
    if (none) none.hidden = shown !== 0;
  };
  q.addEventListener("input", apply);
  apply();
}
export {};
