---
id: invention/kindi-frequency-analysis
lang: en
title: "Al-Kindi's frequency analysis"
status: { review: published }
provenance: { layer: own-research, generated_by: devin-orchestrator-solo, model: SWE-2, run: inventions-w2-22, source: "Mrayati et al. 1987 edition; EI2" }
---

## Summary

In a short treatise on "extracting the crypted" (Risala fi Istikhraj al-Mu'amma), the ninth-century philosopher al-Kindi gave the earliest known written method for breaking a substitution cipher: count how often each letter appears in the language, count the symbols in the ciphertext, and match the two tables. What the Greeks and Romans did by intuition, al-Kindi made a countable procedure — the birth of scientific cryptanalysis {cite:kindi-cryptanalysis-1987}.

## What it is

A method, not a machine: given a message written in substituted letters, you exploit the fact that every language has an uneven letter distribution — in Arabic, alif and lam dominate — so the most frequent ciphertext symbol is probably the most frequent letter. From a few anchored guesses the rest of the alphabet falls into place {cite:kindi-cryptanalysis-1987}.

## The world before it

Ciphers were old — Caesar's shifted alphabet was a millennium older — but breaking them had been an art of lucky guessing. No surviving text before al-Kindi taught a general procedure for attack; secrecy itself discouraged writing methods down.

## The story

Al-Kindi (d. c. 873), "the philosopher of the Arabs," ran the intellectual centre of early Abbasid Baghdad: philosophy, medicine, astrology, music theory — and the secret-letter sciences that a correspondence-rich bureaucracy needed. His short treatise on decipherment survived in a single Istanbul manuscript and was published in 1987 by a team of scholars who recognised it as the oldest cryptanalytic text known {cite:kindi-cryptanalysis-1987}.

## The maker(s)

Abu Yusuf Ya'qub ibn Ishaq al-Kindi (c. 801–873), the first great philosopher of the Islamic world, a Muslim scholar of the translation era; the record registers his faith on the museum's declared Sunni frame.

## How it works

Three steps: (1) tabulate the plain-language frequency order — in Arabic alif, lam, then ba', mim, nun and so on; (2) tabulate the ciphertext symbols by count; (3) match ranks and test the guesses against word shapes. A longer text gives a stronger match, because averages converge {cite:kindi-cryptanalysis-1987}.

## The spread

The treatise itself went quiet — one manuscript. But the idea travelled in the craft tradition: European Renaissance cryptanalysts rediscovered frequency counting independently, and from them it entered the standard toolbox of code-breaking.

## What it was built on

On the substitution ciphers it attacks — Caesar-type alphabets and the monoalphabetic tricks of earlier secretaries — and on the Arabic grammatical tradition that had already counted and ranked its own letters.

## What was built on it

Everything in classical cryptanalysis builds on frequency reasoning: polyalphabetic ciphers were invented to defeat it, and every attack on them — Kasiski, Friedman — is still counting. Modern statistical decipherment is the same idea at machine speed.

## Impact on daily life

It made secrecy measurable: from this point a cipher's strength could be argued, not merely assumed — the beginning of treating codes as a science.

## How it changed history

It started the arms race between cipher-makers and cipher-breakers that runs through the Renaissance courts, the World Wars' code rooms and today's cryptography.

## Who invented it?

For frequency analysis as a written method: al-Kindi, on the manuscript's testimony — no earlier text is known. Whether scribes practised it informally before him is unknowable {cite:kindi-cryptanalysis-1987}.

## Today

Every cipher puzzle, every automated codebreaker, every attack that begins "count the letters" is running al-Kindi's procedure.

## Surviving examples

The unique manuscript (Süleymaniye, Istanbul) and the 1987 edition of Mrayati and colleagues {cite:kindi-cryptanalysis-1987}.

## In culture

He is celebrated in histories of cryptography as the founder — "the father of cryptanalysis" in the literature that begins with his treatise.

## For young readers

Imagine a note where every letter was swapped for another. Al-Kindi said: in any language some letters appear more often — so count the strange symbols, guess the most common one first, and the message will open. That trick still breaks ciphers today.

## References

- {cite:kindi-cryptanalysis-1987}
- {cite:encyclopaedia-of-islam-2}
