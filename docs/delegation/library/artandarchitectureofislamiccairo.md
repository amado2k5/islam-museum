# Library progress: extra-architecture/artandarchitectureofislamiccairo

Richard Yeomans, *The Art and Architecture of Islamic Cairo*, Garnet Publishing, Reading, 2006 (1st ed., ISBN 978-1-85964-154-5). Source record: `source/yeomans-islamic-cairo-2006`. Lane: OCR-harvest worker H (Claude Code, claude-opus-5-5), run `ocr-harvest-2026-11-04`.

## Items and editions
- `Art/` and `Art And Architecture of Islamic Cairo/`: byte-identical text layers (md5 327d64a6…, 286 PDF pages). Harvested once.
- Born-digital text layer, clean except the dust-jacket pages (PDF pp. 2, 285-286), which are garbled OCR.
- **Page offset:** printed page = PDF page − 9 (checked PDF 21→12, 61→52, 151→142). All cites give the printed page; front matter is cited as `imprint` / `contents`, the jacket author note as `back flap`.

## Sections covered
- Preface (pp. 1-3), contents.
- Chapter 1, Umayyad and Tulunid architecture (pp. 14-41): read in full.

## Entities (batch 1)
Created: source/yeomans-islamic-cairo-2006, work/art-and-architecture-of-islamic-cairo, person/richard-yeomans, building/nilometer-of-rawda, place/al-qatai, concept/samarran-stucco-styles.
Enriched (new Yeomans sections ar+en+ur): building/masjid-ibn-tulun (prose rewritten around the existing Khitat sentences), building/masjid-amr-fustat, person/ahmad-ibn-tulun, person/khumarawayh, polity/tulunid-dynasty, person/lajin, concept/mihrab, concept/minbar, concept/arabesque.

## Doubts and notes
- Yeomans dates the Ibn Tulun mosque "between 876 and 896" (p. 32); the record's `built` field keeps 879 (Wikidata). Noted in prose, not resolved.
- Yeomans places al-Qata'i "north-west of Fustat" (p. 29); direction left out of the prose.
- Back-flap biography of Yeomans read from garbled OCR; only the plain facts (Warwick, Institute of Education, painter) are used.

## Excluded
- Nothing excluded in chapter 1. The author's general judgements in the introduction about the conquests and Arab culture (pp. 4, 15) were not used as museum statements.

## Next
Chapter 2 (Fatimid architecture, pp. 42-69): al-Azhar, al-Hakim mosque, Bab al-Futuh/al-Nasr/Zuwayla, al-Aqmar, Juyushi, al-Salih Tala'i, Sayyida Ruqayya; then chapters 4, 5, 7 (Ayyubid, Bahri and Burji Mamluk buildings, many thin or empty in data/building).

## Batch 2: chapter 2, Fatimid architecture (pp. 42-69, read in full)
Created: building/mosque-of-al-hakim, building/bab-al-nasr, building/bab-al-futuh, building/bab-zuwayla, building/mosque-of-al-salih-talai, concept/keel-arch; prose created for building/mausoleum-sayyida-ruqayya-cairo (record existed without prose).
Enriched (Yeomans sections ar+en+ur): building/al-aqmar-mosque, building/al-azhar, building/masjid-al-husayn-cairo, building/dar-al-hikma-cairo, person/badr-al-jamali, person/talai-ibn-ruzzik, person/al-hakim-bi-amr-allah (labelled perspectives block: Sunni historians as summarised by Yeomans, then Yeomans's academic view; `sensitivity: contested`), concept/manara.
Notes: Yeomans's account of Isma'ili doctrine (pp. 43-44) and of al-Nu'man's teaching at al-Azhar (pp. 51-53) not yet used; mashhads of Atika/al-Ja'fari, Umm Kulthum and Yahya al-Shabih (pp. 65-66) and the al-Azhar madrasas of Taybars, Aqbugha and Gawhar al-Qanaqba'i (p. 56) are leads for a later batch.

## Batch 3: chapter 4, Ayyubid architecture (pp. 100-123, read in full)
Created: building/citadel-of-cairo, building/bir-yusuf-cairo, building/mausoleum-of-the-abbasid-caliphs-cairo, building/rawda-citadel, concept/iwan, place/al-qarafa.
Enriched (ar+en+ur sections): building/mausoleum-of-imam-al-shafii, building/al-madrasa-al-salihiyya-cairo, building/shajarat-al-durr-tomb, person/salah-al-din-yusuf-ibn-ayyub, person/al-malik-al-kamil, person/al-malik-al-salih-ayyub, person/shajar-al-durr, concept/madrasa.
Fix: source/yeomans-islamic-cairo-2006 now cites itself (validator rule for own-research sources).
Doubts: Bir Yusuf and the Abbasid mausoleum dated with `status: debated` (Yeomans gives attribution/date as probable only). Rawda citadel's present state not given by the book, so no `status_now`.

## Batches 4-5: chapter 5, Bahri Mamluk architecture (pp. 124-163, read in full)
Created: building/mosque-of-al-zahir-baybars, building/madrasa-of-al-nasir-muhammad (possible overlap with building/al-madrasa-al-nasiriyya-cairo, Wikidata Q25463062, not verifiable here; left untouched), concept/khanqah.
First prose for existing empty records: building/al-nasir-muhammad-mosque, building/ablaq-palace-cairo, building/tomb-of-salar-and-sangar, person/sanjar-al-jawli, building/amir-al-maridani-mosque, building/aqsunqur-mosque-cairo.
Enriched: building/madrasa-of-al-zahir-baibars, person/baybars, building/qalawun-complex, person/qalawun, person/al-nasir-muhammad-ibn-qalawun, building/khanqah-of-baybars-al-gashankir, person/baybars-al-jashankir, building/masjid-sultan-hasan, person/ibn-khaldun (tour/halls.yaml stop sources updated to match).
Doubts: Sanjar al-Jawli died 1344 per Yeomans vs 1345 on the earlier Wikidata card (noted in summary). Ablaq Palace: text says remains destroyed, Citadel map still marks "remains", so no status_now.
Leads: mausolea of Sarghitmish, al-Sultaniyya and Yunus al-Dawadar (p. 162) and the madrasas of Shaykhu and al-Yusufi (p. 163) are only named.

## Batch 6: chapter 7 part 1, Burji Mamluks (pp. 198-217)
Created: building/funerary-complex-of-sultan-inal, place/eastern-cemetery-cairo, concept/sabil-kuttab, concept/qaa.
First prose for: building/complex-sultan-barquq, building/farag-ibn-barquq-complex, building/emir-qurqumas-complex, building/khanqah-mausoleum-of-sultan-barsbay (Eastern Cemetery), building/al-ashraf-barsbay-complex (assigned to the al-Mu'izz street madrasa, 1425, with a note in the prose).
Enriched: building/al-muayyad-mosque-cairo, person/barquq, person/faraj-ibn-barquq, person/al-muayyad-shaykh, person/barsbay, concept/waqf.
Leads: tomb of Ganibak al-Ashrafi (1432), Bashtak palace (1334-9), mosque of Aslam al-Silahdar (1344-5) only treated inside other records.
