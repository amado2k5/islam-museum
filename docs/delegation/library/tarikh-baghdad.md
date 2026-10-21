# Lane: lib-tarikh-baghdad — Tarikh Baghdad (al-Khatib al-Baghdadi)

## Source
- Book: تاريخ بغداد أو مدينة السلام — Abu Bakr Ahmad ibn Ali al-Khatib al-Baghdadi (392–463 AH). Alphabetical biographical dictionary of Baghdad's transmitters, scholars and rulers; entries numbered, ~28,000 biographies in the full work.
- Scans (raw, outside git): `books/tareekh/tarikh-baghdad/` under the harvest root —
  - `AAlexandrina-223771` / `AAlexandrina-027967`: **vol. 9** (duplicate scans), باب السين through mid-باب العين, entries ~4500–5500, printed pp. 1–494.
  - `AAlexandrina-065329`: **vol. 11**, باب الهـ through باب ياء (Ha, Waw, Ya), printed to ~p. 500.
  - `AAlexandrina-106247`: fourth scan; coverage to be confirmed (likely vol. 10 — باب عين).
- OCR: Apple Vision, noisy but usable; heading lines carry the printed entry number (`- ٧٤٦١ -` = entry 7461). Printed-page markers appear as `- NNN -` inside the text.
- Cite as `{cite:tarikh-baghdad-khatib j.N p.M}` — j = printed volume, p = printed page. Source record `source/tarikh-baghdad-khatib` currently describes vol. 9; extend its summary as more volumes are mined.

## Method
Same as other library lanes: locate the entry heading in the OCR, read the biography, dedupe against `data/person`, write person records + Arabic prose, cite volume and page. Do not bulk-copy isnads — take the teachers/students lists, grades attributed to named critics, dates, and the anecdotes. Unknown targets go to `data/_stubs.d/tarikh-baghdad.yaml` (created when first needed).

## Progress
- Setup: scanned all four scan dirs, confirmed vols. 9 and 11 usable; dedupe survey of ~25 prominent names (الأعمش, شعبة, الثوري, ابن عيينة, ابن المبارك — already exist; القطان, يزيد بن هارون, يزيد بن زريع, يوسف بن أسباط, علي بن المديني, عيسى بن يونس, غندر, شريك, عفان, القواريري, وهب بن جرير, حجاج بن منهل, بشر بن الحارث — several missing).
- Batch TB-1 (vols. 9 + 11, rijal masters): 6 new persons — yahya-ibn-said-al-qattan (j.11 p.140, the twenty years with Shu'ba), yazid-ibn-harun (j.11 p.338, b. 118 Wasit), hushaym-ibn-bashir (j.11 p.86, Wasit→Baghdad), yaqub-ibn-ishaq-al-sikut (j.11 p.274, grammarian of Islah al-Mantiq, tutor to al-Mutawakkil's sons), sharik-ibn-abdallah (j.9 p.280, Kufan qadi b. Bukhara 95), ubayd-allah-ibn-umar-al-qawariri (j.9 p.320-321, Ahmad wrote hadiths from him in prison; the 27-prayer dream).
- Noted but entries not located in vol-9 OCR this pass (headings damaged or in vol. 10): ali-ibn-al-madini, isaa-ibn-yunus, afan-ibn-muslim, yazid-ibn-zuray, yusuf-ibn-asbat, wahb-ibn-jarir, hajjaj-ibn-minhal — retry via vol. 10 scan `AAlexandrina-106247` and the printed index.
