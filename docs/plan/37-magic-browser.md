# Plan 37 — Magic and Magicians Browser (متصفح السحر والسحرة)

_Requested by the founder: "start working on متصفح السحر والسحرة where it should
list all the mentioned and written Magic and magicians that are in quran, sunnah,
any of seerah and any dreams mentioned and written in books that were harvested
and any future harvested book if it has a Magic and magicians should be viewable
here. add a box for it on landing page and in navigation menus … find all the
instances where Magic and magicians met or interacted with humans in the quran,
seerah, sunna, quotes from sahaba and tabi'een and add those stories, mentions,
quotes … this is only about Magic and magicians and everything mentioned about
Magic and magicians in quran, sunnah, seerah, anywhere in any of the sunni
books."_

The acceptance spec for production validation is
`docs/engineering/25-magic-browser-requirements.md` (`MAGIC-R..` ids).

## 1. What it is

A browser over the one graph that gathers every mention of magic and the
magicians in the museum's sources: sorcery (سحر) in the Qur'an — Pharaoh's
magicians, the accusation against the Prophet, the trial of Harut and Marut —
the hadiths on sorcery and soothsaying, the Prophet's own cure by ruqyah, the
evil eye and envy, and every magic mention in every harvested book, plus the
curated records about the topic itself. It follows the Dream Browser
architecture: passages are ordinary graph nodes found at build time by a shared
detector; curated records carry the `magic-browser` tag; there is no side table
and no second list.

Like the Dream Browser, **passages are not tagged — they are detected.**
`scripts/magic.ts` matches the magic lexicon against each passage's own text,
search text, label and summary, in Arabic and English. A magic mention in a
book harvested next month appears here the day its passage record lands — the
founder's "any future harvested book" requirement, met by the detector rather
than by tagging.

The lexicon is deliberately **gated**, because unvocalized Arabic makes the
core words ambiguous:

- «السحر»/«سحر» — sorcery (سَحَرَ) or the night-vigil (سَحَر); the sahar usages
  (`تسحر`, `أسحر`, `سحراً`, `في السحر`, `سحرها/سحرهم/سحرنا`) are stripped before
  matching, and indefinite forms count only beside a magic-domain collocation.
- «رقى»/«رقية» — the incantation or "he ascended"/a name (Ruqayya); guarded
  word-initial forms only, never inside «شرقية» or «مفترقين».
- «يسترق»/«تسترق» — seeking ruqyah or seeking enslavement; slavery markers veto.
- «العين» — the evil eye or the eye, a spring, the 'īna sale, poetry tears;
  counts only beside evil-eye collocations or the strong phrases
  «العين حق»، «صاحب العين»، «ذو العين».
- «كاهن» — the soothsayer; «الأعراف» (the sura) and «العينة» (the sale) stripped.
- «عراف» — substring of «الأعراف» handled by the same strip.
- «منجم» — astrologer or "in installments" (منجمة), guarded.
- English fields: "magic/sorcery/sorcerer", "soothsaying/augury/astrolog*",
  "ruqyah", "evil eye", "envy/hasad".

`MAGIC_EXCLUDE` is the curated escape hatch for verified false positives, each
read by hand (the sahar-night reports in the Muwatta, the «أعراقية» substring,
the Ruqayya name, the Bukhari «سحرها ونحرها» anatomy idiom, the Zuhayr dawn
verse).

## 2. Scope decisions (founder answers, 10 Nov 2026)

- **Full unseen-harm complex in scope**: sorcery, soothsayers/augury/astrology,
  ruqyah, the evil eye, envy (hasad), and the adjacent records on waswasah,
  kashf, 'irafa, jinn-affliction and nujum — the topics the sources tie to
  magic.
- **Dreams out of scope**: dream mentions belong to the Dream Browser
  (`/[lang]/dreams/`); this browser does not duplicate them.
- **Independent of the jinn-devils browser branch**: built on `main` alone.
- **Push without waiting on local build/test/CI**: CI verifies; gates run
  opportunistically.

## 3. Records

- **85 passage records detected** in the current corpus: 63 Qur'an ayahs,
  20 hadith/muwatta/arba'in reports, 2 poetry passages — topic counts
  `sihr:56, hasad:16, ayn:12→3 after gating, kahana:8, ruqyah:4` (per-topic
  counts overlap where a passage carries several families).
- **3 manually verified passages** the lexicon cannot catch (no unambiguous
  magic word in the matn) join through the tag path:
  `muwatta-29-2553` (Hafsa's bewitched slave-girl), `muwatta-31-2715` and
  `muwatta-31-2716` (the ruqyah hadiths of Uthman b. Abi al-'As and the
  Mu'awwidhat).
- **29 existing records tagged** `magic-browser` + `magic-<topic>` tags:
  16 concepts (sihr, al-sahara, kahana, kahana-fiqh,
  tathir-al-jinn-wal-sihr, mass-al-jinn, ruqya-fiqh, al-ayn, hasad,
  hasad-envy, irafa, kashf, waswasa-fiqh, al-waswasa,
  shayatin-al-ins-wal-jinn, harut-and-marut), 9 soothsayer/sorcerer persons
  (al-kahina, the kahin persons, ismail-al-sahir, labid-ibn-rabia), and
  `event/hassan-vs-kahina`.
- **5 new records**, draft-tier with trilingual label, summary and prose:
  `person/harut`, `person/marut` (the Babylon-trial angels of 2:102),
  `person/labid-ibn-al-asam` (the sorcerer of the famous hadith),
  `event/sihr-against-the-prophet` (the bewitching and cure-by-ruqyah
  incident), `concept/ruqya` (the lawful counter-incantation — a real record
  where only a stub existed).

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `concepts` سجلات السحر — derived from each passage's work (genre
`hadith`/`sira` or `unit: hadith`, `work/quran` first) and from the
`magic-<section>` tag on curated records. Topic chips (`sihr`, `kahana`,
`ruqyah`, `ayn`, `hasad`, `waswasah`, `kashf`, `irafa`, `jinn`, `nujum`,
`sahara`) label each card.

## 5. Pages

- `/[lang]/magic/` — the home: lede, status count, method note, API link,
  section chips with counts, topic chips per card, a client-side filter over
  trilingual labels, summaries, work names, topic names and excerpts, and
  ordinary entity links.
- Landing card «متصفح السحر والسحرة» with a magic star icon + accent, and an
  Explore-menu entry, in all three languages.

## 6. API and documentation

- `/api/v1/magic.json` — every detected + tagged record with `section`,
  `topics`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`,
  `tags` and edges; registered in `scripts/export-api.ts`,
  `site/public/openapi/v1.json`, `docs/data/README.md`, `llms.txt`.
- Docs: this plan, `docs/engineering/25-magic-browser-requirements.md`,
  `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`
  (`magic` lane), `docs/status.md`, `docs/site/browsers.md`, `CANARY.md`.

## 7. Known limits

- Detection is lexical: a magic mention phrased without the lexicon (like the
  three manually tagged Muwatta passages) needs a `magic-browser` tag on the
  passage record — the documented escape hatch.
- Poetry matches are kept only where the magic vocabulary is literal
  (envy-root verses); metaphorical «سحر» in panegyric is excluded by review.
- The seerah section fills itself as seerah passages are harvested; today it
  is empty.
- All AI-authored records stay `status.review: draft` until a human reads
  them; nothing is live until the founder deploys.
