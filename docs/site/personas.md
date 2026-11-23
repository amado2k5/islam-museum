# Persona views (the five doors on the landing page)

Founder request, 23 November 2026. Under the Grand Tour button the landing page offers five doors; each opens a view of the same museum with its own colour, questions and reading order.

| Key | Button (en) | Who it is for | Accent |
|---|---|---|---|
| `convert` | Just converted | someone new to Islam: first days, family, food, people, doubt | green `#1f7a52` |
| `doubter` | Still deciding | someone who has not decided | amber `#a8631a` |
| `researcher` | Researcher | Muslim or not, wants sources, data, method | blue `#1f5f99` |
| `learner` | Learning my deen | a Muslim who wants to deepen and does not know where to start | violet `#6b3f95` |
| `critic` | Critic | someone who thinks Islam is wrong or wants to argue against it | brick `#9c3a32` |

## How it is built

- Route: `/{lang}/for/{persona}/` (`site/src/pages/[lang]/for/[persona].astro`), in all seven languages. No script is needed to read it.
- Language-neutral parts (keys, colours, which hall each section links to) are in `site/src/lib/personas.ts`. Text is in `i18n/<lang>.yaml` under `personas:`. The section count in the YAML must equal the link lists in `personas.ts`; the page throws at build time if it does not.
- Landing buttons: `site/src/components/PersonaButtons.astro`, rendered in `Landing.astro` before the "today" cards. Its styles are scoped to the component, so no file under `site/src/styles/` changes (no whole-site rewrite).
- A view is a navigation layer over existing halls. It adds no entity, no edge and no dataset, so there is nothing new for the API or the graph; the page text is indexed by search through `data-pagefind-body`.

## Truth notes (AGENTS.md, "Truth in every public claim")

- The museum has **no verified directories** of halal shops, bookshops, modest-wear shops, support groups, Discord servers or forums yet. The convert view says so and tells the visitor to ask at a local mosque. Add a directory only after each address is checked, as records with sources (a new class would need its own proposal).
- The views describe; they do not rule. Questions about what to do with alcohol, family and so on point to the halal and ahkam halls and to a trusted local scholar.
- The `personas` block in Spanish, Turkish and Indonesian is Microsoft Word document-translation output (Spanish from English; Turkish and Indonesian from Arabic), imported on 23 November 2026, machine translation not read by a human. Urdu (from English) is Google Translate output, uploaded by the founder. French is still the earlier language-model translation of 23 November 2026; none of it is read by a human.

## Ideas not built yet

- A persona carried across pages (a coloured ribbon on every hall) would touch `BaseLayout.astro` and rewrite every page; it needs the founder's weekly batch.
- A "find near me" list of halal food, bookshops and groups, built from the local-harvest lane (`docs/plan/15-local-harvest`).
- A convert story shelf (accounts of conversion with sources) and a printable first-week checklist.
