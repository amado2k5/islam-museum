# Plan 39 — Messengers and Prophets Browser (متصفح الرسل والأنبياء)

_Requested by the founder: "start working on متصفح الرسل والانبياء where it
should list all the mentioned and written الرسل والانبياء that are in tabi3een
stories, quotes, mentioned and written in books that were harvested and any
future harvested book if it has a الرسل والانبياء should be viewable here. add a
box for it on landing page and in navigation menus … find all the instances
where الرسل والانبياء were mentioned or part of quotes from sa7aba and tabi3een
and add those stories, mentions, quotes … this is only about الرسل والانبياء
and everything mentioned about الرسل والانبياء anywhere in any of the sunni
books, quran, sunnah, see rah."_

The acceptance spec for production validation is
`docs/engineering/27-messengers-browser-requirements.md` (`MSG-R..` ids).

## 1. What it is

A browser over the one graph that gathers every mention of the messengers and
prophets in the museum's sources: the named prophets and messengers in the
Qur'an and the hadith, the bearers of stories, lineages and missions, the
prophets who are not named, the class terms (الأنبياء، الرسل، المرسلون،
بعثنا/أرسلنا), and every mention in every harvested book — plus subject pages
for the canonical prophet/messenger records. It follows the Magic/Dream
Browser architecture: passages are ordinary graph nodes found at build time by
a shared detector and joined to the canonical `mentions` edges already in the
graph; curated records carry the `messengers-browser` tag; there is no side
table and no second list.

Like the Magic Browser, **passages are not tagged — they are detected.**
`scripts/messengers.ts` matches a guarded lexicon against each passage's own
matn (`text_search`/`text`, never the isnad-heavy summary or the work label),
in Arabic and English. A prophet mention in a book harvested next month
appears here the day its passage record lands — the founder's "any future
harvested book" requirement, met by the detector rather than by tagging.

The lexicon is deliberately **gated**, because unvocalized Arabic makes the
core names ambiguous:

- «ابن آدم»/«بني آدم» are stripped before matching — they mean mankind, not
  Adam; «أبو داود» is stripped before matching Dawud.
- «صالح» is a common adjective — it counts as Salih only beside Thamud or
  the messenger formula («نبي ثمود», «اخاهم صالح»).
- «يحيي» is also "he gives life" — it counts as Yahya only in the
  annunciation formulas («يا يحيي», «اسمه يحيي», «يحيي بن زكريا»).
- Names are matched on the passage matn only; isnads and work labels are not
  scanned, so narrator names like «محمد» in isnads do not create mentions.
- A bare `mentions → person/muhammad` edge marks a hadith's narrator, not a
  mention of the prophets as a subject; it enters the feed only beside a
  named/class hit in the matn.
- `MESSENGERS_EXCLUDE` is the curated escape hatch for verified false
  positives.

## 2. Scope decisions

- **All prophet figures, not only the 25 named in the Qur'an**: the subject
  index is `MESSENGER_SUBJECTS` in `scripts/messengers.ts` — Adam through
  al-Khidr, including the prophets the Qur'an names without calling them
  prophets (Salih, Hud, Shu'ayb) and the prophetic figure al-Khidr. Adjacent
  people — Maryam, the Pharaohs, Talut, Dhu al-Qarnayn, Luqman, Uzair and the
  false claimants — are deliberately not subjects; they remain ordinary
  records and may appear as related links.
- **Unnamed prophets stay unnamed**: passages that speak of «نبي من الأنبياء»
  or «مرسل من الرسل» are shown under the generic/unnamed chips without guessing
  an identity.
- **Subject pages plus a mention feed**: `/[lang]/messengers/` lists the
  subject cards and the corpus feed; `/[lang]/messengers/<slug>/` gathers one
  subject's verses, reports and stories from every section.
- **Independent of unmerged browser branches**: built on `main` alone.
- **Push without waiting on local build/test/CI**: CI verifies; gates run
  opportunistically.

## 3. Records

- **Passages detected in the current corpus** by `scripts/messengers.ts`:
  Qur'an ayahs (named prophets, the class terms, unnamed prophets), Sunnah
  reports (the Prophet's and the Companions'/Tabi'in's mentions of the
  prophets), seerah and other harvested books as they exist today.
- **Canonical mention edges already in the graph** join the same passages:
  explicit `mentions → person/<prophet>` edges on passage records enter the
  feed and the subject pages even when the matn lexicon does not fire.
- **Canonicalisation fix**: Qur'an mention edges that pointed at the stub ids
  `person/zakariya` and `person/dhu-al-kifl` are retargeted to the canonical
  records `person/zakariyya` and `person/dhu-l-kifl`, and the stale stub lines
  are removed from `data/_stubs.d/quran-mentions.yaml`.
- **Three new canonical records**, draft-tier with trilingual label, summary
  and provenance: `person/idris`, `person/hud`, `person/ilyas` — the Qur'anic
  prophets whose only graph presence was a stub. Their `mentions` edges from
  the Qur'an passages now resolve to real records.
- **Curated records** join through the `messengers-browser` tag and the
  `messengers-<section>` tag when a record is specifically about the prophets
  as a class (prophet biographies, seerah, qisas).

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `curated` سجلات منتقاة — derived from each passage's work (genre
`hadith`/`sira` or `unit: hadith`, `work/quran` first) and from the
`messengers-<section>` tag on curated records. Subject pages are the canonical
`MESSENGER_SUBJECTS` records; generic chips (`prophets`, `messengers`,
`sending`, `unnamed`) label class-level cards.

## 5. Pages

- `/[lang]/messengers/` — the home: lede, status count, method note, API
  link, subject cards with mention counts, section chips with counts, topic
  chips per card, a client-side filter over trilingual labels, summaries,
  work names, topic and subject names and excerpts, and ordinary entity
  links.
- `/[lang]/messengers/<slug>/` — one subject: summary lede, passages grouped
  by corpus (Qur'an ayahs with Tanzil text and translation, Sunnah/seerah/
  books reports with work+ref and excerpt), sources footnotes and related
  records.
- Landing card «متصفح الرسل والأنبياء» with a messenger icon + accent, and an
  Explore-menu entry, in all three languages.

## 6. API and documentation

- `/api/v1/messengers.json` — every detected + tagged record with `section`,
  `subjects`, `topics`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`,
  `themes`, `tags` and edges, plus a `subjects` index (id, label, summary,
  status, per-corpus counts, passage ids); registered in
  `scripts/export-api.ts`, `site/public/openapi/v1.json`,
  `docs/data/README.md`, `llms.txt`.
- Docs: this plan, `docs/engineering/27-messengers-browser-requirements.md`,
  `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`
  (`messengers` lane), `docs/status.md`, `docs/site/browsers.md`, `CANARY.md`.

## 7. Known limits

- Detection is lexical: a prophet mention phrased without the lexicon needs a
  `messengers-browser` tag on the passage record — the documented escape
  hatch.
- The feed is a mention index, not a story index: it lists where prophets are
  mentioned; the stories themselves live on the subject and passage entity
  pages and grow as books are harvested.
- The seerah section fills itself as seerah passages are harvested.
- All AI-authored records stay `status.review: draft` until a human reads
  them; nothing is live until the founder deploys.
