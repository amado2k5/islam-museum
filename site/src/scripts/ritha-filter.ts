// The Elegy and Death-Announcement Browser's filter (docs/plan/72-ritha-browser.md): the four kind
// chips (elegy, death announcement, condolence, weeping and wailing) narrow the list, and the
// search box narrows it further by titles, summaries, work names and excerpts in all five
// languages, ignoring Arabic vowel marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-ritha-filter]");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-ritha-kind]")];
const rows = [...document.querySelectorAll<HTMLElement>("[data-ritha-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-ritha-section]")];
const none = document.querySelector<HTMLElement>("[data-ritha-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

let kind = new URLSearchParams(location.search).get("kind") ?? "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (kind === "" || (row.dataset.kind ?? "") === kind) && (q === "" || norm(row.dataset.search ?? "").includes(q));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-ritha-row]")].some((r) => !r.hidden);
  for (const c of chips) c.setAttribute("aria-pressed", String((c.dataset.kind ?? "") === kind));
  if (none) none.hidden = shown > 0;
};

for (const chip of chips) {
  chip.addEventListener("click", () => {
    kind = chip.dataset.kind ?? "";
    apply();
  });
}
input?.addEventListener("input", apply);
apply();
