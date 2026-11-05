// The Inventions Browser's name filter: narrows the A-to-Z list as the visitor types, matching the name in any of the
// three languages and ignoring Arabic vowel marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-invention-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-invention-row]")];
const none = document.querySelector<HTMLElement>("[data-invention-none]");
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

input?.addEventListener("input", () => {
  const q = norm(input.value);
  let shown = 0;
  for (const row of rows) {
    const hit = q === "" || norm(row.dataset.search ?? "").includes(q);
    row.hidden = !hit;
    if (hit) shown++;
  }
  if (none) none.hidden = shown > 0;
});
