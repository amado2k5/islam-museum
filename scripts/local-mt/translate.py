#!/usr/bin/env python3
"""Local machine translation of museum prose, English -> Spanish or French, with a model served by Ollama on this Mac.

Founder instruction, 18 November 2026: from wave 11 on the translation itself runs on the founder's Mac with a local
model; Claude manages the run (queue, checks, shipping). Always from English.

    python3 scripts/local-mt/translate.py --lang es --log /Volumes/exmicroSD/islam-museum-local-mt/logs/es.log
    python3 scripts/local-mt/translate.py --lang fr --classes event,place,work --limit 20

What it does, per record (shortest first, class by class):
  * reads content/en/<class>/<slug>.md, never anything else;
  * protects what must survive verbatim ({cite:...}, (needs_source...), [[id|label]] ids, code, URLs) behind numbered
    markers, sends each paragraph to the model, and puts the protected text back;
  * checks the result against the English (same link ids, same cite markers, same headings and paragraphs, length ratio,
    no typed honorific, not left in English) and writes content/<lang>/<class>/<slug>.md only if every check passes;
  * appends one JSON line per record to the log (ok / failed with the reason), so a supervisor or a person can tail it.
It is restartable: a record that already has a file in the target language is skipped.
"""
import argparse, concurrent.futures, glob, itertools, json, os, re, sys, threading, time, urllib.request

import yaml

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LANG_NAME = {"es": "Spanish", "fr": "French"}
SPINE = ["event", "place", "work", "person", "concept", "building", "object"]
SACRED = ["practice", "question", "passage"]  # last: translated from English like the rest (founder, 18 Nov 2026)
LEVELED = re.compile(r"^## (For Sprouts|For Explorers|For Scholars)\s*$", re.M)
BROKEN = re.compile(r"^\s+(ur|ar|en|fr|es): \"", re.M)  # a frontmatter line that leaked into the prose
HONORIFIC = re.compile(
    r"(peace be upon him|\bpbuh\b|\(saw\)|ﷺ|la paz sea con (él|ella)|que dios (esté|este) (complacido|satisfecho)|que dios tenga misericordia"
    r"|paix (soit )?sur lui|que dieu soit satisfait|que dieu l'agrée|que dieu lui fasse miséricorde|صلى الله عليه|عليه السلام|رضي الله ع|رحمه الله)", re.I)
FIXED_HEADINGS = {
    "es": {"Brief": "En breve", "For young visitors": "Para los visitantes jóvenes", "Notes for scholars": "Notas para investigadores",
           "Notes for researchers": "Notas para investigadores", "Overview": "Visión general", "Summary": "Resumen", "Legacy": "Legado",
           "Sources": "Fuentes", "References": "Referencias", "Curatorial notes": "Notas curatoriales", "Life": "Vida", "Works": "Obras"},
    "fr": {"Brief": "En bref", "For young visitors": "Pour les jeunes visiteurs", "Notes for scholars": "Notes pour les chercheurs",
           "Notes for researchers": "Notes pour les chercheurs", "Overview": "Vue d'ensemble", "Summary": "Résumé", "Legacy": "Héritage",
           "Sources": "Sources", "References": "Références", "Curatorial notes": "Notes de conservation", "Life": "Vie", "Works": "Œuvres"},
}
ERA_RULE = {
    "es": 'Write "AH" as "H" (91 AH -> 91 H), "CE" as "d. C." and "BCE" as "a. C."; write "Qur\'an" as "Corán".',
    "fr": 'Write "AH" as "H" (91 AH -> 91 H), "CE" as "apr. J.-C." and "BCE" as "av. J.-C."; write "Qur\'an" as "Coran".',
}
STOP = re.compile(r"\b(the|and|was|were|which|with|from|that|his|their)\b", re.I)
PROTECT = re.compile(
    r"(⁦?\(needs_source[^)]*\)⁩?|\{\{?cite:[^}]*\}\}?|`[^`\n]*`|https?://[^\s)>\]]+|<[^>\n]+>|\[\[[^\]|]+\]\])")
LINK = re.compile(r"\[\[([^\]|]+)\|([^\]]*)\]\]")


def log(path, **rec):
    rec["t"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    line = json.dumps(rec, ensure_ascii=False)
    with open(path, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def call_model(host, model, lang, text, temperature=0.0):
    name = LANG_NAME[lang]
    prompt = (f"You are a professional English (en) to {name} ({lang}) translator. Your goal is to accurately convey the meaning and nuances "
              f"of the original English text while adhering to {name} grammar, vocabulary, and cultural sensitivities.\n"
              f"Produce only the {name} translation, without any additional explanations or commentary. "
              f"Keep every marker of the form [[N]] and every pair <xN>…</xN> and <sN>…</sN> exactly as written, in the matching place; translate what is inside each <sN>…</sN> separately. "
              f"Keep personal names and transliterated Arabic terms in the spelling the English uses. "
              f"Stay close to the source: add no explanation, cause or word that is not in the English, and keep every attribution and hedge exactly as strong as it is. "
              f"{ERA_RULE[lang]} "
              f"Please translate the following English text into {name}:\n\n\n{text}")
    body = json.dumps({"model": model, "stream": False, "messages": [{"role": "user", "content": prompt}],
                       "options": {"temperature": temperature, "num_ctx": 8192, "num_predict": 4096}}).encode()
    req = urllib.request.Request(f"{host}/api/chat", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=900) as r:
        d = json.loads(r.read())
    return d["message"]["content"].strip(), d.get("eval_count", 0), d.get("eval_duration", 0)


def protect(text, base_k=0, base_l=0):
    """Hide what must survive verbatim behind [[N]] markers and wrap link labels in <xN>…</xN>. Returns (source, kept, link ids)."""
    kept, links = [], []

    def keep(m):
        kept.append(m.group(0)); return f"[[{base_k + len(kept)}]]"

    def link(m):
        links.append(m.group(1)); return f"<x{base_l + len(links)}>{m.group(2)}</x{base_l + len(links)}>"

    src = PROTECT.sub(keep, text)  # first: its HTML pattern must never see the <xN> link tags added next
    src = LINK.sub(link, src)
    return src, kept, links


def restore(out, kept, links, base_k=0, base_l=0):
    """Put the protected text back. Returns None if a marker or a link tag did not survive exactly once."""
    for i in range(len(kept)):
        if out.count(f"[[{base_k + i + 1}]]") != 1: return None
    for i in range(len(links)):
        if len(re.findall(rf"<x{base_l + i + 1}>[^<]*</x{base_l + i + 1}>", out)) != 1: return None
    if len(re.findall(r"\[\[\d+\]\]", out)) != len(kept) or len(re.findall(r"<x\d+>", out)) != len(links): return None
    for i, ident in enumerate(links):
        out = re.sub(rf"<x{base_l + i + 1}>([^<]*)</x{base_l + i + 1}>", lambda m, ident=ident: f"[[{ident}|{m.group(1).strip()}]]", out)
    for i, k in enumerate(kept):
        out = out.replace(f"[[{base_k + i + 1}]]", k)
    return out


def translate_text(host, model, lang, text, stats):
    """Translate one run of prose, keeping protected spans and link ids intact. Raises ValueError if they do not survive."""
    if not re.search(r"[A-Za-z]{2}", text):
        return text
    src, kept, links = protect(text)
    last = None
    for temp in (0.0, 0.3, 0.6):
        out, n, dur = call_model(host, model, lang, src, temp)
        stats["tokens"] += n; stats["ns"] += dur
        out = out.replace("\n\n", " ").replace("\n", " ").strip()
        done = restore(out, kept, links)
        if done is not None: return done
        last = out
    raise ValueError(f"markers lost after 3 attempts: {last[:120]!r}")


BATCH_WORDS = 260  # short runs of prose are sent together: one request instead of one per paragraph


def translate_group(host, model, lang, texts, stats):
    """Translate several runs in one request, each wrapped as <sN>…</sN>. Falls back to one request per run."""
    if len(texts) == 1: return [translate_text(host, model, lang, texts[0], stats)]
    parts, meta, bk, bl = [], [], 0, 0
    for i, t in enumerate(texts):
        src, kept, links = protect(t, bk, bl)
        parts.append(f"<s{i + 1}>{src}</s{i + 1}>"); meta.append((kept, links, bk, bl)); bk += len(kept); bl += len(links)
    out, n, dur = call_model(host, model, lang, "\n".join(parts), 0.0)
    stats["tokens"] += n; stats["ns"] += dur
    res = []
    for i, (kept, links, k0, l0) in enumerate(meta):
        m = re.findall(rf"<s{i + 1}>(.*?)</s{i + 1}>", out, re.S)
        done = restore(m[0].replace("\n", " ").strip(), kept, links, k0, l0) if len(m) == 1 else None
        if done is None or not done.strip():
            stats["fallbacks"] = stats.get("fallbacks", 0) + 1
            return [translate_text(host, model, lang, t, stats) for t in texts]
        res.append(done)
    return res


def translate_body(host, model, lang, body, stats):
    # Pass 1: lay the body out as fixed pieces and runs to translate. Pass 2: translate the runs in groups. Pass 3: join.
    layout, runs = [], []  # layout: list of blocks, each a list of lines; a line is a str or (prefix, run index, heading?)

    def run(prefix, text, head=False):
        if not re.search(r"[A-Za-z]{2}", text): return prefix + text
        runs.append(text); return (prefix, len(runs) - 1, head, text)

    for block in body.split("\n\n"):
        lines = []
        for line in block.split("\n"):
            if not line.strip() or line.strip() in (":::", ":::perspectives") or re.fullmatch(r"\s*[-|: ]+\s*", line):
                lines.append(line); continue
            m = re.match(r"^(#{1,6} )(.*)$", line)
            if m:
                head = m.group(2).strip()
                lines.append(m.group(1) + FIXED_HEADINGS[lang][head] if head in FIXED_HEADINGS[lang] else run(m.group(1), head, True)); continue
            m = re.match(r"^(\s*(?:[-*]|\d+\.) +)(.*)$", line) or re.match(r"^(> ?)(.*)$", line)
            lines.append(run(m.group(1), m.group(2)) if m else run("", line))
        layout.append(lines)
    done, group, words = {}, [], 0

    def flush():
        nonlocal group, words
        if group:
            for i, tr in zip(group, translate_group(host, model, lang, [runs[i] for i in group], stats)): done[i] = tr
        group, words = [], 0

    for i, t in enumerate(runs):
        w = len(t.split())
        if w > BATCH_WORDS: flush(); done[i] = translate_text(host, model, lang, t, stats); continue
        if words + w > BATCH_WORDS: flush()
        group.append(i); words += w
    flush()
    out = []
    for lines in layout:
        res = []
        for ln in lines:
            if isinstance(ln, str): res.append(ln); continue
            prefix, i, head, src = ln
            tr = done[i]
            if head and not src.endswith("."): tr = tr.rstrip(".")  # the model likes to close a heading with a full stop
            res.append(prefix + tr)
        out.append("\n".join(res))
    return "\n\n".join(out)


def check(en_body, tr_body, lang):
    links = lambda b: sorted(m.group(1).strip() for m in re.finditer(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", b))
    cites = lambda b: sorted(re.findall(r"\{cite:[^}]*\}", b))
    heads = lambda b: [m.group(1) for m in re.finditer(r"^(#{1,6}) .+$", b, re.M)]
    paras = lambda b: len([x for x in re.split(r"\n\s*\n", b) if x.strip()])
    words = lambda b: len(re.sub(r"\{cite:[^}]*\}", "", b).split())
    if re.search(r"</?[sx]\d+>|\[\[\d+\]\]", tr_body): return "internal marker left in the text"
    if links(en_body) != links(tr_body): return "wiki-link ids differ"
    if cites(en_body) != cites(tr_body): return "cite markers differ"
    if heads(en_body) != heads(tr_body): return "heading structure differs"
    if paras(en_body) != paras(tr_body): return "paragraph count differs"
    we, wt = words(en_body), words(tr_body)
    r = wt / max(1, we)
    if r < (0.7 if we < 120 else 0.85) or r > 1.6: return f"length ratio {r:.2f}"
    m = HONORIFIC.search(tr_body)
    if m: return f"typed honorific: {m.group(0)}"
    if re.search("[﴿﴾]", tr_body): return "Qur'an brackets"
    plain = re.sub(r"\{cite:[^}]*\}", "", re.sub(r"\[\[[^\]|]+", "[[", tr_body))  # source keys such as {cite:the-ten-…} are not prose
    if len(STOP.findall(plain)) / max(1, wt) > 0.04: return "looks untranslated"
    return None


def queue(lang, classes, taken):
    exc = set(re.findall(r"^- `([a-z_]+/[^`]+)`", open(os.path.join(ROOT, "docs/delegation/extremism-firewall-exceptions.md"), encoding="utf-8").read(), re.M))
    all_classes = sorted(os.listdir(os.path.join(ROOT, "content", "en")))
    order = classes or (SPINE + [c for c in all_classes if c not in SPINE and c not in SACRED] + SACRED)
    for cls in order:
        items = []
        for en in glob.glob(os.path.join(ROOT, "content", "en", cls, "*.md")):
            slug = os.path.basename(en)[:-3]; ident = f"{cls}/{slug}"
            if ident in exc or ident in taken or (cls == "passage" and slug.startswith("quran-")): continue
            if os.path.exists(os.path.join(ROOT, "content", lang, cls, slug + ".md")): continue
            items.append((os.path.getsize(en), ident))
        for _, ident in sorted(items):
            yield ident


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", required=True, choices=["es", "fr"])
    ap.add_argument("--model", default="translategemma:27b")
    ap.add_argument("--host", default="http://127.0.0.1:11500")
    ap.add_argument("--classes", default="")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--workers", type=int, default=1, help="records translated at once (2 per language fills the MLX server's batch of 4)")
    ap.add_argument("--log", required=True)
    ap.add_argument("--out", default=ROOT, help="root that receives content/<lang>/… (default: the repository)")
    ap.add_argument("--taken", default="", help="file of ids to skip (already translated elsewhere)")
    ap.add_argument("--failed", default="", help="file of ids that failed before; skipped unless --retry-failed")
    ap.add_argument("--retry-failed", action="store_true")
    ap.add_argument("--ids", default="", help="comma-separated record ids to translate (for pilots); ignores the queue")
    a = ap.parse_args()
    lang = a.lang
    taken = set(l.strip() for l in open(a.taken, encoding="utf-8")) if a.taken and os.path.exists(a.taken) else set()
    failed_path = a.failed or a.log + ".failed"
    if not a.retry_failed and os.path.exists(failed_path):
        taken |= set(l.split("\t")[0].strip() for l in open(failed_path, encoding="utf-8"))
    run = f"local-mt-{lang}-{time.strftime('%Y-%m-%d')}"
    done = [0]
    lock = threading.Lock()
    log(a.log, event="start", lang=lang, model=a.model, pid=os.getpid(), workers=a.workers)

    def do_record(ident):
        target = os.path.join(a.out, "content", lang, ident + ".md")
        if os.path.exists(target): return
        raw = open(os.path.join(ROOT, "content", "en", ident + ".md"), encoding="utf-8").read()
        m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
        t0 = time.time(); stats = {"tokens": 0, "ns": 0}
        try:
            if not m: raise ValueError("no frontmatter")
            fm, body = yaml.safe_load(m.group(1)), m.group(2)
            if LEVELED.search(body): raise ValueError("held: reading-level sections")
            if BROKEN.search(body): raise ValueError("held: English file is damaged")
            tr = translate_body(a.host, a.model, lang, body, stats)
            problem = check(body, tr, lang)
            if problem: raise ValueError(problem)
            new = {"id": ident, "lang": lang, "source_lang": "en",
                   "translators": [f"TranslateGemma 27B ({a.model}, run locally on the founder's Mac), draft translation"]}
            for k, v in fm.items():
                if k not in ("id", "lang", "source_lang", "translators", "provenance", "translation_of"): new[k] = v
            new["provenance"] = {"generated_by": "scripts/local-mt/translate.py (spanish lane, local machine translation, managed by Claude Code)",
                                 "model": a.model, "run": run, "source": f"content/en/{ident}.md"}
            text = "---\n" + yaml.safe_dump(new, allow_unicode=True, sort_keys=False, width=10000, default_flow_style=None).rstrip("\n") + "\n---\n" + tr
            if not text.endswith("\n"): text += "\n"
            os.makedirs(os.path.dirname(target), exist_ok=True)
            tmp = target + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f: f.write(text)
            os.replace(tmp, target)
            with lock:
                done[0] += 1
                log(a.log, event="ok", id=ident, words=len(body.split()), secs=round(time.time() - t0, 1),
                    tok_s=round(stats["tokens"] / (stats["ns"] / 1e9), 1) if stats["ns"] else 0, n=done[0])
        except (ValueError, KeyError) as e:
            with lock:
                with open(failed_path, "a", encoding="utf-8") as f: f.write(f"{ident}\t{e}\n")
                log(a.log, event="failed", id=ident, reason=str(e)[:200], secs=round(time.time() - t0, 1))
        except Exception as e:  # the server is down or busy: stop, the supervisor restarts us
            with lock:
                log(a.log, event="crash", id=ident, reason=repr(e)[:300])
            os._exit(2)

    ids = [i for i in a.ids.split(",") if i] if a.ids else queue(lang, [c for c in a.classes.split(",") if c], taken)
    if a.limit: ids = itertools.islice(ids, a.limit)
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
        list(pool.map(do_record, ids))
    done = done[0]
    log(a.log, event="done", lang=lang, translated=done)


if __name__ == "__main__":
    main()
