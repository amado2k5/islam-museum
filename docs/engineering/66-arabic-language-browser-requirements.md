# 66. Arabic Language Browser («متصفح اللغة العربية لغة القرآن») — original requirements and acceptance spec

**Status:** built 21 November 2026, awaiting the founder's deploy and production validation · **Lane:** `arabiyya` · **Plan:** `docs/plan/74-arabic-language-browser.md` · **Shipped:** `/[lang]/arabiyya/`, `/api/v1/arabiyya.json`, `sig/ArabiyyaRing.astro`

This page keeps the founder's request as he gave it, the requirements read out of it, and tests an agent can run against production. It is the reference for any later check of the feature.

## The founder's original brief (21 November 2026, in chat; mixed Arabic and English, kept in his words, shortened only where he repeated a phrase)

> Use microsd instead of Mac main drive. Get latest from main, clone the repo to a separate folder then start working on **«متصفح اللغة العربية لغة القران»** where it should list all the mentioned and written «اللغة العربية لغة القران» that are in quran, seerah, sunna, tabi3een stories, quotes, mentioned and written in books that were harvested and any future harvested book if it has a «اللغة العربية لغة القران» should be viewable here. Add a box for it on landing page and in navigation menus. Make sure this is done end to end and full detailed proses and make it ready for production at the end of this.
>
> This is only about «اللغة العربية لغة القران» and everything mentioned about «اللغة العربية لغة القران» anywhere in any of the sunni books or quran or sunna or sera. Find all the instances where «اللغة العربية لغة القران» were mentioned or part of quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes, details.
>
> Also add this in engineering documents as the original requirements to allow AI later on to test and validate it when it is in production.
>
> You can use mac browser to browse to any web page, to get any information or download any books, you can use mac apple vision to OCR and then harvest those OCRd books or you can find any other online website that you can decide whether or not can be authentic and trusted as a source and get from it information to fully enrich and fill detailed proses.
>
> When context is tight, just commit and push and continue. Do not wait for build/test or ci. Make the changes in all the website languages. Make the browser/explorer for this have a unique UI that is relevant to its content, similar to how unique all the other browser/explorers are on the website. In the end commit, push, raise PR and merge it. Then delete all the files and folder related to this work from the microsd.

Three additions the founder sent while the work was running, the same day:

> Cover all topics about arabic, its grammar, words, rules, history, where it came from, what it is now, all the different dialects, where it is being spoken, compare it to other languages, the entire story about arabic, all the books written about arabic, arabic nations, arabic world, everything.

> And how arabic in quran is a miracle, explain it in detail and with examples and with stories and with tafsir and background.

> Also make the UI for this browser/explorer unique like you did with the other browsers/explorers in islam.museum.

## Requirements

- **AR-R1 — One browser, one graph.** `/[lang]/arabiyya/` lists records of the one graph, computed at build time. No side table, no page-only dataset.
- **AR-R2 — The Qur'an on its language.** Every ayah of the frozen Tanzil text whose wording names the tongue of the revelation («عربي», «أعجمي», «الأعجمين», «بلسان قومه», «بلسانك») is listed in mushaf order with its text from the frozen record and a link to its verse page. Verse text is never typed.
- **AR-R3 — Detection in every harvested text.** `scripts/arabiyya.ts` matches a narrow Arabic lexicon (after removing vowel marks) over each passage's `text`, `text_search`, Arabic label and Arabic summary: the Arabic tongue, the tongue of Quraysh, the speech and language of the Arabs, learning Arabic, grammar and its founders, solecism, the Qur'an's inimitability. Known false positives stay out: the name «ابن العربي», a bare «لسان العرب» dictionary citation, «النحو» meaning "manner", «الأعراب».
- **AR-R4 — Future books.** A passage of a book harvested after this date appears on the next build with no code change and no tagging, in the corpus its work's genre gives it: `quran`, `sunnah` (genre `hadith` or unit `hadith`), `seerah` (genre `sira`), `tafsir` (genre `tafsir`), else `books`.
- **AR-R5 — Curated records.** Records tagged `arabiyya-browser` plus one `arabiyya-<section>` tag join the curated chapters: `lisan` (Arabic, the language of the Qur'an), `ijaz` (the inimitable language of the Qur'an), `origins`, `script`, `sciences`, `dialects`, `world`, `scholars`, `books`. An unknown section tag falls into `sciences`.
- **AR-R6 — The whole story of Arabic** (second message): the curated chapters cover grammar and the other sciences, vocabulary, history and origin, the language today, the dialects old and new, where Arabic is spoken, the Arab countries, comparison with other languages, and the books written about Arabic. The dictionaries stay in their own browser (`/[lang]/maajim/`) and are linked.
- **AR-R7 — The miracle of the Qur'an's Arabic** (third message): the `ijaz` chapter explains the challenge verses, the accounts of those who heard the Qur'an, the scholars' explanations with examples, and the tafsir background. Each view is attributed to its holder and cited; the museum's voice gives no verdict (`AGENTS.md`, voice and scope).
- **AR-R8 — Full prose.** Every new curated record has detailed prose, written in Arabic first, with its sources listed and cited in the text.
- **AR-R9 — Five languages.** The page, the landing card, the Explore entry, every interface string, and every new record's label, summary and prose ship in Arabic, English, Urdu, French and Spanish.
- **AR-R10 — Unique UI.** `sig/ArabiyyaRing.astro` («دائرة الحروف»): the letters of Arabic round a ring in the order al-Khalil ibn Ahmad gave them in *Kitab al-Ayn*, one coloured arc per place of articulation, with the build's counts in the centre; the verse strip; the numbered chapters. Readable without JavaScript.
- **AR-R11 — Discovery.** Landing card, Explore menu entry (group `texts`), the row in `docs/site/browsers.md` and in `docs/site/signature-views.md`.
- **AR-R12 — API.** `/api/v1/arabiyya.json` with `section` per item, documented in `site/public/openapi/v1.json`, `llms.txt` and `docs/data/README.md`.
- **AR-R13 — Search.** The landing header, the signature view's title and each chapter heading sit inside `data-pagefind-body`; the long lists carry `data-pagefind-ignore`; every record is an entity page and so is indexed.
- **AR-R14 — Never a dead end.** Every card links to the record's ordinary entity page.
- **AR-R15 — Sources and safety.** No honorifics typed; no Qur'an text typed; every record cites defined sources; nothing from or about a blocked organisation; weak or disputed reports are labelled as such where the source grades them.
- **AR-R16 — Tests.** `scripts/arabiyya.test.ts` covers detection, the false positives, future-book inclusion and filing; `scripts/features-api.test.ts` lists `arabiyya.json` among the feature exports.

## Acceptance tests (production)

1. `/ar/arabiyya/`, `/en/arabiyya/`, `/ur/arabiyya/`, `/fr/arabiyya/` and `/es/arabiyya/` return 200 and show the title, lede, status line, ring and chapter titles in that language.
2. With JavaScript off, the whole page is readable: the ring is inline SVG, and every list is in the HTML.
3. The Qur'an strip holds exactly these fifteen verses, in this order: 12:2, 13:37, 14:4, 16:103, 19:97, 20:113, 26:195, 26:198, 39:28, 41:3, 41:44, 42:7, 43:3, 44:58, 46:12. Each links to `/[lang]/passage/quran-<sura>-<aya>/`.
4. `GET /api/v1/arabiyya.json` returns `feature: "arabiyya-browser"` and items each carrying `section`; the fifteen verses carry `section: "quran"`; `passage/bukhari-4987` (write it in the tongue of Quraysh) carries `section: "sunnah"`.
5. The ring shows twenty-nine marks (the twenty-eight letters and the hamza) in nine arcs and links to `work/kitab-al-ayn` and `person/al-khalil-ibn-ahmad-al-farahidi`.
6. The curated chapters include `language/arabic` (lisan), `concept/ijaz-al-quran` and `concept/al-tahaddi-bil-quran` (ijaz), `group/arabs` (origins), `concept/naqt-al-irab` (script), `concept/ibtida-al-nahw` (sciences), `person/sibawayh` (scholars) and `work/kitab-sibawayh` (books).
7. A passage that only names «ابن العربي» or cites «لسان العرب، ج …» is not listed.
8. The home page shows the browser's card in the Explore section, and the Explore menu lists it under the texts group, in all five languages.
9. `/api/v1/arabiyya.json` is in `/openapi/v1.json` (operation `getArabiyya`) and in `/llms.txt`.
10. Each new record named in `docs/plan/74-arabic-language-browser.md` section 4 opens in all five languages with prose and a sources list.
11. After any later harvest that adds a passage containing «نزل بلغة العرب», the count in the status line rises on the next build with no code change.

## What this build does not claim

- The passages are found by wording. Some mention Arabic only in passing, and a passage that discusses Arabic without any of the matched phrases is missed. The excerpt of a machine-read (OCR) passage can carry reading errors.
- "Every book about Arabic" is not reached. The curated chapters hold the records the graph had on 21 November 2026 and the new ones named in the plan; the plan lists what is still to be written.
- New prose and translations are AI-written from the cited sources and have not been read by a human.
