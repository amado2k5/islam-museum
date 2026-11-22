# Harvest queue — books named in "Hudhud's Story Time"

Checked 21 November 2026 against `data/source/` (11,418 source records), `data/work/` and, after a correction the same day, `docs/library/harvest-register.yaml` (searched by Arabic and Latin title: only T1-13 is held; the other 14 have no entry, so nothing is downloaded for them. The Tier 2 titles were searched by Arabic title only). No existing "wanted books" queue was found: `docs/library/harvest-register.yaml` records items already downloaded or harvested, and `docs/library/enrichment/` queues gaps in records. This file is the queue for the books below and was created for this task; a lane that harvests one of them records it in `harvest-register.yaml` (the usual rule) and marks it here.

Scope of the check: 36 items from the 40 final scripts (26 named by title, 10 described but not titled). Check and queue only: no source record, no content and no entity record was created or edited. Matching was by Arabic and English title, transliteration variants, author and alternate titles; a match is the same work, not the same author. "Source record" means a file in `data/source/`; a `work` record (the book as an entity) is noted where one exists, but a work record alone is not a harvested source.

Status markers: [ ] queued · [~] in a lane's hands · [x] harvested and cited.

## Result

| | Count |
|---|---|
| Already a source record | 19 (Tier 1: 16; Tier 2: 3) |
| Downloaded and OCR'd but no source record yet (found in `harvest-register.yaml` after the first pass) | 1 (T1-13, volume 2 only) |
| Of those, exist but the author's or subject's record does not cite them (EXISTS–UNCITED) | 3 (items T1-11, T1-20, T1-25) |
| NOT FOUND, queued below | 14 (Tier 1: 8; Tier 2: 6) |
| Founder decision, not queued | 2 (T1-12 Aristotle's Metaphysics; T2-10 Ibn Rushd's commentaries) |

## Table (one row per item)

"Cited?" = cited by the author's person record, the work record or the episode subject's record. Where a book has several editions, the best-matching record is named and the others follow.

### Tier 1

| # | Book | Author | Source record in repo | Cited? | Action |
|---|---|---|---|---|---|
| 1 | Al-Rihla | Ibn Battuta | `source/rihla-ibn-battuta-1958` (also `-khayriyya-1904`, `-ihya-al-ulum-1987`, `rihla-ibn-battuta`) | yes (person, work, places) | none |
| 2 | Al-Kitab al-Mukhtasar fi Hisab al-Jabr | al-Khwarizmi | `source/khwarizmi-jabr-rosen-1831` (Arabic text and Rosen's translation; also `khwarizmi-jabr-cairo-1939`) | yes | none |
| 3 | Kalila wa Dimna | Ibn al-Muqaffa' | NOT FOUND (`work/kalila-wa-dimna` exists, cites only Ibn al-Nadim and the Oxford Dictionary) | n/a | QUEUE |
| 4 | Kitab al-Manazir | Ibn al-Haytham | `source/manazir-sabra-1983` (Sabra edition; vol. 1, Books I–III only) | yes | none; later volumes optional |
| 5 | Nuzhat al-Mushtaq | al-Idrisi | `source/nuzhat-al-mushtaq-2002` (also `idrisi-nuzhat-1592`) | yes | none |
| 6 | Al-Qanun fi al-Tibb | Ibn Sina | `source/canon-ibn-sina-print-v1` (also `-v2`, `-v3`, `canon-ibn-sina-print`) | yes | none |
| 7 | Al-Tasrif | al-Zahrawi | `source/zahrawi-spink-lewis-1973` (surgery book only), `zahrawi-leclerc-chirurgie-1861`, `tdv-tasrif-zehravi` | yes | none; whole-work edition optional |
| 8 | Kitab al-Hayawan | al-Jahiz | `source/hayawan-jahiz-ilmiyya-2003-v1` … `-v4` | yes | none |
| 9 | Rihlat Ibn Jubayr | Ibn Jubayr | `source/rihla-ibn-jubayr-1907` (no `work` record) | yes | none |
| 10 | Alf Layla wa Layla | traditional | NOT FOUND (`work/alf-layla-wa-layla` exists, cites Ibn al-Nadim, al-Mas'udi, EI2) | n/a | QUEUE (authorship traditional) |
| 11 | Kitab al-'Ayn | al-Khalil ibn Ahmad | `source/kitab-al-ayn-makhzumi` (also `arabica-kitab-al-ayn`, `dia-kitabul-ayn`) | **EXISTS–UNCITED**: cited by the work record and concepts, not by `person/al-khalil-ibn-ahmad-al-farahidi` | cite it |
| 12 | Metaphysics | Aristotle | NOT FOUND | n/a | **founder decision** |
| 13 | Jami' al-Tawarikh | Rashid al-Din | No source record, but **downloaded and OCR'd** (register id `jami-al-tawarikh`, acquired 2026-11-21, `ocr_done`, 652 pages: volume 2 only, Hulagu to Kaykhatu). `work/jami-al-tawarikh` cites EI2 | n/a | create the source record; queue volume 1 (Mongol tribes, Genghis, Ogedei to Mongke) only if wanted |
| 14 | Kitab al-Jabr (Khayyam's algebra) | Umar Khayyam | `source/khayyam-woepcke-1851` (Woepcke, *L'algèbre d'Omar Alkhayyami*; no `work` record for it — `work/khayyam-euclid-commentary` is a different book) | yes (person) | none |
| 15 | Al-Rubaiyat | attributed to Khayyam | NOT FOUND | n/a | QUEUE |
| 16 | Nowruznameh | Umar Khayyam | NOT FOUND | n/a | QUEUE |
| 17 | Al-Muwatta | Malik ibn Anas | `source/muwatta-maruf-1997` (also `muwatta-malik`) | yes | none |
| 18 | Bidayat al-Mujtahid | Ibn Rushd | `source/bidaya-hallaq-v1` (also `bidaya-bakri-bayt-al-afkar`, `bidaya-ibn-wanis-v4`) | yes | none |
| 19 | Al-Kulliyat (Colliget) | Ibn Rushd | NOT FOUND (no work record either) | n/a | QUEUE |
| 20 | Kitab al-Hawi | al-Razi | `source/hawi-razi-dar-kutub-ilmiyya` (also `isaw-nlm-hawi-1094`, `wellcome-hawi-or123`) | **EXISTS–UNCITED**: cited by the work record and one invention, not by `person/al-razi-abu-bakr` | cite it |
| 21 | Al-Shukuk 'ala Jalinus | al-Razi | NOT FOUND | n/a | QUEUE |
| 22 | Kitab al-Mansuri | al-Razi | NOT FOUND (`qanun-masudi-jundi-v1` is al-Biruni's Qanun, a different book) | n/a | QUEUE |
| 23 | Al-Muqaddimah | Ibn Khaldun | `source/muqaddima-ibn-khaldun` | yes | none |
| 24 | Kitab al-'Ibar | Ibn Khaldun | `source/tarikh-ibn-khaldun-ibar` (also `tarikh-ibn-khaldun-shahada-1981`) | yes (183 persons, 133 events) | none |
| 25 | Ihya' 'Ulum al-Din | al-Ghazali | `source/ihya-shamela-dar-al-marifa` (also `ihya-dar-al-marifa-1982-v3`, `ihya-tabana-v4`, `ihya-kitab-al-shab-pts13-16`) | **EXISTS–UNCITED**: cited by the work record and concepts, not by `person/al-ghazali-abu-hamid` | cite it |
| 26 | Al-Munqidh min al-Dalal | al-Ghazali | NOT FOUND (`work/al-munqidh-min-al-dalal` cites only al-A'lam) | n/a | QUEUE |

### Tier 2 (identifications are hypotheses, checked below)

| # | Work | Author | Source record in repo | Cited? | Action |
|---|---|---|---|---|---|
| 1 | Kitab fi Ma'rifat al-Hiyal al-Handasiyya | al-Jazari | `source/jazari-hill-1974` (Hill's translation, *The Book of Knowledge of Ingenious Mechanical Devices*); also museum folios | yes (person, 12 inventions) | none; the Arabic text is a possible later addition |
| 2 | Al-Shamil fi al-Sina'a al-Tibbiyya | Ibn al-Nafis | NOT FOUND (`work/al-shamil-fi-al-sinaa-al-tibbiyya` cites only al-A'lam) | n/a | QUEUE |
| 3 | Sharh Tashrih al-Qanun | Ibn al-Nafis | `source/sharh-tashrih-qanun-print` (also `wellcome-wms-or-51`, `west-2008-ibn-al-nafis`) | yes | none |
| 4 | Kitab al-Jam' wa-l-Tafriq bi-Hisab al-Hind | al-Khwarizmi | NOT FOUND. `work/kitab-al-hisab-al-khwarizmi` exists but cites `khwarizmi-jabr-cairo-1939`, which is the algebra, not the arithmetic; the title is a hypothesis and may be the same book as the work record | n/a | QUEUE (identify first) |
| 5 | Kitab al-Hind (Tahqiq ma li-l-Hind) | al-Biruni | NOT FOUND (`work/kitab-al-hind` cites only al-A'lam) | n/a | QUEUE |
| 6 | Al-Qanun al-Mas'udi | al-Biruni | `source/qanun-masudi-jundi-v1` | yes | none |
| 7 | Risala fi Istikhraj al-Mu'amma | al-Kindi | NOT FOUND (no work record) | n/a | QUEUE |
| 8 | Kitab al-Hiyal | Banu Musa | NOT FOUND (`work/ibtal-al-hiyal` is a legal-stratagem book, unrelated) | n/a | QUEUE |
| 9 | Aims of Aristotle's Metaphysics (Fi aghrad ma ba'd al-tabi'a) | al-Farabi | NOT FOUND (no work record) | n/a | QUEUE (see the Aristotle note below) |
| 10 | Ibn Rushd's Aristotle commentaries | Ibn Rushd | none as a body | n/a | **founder decision** |

## Founder decision (not queued)

1. **Aristotle's *Metaphysics* (T1-12).** A Greek work by a non-Muslim author that the tradition engaged with. `docs/sources-policy.md` makes every source readable (classical texts, translations) and `docs/scope.md` welcomes non-Muslim perspectives, and the graph already holds `person/galen` and `work/tahrir-al-majisti`. But no policy sentence says the museum harvests a non-Muslim-authored work as a source for its own sake. Question: may Greek works such as the *Metaphysics* be harvested as sources, or only the Arabic-tradition commentaries and treatises that engage them? Queue entry T2-9 (al-Farabi's treatise on its aims) is an Arabic-tradition work and is queued either way.
2. **Ibn Rushd's Aristotle commentaries as a body (T2-10).** A corpus, not one book. None of the commentaries (short, middle, long) exists as a source record. The only Ibn Rushd source records are `source/bidaya-hallaq-v1`, `bidaya-bakri-bayt-al-afkar` and `bidaya-ibn-wanis-v4` (the *Bidaya*, a legal work) and `source/britannica-averroes`; `work/tahafut-al-tahafut` exists with no source record. Question: which commentaries, if any, to queue (for example the Middle Commentary on the *Metaphysics* and the *Tahafut*)?

## Queue

Centuries are approximate (hijri century in brackets). "Cite from" lists the entity records that should cite the book once it is a source record.

- [ ] **T1-3 · Kalila wa Dimna** · كليلة ودمنة · Ibn al-Muqaffa' (Arabic version of the Pahlavi, from the Sanskrit Panchatantra) · 8th c. CE (2nd c. AH) · EN S1 E8 · cite from `work/kalila-wa-dimna`, `person/ibn-al-muqaffa`
- [ ] **T1-10 · Alf Layla wa Layla (The Thousand and One Nights)** · ألف ليلة وليلة · traditional / anonymous, grown over several centuries · 8th–16th c. CE (2nd–10th c. AH) · AR S1 E9 (Sindbad) · cite from `work/alf-layla-wa-layla`
- [~] **T1-13 · Jami' al-Tawarikh (Compendium of Chronicles)** · جامع التواريخ · Rashid al-Din Hamadani (Persian original; the scan is an Arabic edition) · 14th c. CE (8th c. AH) · EN S2 E9 · cite from `work/jami-al-tawarikh`, `person/rashid-al-din-hamadani`. **Already in `harvest-register.yaml` as `jami-al-tawarikh`: downloaded and OCR'd 2026-11-21, volume 2 parts 1 and 2 only. Not a harvest task: needs a source record and mining. Volume 1 is not held.**
- [ ] **T1-15 · Al-Rubaiyat (Quatrains)** · الرباعيات · attributed to Umar Khayyam (attribution of individual quatrains is disputed; record it as attributed) · 11th–12th c. CE (5th–6th c. AH) · AR S2 E3 · cite from `person/umar-khayyam`
- [ ] **T1-16 · Nowruznameh** · نوروزنامه · Umar Khayyam (attribution to be verified) · 11th–12th c. CE (5th–6th c. AH) · AR S2 E3 · cite from `person/umar-khayyam`
- [ ] **T1-19 · Al-Kulliyat fi al-Tibb (Colliget)** · الكليات في الطب · Ibn Rushd · 12th c. CE (6th c. AH) · AR S2 E4 · cite from `person/ibn-rushd`
- [ ] **T1-21 · Al-Shukuk 'ala Jalinus (Doubts about Galen)** · الشكوك على جالينوس · Abu Bakr al-Razi · 9th–10th c. CE (3rd–4th c. AH) · AR S2 E5 · cite from `person/al-razi-abu-bakr`
- [ ] **T1-22 · Kitab al-Mansuri (Al-Tibb al-Mansuri)** · المنصوري في الطب · Abu Bakr al-Razi · 9th–10th c. CE (3rd–4th c. AH) · AR S2 E5 · cite from `person/al-razi-abu-bakr`
- [ ] **T1-26 · Al-Munqidh min al-Dalal** · المنقذ من الضلال · Abu Hamid al-Ghazali · 11th–12th c. CE (5th–6th c. AH) · AR S2 E10 · cite from `work/al-munqidh-min-al-dalal`, `person/al-ghazali-abu-hamid`
- [ ] **T2-2 · Al-Shamil fi al-Sina'a al-Tibbiyya** · الشامل في الصناعة الطبية · Ibn al-Nafis · 13th c. CE (7th c. AH) · EN S1 E6 · cite from `work/al-shamil-fi-al-sinaa-al-tibbiyya`, `person/ibn-al-nafis`
- [ ] **T2-4 · Kitab al-Jam' wa-l-Tafriq bi-Hisab al-Hind** · كتاب الجمع والتفريق بحساب الهند · al-Khwarizmi (identification to verify against `work/kitab-al-hisab-al-khwarizmi`) · 9th c. CE (3rd c. AH) · EN S1 E7 · cite from `work/kitab-al-hisab-al-khwarizmi`, `person/al-khwarizmi`
- [ ] **T2-5 · Tahqiq ma li-l-Hind min Maqula (Kitab al-Hind)** · تحقيق ما للهند من مقولة · al-Biruni · 11th c. CE (5th c. AH) · AR S1 E5 and EN S2 E5 · cite from `work/kitab-al-hind`, `person/al-biruni-muhammad-ibn-ahmad`
- [ ] **T2-7 · Risala fi Istikhraj al-Mu'amma (Manuscript on Deciphering Cryptographic Messages)** · رسالة في استخراج المعمى · al-Kindi · 9th c. CE (3rd c. AH) · EN S2 E1 · cite from `person/al-kindi`
- [ ] **T2-8 · Kitab al-Hiyal (Book of Ingenious Devices)** · كتاب الحيل · Banu Musa (Muhammad, Ahmad and al-Hasan) · 9th c. CE (3rd c. AH) · EN S2 E2 · cite from `group/banu-musa`
- [ ] **T2-9 · Fi aghrad ma ba'd al-tabi'a (On the Aims of the Metaphysics)** · مقالة في أغراض ما بعد الطبيعة · al-Farabi (identification to verify) · 10th c. CE (4th c. AH) · EN S2 E7 · cite from `person/al-farabi`

Download state of the other items: the 19 existing source records are mostly downloaded and OCR'd (Ihya and Muqaddimah OCR partial; Ibn Jubayr's Rihla OCR partial, mining not started); per `harvest-register.yaml`, not checked on the microSD itself.

Held for the founder (see above, not queued): T1-12 Aristotle's *Metaphysics*; T2-10 Ibn Rushd's commentaries.

Not queued but noted (cheap fixes for a later task, no harvest needed): T1-11, T1-20 and T1-25 exist as source records that the author's record does not cite.

## Download log (21 November 2026, founder instruction: download the 14 to the microSD)

Source for all: archive.org items (the same route as the Jami' al-Tawarikh scan). Files are in `raw/library/<id>/` on the microSD, claimed and closed in `WORK-REGISTRY.md`, and entered in `harvest-register.yaml` (segment `books:hudhud-queue`) as `downloaded`. Sizes matched archive.org's listing; sha256 and page counts for the full set are pending.

Downloaded (12): T1-3 Kalila wa Dimna (Azzam ed.); T1-10 Alf Layla (Cairo edition, 4 vols); T1-15 Rubaiyat (Badr Tawfiq's Arabic with FitzGerald's English; a translation, not the Persian quatrains); T1-16 Nowruznameh (**only a 2008 Arabic study of the book, not the text itself**); T1-19 Kulliyat; T1-21 Shukuk; T1-22 Mansuri; T1-26 Munqidh (has a text layer); T2-2 Shamil (Shamela database, digital text); T2-5 Kitab al-Hind (1957 edition); T2-8 Kitab al-Hiyal; T2-9 al-Farabi's Rasa'il (**unverified** that it holds the treatise on the aims of the Metaphysics).

Not downloaded (2): T2-4 Jam' wa-l-Tafriq and T2-7 Risala fi Istikhraj al-Mu'amma: no scan found on archive.org by Arabic or English title. al-Khwarizmi's Jam' wa-l-Tafriq is not known to survive in Arabic, and al-Kindi's treatise needs the Mrayati–Meer–Tayyan edition or a library source.

Scanned PDFs among these still need OCR (all except Munqidh and Shamil). Nothing has been OCRed or mined.

### Second pass, in the Mac Chrome browser (21 November 2026)

- T2-7 al-Kindi: archive.org item `origins_of_ancient_arab_criptography_and_criptanalysis` (Mrayati–Meer–Tayyan, 2 PDFs, 886 pages) downloaded as `kindi-istikhraj-muamma`. Scanned; needs OCR; the volume holding the Risala is not yet checked.
- T2-4 al-Khwarizmi: no Arabic *Jam' wa-l-Tafriq* found. The Latin *Algoritmi de numero Indorum* (Boncompagni 1857) was downloaded instead as `algoritmi-de-numero-indorum-khwarizmi`, but the scan is only 24 pages, so it is partial; the identification with the queued title is still a hypothesis.
- Still open: a text of the Nowruznameh itself (T1-16), a verified al-Farabi treatise on the aims of the Metaphysics (T2-9), and the Persian quatrains (T1-15).
