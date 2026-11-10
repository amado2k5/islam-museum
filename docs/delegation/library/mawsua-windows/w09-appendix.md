# Mawsu'a fiqhiyya window w09 appendix (scan pp.14943-14969): jurist biographies

- **Owner:** mining agent w09-appendix (Claude Haiku 5.5), brief `/private/tmp/claude-501/scratch/mawsua-brief.md`
- **Source:** `source/fiqh-mawsua-kuwaitiyya-noor-v3`, the "تراجم الفقهاء" appendix (vol. 38 end). Class `person`.
- **Rule applied:** a headword is a candidate only where the scan gives a biography paragraph. Bare name headers followed by "تقدمت ترجمته" are cross-references and produce no entity. Existing entries in data/person are listed, not extended.
- **Branch:** `mawsua-w09-appx-<n>` per batch.

## Batch 1 (pp.14946-14953), 8 persons created

| id | page | note |
|---|---|---|
| person/ibn-maan | 14948 | header dates read as death 576, birth 497 |
| person/abu-basra-al-ghifari | 14949 | companion |
| person/abu-bakr-ibn-sabiq-al-bayri | 14949 | Maliki; no dates (garbled in scan) |
| person/abu-al-jawza | 14950 | death 83 AH |
| person/abu-salih-al-samman | 14950-14951 | death 101 AH per header |
| person/abu-al-tahir-al-tanukhi | 14951 | alive 526 AH per scan |
| person/aws-ibn-hudhayfa | 14953 | companion; death 59 AH, first figure unclear |
| person/ahmad-ibn-ibrahim-al-saruji | 14957-14958 | Hanafi; dates garbled, left out |

## Existing person, not extended (listed for the reconciliation pass)

| id | page | scan name |
|---|---|---|
| person/ibn-al-zaghuni | 14946 | ابن الزاغوني (علي بن عبيد الله) |
| person/abu-barza-al-aslami | 14949 | أبو برزة الأسلمي |
| person/al-fariqi | 14951 | أبو علي الفارقي |
| person/al-samawal-al-maghribi | 14958 | السموال بن يحيى |
| person/al-ardabili-yusuf-ibn-ibrahim | 14959 | صاحب الأنوار (يوسف بن إبراهيم الأردبيلي) |
| person/abu-bakr-muhammad-ibn-abd-allah-al-sayrafi | 14960 | أبو بكر الصيرفي |
| person/najm-al-din-al-tufi | 14960-14961 | الطوفي |
| person/abu-hashim-al-mughira-ibn-miqsam | 14966-14967 | مغيرة بن مقسم |
| person/nawfal-ibn-muawiya | 14967-14968 | نوفل بن معاوية |

## Cross-reference or name-only lines skipped

Pages 14944-14969 headers with "تقدمت ترجمته" or no biography (examples: ابن حجر, ابن كثير, الشافعي, أبو حنيفة, مالك, عطاء بن أبي رباح, زفر, سعيد بن جبير, and the other bare headers). Also skipped: the index header on p.14943 and p.14945, the page-end line on p.14969.

## Batch 2 (pp.14957-14968), 8 persons created

| id | page | note |
|---|---|---|
| person/zurayq-ibn-hayyan | 14957 | death 100 AH |
| person/isa-ibn-umar-al-hamdani | 14962-14963 | Kufan reader; death 156 AH |
| person/ubayd-ibn-jabr | 14961 | death 74 AH |
| person/amr-ibn-shurahbil | 14962 | death 63 AH |
| person/ahmad-ibn-muhammad-al-qamuli | 14964 | Shafi'i; died 727, born 653 per header |
| person/muhammad-ibn-hamid-al-bukhari | 14966 | Hanafi; header dates garbled, left out |
| person/abdallah-ibn-sharaf-al-marzuqi | 14966 | Shafi'i; died before 700 AH or shortly after |
| person/yahya-ibn-kathir-al-anbari | 14968 | muhaddith; header dates garbled, left out |

Existing, not extended (batch 2):

| id | page | scan name |
|---|---|---|
| person/fayruz-al-daylami | 14963 | فيروز الديلمي (found by the validator as a homonym; the new file was removed) |

## Remaining

- The window is complete (all bio paragraphs from pp.14946-14968 handled). Page 14969 is the end-of-volume line.
- Scan-name headers that are only names, or carry "تقدمت ترجمته" / "تقدمت في ...", produce no entity.

Scan dates for several entries are garbled; those are left out rather than guessed.
