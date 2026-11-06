// The Modern Islam Browser's name filter: narrows a list as the visitor types, matching the name in any of the three
// languages and ignoring Arabic vowel marks. Several lists may share a page (each has its own id). Without JavaScript
// the whole list is on the page.
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
for (const input of document.querySelectorAll<HTMLInputElement>("[data-modern-filter]")) {
  const id = input.dataset.modernFilter;
  const rows = [...document.querySelectorAll<HTMLElement>(`[data-modern-row="${id}"]`)];
  const none = document.querySelector<HTMLElement>(`[data-modern-none="${id}"]`);
  input.addEventListener("input", () => {
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
