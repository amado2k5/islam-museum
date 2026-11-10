// The Asma ul Husna Browser's name filter (docs/plan/29): narrows the 99-name grid as the visitor
// types, matching the name in any of the three languages or its transliteration, and ignoring
// Arabic vowel marks. Without JavaScript the whole grid is on the page.
(() => {
const input = document.querySelector<HTMLInputElement>("[data-asma-filter]");
const items = [...document.querySelectorAll<HTMLElement>("[data-asma-item]")];
const none = document.querySelector<HTMLElement>("[data-asma-empty]");
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

})();
