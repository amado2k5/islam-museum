// The Nuzul Browser's filter (docs/plan/75-asbab-nuzul-browser.md): narrator chips
// narrow the list to prophetic / companion / tabi'i / later reports, and the search
// box narrows it further by titles, summaries, work names and excerpts in all the
// site languages, ignoring Arabic vowel marks. Without JavaScript the whole list is
// on the page.
const input = document.querySelector<HTMLInputElement>("[data-nuzul-filter]");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-nuzul-narrator]")];
const rows = [...document.querySelectorAll<HTMLElement>("[data-nuzul-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-nuzul-section]")];
const none = document.querySelector<HTMLElement>("[data-nuzul-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

let narrator = "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (narrator === "" || (row.dataset.narrator ?? "") === narrator) && (q === "" || norm(row.dataset.search ?? "").includes(q));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-nuzul-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
};

for (const chip of chips) {
  chip.addEventListener("click", () => {
    narrator = chip.dataset.narrator ?? "";
    for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
    apply();
  });
}
input?.addEventListener("input", apply);
