// The Magic Browser's filter (docs/plan/37-magic-browser.md): narrows the magic list as the
// visitor types, matching titles, summaries, work names, topic names and text excerpts in all
// three languages, ignoring Arabic vowel marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-magic-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-magic-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-magic-section]")];
const none = document.querySelector<HTMLElement>("[data-magic-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-magic-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
