// The Companions Browser's name filter: narrows a list as the visitor types, matching the name in any of the three
// languages and ignoring Arabic vowel marks. Without JavaScript the whole list is on the page.
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

for (const box of document.querySelectorAll<HTMLElement>("[data-companion-list]")) {
  const input = box.querySelector<HTMLInputElement>("[data-companion-filter]");
  const rows = [...box.querySelectorAll<HTMLElement>("[data-companion-row]")];
  const none = box.querySelector<HTMLElement>("[data-companion-none]");
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
}
