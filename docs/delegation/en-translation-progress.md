# English translation lane — progress

**Lane:** `en-translation` (doc: `docs/agents/lanes/en-translation.md`)
**Sessions:** Devin (SWE-2), 2026-10-12, clone `islam-museum-english`

## Done

- Phase A (publication plumbing): `en` added to `LANGS`, `PUBLISHED_LANGS`, Astro locales + sitemap; 21 missing `i18n/en.yaml` keys translated; per-language search synonyms + Pagefind indexes (`pagefind-ar`, `pagefind-en`); bilingual `llms.txt`; i18n key-parity test. `validate` 0 errors, `test` 44/44, `build` 15,962 pages, `check:site` clean.
- Phase B (rendered metadata): `label.en` + `summary.en` filled for all entities that lacked them (139 labels, 328 summaries: people 124, events 52, places 50, groups 30, polities 25, buildings 17, works 9, concepts 7, datasets 5, exhibits 5, journeys 2, object 1, source 1); 59 exhibit room titles+bodies; 13 `perspectives[].summary`; 21 stub `label.en`; `map.note` already bilingual.
- Phase C prose, in progress. `content/en/` written so far:
  - exhibit/ ×5 (all five trails)
  - event/ ×127 (through `khirash-incident`, alphabetical)

## Next step

Continue `content/en/event/` — alphabetical by slug; done so far: `abu-bakr-leads-the-prayers` … `khirash-incident` (127 files). Next file: `content/ar/event/khuzaa-appeal-to-medina.md` (next event slug alphabetically; 74 events remain). 201 event files total; then person ×408, group ×59, concept ×43, place ×27, source ×9, object ×9, polity ×8, work ×8, building ×5, practice ×4, journey ×3.

## Conventions

`translators: ["Devin (SWE-2), draft translation"]`; keep `[[id|label]]` ids, `{cite:id loc}` ids (localise `ص` → `p.`), `:::perspectives` order (Sunni first); standard headers used in this lane: `## Summary` (موجز), `## The account` (الرواية/خبر الوقعة), `## Markers of weakness and doubt` (علامات التمريض والشك), `## For young visitors` (للزوار الصغار).
