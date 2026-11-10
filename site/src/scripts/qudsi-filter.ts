// The Hadith Qudsi Browser's filter (docs/plan/31-hadith-qudsi-browser.md): narrows the hadith list as the visitor types,
// matching the title in any of the three languages and the collection names, ignoring Arabic vowel marks.
// Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-qudsi-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-qudsi-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-qudsi-section]")];
const none = document.querySelector<HTMLElement>("[data-qudsi-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-qudsi-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
});
