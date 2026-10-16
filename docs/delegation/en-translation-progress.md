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
- person d–h batch 2 (Claude Haiku 5.5): 25 pages, dirar-ibn-damra → fakhr-al-razi… farqad-al-sanji (commit 8b8a1d07)
- work batch 2 (25 files, al-ansab-samani … al-kamil-fi-al-tarikh): done by Claude Haiku 5.5, draft
- concept batch 1 (Claude Haiku 5.5): 25 pages, abjad-kings-etymology → al-ilm-fi-l-andalus (commit 9c937da4)
- concept batch 2 (Claude Haiku 5.5): 25 pages, amir-al-umara → bayyina
- work batch 3 (25 files, al-kashshaf … alam-al-tubwa): done by Claude Haiku 5.5, draft
- person d–h batch 3 (Claude Haiku 5.5): 25 pages, farrukhbandadh → ghaylan-al-dimashqi (commit ac283e50)
- work batch 4 (25 files, alf-layla-wa-layla … azhar-al-rawdatayn): done by Claude Haiku 5.5, draft
- person d–h batch 4 (Claude Haiku 5.5): 25 pages, ghaylan-ibn-kharasha → hajib-ibn-zurara (commit 3e1b7dee)
- person i–m batch 1 (25 files, ibn-aaisha-al-qurashi … ibn-al-abrash-khalaf) pushed to main — Claude Haiku 5.5, draft
- event a–m batch 1 (2026-10-16, claude-haiku-5-5): 25 pages, abbad-qandahar → abu-muslim-enters-marw (EN drafts).
- person d–h batch 5 (Claude Haiku 5.5): 25 pages, hakim-ibn-jabala → hanzala-ibn-zayd (commit e0890fee)
- person s–z batch 1 (Claude Code, claude-haiku-5-5): saad-al-aasir … sahib-ibn-abbad, 25 files, commit b4c0bec7.
- place m–z batch 2: 25 files (majtama-al-anhar.md … manh.md), draft
- place m–z batch 3: 25 files (manjabari.md … masfahan-island.md), draft
- place m–z batch 4: 25 files (masharif.md … mihrajanqadhaf.md), draft
- place m–z batch 5: 25 files (mihran.md … mussisa.md), draft
- concept batch 3 (Claude Haiku 5.5): 25 pages, bida → fath-sulh (commit 71f085dc)
- group batch 1 (25 files, abbasid-dawa … banu-al-muttalib): done by Claude Haiku 5.5, draft
- work batch 5 (25 files, azhar-al-riyad … hazar-afsan): done by Claude Haiku 5.5, draft
- place m–z batch 6: 25 files (mustaghanim.md … nahr-al-ubulla.md), draft
- person d–h batch 6 (Claude Haiku 5.5): 25 pages, harb-ibn-salm → hasan-ibn-qatada (commit 371935a9)
- correction to the lines above: batch 2 covers dirar-ibn-damra → farqad-al-sanji; batch 5 covers hakim-ibn-jabala → harb-ibn-abdallah-al-balkhi (commit e0890fee)
- person i–m batch 2 (25 files, ibn-al-aftas … ibn-al-faras-qahtani) pushed to main — Claude Haiku 5.5, draft
- person i–m batch 3 (25 files, ibn-al-habbar … ibn-al-nahhas-al-dimashqi) pushed to main — Claude Haiku 5.5, draft
- place m–z batch 7: 25 files (nahr-barada.md … narand.md), draft
- person s–z batch 2 (Claude Code, claude-haiku-5-5): sahl-al-tustari … said-ibn-uthman, 25 files, commit 4cebb75c.
- event a–m batch 2 (2026-10-16, claude-haiku-5-5): 25 pages, abu-said-qarmati-bahrayn-286 → al-awzai-letter-to-salih (EN drafts).
- concept batch 4 (Claude Haiku 5.5): 25 pages, fay → husn-al-islam
- person d–h batch 7 (Claude Haiku 5.5): 25 pages, hasan-ibn-umran-al-batih → hisham-i-andalusi (commit f0e275d7)
- place m–z batch 8: 25 files (naroa.md … nuba.md), draft
- work batch 6 (25 files, ihya-ulum-al-din … kitab-al-ayn): done by Claude Haiku 5.5, draft
- person i–m batch 5 (25 files, ibn-barrajan-abd-al-salam … ibn-hayy-al-tujibi-al-hasan-ibn-muhammad) — Claude Haiku 5.5, draft
- place m–z batch 9: 25 files (nughayra.md … qalari.md), draft
- concept batch 5 (Claude Haiku 5.5): 25 pages, ibadat-al-asnam-jahiliyya → jihad-call-of-1914
- person d–h batch 8 (Claude Haiku 5.5): 25 pages, hisham-ibn-abd-al-malik → hurayth-ibn-jabir-al-jufi (commit ea10e080)
- group batch 2 (25 files, banu-al-najjar … banu-murra): done by Claude Haiku 5.5, draft
- work batch 7 (25 files, kitab-al-ibana … masail-tabiiyya-hunayn): done by Claude Haiku 5.5, draft
- place m–z batch 10: 25 files (qalat-al-balut.md … qantarat-al-sayf.md), draft
- person i–m batch 6 (25 files, ibn-hayyan-abu-marwan … ibn-khaldun) — Claude Haiku 5.5, draft
- person s–z batch 3 (Claude Code, claude-haiku-5-5): salih-ibn-al-mansur … sajjada, 25 files, 25 files (said-ibn-yahya … salih-ibn-musarrih).
- event a–m batch 3 (2026-10-16, claude-haiku-5-5): 25 pages, al-falalij-and-tustar-jaban → ansar-scribes-kamil (EN drafts).
- place m–z batch 11: 25 files (qantarat-qurra.md … qasr-al-nawashiq.md), draft
- person i–m batch 7 (25 files, ibn-khalil-al-dimashqi-abu-al-hajjaj-yusuf … ibn-qayyim-al-jawziyya) — Claude Haiku 5.5, draft
- work batch 8 (25 files, masalik-al-absar … sharh-aqida-tahawiyya): done by Claude Haiku 5.5, draft
- group batch 3 (25 files, banu-musa … christians-of-najran): done by Claude Haiku 5.5, draft
- place m–z batch 12: 25 files (qasr-al-numan.md … qift.md), draft
- concept batch 6 (Claude Haiku 5.5): 25 pages, jizya → madhahib-al-tibb
- person s–z batch 4 (Claude Code, claude-haiku-5-5): salih-ibn-muslim … salman-ibn-rabi-a, 25 files, 25 files.
- person i–m batch 8 (25 files, ibn-qudama-al-maqdisi … ibn-zaydun) — Claude Haiku 5.5, draft
- person d–h batch 9 (Claude Haiku 5.5): 15 pages, hurayth-ibn-qutba → husayn-ibn-yahya-al-ansari (commit 3a4e31e5). Person d–h slice complete.
- place m–z batch 13: 25 files (qina.md … ramadin.md), draft
- work batch 9 (25 files, sifat-jazirat-al-arab … wafayat-al-ayan): done by Claude Haiku 5.5, draft
- person i–m batch 9 (25 files, ibn-zuhr-al-hafid … ibrahim-ibn-yahya-al-ansari-al-mursi) — Claude Haiku 5.5, draft
- person s–z batch 5 (Claude Code, claude-haiku-5-5): salmawayh-ibn-bunan … sayf-al-din-ghazi-i, 25 files, 25 files.
- place m–z batch 14: 25 files (ramhurmuz.md … rudhistu.md), draft
- concept batch 7 (Claude Haiku 5.5): 25 pages, madrasat-al-nahw-al-basriyya-kufiyya → nasab-al-nabi
- work batch 10 (25 files, zibriqan-boast-poem … zibriqan-second-boast): done by Claude Haiku 5.5, draft
- group batch 4 (25 files, dajaima … jarudiyya): done by Claude Haiku 5.5, draft
