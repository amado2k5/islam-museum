// The Munazarat Browser's filter (docs/plan/63-munazarat-browser.md): opponent chips
// narrow the list to the scriptuaries / polytheists / inside-the-ummah / other debates,
// and the search box narrows it further by titles, summaries, work names and excerpts in
// all three languages, ignoring Arabic vowel marks. Without JavaScript the whole list is
// on the page.
const input = document.querySelector<HTMLInputElement>("[data-munazarat-filter]");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-munazarat-opponent]")];
const rows = [...document.querySelectorAll<HTMLElement>("[data-munazarat-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-munazarat-section]")];
const none = document.querySelector<HTMLElement>("[data-munazarat-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

let opponent = "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (opponent === "" || (row.dataset.opponent ?? "") === opponent) && (q === "" || norm(row.dataset.search ?? "").includes(q));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-munazarat-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
};

for (const chip of chips) {
  chip.addEventListener("click", () => {
    opponent = chip.dataset.opponent ?? "";
    for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
    apply();
  });
}
input?.addEventListener("input", apply);
