// The Khulafa Browser's name filter (docs/plan/30): narrows the caliph cards as the visitor
// types, matching the name in any of the three languages and ignoring Arabic vowel marks.
// Without JavaScript every card is on the page.
const input = document.querySelector<HTMLInputElement>("[data-khulafa-filter]");
const items = [...document.querySelectorAll<HTMLElement>("[data-khulafa-item]")];
const none = document.querySelector<HTMLElement>("[data-khulafa-empty]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const it of items) {
    const hit = q === "" || norm(it.dataset.search ?? "").includes(q);
    it.hidden = !hit;
    if (hit) shown++;
  }
  if (none) none.hidden = shown > 0;
});
