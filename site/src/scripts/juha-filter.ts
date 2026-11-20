// The Juha and Islamic Folklore Browser's filter (docs/plan/72-juha-browser.md): kind chips
// narrow the list to Juha, the wits, anecdotes, jests, laughter or the ethics of the joke,
// and the search box narrows it further by titles, summaries, work names and excerpts in
// all five languages, ignoring Arabic vowel marks. Without JavaScript the whole list is
// on the page.
const input = document.querySelector<HTMLInputElement>("[data-juha-filter]");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-juha-kind]")];
const rows = [...document.querySelectorAll<HTMLElement>("[data-juha-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-juha-section]")];
const none = document.querySelector<HTMLElement>("[data-juha-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

let kind = "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (kind === "" || (row.dataset.kind ?? "") === kind) && (q === "" || norm(row.dataset.search ?? "").includes(q));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-juha-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
};

for (const chip of chips) {
  chip.addEventListener("click", () => {
    kind = chip.dataset.kind ?? "";
    for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
    apply();
  });
}
input?.addEventListener("input", apply);
