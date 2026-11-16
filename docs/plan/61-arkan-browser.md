# 61 · Pillars of Islam, Pillars of Faith, Branches of Faith and Traits of the Believer Browser

_متصفح أركان الإسلام وأركان الإيمان وشُعَب الإيمان وخِصَال المؤمن. Requested by the founder on 16 November 2026 and built the same day. Acceptance spec: [`docs/engineering/53-arkan-browser-requirements.md`](../engineering/53-arkan-browser-requirements.md). Lane `arkan` (`docs/agents/lanes.md`). Figures below were counted on 16 November 2026 from the working tree by `npx tsx scripts/arkan-audit.ts`; the page prints its own counts at build time._

## 1. What it is

One front door over the one graph for four themes the founder named together:

| Topic id | Theme | What belongs |
|---|---|---|
| `islam` | أركان الإسلام — the pillars of Islam | texts that name the pillars, count the five together (the testimony, the prayer, the zakat, the fast of Ramadan, the pilgrimage) or define Islam by them |
| `iman` | أركان الإيمان — the pillars of faith | texts that name the pillars of faith, count the six together (God, His angels, His books, His messengers, the Last Day, the decree) or answer the question about faith |
| `shuab` | شعب الإيمان — the branches of faith | texts that name the branches, count an act, word or state as part of faith, deny the completeness of faith until a trait is present, or tie an act to belief in God and the Last Day |
| `khisal` | خصال المؤمن — the traits of the believer | texts that describe the believer or the Muslim, give a likeness for them or count their traits |

It has no data of its own (`docs/site/browsers.md` §1): every row is an ordinary museum record.

## 2. How records enter

1. **Qur'an: a reviewed table.** The Qur'an does not use the later terms «أركان» or «شعب الإيمان», so the lexicon is not run over it. `ARKAN_QURAN` in `scripts/arkan.ts` names the verses by reference under each theme; the text shown is the frozen Tanzil text of the passage record. The table is the browser's own selection and can grow by a reviewed edit.
2. **Every other passage: a guarded lexicon** in `scripts/arkan.ts`, run at build time over `text_search`/`text` only. Strong signals admit a passage; weak ones (a single article of faith, faith increasing and decreasing, the weight of a grain of faith) count only beside a strong one or two at a time. A footnote that cites the title of al-Bayhaqi's book («في شعب الإيمان», «الجامع لشعب الإيمان») is not a mention.
3. **Curated records** carry `arkan-browser` and one or more of `arkan-islam`, `arkan-iman`, `arkan-shuab`, `arkan-khisal`.
4. **Future books enter automatically**: detection is a function of the compiled graph, so a passage of a book harvested later appears the day its record lands, in the corpus section its work's genre gives it.

## 3. What was harvested for it (16 November 2026)

- `scripts/harvest-arkan-hadithapi.ts`: 186 reports from the seven Arabic hadith-api editions (the two Sahihs, the four Sunan, the Muwatta), matn excerpts of at most 55 words, gated by the detector's strong signals; a report that quotes six consecutive words of a verse is skipped.
- `scripts/harvest-arkan-ocr.ts`: 1,039 excerpts of at most 40 words from the OCR'd books on the harvest drive — the books of faith and creed (al-Bayhaqi's Shu'ab al-Iman vols. 2 and 10, Ibn Taymiyya's Kitab al-Iman, the Tahawiyya commentary, Ibn Batta's Ibana, al-Lalaka'i, al-Khallal, 'Abd Allah ibn Ahmad), the hadith commentaries and compilations (Jami' al-'Ulum wa-l-Hikam, the two Fath al-Bari, al-Nawawi on Muslim, Riyad al-Salihin, al-Targhib, al-Adab al-Mufrad, Mishkat, Ibn Hibban, the two Musannafs), the seerah books, the books on the Companions, the Successors and the early ascetics (Hilya, Sifat al-Safwa, Hayat al-Sahaba, Usd al-Ghaba, al-Isaba, al-Isti'ab, the two Kitab al-Zuhd, Ibn Sa'd), the Ihya', histories, and fiqh and usul. The text is machine-read and not corrected, and each record says so. A window is skipped when it quotes a verse, carries an honorific formula, or reads as garbled.
- No PDF, OCR text or page image entered git (`docs/sources-policy.md`).

## 4. Curated records

New, with full prose in Arabic, English and Urdu:

- `concept/arkan-al-iman` — the six pillars of faith (Ibn Abi al-'Izz on the Tahawi creed; al-Bukhari 50; al-'Ayni).
- `concept/shuab-al-iman` — the branches of faith: the hadith and its versions, the meaning of the words, who counted the branches, and al-'Ayni's list of seventy-seven in three groups, restated in his order ('Umdat al-Qari 1:212–213; al-Nawawi on Muslim).
- `concept/khisal-al-mumin` — the traits of the believer in the Qur'an and the hadith.
- `source/shuab-iman-dki-zaghlul-v2` — the scanned volume 2 of Shu'ab al-Iman.

Tagged in place (22 records): the five-pillars record and each pillar (`concept/shahada`, `practice/salah`, `practice/zakat`, `practice/sawm-ramadan`, `practice/hajj`); `concept/iman` and each article (`tawhid`, `malaika`, `kutub-al-munzala`, `nubuwwa`, `yawm-al-qiyama`, `qadar`); `work/shuab-al-iman`, `work/kitab-al-iman-ibn-taymiyya`, `concept/haya`; `concept/mumin`, `taqwa`, `sabr`, `shukr`, `tawakkul`, `amana`.

## 5. Pages, API, search

- `/[lang]/arkan/` — the home: lede, method, the signature view "the four doors" (`sig/ArkanFour.astro`), the five sections (curated first), filter, paged lists (`/arkan/all/<section>/[n]/`).
- `/[lang]/arkan/topic/<islam|iman|shuab|khisal>/[n]/` — one theme, answers first.
- `/api/v1/arkan.json` — every record with `section`, `topics`, `signals`.
- Landing card and Explore menu entry (group `conduct`), in the three languages.

## 6. Counts on 16 November 2026

| Section | Records |
|---|---|
| Qur'an (reviewed table) | 124 |
| Sunnah | 795 |
| Seerah | 28 |
| Other books | 472 |
| Curated | 25 |
| **Total** | **1,444** |

| Theme (a record can carry more than one) | Records |
|---|---|
| Pillars of Islam | 299 |
| Pillars of faith | 215 |
| Branches of faith | 684 |
| Traits of the believer | 484 |

Of the passages, 186 hadith reports and 1,039 book excerpts were harvested for this browser on 16 November 2026; the rest were already in the graph. The Sunnah section includes the excerpts from hadith commentaries and compilations, whose works carry the genre `hadith`.

## 7. What is not done, stated plainly

- The OCR excerpts are machine-read and uncorrected; some carry misread letters.
- The Qur'an table is a selection, not a claim of completeness; the verses of each single act of worship are in the Worship and Adhkar Browser.
- Al-Bayhaqi's own list of the branches is not given: volume 1 of Shu'ab al-Iman is not among the scans. The list shown is al-'Ayni's.
- The Urdu and English prose is machine translation and has not been read by a person.
- Books with no work or source record yet (Siyar A'lam al-Nubala' among them) were skipped; one line in `BOOKS` adds each when its records exist.

## 8. Next

More hadith as the Hadith Library lands; al-Halimi's Minhaj and volume 1 of the Shu'ab when acquired (look them up in `docs/library/harvest-register.yaml` first); a record per branch where the sources allow; a person's read of the translations.
