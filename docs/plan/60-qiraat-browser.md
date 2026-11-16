# Plan 60 — Qur'an Readings, Orthography, Scripts and Dotting Browser (متصفح قراءات القرآن والرسم الإملائي والخطوط والتنقيط)

_Requested by the founder, 15 November 2026: "start working on متصفح قراءات القران والرسم الإملائي
والخطوط والتنقيط, where it should list all the mentioned and written [readings of the Qur'an,
orthography, scripts and dotting] that are in the Qur'an, the seerah, the Sunnah, the Tabi'in's
stories, quotes, mentioned and written in books that were harvested and any future harvested book …
add a box for it on the landing page and in navigation menus … full detailed prose … ready for
production." The verbatim request and the acceptance spec for production validation are in
`docs/engineering/52-qiraat-browser-requirements.md` (`QIRAAT-R..` ids)._

## 1. What it is

A browser over the one graph that gathers what the museum's sources say about how the Qur'an is read
and how it is written, in seven topics:

| Topic (`qiraat-<topic>`) | Arabic | What it holds |
|---|---|---|
| `ahruf` | الأحرف السبعة | the report that the Qur'an was sent down in seven ahruf, its narrations, and the scholars' readings of it |
| `readings` | القراءات | the canonical and non-canonical readings, the conditions of an accepted reading, the Companions' readings reported in hadith, and the verses in which the readers differ |
| `readers` | القراء والرواة | the readers among the Companions and Successors, the seven and the ten imams and their transmitters, the authors on the readings |
| `codex` | جمع القرآن والمصاحف | the writing down of the revelation and its scribes, Abu Bakr's collection, 'Uthman's copying and the codices sent to the cities, the Companions' codices, mushaf manuscripts |
| `rasm` | رسم المصحف | the spelling of the 'Uthmanic codices and its rules, the differences between the codices of the cities, and the debate over writing the mushaf in ordinary (imla'i) spelling |
| `naqt` | النقط والشكل والضبط | the dots for case endings (Abu al-Aswad), the dots that tell letters apart (Nasr ibn 'Asim, Yahya ibn Ya'mar), al-Khalil's vowel signs, the marks of fives, tens and divisions, the early dislike and later acceptance |
| `khatt` | الخطوط والكتابة | the pen, ink and page in the Qur'an; the scripts of the mushaf from Hijazi and Kufic to the six pens, naskh, thuluth and Maghribi; the calligraphers |

It follows the architecture of the Magic, Dream and Cosmos Browsers (`docs/plan/59-cosmos-browser.md`):
there is no side table and no second list. Passages are ordinary graph nodes; curated records carry
the `qiraat-browser` tag.

## 2. How records get in

1. **The Qur'an: a reviewed table, not a word search.** `scripts/qiraat.ts` `QIRAAT_QURAN_REFS` lists
   the verses (sura, first aya, last aya, topics). Two kinds of verse are there: those that speak of
   reading, measured recitation, the tongue of the revelation, the kept Book, the pen and the page; and
   a reviewed selection of the verses in which the canonical readers, or the codices 'Uthman sent to
   the cities, are recorded as differing (by a letter of the skeleton → `rasm`, by the dots of a letter
   → `naqt`, by vowels or doubling → `readings`). The verse text is frozen (Tanzil) and never matched by
   vocabulary, and no variant wording is typed anywhere: the table's comments and the prose describe a
   reading in words.
2. **Every other passage: a guarded lexicon, at build time.** The same file's Arabic and English
   patterns run over the passage's own text, search text, label and summary, after folding (vowel
   marks dropped, alef forms joined), so fully vowelled hadith text matches. Bare common words never
   match alone — «القراءة» is also the recitation in prayer, «الخط» a line drawn in the sand and the
   first letters of «الخطبة», «الحرف» any letter, «النقطة» any dot — so the lexicon uses phrases and
   names that carry the topic by themselves (`سبعة أحرف`، `في قراءة ابن مسعود`، `القراء السبعة`،
   `جمع القرآن`، `مصحف`، `رسم المصحف`، `نقط المصاحف`، `الخط الكوفي`، `ابن مقلة` …). A mention in a book
   harvested next month appears the day its passage record lands (the founder's "any future harvested
   book" requirement, met by the detector and not by tagging).
3. **Curated records and hand-checked passages: tags.** `qiraat-browser`, a section tag
   (`qiraat-sciences`, `qiraat-people`, `qiraat-scripts`, `qiraat-works`, `qiraat-mushafs`; without one
   a record is filed by its class) and `qiraat-<topic>` tags (the topic chips) on any record; a passage
   whose wording the lexicon cannot see joins the same way.
4. `QIRAAT_EXCLUDE` is the escape hatch for verified false positives, each read by hand.
5. **Mining tools.** `scripts/harvest-qiraat-ocr.ts` turns pages of the OCR'd library on the harvest
   drive into passage records (an excerpt of at most 40 words, the work and the scan page), and
   `scripts/harvest-qiraat-hadithapi.ts` does the same for reports of the hadith collections from the
   open hadith dataset; both use the detector above, skip any window that carries Qur'an text or an
   honorific, and can be run again when a new book is OCR'd. `scripts/qiraat-audit.ts` prints every
   detected passage with the words that matched.

## 3. Sections

Four from the corpus — `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب — derived from each passage's work (`work/quran` first; genre `sira`; genre `hadith` or
`unit: hadith`; all else `books`); and five curated — `sciences` العلوم والوقائع والأسئلة · `people`
القراء والكتبة والخطاطون · `scripts` الخطوط · `works` الكتب المصنفة · `mushafs` المصاحف. The curated
sections lead the page (`curatedFirst`), the passages follow.

## 4. Pages

- `/[lang]/qiraat/` — home: lede, status count, method note, the seven topics defined, API link, a
  signature view (`components/sig/QiraatLines.astro`, "the ruled page": a line per topic and on it a
  dot for every section that holds records of the topic, sized by their number, every dot a link),
  section chips with counts, a client-side filter over trilingual labels, summaries, work names, topic
  names and excerpts, and ordinary entity links; long sections are paged (`site/src/lib/paged.ts`).
- Landing card «متصفح قراءات القرآن والرسم الإملائي والخطوط والتنقيط» with a ruled-page icon and its
  accent, and an Explore-menu entry under the **texts** group after the Tafsir Browser, in all three
  languages.

## 5. API and documentation

- `/api/v1/qiraat.json` — every detected + tagged record with `section`, `topics`, `work`, `ref`,
  `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` and edges; registered in
  `scripts/export-api.ts`, `site/public/openapi/v1.json`, `docs/data/README.md`, `llms.txt`.
- Registered in `docs/site/browsers.md`, `docs/site/signature-views.md`, the plan index, the roadmap,
  `docs/agents/lanes.md` (`qiraat` lane), `docs/status.md` and `CANARY.md`.

## 6. The curated layer

Existing records were tagged in place and, where thin, enriched: the concepts of the readings, the
seven ahruf, the seven readers, the rasm, the mushaf, tajwid and tartil; the script concepts (Hijazi,
Kufic, naskh, thuluth, muhaqqaq, rayhan, riqa', tawqi', Maghribi and the later hands); the readers,
transmitters, scribes of the revelation, dotters and calligraphers already in the graph; the books of
the readings, rasm and the Qur'anic sciences; and the mushaf manuscripts. New records were written
where the graph had none — the conditions of an accepted reading, the ten readings, the shadhdh
readings, the final review, the scribes of the revelation, the two collections and the codices of the
cities, the rules of the rasm, the two kinds of dotting, the vowel signs, the division marks, the
missing transmitters of the seven and the ten, the authorities of rasm and dabt, the missing books,
and tension cards on the questions scholars differed on (the meaning of the seven ahruf; whether the
seven readings are the seven ahruf; whether the mushaf may be written in ordinary spelling). Each new
record is trilingual, cites defined sources, labels contested views (`perspectives`) and gives no
verdict. The list of what landed is in `CANARY.md` under the release that added the browser.

## 7. Scope decisions (made by the agent, recorded here for the founder's audit)

- **«الرسم الإملائي» is read as the orthography of the mushaf as a whole.** The founder's phrase names
  ordinary (imla'i) spelling; the sources discuss it only as the alternative to the 'Uthmanic rasm, so
  the browser carries the rasm, its rules, the differences between the codices, and the debate over
  ordinary spelling as a tension card with each position attributed.
- **The readings need the people and the codex.** A browser of the readings without the readers, the
  seven ahruf and the collection of the Qur'an would not answer its own questions, so those are topics
  of their own.
- **What stays out.** The recitation in the ritual prayer (a fiqh subject, in the Ibadat Browser), the
  abrogation sense of «النسخ», tafsir in general, and writing that is not about the Qur'an or the
  scripts (letters and chancery practice are in the Mukatabat Browser; the writing down of hadith is
  not here). A bare mention of «المصحف» in a hadith is kept, because the report is then about the
  written Qur'an; on a book page it is not enough by itself for the mining tool.
- **A narrator who is also a reader.** 'Asim, Hafs and Abu Ja'far appear in hadith chains; a report in
  which the reader is only a link of the chain is listed under `readers` by the detector, and the mining
  tool does not import a report for that reason alone.
- **No preference among readings or scripts**, and no ruling on any disputed question.
- **Qur'an text is never typed**, so a variant reading is described in words, and mined windows that
  quote a verse are skipped. This keeps some of the densest pages of the books of the readings out of
  the mined passages; the curated prose covers their content with citations.
- **Push without waiting for CI** (founder instruction): the gates are run locally where time allows,
  and the pull request says which were run.

## 8. Known limits and next waves

- Detection of non-Qur'an passages is lexical; a mention phrased without the lexicon needs a
  `qiraat-browser` (+ `qiraat-<topic>`) tag on the passage record — the documented escape hatch.
- The verse table holds a reviewed selection of the verses in which the readers differ. A full farsh
  wave — every verse with a recorded difference among the ten, each described in words and cited to
  al-Nashr or al-Taysir — is the natural next step, as `reading` records linked to their verse.
- The seerah section fills itself as seerah passages with these subjects are harvested.
- Books not yet in the OCR library that would add most: Ibn Abi Dawud's Kitab al-Masahif, Ibn Mujahid's
  Kitab al-Sab'a, al-Dani's al-Muqni' and al-Muhkam, Ibn al-Jazari's Ghayat al-Nihaya, al-Dhahabi's
  Ma'rifat al-Qurra' al-Kibar, Abu 'Ubayd's Fada'il al-Qur'an. They are named here as the acquisition
  list; none was downloaded in this run.
- The prose was written by AI agents from the cited sources and has not been read by a human; nothing
  is live until the founder deploys.
