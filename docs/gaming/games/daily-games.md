# The four daily games: Five Questions, Kalima, The Thread of Time, The Lantern

_26 November 2026. Release status of each: **prototype**. Code: `gaming/games/five-questions/`, `gaming/games/kalima/`, `gaming/games/thread/`, `gaming/games/lantern/`, sharing `gaming/packages/daily/`. Built at the founder's request of 26 November 2026 ("one daily trivia and one like wordle and a third something you can come up with … maybe hangman too … allow these games to work on mobile, on any device and make their interface very simple")._

## What they are

| Game | What the player does | Per day |
|---|---|---|
| **Five Questions** (`five-questions`) | Answers five multiple-choice questions: the year of an event, the place of an event, a person's birthplace, which of four people was born first, and a second event year. After each answer the page says what the museum records and links to the record. | 5 questions, the same for everyone |
| **Kalima** (`kalima`) | Guesses a place name of 4 to 6 letters in six tries. Each letter is marked ✓ (right place), ↔ (in the word, elsewhere) or · (not in the word), by sign and by colour, and read out in words. | 1 word per language |
| **The Thread of Time** (`thread`) | Puts five dated events in the order they happened with ▲ and ▼ buttons, then sees each one's year (CE and AH) and record. | 5 events, the same for everyone |
| **The Lantern** (`lantern`) | Reveals a place's or person's name letter by letter before seven drops of oil run out. | 1 name per language |

Each also has a practice round ("play another") that is never saved. Kalima is the game "like Wordle" the founder asked for; its name (Arabic for "word"), its signs, its colours, its keyboard and its page are the museum's own, and it does not use Wordle's name, look or word list. The Lantern is the hangman the founder suggested, without the gallows: a lamp losing oil.

## Why The Thread of Time is the third game

The founder left the third game to the agent. The museum's graph is strongest in **dated events**: 3,187 events have a start date known to the year and one place. A timeline game uses exactly that, teaches the shape of the history (what came before what), needs no art, and plays the same with a finger, a mouse, a keyboard or a screen reader because ordering is done with buttons, not dragging. A "connections" grouping game was the other candidate; it was set aside because the graph's grouping fields (themes, periods, regions) are uneven across records, so a fair four-by-four grid could not be guaranteed every day.

## Where the content comes from

`gaming/packages/daily/tools/build-pack.ts` (run with `npm --prefix gaming run daily:pack`) reads `data/place`, `data/event` and `data/person` and writes a pinned pack in `gaming/packages/daily/data/`. Nothing is fetched at run time and nothing is added, rewritten or guessed. The rules, and what each one left out, are in `report.v1.json` beside the pack:

- every record used carries at least one source on the record;
- a record that names a blocked organisation anywhere in its file (the museum's own check, `scripts/lib/extremism.ts`), or carries a `sensitivity` field, is left out whole; event kinds the games do not ask about (massacre, persecution, expulsion, revelation, schism, assassination, execution, attack) are left out;
- a summary sentence is shown only if it types no honorific, no Qur'an bracket and no note about the museum's own editorial state;
- an event whose name holds a number in any language is left out, because the number gives the year away;
- dates must be known to the year or better; years are CE with the Hijri year when the record gives it;
- the word games use only well-known names (by the record's importance mark and the number of records that point to it), and a name in French, Spanish, Turkish or Indonesian is used only when another of those languages writes it the same way, because a name found in one translation alone has proved to be a mistranslation (for example Turkish labels that were verbs). Arabic words are Arabic letters, not transliteration.

Built from commit `8a730f05e42` on 26 November 2026: 1,190 events, 1,500 people and 1,030 places; Kalima has 147 to 331 words a language and The Lantern 247 to 815 names. Day `n` uses entry `n` of a fixed shuffle of each list, so no word comes back before the list is used up.

## What is checked

`gaming/packages/daily/test/daily.gtest.ts`: for 400 days from 26 November 2026, every day's quiz, word, name and thread exists in every language, is the same on a second call (deterministic by date), can be solved, and names only museum records that exist and carry a source; no shown text has an honorific, a Qur'an bracket or a blocked name. `tools/release-smoke.ts` opens each game behind the host's real headers in Arabic and English and plays one move.

## What is not done

- The strings and the record names in Urdu, French, Spanish, Turkish and Indonesian are machine work no native speaker has read.
- No human has played them on a phone; the phone checks are an emulated 375×812 screen in a browser.
- The label files are 0.4 to 0.8 MB a language before compression. Five Questions, the Thread and the Lantern still load them whole; Kalima, released on 28 November 2026, loads only its own words' names (17 to 53 KB).
