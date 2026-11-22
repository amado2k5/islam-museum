#!/usr/bin/env python3
"""Claims table for one Mufti Menk recording (lane mufti-menk), local models through Ollama, nothing leaves the Mac.

Input : $HARVEST/mufti-menk/transcripts/<id>.txt (lines "[hh:mm:ss] text") and the ledger row (title, description, chapters).
Output: $HARVEST/mufti-menk/claims/<id>.claims.jsonl   accepted timestamped claims (about one per minute of talk)
        $HARVEST/mufti-menk/claims/<id>.rejects.jsonl   refused claims with the reason
        $HARVEST/mufti-menk/claims/<id>.header.json     title, headline, kind, sermon_type, place, occasion ... (validated)
        $HARVEST/mufti-menk/claims/<id>.verdicts.jsonl  second pass (a different model) per claim: supported yes/no
Nothing in that folder is ever committed (docs/sources-policy.md, founder ruling 21 Nov 2026).

Rules enforced by code, not trusted from the model (docs/agents/audio-video-harvest.md §2):
  - a quote is at most 40 words, copied word for word from the line at the stated time; refused otherwise;
  - Qur'an marks in a quote are refused; Qur'an references are only surah:ayah numbers; hadith only as a description;
  - every enum value must be in the allowed list or the whole answer is rejected and retried (never repaired);
  - the second pass judges each claim against the transcript span at its timestamp and drops what the span does not support.

Usage: python3 claims.py [--model qwen3:32b] [--judge qwen3.5:27b] [--batch-lines 40] VIDEO_ID [VIDEO_ID ...]
Resumable: finished batches are not sent again.
"""
import argparse, json, os, re, sqlite3, sys, time, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
WORK = HARVEST / "mufti-menk"
OLLAMA = "http://localhost:11434/api/chat"
LINE = re.compile(r"^\[(\d{2}):(\d{2}):(\d{2})\] ?(.*)$")


def enum(name):
    return [re.match(r"-\s*(?:\{\s*id:\s*)?([^,}\s]+)", l).group(1).strip("'\"") for l in (ROOT / f"schema/enums/{name}.yaml").read_text().splitlines() if re.match(r"-\s", l)]


SERMON_TYPES = enum("sermon-type")
SENSITIVITY = enum("sensitivity")
CLAIM_KINDS = ["teaching", "advice", "story", "example", "definition", "opinion", "hadith_mention", "quran_mention", "other"]
KINDS = ["sermon", "lecture"]

CLAIM_SYSTEM = (Path(HERE / "prompts/claims.txt")).read_text() if (HERE / "prompts/claims.txt").exists() else ""
HEADER_SYSTEM = (Path(HERE / "prompts/header.txt")).read_text() if (HERE / "prompts/header.txt").exists() else ""
JUDGE_SYSTEM = (Path(HERE / "prompts/judge.txt")).read_text() if (HERE / "prompts/judge.txt").exists() else ""

CLAIM_SCHEMA = {"type": "object", "required": ["claims"], "properties": {"claims": {"type": "array", "items": {
    "type": "object",
    "required": ["time", "claim_en", "kind", "quote", "topics", "quran_refs", "hadith_description", "clear", "confidence"],
    "properties": {
        "time": {"type": "string"}, "claim_en": {"type": "string"}, "kind": {"type": "string", "enum": CLAIM_KINDS},
        "quote": {"type": "string"}, "topics": {"type": "array", "items": {"type": "string"}},
        "quran_refs": {"type": "array", "items": {"type": "string"}}, "hadith_description": {"type": "string"},
        "clear": {"type": "boolean"}, "confidence": {"type": "string", "enum": ["high", "medium", "low"]}}}}}}

HEADER_SCHEMA = {"type": "object", "required": ["title_en", "headline_en", "kind", "sermon_type", "sensitivity", "place", "occasion", "host", "audience", "book_studied", "talk_start_seconds", "topics", "confidence"],
    "properties": {
        "title_en": {"type": "string"}, "headline_en": {"type": "string"}, "kind": {"type": "string", "enum": KINDS},
        "sermon_type": {"type": "string", "enum": SERMON_TYPES + [""]}, "sensitivity": {"type": "string", "enum": SENSITIVITY},
        "place": {"type": "string"}, "occasion": {"type": "string"}, "host": {"type": "string"}, "audience": {"type": "string"},
        "book_studied": {"type": "string"}, "talk_start_seconds": {"type": "integer"},
        "topics": {"type": "array", "items": {"type": "string"}}, "confidence": {"type": "object"}}}

JUDGE_SCHEMA = {"type": "object", "required": ["supported", "reason"], "properties": {"supported": {"type": "boolean"}, "reason": {"type": "string"}}}


def chat(model, system, user, schema, num_ctx=8192):
    payload = {"model": model, "think": False, "stream": False, "format": schema, "options": {"temperature": 0, "num_ctx": num_ctx},
               "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
    req = urllib.request.Request(OLLAMA, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=1800) as r:
        return json.loads(json.loads(r.read())["message"]["content"])


MLX = {}


def chat_mlx(model, system, user):
    """Claims pass through mlx-lm (Apple silicon, no grammar-constrained output): the answer is parsed as JSON,
    retried up to three times if it does not parse, never repaired. Enums and quotes are still checked in code."""
    if not MLX:
        from mlx_lm import load
        from mlx_lm.sample_utils import make_sampler
        MLX["model"], MLX["tok"] = load(model)
        MLX["sampler"] = make_sampler(temp=0.0)
    from mlx_lm import generate
    tok = MLX["tok"]
    sys_full = system + '\nAnswer with JSON only, in the form {"claims": [{"time": "hh:mm:ss", "claim_en": "...", "kind": "...", "quote": "", "topics": [], "quran_refs": [], "hadith_description": "", "clear": true, "confidence": "high"}]}. kind must be one of: ' + ", ".join(CLAIM_KINDS) + "."
    prompt = tok.apply_chat_template([{"role": "system", "content": sys_full}, {"role": "user", "content": user}], tokenize=False, add_generation_prompt=True)
    txt = generate(MLX["model"], tok, prompt=prompt, max_tokens=4000, sampler=MLX["sampler"])
    m = re.search(r"\{.*\}", txt, re.S)
    return json.loads(m.group(0))


def read_lines(p):
    out = []
    for raw in p.read_text(encoding="utf-8").splitlines():
        m = LINE.match(raw.strip())
        if m and m.group(4).strip():
            out.append((f"{m.group(1)}:{m.group(2)}:{m.group(3)}", m.group(4).strip()))
    return out


def secs(t):
    h, m, s = t.split(":")
    return int(h) * 3600 + int(m) * 60 + int(s)


def squash(s):
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    return re.sub(r"[^a-z0-9' ]+", "", squash(s).lower().replace("’", "'"))


def check_claim(c, line_text):
    t = re.sub(r"[\[\]\s]", "", c.get("time", ""))
    c["time"] = t
    if t not in line_text:
        return "time is not a transcript line"
    q = squash(c.get("quote", ""))
    if not squash(c.get("claim_en", "")):
        return "empty claim"
    if not re.match(r"(He|The speaker)\b", squash(c["claim_en"])):
        return "claim not attributed to the speaker (He says ...)"
    if c.get("clear") is False:
        return "model marked the line unclear"
    if "﴿" in q or "﴾" in q:
        return "Qur'an marks in quote"
    if q:
        if len(q.split()) > 40:
            return "quote over 40 words"
        if norm(q) not in norm(line_text[t]):
            return "quote not found in the line at that time"
    if c.get("kind") not in CLAIM_KINDS:
        return "kind not in enum"
    if not re.match(r"(He|The speaker)\b", squash(c["claim_en"])):
        return "claim not attributed to the speaker (He says ...)"
    if any(not re.fullmatch(r"\d{1,3}:\d{1,3}(-\d{1,3})?", r) for r in c.get("quran_refs", [])):
        return "Qur'an reference is not surah:ayah"
    return ""


MLX_MODEL = False


def run_claims(vid, lines, meta, model, batch_lines, out):
    line_text = dict(lines)
    acc, rej, done_p = out / f"{vid}.claims.jsonl", out / f"{vid}.rejects.jsonl", out / f"{vid}.batches.txt"
    done = set(done_p.read_text().split()) if done_p.exists() else set()
    ctx = f"Video title: {meta['title']}\nDescription (first 500 characters): {(meta['description'] or '')[:500]}\n"
    for i in range(0, len(lines), batch_lines):
        batch = lines[i:i + batch_lines]
        if batch[0][0] in done:
            continue
        body = ctx + "\nTranscript lines:\n" + "\n".join(f"[{t}] {x}" for t, x in batch)
        for attempt in range(3):
            try:
                claims = (chat_mlx(model, CLAIM_SYSTEM, body) if MLX_MODEL else chat(model, CLAIM_SYSTEM, body, CLAIM_SCHEMA))["claims"]
                break
            except Exception as e:  # off-enum or malformed answer: rejected and retried, never repaired
                print(f"  {vid} {batch[0][0]} attempt {attempt+1}: {e}", file=sys.stderr)
                claims = None
        if claims is None:
            continue
        kept = dropped = 0
        with acc.open("a") as a, rej.open("a") as r:
            for c in claims:
                why = check_claim(c, line_text)
                (r if why else a).write(json.dumps({**c, **({"reason": why} if why else {})}, ensure_ascii=False) + "\n")
                kept += not why
                dropped += bool(why)
        done_p.open("a").write(batch[0][0] + "\n")
        print(f"{vid} {batch[0][0]}: {kept} kept, {dropped} refused", flush=True)


def run_header(vid, lines, meta, model, out):
    p = out / f"{vid}.header.json"
    if p.exists():
        return
    head = "\n".join(f"[{t}] {x}" for t, x in lines[:25])
    chapters = json.loads(meta["chapters"] or "[]")
    user = (f"Video title: {meta['title']}\nUpload date (NOT the delivery date): {meta['upload_date']}\nDuration seconds: {meta['duration']}\n"
            f"Description:\n{(meta['description'] or '')[:1500]}\nChapters: {json.dumps(chapters)[:800]}\n\nFirst transcript lines:\n{head}")
    for attempt in range(3):
        try:
            h = chat(model, HEADER_SYSTEM, user, HEADER_SCHEMA)
            p.write_text(json.dumps(h, ensure_ascii=False, indent=2))
            return
        except Exception as e:
            print(f"  header {vid} attempt {attempt+1}: {e}", file=sys.stderr)


def run_judge(vid, lines, judge, out):
    acc, ver = out / f"{vid}.claims.jsonl", out / f"{vid}.verdicts.jsonl"
    if not acc.exists():
        return
    seen = {json.loads(l)["time"] + json.loads(l)["claim_en"] for l in ver.read_text().splitlines()} if ver.exists() else set()
    times = [t for t, _ in lines]
    for raw in acc.read_text().splitlines():
        c = json.loads(raw)
        if c["time"] + c["claim_en"] in seen:
            continue
        k = times.index(c["time"])
        span = "\n".join(f"[{t}] {x}" for t, x in lines[max(0, k - 3):k + 8])
        try:
            v = chat(judge, JUDGE_SYSTEM, f"Claim: {c['claim_en']}\n\nTranscript span:\n{span}", JUDGE_SCHEMA)
        except Exception as e:
            print(f"  judge {vid}: {e}", file=sys.stderr)
            continue
        ver.open("a").write(json.dumps({"time": c["time"], "claim_en": c["claim_en"], **v}, ensure_ascii=False) + "\n")
    print(f"{vid}: judged", flush=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ids", nargs="+")
    ap.add_argument("--model", default="mlx-community/Qwen3-30B-A3B-Instruct-2507-4bit", help="claims model; an mlx-lm repo id, or an Ollama name if it has no slash-free mlx form")
    ap.add_argument("--header-model", default="qwen3:32b")
    ap.add_argument("--judge", default="qwen3.5:27b")
    ap.add_argument("--batch-lines", type=int, default=40)
    ap.add_argument("--no-judge", action="store_true", help="claims and header only; status becomes claims_done until --judge-only runs")
    ap.add_argument("--judge-only", action="store_true", help="run only the judge on videos already at claims_done; then distilled")
    a = ap.parse_args()
    global MLX_MODEL
    MLX_MODEL = a.model.startswith("mlx-community/")
    out = WORK / "claims"
    out.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(WORK / "ledger.sqlite")
    con.row_factory = sqlite3.Row
    for vid in a.ids:
        tp = WORK / "transcripts" / f"{vid}.txt"
        if not tp.exists():
            print(f"{vid}: no transcript yet, skipped")
            continue
        meta = con.execute("SELECT * FROM videos WHERE id=?", (vid,)).fetchone()
        lines = read_lines(tp)
        if a.judge_only:
            run_judge(vid, lines, a.judge, out)
            con.execute("UPDATE videos SET status='distilled', updated_at=? WHERE id=? AND status='claims_done'", (time.strftime("%Y-%m-%dT%H:%M:%S%z"), vid))
            con.commit()
            continue
        run_claims(vid, lines, meta, a.model, a.batch_lines, out)
        run_header(vid, lines, meta, a.header_model, out)
        if a.no_judge:
            con.execute("UPDATE videos SET status='claims_done', transcript_path=?, updated_at=? WHERE id=? AND status IN ('detailed','transcribed')", (str(tp), time.strftime("%Y-%m-%dT%H:%M:%S%z"), vid))
            con.commit()
            continue
        run_judge(vid, lines, a.judge, out)
        con.execute("UPDATE videos SET status='distilled', transcript_path=?, updated_at=? WHERE id=? AND status IN ('detailed','transcribed')", (str(tp), time.strftime("%Y-%m-%dT%H:%M:%S%z"), vid))
        con.commit()


if __name__ == "__main__":
    sys.exit(main())
