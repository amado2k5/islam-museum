// The Islamic Economy Browser's filter (docs/plan/47-islamic-economy-browser.md): narrows
// the money/sukuk/waqf list as the visitor types or picks a topic chip, matching titles,
// summaries, work names and text excerpts in all three languages, ignoring Arabic vowel
// marks. Without JavaScript the whole list is on the page.
const input = document.querySelector<HTMLInputElement>("[data-ie-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-ie-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-ie-section]")];
const none = document.querySelector<HTMLElement>("[data-ie-none]");
const topicBtns = [...document.querySelectorAll<HTMLButtonElement>("[data-ie-topic]")];
let topic = "";
const norm = (s: string) => s.normalize("NFKC").replace(/[ً-ٰٟ]/g, "").replace(/[أإآ]/g, "ا").toLowerCase().replace(/\s+/g, " ").trim();

function apply() {
  const q = norm(input?.value ?? "");
  let shown = 0;
  for (const row of rows) {
    const hit = (q === "" || norm(row.dataset.search ?? "").includes(q))
      && (topic === "" || (row.dataset.topics ?? "").split(" ").includes(topic));
    row.hidden = !hit;
    if (hit) shown++;
  }
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-ie-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
}

input?.addEventListener("input", apply);
for (const b of topicBtns) {
  b.addEventListener("click", () => {
    topic = topic === b.dataset.ieTopic ? "" : (b.dataset.ieTopic ?? "");
    for (const x of topicBtns) x.setAttribute("aria-pressed", String(x === b && topic !== ""));
    apply();
  });
}
