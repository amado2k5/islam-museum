# Plan 39 — Signs of the Hour Browser (متصفح علامات الساعة)

_Requested by the founder: "متصفح علامات يوم القيامة الكبرى والصغرى where it
should list all the mentioned and written that are in quran, seerah, sunna,
tabi'een stories, quotes, mentioned and written in books that were harvested
and any future harvested book if it has [a mention] should be viewable here.
add a box for it on landing page and in navigation menus … this is only about
علامات يوم القيامة الكبرى والصغرى and everything mentioned about it anywhere
in any of the sunni books or quran or sunna or seerah — find all the instances
where [it] was mentioned or part of quotes from quran, sunnah, Hadith, seerah
or from sahaba and tabi'een and add those stories, mentions, quotes, details …
also add this in engineering documents as the original requirements …"_

The acceptance spec for production validation is
`docs/engineering/30-eschatology-browser-requirements.md` (`ESCH-R..` ids).

## 1. What it is

A browser over the one graph that gathers **all eschatology** in the museum's
sources: the signs of the Hour — the major signs (الأشراط الكبرى) and the
minor signs (الأشراط الصغرى) — and everything the tradition records around
them: the death and the grave (البرزخ), resurrection and gathering
(البعث والنشور), the reckoning (الحساب والميزان), the Sirat and the Hawd,
Paradise and Hell, and the end-times figures the hadith names (the Dajjal,
Yajuj and Majuj, the Beast, Gog and Magog, the rising sun from the west).
It follows the Dream and Magic Browser architecture: passages are ordinary
graph nodes found at build time by a shared detector; curated records carry
the `eschatology-browser` tag; there is no side table and no second list.

Like the Dream and Magic Browsers, **passages are not tagged — they are
detected.** `scripts/eschatology.ts` matches a guarded eschatology lexicon
against each passage's own text, search text, label and summary, in Arabic and
English. A mention of the Hour's signs, the Hereafter or a sign-figure in a
book harvested next month appears here the day its passage record lands — the
founder's "any future harvested book" requirement, met by the detector rather
than by tagging.

The lexicon is deliberately **gated**, because unvocalized Arabic makes the
core words dangerously ambiguous:

- «الساعة»/«ساعة» — the Hour or an hour (of time, of prayer, of commerce);
  counts only beside Hour-collocations (تقوم، تنفخ، انقضت، يوم القيامة) or in
  the «أشراط الساعة» compounds.
- «يوم»/«اليوم» — the Day or "today"; never matched bare. Only the compounds:
  يوم القيامة، يوم الدين، يوم البعث، يوم النشور، يوم الحساب، يوم الفصل،
  يوم الحسرة، يوم القيامة الكبرى، يوم القيامة الصغرى.
- «الآخرة»/«الاخرة» — the Hereafter or "the last (of a series)"; counts only
  beside Hereafter collocations (دار الآخرة، ثواب الآخرة، في الآخرة).
- «البرزخ» — the isthmus or a boundary/partition; counts beside grave/death
  collocations (بعد الموت، في القبر، سؤال القبر).
- «الميزان» — the Scale or a scale/balance (of commerce); counts beside
  weighing-reckoning collocations (يوزن، توزن، حسنات، سيئات).
- «القيامة» — the Resurrection or "getting up" (from sitting, sleep, prayer);
  guarded by resurrection collocations (من القبور، البعث، الموتى).
- «النفخ»/«بوق»/«صور» — the Trumpet or blowing (of a horn in poetry, of a
  whistle); counts beside Trumpet collocations (الصور، إسرافيل، ينفخ، بوق).
- «النار»/«الجحيم» — the Fire or a literal fire; counts beside Hereafter
  collocations (أهل النار، عذاب النار، دار النار).
- «الجنة»/«الجنان» — Paradise or a garden (of this world); counts beside
  Paradise collocations (دار الجنة، فراديس، جنات عدن، الفردوس).
- «الموت»/«القتل» — death or killing in worldly contexts; never matched
  bare. Only death-of-the-soul collocations (عند الموت، سكرات الموت،
  يوم يموت) in hadith-classified corpora, and barzakh passages.
- «العالم»/«الآخر» — the world or the other (man); never matched bare.
- «الدجال»/«المسيح الدجال» — the Dajjal is unambiguous (also a proper noun);
  «المسيح» alone counts only in the عيسى/الدجال collocations.
- «يأجوج»/«مأجوج» — Yajuj and Majuj (a legacy spelling is « Gog and Magog»);
  «الجنس»/«الأجناس» never matched bare.
- «المهدي» — the Mahdi (eschatological) or "the rightly-guided" (caliphs);
  counts beside Mahdi collocations (يخرج المهدي، آخر الزمان) — the guided-caliph
  usages are excluded.
- English fields: "Day of Judgment/Resurrection/Account", "Hereafter",
  "Paradise/Hell", "Dajjal/Antichrist", "Yajuj/Majuj/Gog/Magog", "Mahdi",
  "Hour", "barzakh", "Trumpet", "Scale of deeds".

`ESCH_EXCLUDE` is the curated escape hatch for verified false positives, each
read by hand.

## 2. Scope decisions (founder answers, 10 Nov 2026)

- **All eschatology in scope** (the founder's "كل ما ذُكر عن علامات يوم
  القيامة"): the major and minor signs of the Hour, signs of the Hour
  generally, barzakh and the grave, resurrection and gathering, reckoning
  and the Scale, the Sirat and the Hawd, Paradise and Hell, and the named
  end-times figures (Dajjal, Yajuj and Majuj, the Beast, the rising sun from
  the west, the Mahdi).
- **Source breadth**: Qur'an, Sunnah (hadith collections), seerah and
  history, Companion and Tabi'in reports, quotes, stories and every harvested
  book — present and future.
- **Hadith enrichment**: import the fitan/hereafter chapters of the already
  registered `fawazahmed0/hadith-api` source (Sahih al-Bukhari, Sahih Muslim,
  Sunan Abi Dawud, Jami' al-Tirmidhi, Sunan al-Nasa'i, Sunan Ibn Majah) as
  ordinary `passage` records, reconciling hadith-api numbering with the
  museum's ref convention per collection (the `arabicnumber` field for
  Muslim; `hadithnumber` for the rest; Muwatta skipped — its 2,861 passages
  already cover it and its numbering differs).
- **Push without waiting on local build/test/CI**: CI verifies; gates run
  opportunistically.

## 3. Records

- **Detected passages** across the current corpus — the count is whatever the
  guarded lexicon finds over `work/quran`, the six hadith works, the Muwatta
  and every other harvested work (the detector report lives in the
  `scripts/eschatology.ts` run output and `docs/status.md`).
- **~30 existing records tagged** `eschatology-browser` +
  `eschatology-<section>` tags: the Day-of-Judgment and Hereafter concepts
  (`yawm-al-qiyama`, `saa`, `alamat-al-saaa-al-kubra`, `ashrat-al-saa`,
  `akhirat-al-zaman`, `akhira`, `al-barzakh`, `adhab-al-qabr`,
  `sakarat-al-mawt`, `al-hisab`, `al-mizan`, `al-hawd`,
  `al-sirat-al-mustaqim`, `sirat`, `jahannam`, `jannah`, `jannat-adn`,
  `thamarat-al-jannah`, `yajuj-majuj`, `dajjal`, `qiyam-standing`,
  `malik-keeper-of-jahannam`, `ridwan-keeper-of-jannah`, `qiyam-al-layl`,
  `malik-al-din`, `hawd-basin-water`, `al-mahshar`, `ashab-al-yamin`,
  `ashab-al-shimal`), the end-times figures the hadith names (the Mahdi,
  the Dajjal, Yajuj and Majuj, the Beast, the rising sun from the west,
  Israfil, Malik, Jibril, Mika'il, the Angel of Death), the end-times
  events and reports the seerah and hadith carry, and the relevant hadith
  passages the detector cannot reach (paraphrased eschatology without the
  lexicon).
- **~35 new records**, draft-tier with trilingual label, summary and prose:
  the major-signs and Hereafter concepts the graph lacks — the end-times
  figures (`al-mahdi`, `al-dajjal` detail, `yajuj-majuj` detail, the Beast
  of the earth, the rising sun from the west, Israfil, Malik and Ridwan,
  the Angel of Death), the Day's stations (`yaum-al-bath`,
  `yaum-al-nushur`, `yaum-al-hisab`, `yaum-al-mizan`, `yaum-al-sirat`,
  `yaum-al-hawd`, `al-mahshar`, `ashab-al-yamin`, `ashab-al-shimal`,
  `dar-al-jaza`), the barzakh detail (`al-barzakh`, `sakarat-al-mawt`,
  `adhab-al-qabr` detail), the works' own records where a chapter is
  imported, and the Companion/Tabi'in story records the sources carry —
  reuse before create, each new record citing its source.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `hereafter` في الآخرة · `dwelling` في المسكن · `concepts` سجلات
الآخرة — derived from each passage's work (genre `hadith`/`sira` or
`unit: hadith`, `work/quran` first) and from the `eschatology-<section>` tag
on curated records. Topic chips (`ashrat`, `dajjal`, `yajuj-majuj`, `barzakh`,
`nushur`, `hisab`, `mizan`, `sirat`, `hawd`, `jannah`, `jahannam`,
`yaum-al-din`, `yaum-al-qiyama`, `malakut`, `fitan`) label each card.

## 5. Pages

- `/[lang]/signs/` — the home: lede, status count, method note, API link,
  section chips with counts, topic chips per card, a client-side filter over
  trilingual labels, summaries, work names, topic names and excerpts, and
  ordinary entity links.
- Landing card «متصفح علامات الساعة» with a signs icon + accent, and an
  Explore-menu entry, in all three languages.

## 6. API and documentation

- `/api/v1/eschatology.json` — every detected + tagged record with `section`,
  `topics`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`,
  `tags` and edges; registered in `scripts/export-api.ts`,
  `site/public/openapi/v1.json`, `docs/data/README.md`, `llms.txt`.
- Docs: this plan, `docs/engineering/30-eschatology-browser-requirements.md`,
  `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`
  (`eschatology` lane), `docs/status.md`, `docs/site/browsers.md`, `CANARY.md`.

## 7. Known limits

- Detection is lexical: an eschatology mention phrased without the lexicon
  needs an `eschatology-browser` tag on the passage record — the documented
  escape hatch.
- Worldly uses of «يوم», «الساعة», «الآخرة», «النار», «الجنة», «الميزان»,
  «البرزخ», «المهدي» are gated by collocations; verified false positives are
  excluded by id.
- The seerah section fills itself as seerah passages are harvested; today it
  is thin.
- All AI-authored records stay `status.review: draft` until a human reads
  them; nothing is live until the founder deploys.
