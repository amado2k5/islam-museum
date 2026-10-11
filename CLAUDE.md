# islam.museum — project context

You are working on islam.museum, an open, free, all-digital museum of Islam: the faith, civilization, peoples, places, ideas, objects, texts and living culture, from the world Islam was born into until today. Read docs/plan/ before architectural changes. Key documents: 01-vision (principles), 02-content-model (classes, predicates, dates), 03-architecture (stack, layout, pipeline), 04-experience (halls and pages), 05-editorial (voice, perspectives, licensing), 06-roadmap, 09-ai-content-pipeline, 12-screen-index, 13-figures, 14-themes-atlas, 15-local-harvest.

Non-negotiables
- Static site on GitHub Pages behind Cloudflare; no servers, no databases, no paid services. Astro + Svelte islands + Tailwind; TypeScript scripts; Pagefind search; MapLibre + PMTiles; Sigma.js graphs.
- Content is a knowledge graph in git: data/<class>/<slug>.yaml (language-neutral facts) + content/<lang>/<class>/<slug>.md (prose). IDs are "class/slug", immutable; renames via aliases.
- Dates: EDTF + Hijri string + calendar flag + precision; never invent a date; conversions marked derived.
- Relations use schema/predicates.yaml only; write the edge once; inverses are computed.
- Every entity cites sources; every dated fact needs two sources or a flag. Wikipedia is a pointer, not a source.
- Voice: a warm, precise, neutral docent. Describe, never prescribe. No honorifics typed into prose (the UI renders them). Scope: the museum speaks from Sunni Islam (docs/scope.md); other communities are covered as history and fact, respectfully, never as parallel framings. Contested topics use the perspectives block with the Sunni position(s) and the academic view, each cited, plus an other_views note where another community's position is needed.
- Licenses: prose CC BY-SA 4.0, data CC0, code MIT; third-party content keeps its own license, recorded per version; media only from the whitelist in schema/enums/licenses.yaml; no figurative depictions of prophets; no AI-generated portraits.
- Arabic and RTL are first-class: test every UI change in /ar/.
- Accessibility: WCAG 2.2 AA; alt text required; no JS needed to read a page; islands lazy-load.
- Run `npm run validate` before proposing any content change and `npm run build` before any site change. Fix what fails.
- AI-generated content enters as status.review: draft with a provenance block; never mark reviewed/verified yourself.
- Significance, not sympathy: opponents, critics and allies are included with time-scoped story_roles; describe the act, attribute the judgement; never write "enemy of Islam" or an equivalent in the museum's voice; a person's faith is recorded only with its basis and never inferred.
- Hard questions are written as tension cards with at least two cited voices and no verdict.
- Never write, complete or correct Qur'an text: it comes only from the frozen Tanzil files and is referenced by sura:ayah.
- Harvesting runs on the founder's Mac with local models (docs/plan/15); respect the licence layers: only cc0/by facts or our own cited research enter data/.
- Commit only when asked; conventional commit messages; small PRs per cell batch (≤ 25 entities).
