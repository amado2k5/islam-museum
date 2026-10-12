## CATEGORY: tafsir and Qur'an sciences

What to extract, by class:
- `source`, `work` (the tafsir: author, genre `tafsir`, method (bi'l-ma'thur, bi'l-ra'y, fiqhi, lughawi…), the sources the author names in his introduction, language, structure).
- `person`: the mufassir (full name, dates, school, teachers, students, travels, other works as `work` stubs) and the early mufassirun the introduction names (Ibn Abbas, Mujahid, Qatada, al-Hasan, Ibn Zayd… reuse existing person entities).
- `concept`: tafsir terms and Qur'anic sciences defined in the introduction or in a work like al-Itqan/al-Burhan (nuzul, asbab al-nuzul, naskh, makki/madani, qira'at, ahruf, i'jaz, muhkam/mutashabih, israiliyyat): one entity each, defined from the book's own definitions, attributed, with disagreement among Sunni scholars in `perspectives`.
- Passage edges: for ayat that existing events, practices or concepts cite, add `passage/quran-S-A` edges with a note giving this mufassir's explanation in one short attributed sentence (≤ 40 words if quoted), the page, and the chain to the early authorities as the book prints it. Never type or quote the ayah. Where the mufassirun differ on the occasion of revelation or the meaning of a term, record each reported view with its narrator and `status: debated`.
- `event`: occasion-of-revelation reports (asbab al-nuzul) attach to the event as sources with the narrator named; do not create events from tafsir alone.
Batching: introduction and biography first (one batch), then themed passes (the suras that carry the museum's events, e.g. Anfal/Tawba for the battles, Ahzab for the Trench, Fath for Hudaybiyya, Nur for the slander), never the whole text.
Quality checks: every ayah reference resolves to an existing `passage/quran-*`; no ayah text anywhere; each explanation is attributed to the mufassir and page.
