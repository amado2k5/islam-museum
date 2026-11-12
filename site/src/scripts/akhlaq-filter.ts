// The Akhlaq and Mu'amalat Browser's filter (docs/plan/54-akhlaq-browser.md): narrows the list
// as the visitor types, matching titles, summaries, work names, text excerpts and the
// track/kind/topic names in all three languages, ignoring Arabic vowel marks. Without JavaScript
// the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-akhlaq-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-akhlaq-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-akhlaq-section]")];
const none = document.querySelector<HTMLElement>("[data-akhlaq-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-akhlaq-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
