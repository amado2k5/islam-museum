# Library lane: Tarikh Madinat Dimashq — Ibn Asakir

**Book id:** `tarikh-dimashq` (category `tareekh`). Worker: Claude Code (OCR-harvest worker F), run `ocr-harvest-2026-11-04`.

## Items
| item | what it is | md5 | used |
|---|---|---|---|
| elshandawily9365 | Tarikh Madinat Dimashq, ed. Umar ibn Gharama al-Amrawi, Dar al-Fikr 1415/1995, **vol. 5** (men named Ahmad), 502 pp., good OCR | fd6c3b86… | `source/tarikh-dimashq-amrawi-v5`; printed = PDF (checked pp. 252, 327, 335) |
| 3_20250209_20250209_2145 | Abd al-Qadir Badran's arrangement (Rawdat al-Sham press), vol. 3 | db5faf4f… | not used — this is Badran's *Tahdhib* (a separate work), lower OCR quality; left for a later lane |
| 4_20250209_20250209 | same, vol. 4 | ff5181ef… | not used (as above) |
| 6_20250209_20250209 | same series, vol. 6 (title page reads «تهذيب») | e6eec950… | not used (as above) |

## Done
- **Batch 1** (vol. 5 pp. 1–3, 252–335, entry 136 Ahmad ibn Hanbal, read in part: lineage pp. 252–255, praise and Mihna pp. 310–316, death and funeral pp. 326–335): `source/tarikh-dimashq-amrawi-v5`; `work/tarikh-dimashq` (enriched: title, edition, vol. 5, method); `person/ahmad-ibn-hanbal` (Ibn Asakir section); `event/death-of-ahmad-ibn-hanbal` (new: Rabi' I vs Rabi' II 241 kept as debated; funeral estimates 800k–1.7M all attributed; the "20,000 converts" report kept with al-Dhahabi's verdict quoted from the editor's note).

## Flags
- Dream reports (manamat) in the entry are given as attributed transmitted reports, not as fact.
- OCR reads the narrator of the Euphrates counsel as «أبا جعفر الأنصاري»; kept as printed.

## Next
Ibn Hanbal entry pp. 256–309 (his learning, piety, wealth refusal, sayings), other long entries: Ahmad ibn Muhammad ibn Isa ibn al-Jarrah (p. 434), Ahmad ibn Mahbub al-Ramli (p. 488), Ahmad ibn al-Salt al-Himmani (p. 373).

## Second pass (worker F, run 2, ocr-harvest-2026-11-04)
Batch E (vol. 5, printed = PDF): new trios `person/abu-masud-al-razi` (Ahmad ibn al-Furat, entry 76, pp. 150–157; death 258 vs 268 kept as debated; Ibn Khirash's charge and Ibn Adi's rebuttal as perspectives), `person/ibn-jawsa` (Ahmad ibn Umayr, entry 65, pp. 109–117; the "Ibn Thawban" dispute, praise vs criticism as perspectives; d. 27 Jumada I 320); Tarikh Dimashq section appended to `person/ibn-abi-asim` (entry 62, pp. 104–107; Zahiri, judge of Isfahan 13 years, d. Rabi' II 287).
- Next candidates (long entries, by line span): Abu Sa'id al-Kharraz (entry 70, p. 129; note two duplicate records exist: `person/abu-said-al-kharraz` and `person/ahmad-ibn-isa-al-khazzaz` — flag for merge), al-Khatib al-Baghdadi (entry 16, p. 31), al-Sanawbari the poet (entry 130, p. 239; no record), Ibn al-A'rabi Abu Sa'id (entry 144, p. 353; `person/ibn-al-arabi-ahmad` thin), Ahmad ibn al-Salt al-Himmani (entry 158, p. 373), Ibn al-Nahhas (entry 202, p. 434), Ahmad ibn Mahbub (entry 258, p. 488).

## Third pass (worker F, run 3, ocr-harvest-2026-11-04)
- Entry 70 (pp. 129–143) read in full: `person/abu-said-al-kharraz` rewritten as a full trio (teachers and students, al-Sulami/al-Khatib/al-Qushayri/al-Junayd on him, sayings, austerity reports, wonders as attributed reports, death 277 vs 286 with al-Khatib's judgement). **Duplicate merged**: `person/ahmad-ibn-isa-al-khazzaz` (Devin, same man, same nasab and death variant) is now an `aliases` entry of `person/abu-said-al-kharraz`; its data and three prose files were removed after their one fact (the trade name, Mawsu'a) was carried over. No links pointed to it.
- Qur'an verses quoted in the entry (al-Rahman 60, al-Munafiqun 7, Ibrahim 24) are linked as passages, not typed.
- Entry 144 (pp. 353–357): `person/ibn-al-arabi-ahmad` rewritten from a two-line Mawsu'a card to a full trio (teachers in Damascus/Ramla/Egypt/Baghdad, students, shaykh of the Haram, al-Sulami/al-Khalili on him, sayings, death 340 vs 341, editor's Siyar note).
- Entry 158 (pp. 373–378): new trio `person/ahmad-ibn-al-salt-al-himmani` (the Baghdadi forger; fabricated Abu Hanifa manaqib per al-Khatib; death Shawwal 308 vs Muharram 302, al-Khatib's judgement).
- Entry 130 (al-Sanawbari, pp. 239–246) checked: almost entirely verse, no dates; not written (poems are not paraphrasable without reproducing them).
- Entry 202 (pp. 434–438): new trio `person/abu-al-abbas-ibn-al-nahhas-al-misri` (travels per al-Hakim, Nishapur 321–376, the al-Saffar notebooks affair, al-Hakim's final judgement). Next: Ahmad ibn Mahbub al-Ramli (entry 258, p. 488), Ibn al-Najjad (entry 204, p. 439), al-Khatib al-Baghdadi (entry 16, p. 31).
