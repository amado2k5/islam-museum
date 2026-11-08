# Tradition taxonomy and identification rubric

Reference for classifying a person's religious tradition (`person.faith[]` /
`person.traditions[]`, enums in `schema/enums/traditions.yaml` and
`schema/enums/faith.yaml`). Compiled 8 November 2026 from classical rijal
methodology, modern sect studies, and the museum's own enum. Used by the
decision engine's tradition-attestation rule and the judge rubric.

Golden-set rule applies: existing recorded traditions are authoritative;
this rubric classifies only un-attested or contested cases.

## 1. The two great traditions

### Sunni — ahl al-sunna wa al-jama'a (~85–90% of Muslims)

Accepts the Rashidun caliphate sequence (Abu Bakr → Umar → Uthman → Ali),
the four-madhhab framework, and usul: Quran + Sunnah + ijma' + qiyas.

Sub-traditions already in the enum:

- Fiqh schools: `sunni-hanafi` (Abu Hanifa; Central Asia, South Asia,
  Ottoman lands), `sunni-maliki` (Malik; North and West Africa),
  `sunni-shafii` (al-Shafi'i; Egypt, SE Asia, East Africa),
  `sunni-hanbali` (Ahmad ibn Hanbal; Arabia, Levant).
- Aqeedah schools: `sunni-ashari`, `sunni-maturidi`, and the Athari/Salafi
  current (no separate enum value — recorded as `sunni` plus label).

Sunni movements (NOT separate traditions — same `sunni` value; movement
identity goes in labels/prose, not the tradition field): Deobandi,
Barelvi, Ahl-i Hadith, Salafi/Wahhabi/Neo-Salafi, Tablighi Jamaat,
Muslim Brotherhood/Ikhwan, Hizb ut-Tahrir, modernist (Muhammad Abduh
school), Sanusiyya.

### Shia — shi'at Ali (~10–15%)

Three living branches:

- `shia-twelver` (Ithna'ashari): twelve infallible imams, occultation of the
  Mahdi; centers Qom, Najaf; Iran, Iraq, Lebanon. Signals: hawza
  education, al-Kafi / Man la yahduruhu corpus, distinct prayer
  (turbah prostration, silent qunut variations), critical evaluation of
  post-Rashidun companions.
- `shia-zaydi` (Fiver): imamate only for a righteous rebel who rises with
  the sword; Yemen (Sadaa). Signals: distinct fiqh readings, Yemeni
  geography, Zaydi imamate texts.
- `shia-ismaili`: living imams (Aga Khan); esoteric ta'wil; Khoja,
  Badakhshan, Syrian communities. Signals: ginan devotional corpus,
  da'wa structure.

## 2. Other living denominations

- `ibadi`: Kharijite descendant moderated by Ibn Ibadh/al-Rustaq; neither
  Sunni nor Shia. Centers: Oman, Mzab (Algeria), Jerba (Tunisia), East
  Africa. Signals: own fiqh school, open-handed audible prayer, distinct
  early-caliphate evaluation.
- Mu'tazila (historical peak 8th–10th c.; modern revivals): atomic
  accidents, created Quran, al-manzila bayn al-manzilatayn; Wasil ibn Ata
  lineage. Enum value: `other` unless a dedicated value is added.
- Sufi orders (turuq): Qadiriyya, Naqshbandiyya, Chishtiyya,
  Suhrawardiyya, Tijaniyya, Muridiyya, Mevleviyya, Bektashiyya —
  cross-cutting, can be Sunni or Shia; `sufi` enum value exists.
- `quranist` (ahl al-quran): Quran-only; rejects binding hadith authority.
- `ahmadiyya`: Qadiani and Lahori branches; Lahore/Qadian centers;
  contested — most Sunni authorities do not count them as Muslim.
- Nondenominational: "just Muslim"; no school label — `other` or
  `unknown`.

## 3. Groups mainstream authorities do NOT count as Muslim

Druze (Ismaili offshoot, self-excluded), Alawites/Nusayris (ghulat
offshoot, contested), Alevis/Alevi-Bektashi (contested), Yazidi,
Yarsani, Ahl-e Haqq, Ali-Illahi (syncretic ghulat), Bahai (post-Islamic
revelation claim). Enum: `other` or the non-Muslim faith values in
`schema/enums/faith.yaml` where applicable.

## 4. Extinct historical groups (classical texts only)

Karramiyya, Murji'a, Qadariyya/Jabriyya (positions more than lasting
identities), Jahmiyya, Najjariyya, Batiniyya/Qarmati (Ismaili
predecessors), Nukkariyya, Bayhasiyya. Relevant when classifying
medieval figures mentioned in our books.

## 5. Identification signals — ordered evidence test

1. **Self-designation** — «أنا حنفي», «سني», «أنا من أهل السنة» in the
   person's own words or a reliable biography → that tradition, cited.
2. **Explicit rijal label** — a biographical entry (isaba, siyar, tabaqat,
   usd al-ghaba, tahdhib) stating «حنفي» / «شافعي» / «شيعي» / «معتزلي» /
   «صوفي» → cite the entry. The rijal defect-tag vocabulary to match:
   shī'ī (mild Shiism, often Zaydi-leaning), rāfiḍī (hardline/Twelver),
   qadarī (denier of predestination), murji' (deferrer of judgment on
   sinners), nāṣibī (anti-Ali), bathinī/waqifī (Ismaili/stopped-short
   tags in Twelver rijal). For fiqh-madhhab specifically, inclusion in a
   single-school tabaqat is definitive attribution: Hanafi —
   al-Jawahir al-Mudiyya (al-Qurashi); Maliki — al-Dibaj al-Mudhahhab
   (Ibn Farhun); Shafi'i — Tabaqat al-Shafi'iyya al-Kubra (al-Subki);
   Hanbali — Tabaqat al-Hanabila (Ibn Abi Ya'la).
3. **Corpus membership** — graded or transmitted ONLY in Shia rijal
   (Kashshi, Najashi, Tusi's al-Rijal) or only in a Shia work → strong
   Shia signal; graded *thiqa* inside Sunni isnad discussions → Sunni
   signal (never proof alone).
4. **Works' school** — the fiqh/creed books they wrote or commented on
   reveal the framework they taught in.
5. **Teacher chain** — the shaykh's affiliation propagates; necessary,
   not sufficient.
6. **Geography/era** — context only, never decisive (Kufa ≠ Shia,
   Baghdad ≠ Sunni).
7. **Contested markers** — «يُرمى بالتشيع», «مخالف لأهل السنة», takfir
   accusations → contested; apply the doubt rule: record as debated,
   never flatten to a verdict.

### Practice-level tells (supporting, not decisive)

- Prayer differences: raf' al-yadayn (Shafi'i/Hanbali) vs sadl
  (Hanafi/Maliki); audible vs silent qunut; turbah prostration.
- Hadith corpus: al-Kafi/Man la yahduruhu (Twelver) vs Bukhari/Muslim.
- Companion evaluation: treatment of Mu'awiya, Yazid, and Ahl al-Bayt is
  the sharpest aqeedah tell in Sunni–Shia disputes.
- Honorific usage in their own texts (classical convention differs;
  our prose never types them anyway).


## 7. External authority files and datasets (researched 8 Nov 2026)

- **islamlab/islamic-scholars** (HuggingFace): 2,420 scholar rows,
  structured `madhhab` field populated for 480 (~20%); Sunni-only,
  authors died ≤1350 AH, fiqh-school labels only — no Shia/Zaydi/
  Ismaili/Ibadi values. Rows are NOT deduplicated (e.g. Malik b. Anas
  appears 3×, label on one row). License CC BY-NC-SA 4.0 — usable as a
  corroborating signal alongside an independent sourced attestation,
  never republished as data and never a sole or quiet second source.
- **Wikidata P9929 (madhhab)**: the only structured field covering
  Ja'fari/Zaydi/Ismaili/Ibadi/Zahiri; ~900 statements — sparse
  supplement for the traditions islamlab cannot label.
- **muslimscholars.info**: web-only, self-admitted ~5% error, no
  download — pointer source at most.
- **R3GENESI5/Itqan** (GitHub): the largest open computational
  Quran–Hadith concordance and narrator database — 115,735
  machine-readable rijal profiles scraped from 22 classical rijal
  dictionaries, carrying the historical theological tags critics
  applied. Primary candidate for bulk tradition attestation.
- **Tarajm.com / Ketabonline**: the most structured biographical
  database found — queryable Madhhab (fiqh) AND Aqidah (theology)
  tags per scholar; verify access/licensing before use.
- Shamela author cards (Bitakat al-Mu'allif) and classical
  dictionaries (Wafayat, Bughya, Shadharat) are rich but unstructured
  prose — usable via the harvest pipeline, not as a lookup table.
- Shamela, OpenITI, Waqfeya, Ketabonline, Islamweb: madhhab appears
  only as prose inside entries or book-category labels; OpenITI author
  YAML has no madhhab field. Wafayat/Bughya/Shadharat: searchable prose,
  no structured field.
- **No model classifies a person's sect** — all existing Islamic
  fine-tunes and stylometry systems classify texts, not persons.

## 8. What the classical canon actually says (Muse research)

- No rijal work has a dedicated «bab» assigning madhhabs. Attribution
  lives in: (a) one-word descriptors inside entries (rafidi, shi'i,
  mu'tazili, murji'i…); (b) inclusion in a single-school tabaqat
  volume; (c) Ibn al-Salah's Muqaddima Type 23 — sect membership alone
  never disqualified a narrator (Bukhari narrated the Khariji Imran b.
  Hittan), strikingly close to our own rule.
- Canonical rijal corpus with entry counts: Ibn Abi Hatim's Jarh,
  Ibn Hibban, al-Khatib's Kifaya, Dhahabi's Mizan (>11,000 entries;
  his introduction expressly excludes the followed imams of furu'),
  Ibn Hajar's Tahdhib (12,455) / Lisan (5,991) / Taqrib (12-rank
  scale), Suyuti's Tadrib, Sakhawi's Daw' al-Lami'. Modern anchors:
  Dickinson 2001, Lucas 2004, Brown 2007/2009, Melchert 1997, Hallaq
  2005 — the schools were consolidated by followers, so eponym-era
  madhhab labels are often retrospective projections (attribution
  caution for pre-classical figures).
- **No published fingerprint PROTOCOL exists** for identifying a
  scholar's school from their writings — the closest is Al-Yahya's
  text-level stylometry (CICLing 2018, SVM 97.5% on fiqh-school
  texts). The doctrinal fingerprints themselves are real scholarly
  knowledge (supporting signals only, never decisive): Hanafi —
  zahir al-riwaya, «al-asl» phrasing, al-Dabusi's Ta'sis al-Nazar
  maxims; Maliki — 'amal ahl al-Madinah, «kull» rule phrasing, al-Qarafi's
  al-Furuq; Shafi'i — mantuq/mafhum division, formal qiyas; Hanbali/
  Athari — athar predominance, «bila kayf», rejection of ta'wil;
  Ash'ari/Maturidi — heavy ta'wil of divine attributes. A person-level
  attribution protocol built on these would be first-of-kind.
- Database bias caveat: IslamWeb applies an orthodox Salafi lens
  (adds aqidah "corrections" to Ash'ari scholars like al-Nawawi and
  Ibn Hajar); Shamela flags Muslim Brotherhood figures with bid'ah
  warnings. Never treat either as neutral attestation.

## 9. Sub-sect discriminators (each tradition's own rijal corpus)

- Twelver: al-Kashshi, al-Najashi's Fihrist (1,240 entries recording
  which Imams each man narrated from), al-Tusi's Rijal arranged by
  each Imam's tabaqa; isnads running through the twelve imams.
  Sunni rijal terminology distinguishes: «shī'ī» = moderate, often
  Zaydi-leaning Kufan who accepted Abu Bakr and Umar; «rāfiḍī» =
  Twelver who rejected the first three caliphs. A Zaydi commonly
  appears in Sunni isnads; a Twelver is usually rejected outright.
  Twelver rijal anathematize Ismailis as «waqifī» (stopped at an earlier
  imam) or «batinī».
- Zaydi: Ibrahim b. al-Qasim's Tabaqat al-Zaydiyya al-Kubra; isnads
  through Zaydi imams' books (Majmu' Zayd, al-Hadi's Ahkam, the
  Amali); qadi appointments under a Zaydi imam.
- Ismaili: office, not content — al-Qadi al-Nu'man was Qadi al-Qudat
  and Da'i al-Du'at; his Da'a'im was endorsed by al-Mu'izz as the
  Fatimid code although its contents borrow from everyone. Content
  alone misclassifies him.

## 10. Boundary-community positions (attributed, contested preserved)

- Alawites: Ibn Taymiyya and Ottoman fatwas (not Muslim) vs al-Husayni
  1936, al-Shirazi 1972, Musa al-Sadr July 1973 (Muslims, brothers of
  the Shia). Twelver scholars historically rejected them as ghulat.
- Ahmadiyya: Pakistan's Second Amendment 1974 names Qadiani and Lahori
  groups as non-Muslim in law; Ordinance XX (1984) criminalises either
  posing as Muslim; the 1914 split (Friedmann) is prophethood vs
  mujaddid-only.
- Baha'is: MWL Fiqh Council unanimous "out of Islam"; OIC Fiqh Academy
  Resolution 34 (9/4), 1988.
- Druze: Sunni and Shi'i consensus outside Islam (esoteric doctrines,
  distinct scripture); Ibn Taymiyya's kufr claim vs a conditional
  Shi'i position; the often-cited "1934 Azhar fatwa" could not be
  verified at primary level — treat as unverified.
- Baha'is: 1925 Al-Azhar fatwa codified them as an independent
  religion; MWL Fiqh Council unanimous "out of Islam"; OIC Fiqh
  Academy Resolution 34 (9/4), 1988.
- Yazidis: academic consensus is an independent religion, not a sect;
  classical sources file it as heresy.
- Alevis: Diyanet treats them as Muslims while refusing cemevi
  recognition; no single Diyanet fatwa text found.

## 6. Decision procedure

Apply signals in order. If none resolve → `unknown`/`unverified`.
**Never infer tradition from name, family, ethnicity, or birthplace**
(faith.yaml rule). Conflicting attestations → `contested`/debated
reading, both sides cited, no verdict. Every accepted classification
needs a citable attestation (rijal entry, work provenance, or isnad
usage); a judge recommendation alone yields `label`, never `accept`.
