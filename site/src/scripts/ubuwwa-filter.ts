// The Ubuwwa Browser's filter (docs/plan/63-ubuwwa-browser.md): narrows the fatherhood list
// as the visitor types, matching titles, summaries, work names, topic chips and text
// excerpts in all three languages, ignoring Arabic vowel marks. Without JavaScript the
// whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-ubuwwa-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-ubuwwa-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-ubuwwa-section]")];
const none = document.querySelector<HTMLElement>("[data-ubuwwa-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-ubuwwa-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
