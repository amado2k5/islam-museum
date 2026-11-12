// The Sacred Places Browser's filter (docs/plan/49-places-browser.md): narrows the place list as
// the visitor types, matching titles and summaries in all three languages, ignoring Arabic vowel
// marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-places-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-places-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-places-section]")];
const none = document.querySelector<HTMLElement>("[data-places-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-places-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
