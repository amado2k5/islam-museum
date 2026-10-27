#!/usr/bin/env python3
"""Draft an Arabic episode summary from a quote-checked claims table, with a local model (Ollama).

  draft_episode.py <claims.jsonl> --series al-naba-al-safi --episode 1 [--model qwen3:32b] [--out DIR]

The model sees only the numbered claims (their Arabic restatements and times), never the transcript or the
quotes. It writes Arabic paragraphs in which every sentence ends with {cite:assabile-omar-abdelkafy <series>/epNN hh:mm:ss},
using a time from the claim it restates. Checked after the model answers:
  - every cite names this series and episode and a time that is one of the claims' times;
  - no honorific is typed (the UI renders them);
  - no Qur'an marks (﴿ ﴾);
  - no cite-less sentence.
Drafts go to DIR (default ~/islam-museum-harvest/drafts/), outside git. A person reads each draft against its
claims before any of it goes into content/ar/.
"""
import argparse, json, re, sys, urllib.request
from pathlib import Path

OLLAMA = "http://localhost:11434"
HONORIFIC = re.compile(r"ﷺ|صلى الله|عليه السلام|عليها السلام|رضي الله عن|رحمه الله|رحمها الله")

SYSTEM = """You write an episode summary for an Arabic museum of Islam, from numbered facts about one lecture. You write Arabic only, in a warm, precise, neutral voice.

Hard rules:
1. Restate ONLY the numbered facts given, one sentence per fact at most. Do not add anything else: no purpose of the lecture, no context, no names, dates, titles or places that are not in the facts.
2. Describe, never prescribe. No rulings, no sermon voice. Attribute opinions to the speaker, as "يرى الشيخ" or "يقول الشيخ".
3. Never type an honorific (no صلى الله عليه وسلم, no رضي الله عنه, no رحمه الله, no ﷺ). Plain names only.
4. Every sentence ends with the citation in this exact form: {cite:SOURCE hh:mm:ss}. SOURCE and the time are given with each fact. Use only a time that is given with a fact.
5. No quotation marks and no copied lecture text; put every fact in your own words.
6. Output paragraphs only: no headings, no bullet points, no English, no preamble, no code fence. Group related facts into short paragraphs."""


def build_prompt(claims: list, source: str) -> str:
    facts = "\n".join(f"{i}. {c['claim_ar']} ({c['time']})" for i, c in enumerate(claims, 1))
    return f"SOURCE id for citations: {source}\n\nFacts:\n{facts}\n\nWrite the Arabic summary now, following the rules."


def ask(model: str, user: str) -> str:
    body = json.dumps({
        "model": model, "think": False, "stream": False,
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}],
        "options": {"temperature": 0.0, "num_ctx": 16384},
    }).encode("utf-8")
    req = urllib.request.Request(f"{OLLAMA}/api/chat", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=1800) as r:
        return json.loads(r.read())["message"]["content"].strip()


def normalise_sources(text: str, source: str):
    """Rewrite each cite's source id to the exact id, keeping its time. Returns (text, count of rewrites)."""
    fixed = 0

    def rewrite(m):
        nonlocal fixed
        if m.group(1) != source:
            fixed += 1
        return "{cite:" + source + " " + m.group(2) + "}"

    return re.sub(r"\{cite:([^}]+?) (\d{2}:\d{2}:\d{2})\}", rewrite, text), fixed


def check(text: str, claims: list, source: str) -> list:
    """Return the problems found. An empty list means the draft passes the mechanical checks."""
    times = {c["time"] for c in claims}
    problems = []
    if HONORIFIC.search(text):
        problems.append("typed honorific")
    if "﴿" in text or "﴾" in text:
        problems.append("Qur'an marks")
    for src, t in re.findall(r"\{cite:([^}]+?) (\d{2}:\d{2}:\d{2})\}", text):
        if src != source:
            problems.append(f"unknown source {src}")
        if t not in times:
            problems.append(f"cite time {t} is not among the facts")
    for line in text.splitlines():
        for sentence in re.split(r"(?<=\.)\s+", line.strip()):
            if sentence.strip(" .") and not re.search(r"\{cite:[^}]*\}\.?\s*$", sentence):
                problems.append(f"sentence without cite: {sentence[:40]}")
                break
    return problems


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("claims", type=Path)
    ap.add_argument("--series", required=True)
    ap.add_argument("--episode", type=int, required=True)
    ap.add_argument("--model", default="qwen3:32b")
    ap.add_argument("--out", type=Path, default=Path.home() / "islam-museum-harvest" / "drafts")
    args = ap.parse_args()

    source = f"assabile-omar-abdelkafy {args.series}/ep{args.episode:02d}"
    claims = [json.loads(l) for l in args.claims.read_text(encoding="utf-8").splitlines() if l.strip()]
    claims.sort(key=lambda c: c["time"])
    text = ask(args.model, build_prompt(claims, source))
    text, fixed = normalise_sources(text, source)
    problems = check(text, claims, source)
    if fixed:
        print(f"{fixed} cite(s) had the source id rewritten to the exact id")

    args.out.mkdir(parents=True, exist_ok=True)
    name = f"{args.series}-ep{args.episode:02d}.draft.md"
    (args.out / name).write_text(text + "\n", encoding="utf-8")
    print(f"{name}: {len(text)} chars, {len(problems)} problems")
    for p in sorted(set(problems))[:20]:
        print("  -", p)


if __name__ == "__main__":
    main()
