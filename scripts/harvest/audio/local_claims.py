#!/usr/bin/env python3
"""Build a quote-checked claims table from a transcript, using a local model through Ollama.

Input is a transcript written by transcribe_qwen.py: one line per 30-second window, "[hh:mm:ss] text".
The local model lists the teaching points in each batch of lines and copies the words it relies on
(the quote). Nothing the model writes is trusted until code has checked it:

  - the quote must appear, word for word, inside the line at the time the model gave;
  - the time must be one of the transcript's own window times;
  - a quote containing Qur'an marks (﴿ ﴾) is refused, because Qur'an text is never typed.

Accepted claims go to <out>/<stem>.claims.jsonl; refused ones go to <out>/<stem>.rejects.jsonl with
the reason. Nothing is written to git: the output stays in the harvest folder until the drafting and
review steps (docs/agents/audio-video-harvest.md) use it.

Usage: python local_claims.py --out DIR [--model qwen3:32b] [--batch 8] TRANSCRIPT.txt
Resumable: a batch already present in the output is not sent again.
"""
import argparse, json, re, sys, time, urllib.request
from pathlib import Path

OLLAMA_URL = "http://localhost:11434/api/chat"
LINE = re.compile(r"^\[(\d{2}:\d{2}:\d{2})\] ?(.*)$")
KINDS = ["teaching", "example", "story", "hadith_mention", "quran_mention",
         "definition", "advice", "opinion", "other"]

SYSTEM = (
    "You read a transcript of an Arabic lecture by Sheikh Omar Abdelkafy. Each line starts with a "
    "timestamp in square brackets. You list the teaching points the speaker makes in the lines you are given. "
    "Rules:\n"
    "1. Skip greetings, thanks, logistics, repeated filler and unintelligible lines.\n"
    "2. quote: copy a continuous span of 5 to 30 words EXACTLY as it appears in ONE line. Do not correct, "
    "complete, vowel or translate it.\n"
    "3. time: the timestamp of the line that contains the quote.\n"
    "4. claim_ar: one short Arabic sentence that restates the point in your own words. Use only what the quote "
    "says. Do not add facts, names, dates or references the transcript does not state.\n"
    "5. kind: one of " + ", ".join(KINDS) + ".\n"
    "6. clear: false if the quote is garbled, cut off, repeats words without sense, or you cannot tell what it says; "
    "true only if the quote reads as clear Arabic speech.\n"
    "Answer with JSON only, in the form {\"claims\": [{\"time\": ..., \"quote\": ..., \"claim_ar\": ..., \"kind\": ..., \"clear\": ...}]}."
)

SCHEMA = {
    "type": "object",
    "properties": {
        "claims": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "time": {"type": "string"},
                    "quote": {"type": "string"},
                    "claim_ar": {"type": "string"},
                    "kind": {"type": "string", "enum": KINDS},
                    "clear": {"type": "boolean"},
                },
                "required": ["time", "quote", "claim_ar", "kind", "clear"],
            },
        }
    },
    "required": ["claims"],
}


def read_lines(path: Path):
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = LINE.match(raw.strip())
        if m and m.group(2).strip():
            lines.append((m.group(1), m.group(2).strip()))
    return lines


def ask(model: str, batch) -> list:
    body = "\n".join(f"[{t}] {text}" for t, text in batch)
    payload = {
        "model": model,
        "think": False,
        "stream": False,
        "format": SCHEMA,
        "options": {"temperature": 0, "num_ctx": 8192},
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": body},
        ],
    }
    req = urllib.request.Request(
        OLLAMA_URL, data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=900) as resp:
        reply = json.loads(resp.read().decode("utf-8"))
    return json.loads(reply["message"]["content"]).get("claims", [])


def squash(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def garbled(quote: str) -> bool:
    """A loop or a stutter: three identical words in a row, or one word four times in a short quote."""
    words = quote.split()
    run = 1
    for prev, cur in zip(words, words[1:]):
        run = run + 1 if cur == prev else 1
        if run >= 3:
            return True
    counts: dict = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return len(words) <= 30 and max(counts.values(), default=0) >= 4


def check(claim: dict, lines: dict):
    """Return (ok, reason). lines maps a timestamp to its text."""
    time_ = re.sub(r"[\[\]\s]", "", claim.get("time", ""))
    claim["time"] = time_
    quote = squash(claim.get("quote", ""))
    if time_ not in lines:
        return False, "time is not a transcript window"
    if not quote:
        return False, "empty quote"
    if "﴿" in quote or "﴾" in quote:
        return False, "Qur'an marks in quote"
    if claim.get("clear") is False:
        return False, "model marked the quote unclear"
    if garbled(quote):
        return False, "garbled quote (loop or stutter)"
    if quote not in squash(lines[time_]):
        return False, "quote not found in the line at that time"
    if claim.get("kind") not in KINDS:
        return False, "unknown kind"
    if not squash(claim.get("claim_ar", "")):
        return False, "empty claim"
    return True, ""


def run(transcript: Path, out: Path, model: str, batch_size: int) -> None:
    out.mkdir(parents=True, exist_ok=True)
    stem = transcript.stem
    lines = read_lines(transcript)
    line_text = {t: text for t, text in lines}
    accepted_path = out / f"{stem}.claims.jsonl"
    rejects_path = out / f"{stem}.rejects.jsonl"
    done_path = out / f"{stem}.batches.txt"
    done = set(done_path.read_text().split()) if done_path.exists() else set()

    for start in range(0, len(lines), batch_size):
        batch = lines[start:start + batch_size]
        key = batch[0][0]
        if key in done:
            continue
        began = time.time()
        try:
            claims = ask(model, batch)
        except Exception as exc:  # the batch is retried on the next run
            print(f"batch {key}: model error {exc}", file=sys.stderr, flush=True)
            continue
        kept, dropped = 0, 0
        with accepted_path.open("a", encoding="utf-8") as ok_f, rejects_path.open("a", encoding="utf-8") as bad_f:
            for claim in claims:
                ok, reason = check(claim, line_text)
                if ok:
                    ok_f.write(json.dumps(claim, ensure_ascii=False) + "\n")
                    kept += 1
                else:
                    bad_f.write(json.dumps({**claim, "reason": reason}, ensure_ascii=False) + "\n")
                    dropped += 1
        with done_path.open("a", encoding="utf-8") as d:
            d.write(key + "\n")
        print(f"batch {key}: {kept} kept, {dropped} refused, {time.time() - began:.0f}s", flush=True)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("transcript", type=Path)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--model", default="qwen3:32b")
    ap.add_argument("--batch", type=int, default=8)
    args = ap.parse_args()
    run(args.transcript, args.out, args.model, args.batch)


if __name__ == "__main__":
    main()
