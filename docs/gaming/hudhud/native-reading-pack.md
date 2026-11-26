# Hudhud native-reading pack

_26 November 2026. Documents only; sent to nobody. This pack tells a native reader exactly what to read and how to report problems. It is not a request for free labour and it does not imply machine translation is acceptable as final text._

## What is being read

Hudhud currently has machine-drafted strings in seven languages. Read only the language you know natively or fluently. There are two families of files:

- game/interface and golden-scene strings: `gaming/games/hudhud/i18n/<lang>.json`
- Atlas/world/subject names: `gaming/games/hudhud/i18n-atlas/<lang>.json`

Languages: Arabic `ar`, English `en`, Spanish `es`, French `fr`, Indonesian `id`, Turkish `tr`, Urdu `ur`.

The source-of-truth structure is the English key order, but the museum's rule is Arabic first. This pack is therefore also checking whether English-first drafting has produced unnatural or misleading text in the other six languages.

## What the reader is asked to check

For each string, check:

1. **Naturalness:** would a native speaker write this for a child-friendly game?
2. **Meaning:** does it say the same thing as the key's purpose, not merely translate words?
3. **Age fit:** clear for ages 6–17 without becoming babyish.
4. **Tone:** warm, precise, neutral docent; no sermon voice, no jokes at the player's expense.
5. **UI fit:** buttons short enough; hints explicit enough; settings labels understandable.
6. **Grammar and gender:** agreement, plurals, imperative forms, inclusive forms where the language requires a choice.
7. **Direction and punctuation:** Arabic/Urdu right-to-left behaviour, correct punctuation, no broken parentheses, no Latin fragments unless intended.
8. **Placeholders:** every `{name}`, `{n}` or similar placeholder remains unchanged and grammatically workable.
9. **Consistency:** repeated terms such as Atlas, Storykeeper, feather, mirror, page, beam, prototype, historical review pending, settings and pause are translated the same way throughout.
10. **Sensitive meaning:** no accidental religious ruling, honorific typed into the string, sacred-text misuse, nationalist framing or violence added by translation.
11. **Proper nouns:** names of people/places follow the museum's established form in that language where one exists.
12. **Nonverbal sound words:** the hoopoe call and cat purr should sound natural in the language, not merely transliterated.

## Doubts already raised by the translating agent

These must receive special attention:

- Turkish `d_page_dark`: the translator was unsure whether the dark-page/curtain wording reads naturally and correctly in context.
- Turkish `goal_ingenuity`: the translator was unsure whether the chosen word is the right child-friendly meaning of ingenuity.
- Indonesian `goal_feather_how`: the translator was unsure whether the feather-instruction wording is natural and clear.
- The hoopoe's call and the cat's purr were deliberately given language-specific sound words; a native reader should judge whether they are charming, odd or wrong.

## How to report

Do not rewrite the whole file unless asked. Report string by string in this form:

```text
Language:
File: i18n/ar.json or i18n-atlas/ar.json
Key:
Current text:
Problem type: wrong meaning / unnatural / grammar / tone / UI length / placeholder / punctuation / sensitive / proper noun / sound word / other
Suggested replacement:
Why, in one sentence:
Severity: blocks release / should fix / optional polish
```

If a string is correct, no comment is needed. At the end give a short overall judgement:

```text
Language:
Files read:
Blocks release: yes/no
Main recurring problem:
One example that works well:
Reader's language confidence: native / fluent / other (no personal detail needed)
```

## Language-specific notes

### Arabic (`ar`)

- Check Modern Standard Arabic clarity for children without sounding like a school textbook.
- Check right-to-left punctuation and the museum's isolated-parentheses rule.
- Confirm no honorific is typed into strings; the interface renders required marks itself.
- Check that “historical review pending” sounds precise rather than alarming.

### English (`en`)

- English is the original draft here. Read for child clarity, brevity and whether any idiom will translate badly.
- Flag wording that assumes visual knowledge or mouse use.

### Spanish (`es`)

- Check whether machine translation chose the right register for children and parents.
- Check gendered forms and whether neutral/inclusive alternatives are needed in UI labels.

### French (`fr`)

- Check agreement, apostrophes, non-breaking spaces before French punctuation where required by the site's practice, and whether imperative forms are natural.

### Indonesian (`id`)

- Give special attention to `goal_feather_how`.
- Check whether short UI labels are understandable without heavy literal translation.

### Turkish (`tr`)

- Give special attention to `d_page_dark` and `goal_ingenuity`.
- Check vowel harmony, imperative forms and whether child-facing tone is warm rather than commanding.

### Urdu (`ur`)

- Check right-to-left punctuation, natural Urdu rather than Arabicised or Hindi-calqued machine phrasing, and the museum's isolated-parentheses rule.
- Confirm no honorific is typed into strings.

## What not to do

- Do not add personal identifying information to the repository.
- Do not “improve” historical meaning beyond the source string; flag a meaning problem instead.
- Do not approve the whole language because most strings are understandable. The result should still list blockers precisely.
- Do not treat this reading as a playtest of usability; it is a language review. Native-reading playtests are a separate need.
