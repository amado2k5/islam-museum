#!/usr/bin/env python3
"""Local extraction of one episode's claims file with an Ollama model (no API cost).

Same output shape as claims-brief.md (so check_claims.py and build_records.py work unchanged), made in four steps,
each checked by code, never trusted blindly:
  1. Read the transcript in windows of about 11,000 characters. The model lists, per window, topic sections with
     attributed claims in Arabic, and for each claim copies a short verbatim QUOTE from the transcript.
  2. Code keeps a claim only if its quote is found, word for word (after removing diacritics and punctuation), in
     the window it was given for. A claim without a found quote is rejected and logged: this is the guard against
     invention.
  3. The model translates the kept Arabic claims into English, one section at a time, same count and order.
  4. Code matches graph entities by their Arabic labels inside the section text (no model involved), and writes
     claims/<name>.json. Urdu, French and Spanish are a separate step (translate step of this script: --translate).

Usage:
  local_extract.py --transcript T.txt --ledger-title "<title_ar>" --graph graph-index.tsv --out ep01.json [--model qwen3:32b]
  local_extract.py --translate ep01.json --out ep01.tr.json [--model qwen3:32b]
Standard library only. Needs `ollama serve` running.
"""
import argparse, json, re, sys, time, urllib.request
from pathlib import Path

URL = "http://localhost:11434/api/chat"
LINE = re.compile(r"^\[(\d{2}:\d{2}:\d{2})\] ?(.*)$")


def norm(s):
    s = re.sub(r"[ً-ٰٟـ]", "", s)
    for a, b in (("ى", "ي"), ("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ة", "ه"), ("ؤ", "و"), ("ئ", "ي")):
        s = s.replace(a, b)
    s = re.sub(r"[^\w\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def chat(model, system, user, retries=3):
    body = {"model": model, "stream": False, "think": False, "format": "json",
            "options": {"temperature": 0.2, "num_ctx": 20000},
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}]}
    for k in range(retries):
        try:
            req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=1800) as r:
                txt = json.loads(r.read())["message"]["content"]
            return json.loads(txt)
        except Exception as e:  # noqa: BLE001
            print(f"  retry {k + 1}: {e}", file=sys.stderr)
            time.sleep(3)
    return None


SYS_AR = """You read a transcript window of an Arabic lecture on Islamic history and thought by a Saudi lecturer. Each line starts with [hh:mm:ss].
List the topics the lecturer treats in this window as sections, with the claims of each section. Rules:
- Every claim is ONE sentence in Modern Standard Arabic that begins with the lecturer as subject: يذكر أن / يرى أن / يروي أن / يعدّ / يقول إن. Say what he says; restate in your own words; never copy his sentence.
- Each claim carries "quote": a verbatim copy of 3 to 10 consecutive words from the transcript lines that support it. The quote must be exactly as written in the lines.
- Skip: opening praise, closing prayers, greetings, jokes, audience chat, recitation of the Qur'an or poems, wording of hadith, and exhortations to the listeners or comments on today's events. Never write Qur'an text. Never write the phrases that follow a prophet's or Companion's name (no honorifics).
- A section is a topic that lasts several minutes: "time" is the timestamp of its first line, "topic_ar" a short heading. Between 1 and 6 sections for the window; 2 to 8 claims in each.
- Dates, numbers and names are his statements: keep them as he gives them; if the transcript looks garbled, leave the detail out.
Output JSON only: {"sections":[{"time":"hh:mm:ss","topic_ar":"...","claims":[{"ar":"...","quote":"..."}]}]}"""

SYS_EN = """You translate Arabic claims about a lecture into English. Input: JSON {"claims":[...]}. Output JSON {"claims":[...]} with exactly the same number of items in the same order. Each English claim starts "He says that", "He holds that", "He relates that" or "He counts" to match the Arabic verb, is faithful, plain and neutral, adds nothing, uses no quotation marks and no honorific after a name. Also give "topic" (the heading in English) when the input has "topic_ar". Input also has "topic_ar" to translate.
Output JSON only: {"topic":"...","claims":["..."]}"""


def windows(lines, size=11000):
    cur, n = [], 0
    for t, text in lines:
        cur.append((t, text)); n += len(text) + 12
        if n >= size:
            yield cur; cur, n = [], 0
    if cur:
        yield cur


def load_graph(path):
    out = []
    for l in open(path, encoding="utf8").read().split("\n")[1:]:
        p = l.split("\t")
        if len(p) < 3:
            continue
        ar = norm(p[1])
        words = len(ar.split())
        cls = p[0].split("/")[0]
        # A single common word names too many things (God's names, generic concepts): multi-word labels only, except places.
        if words <= 6 and ((words >= 2 and len(ar) >= 7) or (cls == "place" and len(ar) >= 4)):
            out.append((p[0], f" {ar} "))
    return out


HON_AR = re.compile(r"\s*(صلى الله عليه وسلم|صلى الله عليه وآله وسلم|صلي الله عليه وسلم|ﷺ|عليه السلام|عليهم السلام|عليها السلام|عليه الصلاة والسلام|رضي الله عنهما|رضي الله عنهم|رضي الله عنها|رضي الله عنه|رحمه الله|رحمهم الله|رحمها الله)")
HON_EN = re.compile(r"[,]?\s*\(?\b(peace (and blessings )?be upon (him|them|her)|upon (him|whom) be peace|may (God|Allah) (be pleased with|have mercy on|bless) (him|them|her)( and grant (him|them) peace)?|may (God|Allah) bless him and grant him peace|pbuh|saws|\(s\))\)?", re.I)
GROUP = re.compile(r"اليهود|يهود|الشيعة|الرافضة|النصارى|المسيحيين|المستشرقين|العلمانيين|الليبراليين|الكفار|المشركين|الغرب")
SWEEP = re.compile(r"دائما|دائماً|أبدا|أبداً|طبع|خبث|حقد|غدر|مكر|كل |جميع|لا يزالون|ما زالوا|عداوة|عدوان")


def scrub(text, lang):
    if lang == "ar":
        return re.sub(r"\s{2,}", " ", HON_AR.sub("", text)).strip()
    text = HON_AR.sub("", HON_EN.sub("", text))
    text = re.sub(r"\bAllah\b", "God", text)
    text = re.sub(r"\s+([,.;])", r"\1", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def review(sections):
    """Drop claims that attach a sweeping trait to a group; flag the sections that speak of groups. Returns the dropped claims."""
    dropped = []
    for s in sections:
        keep_ar, keep_en = [], []
        grouped = False
        for ar, en in zip(s["claims_ar"], s["claims_en"]):
            if GROUP.search(ar):
                grouped = True
                if SWEEP.search(ar):
                    dropped.append(ar); continue
            keep_ar.append(ar); keep_en.append(en)
        s["claims_ar"], s["claims_en"] = keep_ar, keep_en
        if grouped or GROUP.search(s["topic_ar"]):
            s["flags"] = ["polemical"]
    return [d for d in dropped]


def extract(a):
    lines = [(m.group(1), m.group(2)) for m in (LINE.match(l.rstrip("\n")) for l in open(a.transcript, encoding="utf8")) if m]
    graph = load_graph(a.graph)
    sections, rejects, kept, total = [], [], 0, 0
    t0 = time.time()
    for wi, win in enumerate(windows(lines)):
        text = "\n".join(f"[{t}] {x}" for t, x in win)
        winnorm = " " + norm(" ".join(x for _, x in win)) + " "
        res = chat(a.model, SYS_AR, text)
        if not res:
            continue
        for s in res.get("sections", []):
            ok = []
            for c in s.get("claims", []):
                total += 1
                q = norm(str(c.get("quote", "")))
                if len(q.split()) >= 3 and f" {q} " in winnorm and str(c.get("ar", "")).strip():
                    ok.append(c["ar"].strip()); kept += 1
                else:
                    rejects.append({"window": wi, "claim": c.get("ar"), "quote": c.get("quote")})
            if ok:
                sections.append({"time": s.get("time") or win[0][0], "topic_ar": str(s.get("topic_ar", "")).strip(), "claims_ar": ok})
        print(f"window {wi}: {len(sections)} sections so far, {kept}/{total} claims kept, {int(time.time() - t0)}s", file=sys.stderr)
    # English
    for s in sections:
        r = chat(a.model, SYS_EN, json.dumps({"topic_ar": s["topic_ar"], "claims": s["claims_ar"]}, ensure_ascii=False))
        en = (r or {}).get("claims", [])
        if len(en) != len(s["claims_ar"]):
            en = ["He says that (translation failed)" for _ in s["claims_ar"]]
        s["claims_ar"] = [scrub(x, "ar") for x in s["claims_ar"]]
        s["topic_ar"] = scrub(s["topic_ar"], "ar")
        s["claims_en"] = [scrub(str(x), "en") for x in en]
        s["topic_en"] = scrub(str((r or {}).get("topic", s["topic_ar"])), "en")
    # entities by label match
    for s in sections:
        blob = " " + norm(" ".join(s["claims_ar"]) + " " + s["topic_ar"]) + " "
        s["entities"] = list(dict.fromkeys(i for i, lab in graph if lab in blob))[:30]
        s["stated_sources"] = []
        s["flags"] = []
    dropped = review(sections)
    sections = [s for s in sections if s["claims_ar"]]
    summary = " ".join(s["topic_en"] for s in sections[:6])
    out = {"episode": a.episode, "title_ar": a.ledger_title, "summary_en": f"The episode covers: {summary}.", "sections": sections,
           "unmatched": [], "excluded": [{"what": "opening and closing praise, prayers, recitation, preaching and chat", "why": "not museum facts"}] + [{"what": d[:80], "why": "generalising judgement about a people"} for d in dropped],
           "_local": {"model": a.model, "claims_kept": kept, "claims_total": total, "seconds": int(time.time() - t0), "rejects": rejects[:20]}}
    Path(a.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
    print(f"{len(sections)} sections, {kept}/{total} claims kept, {int(time.time() - t0)}s -> {a.out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--transcript"); ap.add_argument("--ledger-title", default=""); ap.add_argument("--graph")
    ap.add_argument("--episode", type=int, default=0); ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="qwen3:32b")
    a = ap.parse_args()
    extract(a)


if __name__ == "__main__":
    main()
