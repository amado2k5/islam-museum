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
   «صوفي» → cite the entry.
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

## 6. Decision procedure

Apply signals in order. If none resolve → `unknown`/`unverified`.
**Never infer tradition from name, family, ethnicity, or birthplace**
(faith.yaml rule). Conflicting attestations → `contested`/debated
reading, both sides cited, no verdict. Every accepted classification
needs a citable attestation (rijal entry, work provenance, or isnad
usage); a judge recommendation alone yields `label`, never `accept`.
