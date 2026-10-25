# Lane `omar-abdelkafy`: the recorded lectures of Sheikh Omar Abdelkafy

_Opened 25 October 2026 on the founder's instruction. Binding with `AGENTS.md`, `docs/ai-change-gates.md`, `docs/sources-policy.md`, `docs/agents/publication-standard.md` and the method in [`../audio-video-harvest.md`](../audio-video-harvest.md)._

## Scope

The founder's words: Omar Abdelkafy is a trusted resource; anything he says in his recordings may be used, and the new facts are lodged with a citation to the website they come from. The lane mines his recorded lectures (audio and video) on the Assabile archive, `https://www.assabile.com/omar-abdelkafy`, which lists **25 series and about 620 lessons**:

- video (7 series): Ajaeb Al Kulub (29 lessons), Alwaad Alhaq (44), Modakirate Iblis (30), Min Kunuz Al Sunnah (30), Mawkib Al-Nour (29), Ahl Al Hikma (27), Al Naba' Al Safi (24);
- audio (18 series): Tariq Al Noor (30), Silsilat Qissa Wa Ebra (22), Bustan El Amal (30), Wa Nafsun Ma Sawaha (29), Al Manjeyat (27), Al Dar Al Akhera (33), Albuyout Alamena (47), Silsilat Ebadu Al Rahman (28), Tafsir Al Quran Al Qareem (10), Al Fawzu Al Moubeen (14), Muktatafat Mena Al Seera (24), Sharh Saheeh Al Bukhare (60), Sharh Al Hekam Al Ataeya (17), Al Dinu Al Qayem (13), Aadau Al Islam (4), Al Hoquq (5), Nafahat Ramadaneya 1436 h (6), Sharh Ketab Al Fawaed (10).

Outputs: the speaker's `person/omar-abdelkafy` record enriched from the recordings; topic entities the lectures explain (practices, concepts, prophets' stories, hadith collections and commentaries, the works he explains), each written in the museum's own words and cited to recording anchors; and the archive's source entity `source/assabile-omar-abdelkafy`.

## Order of work

1. **Pilot (done in this session, 25 Oct 2026): `aadau-al-islam`**, 4 episodes, about 3 hours. Download, large-v3 transcription, claims and first prose. Its outputs decide the method's final form.
2. The shorter series next: `al-hoquq` (5), `aadau-al-islam` remainder, `nafahat-ramadaneya-1436-h` (6), `sharh-ketab-al-fawaed` (10), `tafsir-al-quran-al-qareem` (10), `al-fawzu-al-moubeen` (14).
3. The long series after: `sharh-saheeh-al-bukhare` (60), `albuyout-alamena` (47), `alwaad-alhaq` (44), then the rest.
4. The biography: the archive's own biography and the English and Arabic Wikipedia articles are reconciled, with the conflicts recorded (birth year 1952 against 1951).

Batches: at most 25 entities per commit; one series or one topic per batch; progress in `docs/delegation/omar-abdelkafy-progress.md`.

## Rules specific to this lane

- The method, the rights and the checks are in `audio-video-harvest.md`. The transcripts, MP3s and claims tables stay in `~/islam-museum-harvest`; nothing from them enters git except the museum's own cited prose and the `data/` facts.
- A line from a transcript is used from the working engine's output, as the founder authorised on 25 Oct 2026, with the engine and window recorded. Unclear lines are dropped, and single-occurrence names or numbers that look garbled are marked `needs_source`.
- The Qur'an and hadith texts he recites are never typed: references only (`[[passage/quran-<sura>-<aya>|label]]`), with his explanation cited.
- Contested matters (creed and madhhab differences, other faiths, politics, historical disputes) get `perspectives` with the Sunni position first; his own positions are attributed to him with the anchor.
- The Sunni frame is the default; the speaker's school is recorded only as `faith` from two independent sources (the modern-figures rule). A recording in which he states his own school is one attestation, recorded as his statement.
- Platform figures (subscribers, views) are dated and never presented as museum facts.

## Overlap

Shares the speaker's `person` record with the `modern-figures` lane (which created it in batch 4 of that lane). Edits to that record are additive: existing sources and facts stay. The sira and library lanes may cite his explanations of a book or of a sira episode as another source; they add it as an extra cited claim.
