#!/usr/bin/env python3
"""Local claims pipeline for one book item: sections, claims pass (extractor model), quote check (code), judge pass (other family).
  claims_pipeline.py sections <cat>/<book-id>/<item> [--pages-per-section 6]
  claims_pipeline.py extract  <cat>/<book-id>/<item> [--model qwen3:32b] [--only 0003,0010 | --sample 30 --seed 7]
  claims_pipeline.py judge    <cat>/<book-id>/<item> [--model gemma4:26b]
  claims_pipeline.py report   <cat>/<book-id>/<item>
Intermediate files live in ~/islam-museum-harvest/work/<book-id>/ (never in git). Talks only to localhost:11434."""
import argparse, hashlib, json, os, random, re, sys
from pathlib import Path

import ollama

H = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
DIACRITICS = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")
KINDS = ["person", "event", "place", "date", "relation", "attribution", "hadith_ref", "quran_ref", "opinion"]

EXTRACT_SCHEMA = {
    "type": "object",
    "properties": {"claims": {"type": "array", "items": {"type": "object", "properties": {
        "claim": {"type": "string"},
        "kind": {"type": "string", "enum": KINDS},
        "entities": {"type": "array", "items": {"type": "string"}},
        "value": {"type": "string"},
        "date_text": {"type": "string"},
        "quote": {"type": "string"},
        "page": {"type": "string"},
        "isnad_head": {"type": "string"},
        "doubt_marker": {"type": "string"},
        "attributed_to": {"type": "string"},
    }, "required": ["claim", "kind", "entities", "quote", "page"]}}},
    "required": ["claims"],
}
JUDGE_SCHEMA = {"type": "object", "properties": {"verdict": {"type": "string", "enum": ["supported", "partly", "unsupported", "contradicted"]}, "reason": {"type": "string"}}, "required": ["verdict"]}

EXTRACT_PROMPT = """You read one section of a classical Arabic book (page markers like [p12]). Extract only facts the section states explicitly.
Rules:
- Every claim needs a `quote`: copied verbatim from the section, at most 40 words. No quote, no claim.
- `page` is the number in the nearest [pN] marker above the quote.
- `kind` is one of: person, event, place, date, relation, attribution, hadith_ref, quran_ref, opinion.
- `entities` are names exactly as printed. `date_text` is the date exactly as the book words it; never compute one.
- `isnad_head` is the first transmitters as printed, if any. `doubt_marker` is words such as قيل، يقال، زعموا or a weak-chain remark, if present.
- `attributed_to` is who the book says said it, if the book says so.
- Never write Qur'an text. Never invent. Return an empty list if nothing qualifies.
Section:
"""

JUDGE_PROMPT = """Given a claim and the quote it cites, decide whether the quote supports the claim.
supported = the quote states the claim. partly = it states part of it. unsupported = it does not say it. contradicted = it says the opposite.
Claim: {claim}
Quote: {quote}
"""


def norm_ar(s: str) -> str:
    s = DIACRITICS.sub("", s)
    s = s.replace("االله", "الله").replace("اللّٰه", "الله").replace("اللّه", "الله")
    s = re.sub("[إأآٱ]", "ا", s).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    s = re.sub(r"[^\w\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def paths(item_arg: str):
    cat, book, item = item_arg.split("/")
    src = H / "books" / cat / book / item
    work = H / "work" / book
    work.mkdir(parents=True, exist_ok=True)
    return src, work, book, item


def load_pages(src: Path):
    return json.loads((src / "pages.json").read_text())


def cmd_sections(args):
    src, work, book, item = paths(args.item)
    pages = [p for p in load_pages(src) if p["text"].strip()]
    sections, cur = [], []
    for p in pages:
        cur.append(p)
        if len(cur) >= args.pages_per_section:
            sections.append(cur); cur = []
    if cur: sections.append(cur)
    out = []
    for i, group in enumerate(sections):
        first = next((l for l in group[0]["text"].splitlines() if l.strip()), "")[:80]
        out.append({"id": f"{i:04d}", "pdf_pages": [group[0]["page"], group[-1]["page"]], "heading": first})
    (work / f"sections-{item}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print(f"{len(out)} sections from {len(pages)} non-empty pages -> {work / f'sections-{item}.json'}")


def section_text(src: Path, sec) -> str:
    lo, hi = sec["pdf_pages"]
    return "\n".join(f"===== [p{p['page']}] =====\n{p['text']}" for p in load_pages(src) if lo <= p["page"] <= hi and p["text"].strip())


def cmd_extract(args):
    src, work, book, item = paths(args.item)
    secs = json.loads((work / f"sections-{item}.json").read_text())
    if args.only:
        wanted = set(args.only.split(","))
        secs = [s for s in secs if s["id"] in wanted]
    elif args.sample:
        random.Random(args.seed).shuffle(secs); secs = secs[: args.sample]
    raw_dir = work / "raw" / item; raw_dir.mkdir(parents=True, exist_ok=True)
    client = ollama.Client(host="http://localhost:11434")
    for sec in secs:
        out_path = raw_dir / f"{sec['id']}.json"
        if out_path.exists():
            continue
        text = section_text(src, sec)
        prompt = EXTRACT_PROMPT + text
        resp = client.chat(model=args.model, messages=[{"role": "user", "content": prompt}], format=EXTRACT_SCHEMA,
                           options={"temperature": 0, "seed": 42, "num_ctx": 16384})
        try:
            claims = json.loads(resp.message.content).get("claims", [])
        except json.JSONDecodeError:
            claims = None
        out_path.write_text(json.dumps({"section": sec, "model": args.model, "prompt_sha256": hashlib.sha256(prompt.encode()).hexdigest(),
                                        "text": text, "claims": claims, "raw": resp.message.content}, ensure_ascii=False, indent=1))
        print(f"section {sec['id']} p{sec['pdf_pages']}: {'JSON ERROR' if claims is None else len(claims)} claims")
    # quote check (code, not a model)
    kept, dropped = [], []
    for f in sorted(raw_dir.glob("*.json")):
        d = json.loads(f.read_text())
        if d["claims"] is None:
            dropped.append({"section": d["section"]["id"], "reason": "json-error"}); continue
        hay = norm_ar(d["text"])
        for c in d["claims"]:
            row = {**c, "section": d["section"]["id"], "model": d["model"]}
            q = norm_ar(c.get("quote", ""))
            if not q or len(c.get("quote", "").split()) > 40:
                dropped.append({**row, "reason": "quote-missing-or-long"})
            elif q in hay:
                kept.append(row)
            else:
                dropped.append({**row, "reason": "quote-not-in-section"})
    (work / f"claims-{item}.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in kept))
    (work / f"dropped-{item}.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in dropped))
    print(f"quote check: kept {len(kept)}, dropped {len(dropped)}")


def cmd_judge(args):
    src, work, book, item = paths(args.item)
    claims = [json.loads(l) for l in (work / f"claims-{item}.jsonl").read_text().splitlines() if l.strip()]
    client = ollama.Client(host="http://localhost:11434")
    for c in claims:
        resp = client.chat(model=args.model, messages=[{"role": "user", "content": JUDGE_PROMPT.format(claim=c["claim"], quote=c["quote"])}],
                           format=JUDGE_SCHEMA, options={"temperature": 0, "seed": 42, "num_ctx": 4096})
        try:
            c["judge"] = json.loads(resp.message.content)["verdict"]
        except (json.JSONDecodeError, KeyError):
            c["judge"] = "error"
        c["judge_model"] = args.model
    (work / f"judged-{item}.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in claims))
    print("judge:", {v: sum(1 for c in claims if c["judge"] == v) for v in ["supported", "partly", "unsupported", "contradicted", "error"]})


def cmd_report(args):
    src, work, book, item = paths(args.item)
    claims = [json.loads(l) for l in (work / f"judged-{item}.jsonl").read_text().splitlines() if l.strip()]
    dropped = [json.loads(l) for l in (work / f"dropped-{item}.jsonl").read_text().splitlines() if l.strip()]
    print(json.dumps({"proposed_after_quote_check": len(claims), "dropped": len(dropped),
                      "verdicts": {v: sum(1 for c in claims if c["judge"] == v) for v in ["supported", "partly", "unsupported", "contradicted", "error"]}}, ensure_ascii=False))
    sup = [c for c in claims if c["judge"] == "supported"]
    for c in random.Random(1).sample(sup, min(20, len(sup))):
        print(json.dumps({k: c.get(k) for k in ["claim", "quote", "page", "section"]}, ensure_ascii=False))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sections"); s.add_argument("item"); s.add_argument("--pages-per-section", type=int, default=6)
    e = sub.add_parser("extract"); e.add_argument("item"); e.add_argument("--model", default="qwen3:32b")
    e.add_argument("--only"); e.add_argument("--sample", type=int); e.add_argument("--seed", type=int, default=7)
    j = sub.add_parser("judge"); j.add_argument("item"); j.add_argument("--model", default="gemma4:26b")
    r = sub.add_parser("report"); r.add_argument("item")
    args = ap.parse_args()
    {"sections": cmd_sections, "extract": cmd_extract, "judge": cmd_judge, "report": cmd_report}[args.cmd](args)


if __name__ == "__main__":
    sys.exit(main())
