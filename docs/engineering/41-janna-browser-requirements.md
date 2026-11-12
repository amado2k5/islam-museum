# Janna Browser — production requirements

Original request (founder, 11–12 Nov 2026, verbatim, condensed): «متصفح الجنة» — a browser
that lists all the mentioned and written material about الجنة in the Qur'an, the Sunnah,
the seerah, Companion and Tabi'i stories and quotations, every book already harvested and
any future harvested book; a box on the landing page and in the navigation menus; done end
to end with full detailed prose, ready for production; and the requirements filed in
engineering documents so a later AI can test and validate it in production.

Each requirement carries an id (`JAN-Rn`) for the production smoke list.

- **JAN-R1.** `/[lang]/janna/` renders for every published language without JavaScript:
  title, lede, five corpus sections (quran, sunnah, seerah, books, curated), every item as
  a card linking its entity page, per-card work and ref. Pagefind indexes title/lede/headings
  via `data-pagefind-body`.
- **JAN-R2.** `/api/v1/jannas.json` exists and every record has `section` ∈ the five corpora,
  `janna_kind` ∈ {description, mention, null} and `signals` (array); passages carry
  work/ref/unit/text/sura/aya.
- **JAN-R3.** Every passage whose text names an unambiguous Paradise term (الفردوس، جنات عدن،
  دار السلام، جنة المأوى، الكوثر، تسنيم، سلسبيل، حور العين، أهل الجنة، أصحاب الجنة…) is a
  `janna.json` record.
- **JAN-R4.** A passage whose only جنة-word is bare «الجنة/جنات/جنان» enters only with a
  Paradise collocation in its window (khold, rivers, degrees, the Fire counterpoint,
  entry/fallāḥ vocabulary).
- **JAN-R5.** False positives stay out: «الصيام جنة»/«الصوم جنة» (the shield matn), the
  orchard ayahs 18:33 and 34:15–16, and every جِنّ/jinn form — verified by id and by the
  letter-boundary patterns.
- **JAN-R6.** A book harvested later brings its Paradise mentions automatically: the
  detector runs at build time over `text_search`/`text` of every `passage` node; no tagging
  is needed. Smoke: any new passage containing «الفردوس» appears in `jannas.json` with
  `signals` including `firdaws`.
- **JAN-R7.** `concept/jannah` and the other shared records are tagged `janna-browser`
  in place — never duplicated; their entity pages keep their other browser tags.
- **JAN-R8.** `janna-<section>` tags steer a curated record into a corpus section;
  untagged curated records sit in `curated`.
- **JAN-R9.** The Explore menu holds a `janna` entry pointing at `/{lang}/janna/` and the
  landing page shows its card in all three languages.
- **JAN-R10.** Every new record is `status.review: draft` with a `provenance` block and at
  least one defined `source`; Arabic prose exists for all ten new concepts, English and
  Urdu prose for all ten, in the same commit.
- **JAN-R11.** The detector's `signals` are named and stable (firdaws, jannat-adn,
  jannat-al-naim, jannat-al-khuld, jannat-al-mawa, jannat-al-firdaws, dar-al-salam,
  dar-al-janna, ahl-al-janna, ashab-al-janna, hur-al-ayn, wildan, ghuraf, shajarat-tuba,
  al-kawthar, tasnim, salsabil, maqam-amin, janna) so tests can pin them.
- **JAN-R12.** The Fire/Janna split is respected: a passage may live in both browsers; the
  worldly-orchard ayahs stay out of janna and the hellfire names stay out of janna signals.
