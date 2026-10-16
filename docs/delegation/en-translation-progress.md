# English translation lane — progress

**Lane:** `en-translation` (doc: `docs/agents/lanes/en-translation.md`)
**Sessions:** Devin (SWE-2), 2026-10-12, clone `islam-museum-english`

## Done

- Phase A (publication plumbing): `en` added to `LANGS`, `PUBLISHED_LANGS`, Astro locales + sitemap; 21 missing `i18n/en.yaml` keys translated; per-language search synonyms + Pagefind indexes (`pagefind-ar`, `pagefind-en`); bilingual `llms.txt`; i18n key-parity test. `validate` 0 errors, `test` 44/44, `build` 15,962 pages, `check:site` clean.
- Phase B (rendered metadata): `label.en` + `summary.en` filled for all entities that lacked them (139 labels, 328 summaries: people 124, events 52, places 50, groups 30, polities 25, buildings 17, works 9, concepts 7, datasets 5, exhibits 5, journeys 2, object 1, source 1); 59 exhibit room titles+bodies; 13 `perspectives[].summary`; 21 stub `label.en`; `map.note` already bilingual.
- Phase C prose, in progress. `content/en/` written so far:
  - exhibit/ ×5 (all five trails)
  - event/ ×201 (ALL events done)
  - person/ ×472 of 472 — complete (alphabetical by slug, `abaha` through `zuhayr-ibn-sard`)
  - group/ ×60 of 60 — complete (`adnan` through `thaqif`)
  - concept/ ×45 of 45, place/ ×27 of 27, source/ ×9 of 9, object/ ×9 of 9, polity/ ×8 of 8, work/ ×11 of 11, building/ ×5 of 5, practice/ ×4 of 4, journey/ ×3 of 3 — ALL prose classes complete; `content/en/` mirrors `content/ar/` exactly (per-class file lists identical)

## Phase D (verification) — done

- `validate` 0 errors / 326 warnings (pre-existing stubs/quality notes), `test` 45/45.
- `build` 16,018 pages; Pagefind `pagefind-ar` + `pagefind-en` (7,865 pages each); `check:site` 0 errors/0 warnings; `check:static` 0 problems.
- Fixed: English footnotes showed Arabic bibliographic citations — non-`ar` pages now cite `label.<lang>` (commit `4ac3c1e`).
- Browser pass on local `dist/`: `/en/` landing, `/en/event/battle-of-badr/`, `/en/person/khadija/`, `/en/concept/tawhid/`, `/en/search/` (289 "Badr" results, `/en/` links) all English; language switcher round-trips `/en/` ↔ `/ar/` on the same entity; `/ar/` unaffected (rtl, full Arabic citations). Remaining Arabic on `en` pages is intentional: `العربية` switcher, bilingual name display, `Alt:` search meta.
- Pagefind "no `<html>`" notes on `/ar/work/amr-ibn-salim-istighatha/` and `/ar/event/hatib-letter-to-quraysh/` are intentional Astro redirect stubs — not indexed, no action needed.

## Next step

Lane complete. English is published end-to-end; all prose is draft and awaits human review (`status.review` unchanged).

## Conventions

`translators: ["Devin (SWE-2), draft translation"]`; keep `[[id|label]]` ids, `{cite:id loc}` ids (localise `ص` → `p.`), `:::perspectives` order (Sunni first); standard headers used in this lane: `## Summary` (موجز), `## The account` (الرواية/خبر الوقعة), `## Markers of weakness and doubt` (علامات التمريض والشك), `## For young visitors` (للزوار الصغار).
- person d–h batch 1 (Claude Haiku 5.5): 25 pages, daghful-ibn-al-muqarrij → dirar-ibn-amr (commit b8124662)
- work batch 1 (25 files, aban-ibn-said-verses-to-khalid-and-amr … al-amthal-al-saira): done by Claude Haiku 5.5, draft
