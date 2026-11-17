// The Trade Browser's filter (docs/plan/63-trade-browser.md): narrows the
// caravans/silk-road/trade list as the visitor types or picks a topic chip,
// matching titles, summaries, work names and text excerpts in all three
// languages, ignoring Arabic vowel marks. Without JavaScript the whole list is
// on the page.
const input = document.querySelector<HTMLInputElement>("[data-trade-filter]");
const rows = [...document.querySelectorAll<HTMLElement>("[data-trade-row]")];
const sections = [...document.querySelectorAll<HTMLElement>("[data-trade-section]")];
const none = document.querySelector<HTMLElement>("[data-trade-none]");
const topicBtns = [...document.querySelectorAll<HTMLButtonElement>("[data-trade-topic]")];
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
  for (const s of sections) s.hidden = ![...s.querySelectorAll<HTMLElement>("[data-trade-row]")].some((r) => !r.hidden);
  if (none) none.hidden = shown > 0;
}

input?.addEventListener("input", apply);
for (const b of topicBtns) {
  b.addEventListener("click", () => {
    topic = topic === b.dataset.tradeTopic ? "" : (b.dataset.tradeTopic ?? "");
    for (const x of topicBtns) x.setAttribute("aria-pressed", String(x === b && topic !== ""));
    apply();
  });
}
