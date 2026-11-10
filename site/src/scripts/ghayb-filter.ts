// The Ghayb Browser's filter (docs/plan/33-ghayb-browser.md): narrows the topic list as the visitor
// types, matching titles and summaries in all three languages, ignoring Arabic vowel marks.
// Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-ghayb-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-ghayb-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-ghayb-section]")];
const none = document.querySelector<HTMLElement>("[data-ghayb-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-ghayb-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
