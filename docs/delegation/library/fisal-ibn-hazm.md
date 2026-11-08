# Library lane: al-Fisal fi al-Milal wa-l-Ahwa' wa-l-Nihal (Ibn Hazm) — OCR-harvest worker L

**Run:** ocr-harvest-2026-11-04, Claude Code (OCR-harvest worker L), claude-opus-5-5.

## Items (all md5-distinct)

| item | what | used |
|---|---|---|
| 20211016_20211016_0215 (1930 pp.) | kotobarabia.com digital text, full work | `source/fisal-ibn-hazm-kotobarabia` (page = PDF) — main |
| AAlexandrina-169158 (736 pp.) | vol. 1, Maktabat al-Salam al-Alamiyya, with al-Shahrastani in the margin; life of Ibn Hazm by Abd al-Rahman Khalifa | `source/fisal-ibn-hazm-salam-v1` (printed = PDF − 4) |
| AAlexandrina-148432 (642 pp.) | vol. 3, al-Matba'a al-Adabiyya, 1st printing 1320 AH | not used |
| AAlexandrina-148391, 150032 | thin OCR | not used |

## Batch 1

Pages: kotobarabia 1, 5-10, 183-187, 594-597; Salam PDF 1, 5, 7-11.

- Enriched: `work/al-fisal-ibn-hazm` (draft card -> full ar/en/ur; `sensitivity: polemical`), `person/ibn-hazm` (section from the edition's life of the author).
- Heresiography: Ibn Hazm's ranking of non-Muslim groups, his five Jewish sects and his five Muslim sects are given strictly as his own classification and terminology (his placing of al-Ash'ari among the Murji'a is attributed to him). His list of groups he declares outside Islam (p. 596) is not reproduced.

## Next

The theological chapters (attributes, vision, faith); the "scandals" chapters only with each group's own sources alongside; enrich group/samaritans with his account.

## Done (wave 21)

- (8 Nov 2026, wave 21, run `lib-wave-21-fisal-ibn-hazm-1`) Enriched 4 existing group records from the kotobarabia text (`source/fisal-ibn-hazm-kotobarabia`, page = PDF), all polemical material attributed to Ibn Hazm («يذكر ابن حزم...», «عند ابن حزم...»): `group/samaritans` (his five Jewish sects, Samaritans first — Nablus vs Bayt al-Maqdis, a different Torah, rejection of prophecy after Moses/Joshua and of resurrection, PDF pp. 184–185), `group/murjia` and `group/mutazila` (his five-fold division of the Muslims into Sunna/Mu'tazila/Murji'a/Shi'a/Khawarij and his nearest–farthest ordering of each sect, PDF pp. 595–597), `group/jahmiyya` (his report of Jahm ibn Safwan's argument that eternal knowledge other than God is eternal association and God-is-knowledge is ilhad, and his reply that it contradicts the Qur'an; Jahmiyya and Ash'aris share the objection, PDF pp. 622–624). Skipped: `group/khawarij`, `group/azariqa`, `group/ibadiyya`, `group/imamiyya` — the same p. 595–598 passage covers them and can feed a second batch; the theological chapters (attributes, vision, faith) remain for later.
