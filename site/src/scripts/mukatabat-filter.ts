// The Mukatabat Browser's filter (docs/plan/46-mukatabat-browser.md): sender chips
// narrow the list to prophetic / caliphal / royal / other correspondence, and the
// search box narrows it further by titles, summaries, work names and excerpts in all
// three languages, ignoring Arabic vowel marks. Without JavaScript the whole list is
// on the page.
const input = document.querySelector<HTMLInputElement>("[data-mukatabat-filter]");
const chips = [...document.querySelectorAll<HTMLButtonElement>("[data-mukatabat-sender]")];
const rows = [...document.querySelectorAll<HTMLElement>("[data-mukatabat-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-mukatabat-section]")];
const none = document.querySelector<HTMLElement>("[data-mukatabat-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

let sender = "";
const apply = () => {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (sender === "" || (row.dataset.sender ?? "") === sender) && (q === "" || norm(row.dataset.search ?? "").includes(q));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-mukatabat-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
};

for (const chip of chips) {
  chip.addEventListener("click", () => {
    sender = chip.dataset.sender ?? "";
    for (const c of chips) c.setAttribute("aria-pressed", String(c === chip));
    apply();
  });
}
input?.addEventListener("input", apply);
