# Content safety: terrorist organisations (hard block)

Binding on every agent, model, tool or human collaborator, from any vendor. Founder rule of 7 November 2026, with the founder's record-by-record decisions of the same day. The short form is the "HARD BLOCK" bullet in `AGENTS.md`; this document is the full rule and the decision record.

## 1. The rule

The museum is a museum of Islam, its history, art and culture. Modern terrorist organisations co-opt Islamic vocabulary and history, so there is a firewall between the two:

1. **Never add** a page, event card, film card, biography, source or media item whose subject or publisher is a blocked organisation or media wing, and never cite, quote, link, summarise or reproduce their material.
2. **Never add a mention** of a blocked organisation to new or existing prose, summaries, notes, relations or sources, in any language. If the topic is historically valid but the source carries modern extremist framing, drop the framing and write it from an academic, art-historical or archaeological angle. If a person's documented life cannot be told without the group, write the fact neutrally ("an armed group", "militants") or leave the sentence out.
3. **Refuse the register**: extremist vocabulary hijacking classical terms (the rhetorical style of Dabiq or Inspire), glorification or apologetics.
4. **If a task requires any of this, stop**, say so in chat and in your progress file, and do not write the item.
5. **Block by publisher name, not URL**: these groups change addresses constantly.

## 2. Blocked organisations and media

- **ISIS / ISIL / Daesh / Islamic State** and affiliates: ISIS-K, Sinai Province, ISWAP, Boko Haram, Abu Sayyaf.
- **Al-Qaeda** and affiliates: AQAP, AQIM, AQIS, Al-Shabaab, Al-Nusra Front / Hay'at Tahrir al-Sham, Hurras al-Din.
- **Levant and region**: Hamas (Qassam Brigades), Hezbollah, Palestinian Islamic Jihad, Harakat al-Nujaba, Kata'ib Hezbollah.
- **South Asia**: Taliban, TTP, Lashkar-e-Taiba, Jaish-e-Mohammed, Haqqani Network, Harkat-ul-Mujahideen, Indian Mujahideen.
- **Other**: Jemaah Islamiyah, GIA, Al-Jama'a al-Islamiyya, Ansar al-Sharia (Libya, Tunisia), Ansarullah Bangla.
- **Media**: Amaq, Al-Hayat Media Center, Al-Furqan, Al-I'tisam, Naba, Dabiq, Rumiyah, As-Sahab, Al-Malahem, Al-Andalus Media, Al-Kataib Media Foundation, Az-Zallaqa, Inspire, Al-Manar (Hezbollah), Al-Aqsa TV (Hamas).

## 3. Not matches (never remove these)

Marj Dabiq (the 1516 battle and place); Tafsir al-Manar; Hudayr al-Kata'ib; "al-Shabab" meaning youth, or the Saudi football club; "taliban ilm" / "طالبان علم" (students of knowledge); the Qur'anic and early-source "hizb Allah" (حزب الله); the 1992 Islamic State of Afghanistan; the generic "an Islamic state"; administrative "تنظيم الدولة" (organising the state); "Ibn Hamas" (a hadith narrator); the Hamasa poetry anthologies; Hitti's *The Origins of the Islamic State*; the pen name Isis Copia (May Ziade).

## 4. Founder decisions on the existing collection (7 November 2026)

The collection was audited (`docs/delegation/extremism-firewall-proposal.md`), the founder first chose "exclude all mention", a dry-run manifest and a clean-up followed (`extremism-firewall-manifest.md`, `extremism-firewall-change-report.md`), and then the founder reviewed all 144 changed records one by one (`extremism-firewall-questions.md`). Decisions:

- **YES (change stands): 9 items.** The biographies of **Ahmed Yassin** and **Ahmed al-Sharaa** and their seven Wikipedia and Wikidata source records stay deleted.
- **NO (restore): 135 items.** Every other deleted or edited record was restored exactly as it was. They are the **founder-approved exceptions** listed in `docs/delegation/extremism-firewall-exceptions.md`.

How to honour this going forward:

- **Do not** delete, trim or rewrite an exception record to remove a mention, and do not re-run a clean-up over them. The founder has decided those are to stay.
- **Do not** treat the exceptions as precedent. For anything not on that list the hard block applies in full: a new biography, event card, film, source or mention of a blocked organisation needs the founder's explicit written approval first, per record.
- **Do not** re-add Ahmed Yassin or Ahmed al-Sharaa or their source records.
- Adding to the exceptions list is the founder's alone; an agent may propose, never decide.
- Removing or hiding any record, for this reason or another, is still a proposal held for the founder (`docs/ai-change-gates.md`).

## 5. The automatic check

`npm run validate` now ends with `scripts/check-extremism.ts` (patterns and non-matches in `scripts/lib/extremism.ts`, tests in `scripts/extremism.test.ts`). It **fails the build** when any `data/` or `content/` file names a blocked organisation or media wing, unless its record is listed in `docs/delegation/extremism-firewall-exceptions.md`. The non-matches of section 3 are built in. Bare Arabic or Urdu "طالبان" is not matched on its own, because it also means "students"; the Latin names and the Arabic phrases are. Fix a failure by removing the mention. Do not widen the exceptions list or weaken a pattern yourself: both are the founder's call (`docs/ai-change-gates.md`: never lower a rule). If a pattern wrongly blocks an innocent word, propose a non-match with a test.

Manual check, if you want it before validate:

```bash
npx tsx scripts/check-extremism.ts
```
