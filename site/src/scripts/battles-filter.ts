// The Battles, Wars and Conquests Browser's record filter (docs/plan/31): narrows the card lists
// as the visitor types, matching the name in any language, ignoring Arabic vowel marks.
// Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-battles-filter]");
const items = [...document.querySelectorAll<HTMLElement>("[data-battles-item]")];
const none = document.querySelector<HTMLElement>("[data-battles-empty]");
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
