# Claims brief: one episode of «سيرة رسول الله» 2026 (lane `ahmed-el-sayed`, wave 1)

You turn one lecture transcript into a compact claims file. You write facts about what the speaker says, in the museum's own words. You never copy his sentences.

## Inputs (all outside git)
- Transcript: `~/islam-museum-harvest/ahmed-el-sayed/transcripts/epNN.txt`: one line per segment, `[HH:MM:SS] text`. It is speech recognition of a Saudi lecturer: expect wrong words, merged names and repeated lines. Read all of it, in chunks (the Read tool with offset and limit).
- Ledger row for the episode: `harvest/ahmed-el-sayed/ledger.tsv` (title, upload date).
- Graph index: `~/islam-museum-harvest/ahmed-el-sayed/graph-index.tsv`: `id<TAB>label_ar<TAB>label_en`, one line per existing museum entity. Use `grep -i` on it to find the id of a person, event, place, concept, practice or object he treats. **Use only ids that appear in that file.** If nothing matches, leave the topic without an id and say so in `unmatched`.

## Output
Write one JSON file, `~/islam-museum-harvest/ahmed-el-sayed/claims/epNN.json`, exactly this shape:

```json
{
  "episode": 1,
  "title_ar": "...",
  "summary_en": "two or three sentences: what the episode covers",
  "sections": [
    {
      "topic_en": "short heading",
      "topic_ar": "short heading in Arabic",
      "time": "HH:MM:SS",
      "claims_en": ["He says that ...", "He holds that ..."],
      "claims_ar": ["يذكر أن ...", "يرى أن ..."],
      "entities": ["event/hijra", "person/abu-talib"],
      "stated_sources": ["Sirat Ibn Hisham", "Sahih al-Bukhari"],
      "flags": []
    }
  ],
  "unmatched": ["topic or name with no graph entity"],
  "excluded": [{"what": "...", "why": "recitation | garbled | contemporary preaching | blocked content | other"}]
}
```

Aim for 8 to 16 sections for a 60 to 100 minute episode, in the order the topics are treated. `time` is where the section starts (internal only; citations never carry a time).

## Rules (they are the museum's, not suggestions)
1. **Attribute everything.** Every claim begins with who says it: "He says", "He holds", "He relates", "He counts". Dates, numbers, names and stories are his statements; do not correct or convert them. If you doubt a reading because of the recognition, write `asr_uncertain` in `flags` or leave the detail out. A claim nobody could confirm by listening is better dropped than guessed.
2. **Own words.** No sentence of the transcript is copied. A quotation is never needed here; do not use quotation marks.
3. **No scripture or hadith wording.** Never type Qur'an text, and never write a hadith's wording from the transcript. Write what the speaker says about the verse or report (its topic, the story, his explanation), and name it in `stated_sources` if he does. Recitations go to `excluded` ("recitation").
4. **No honorifics typed** (not the Arabic or English phrases that follow a prophet's or Companion's name). Write names plainly.
5. **Facts, not preaching.** His exhortations, prayers for the listeners and comments on today's events are not museum facts: list them in `excluded` ("contemporary preaching") in one line, not in `claims_*`. The historical and scholarly content of the episode is what you extract.
6. **Stated sources.** When he says which book he is following (Ibn Ishaq, Ibn Hisham, al-Tabari, al-Bukhari and so on), put the work in `stated_sources` for that section. This records what the episode says it relies on; it is not a citation of that work.
7. **Flags** (`flags`): `contested` when scholars differ and he takes a side; `polemical` when he attacks a group or person; `needs_source` for a figure or claim he gives without a basis; `asr_uncertain` as above.
8. **Content safety.** Before writing, read `docs/agents/content-safety.md`. If the episode names an organisation, media outlet or person the file blocks, do not write a claim about it: put one line in `excluded` with why `blocked content`, and tell the lead agent in your final message.
9. **Arabic text** in `claims_ar` and `topic_ar`: a parenthetical that contains Arabic script is written `⁦(…)⁩` (U+2066 before the opening parenthesis, U+2069 after the closing one); better, avoid parentheses.
10. Write the file, then reply in two or three lines: sections written, entities matched, entities unmatched, anything excluded for safety. Do not paste the file in your reply.
