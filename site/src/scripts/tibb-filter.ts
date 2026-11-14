// The Medicine Browser's filter (docs/plan/57-tibb-browser.md): narrows the medicine list as the
// visitor types, matching titles, summaries, work names, topic chips and text excerpts in all
// three languages, ignoring Arabic vowel marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-tibb-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-tibb-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-tibb-section]")];
const none = document.querySelector<HTMLElement>("[data-tibb-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-tibb-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
