#!/usr/bin/env python3
"""Imports a Word file translated by Google Translate (document translation) back into museum records.

Pilot of 19 November 2026 (founder's request): a plain-text Word file of English prose, built by a script that hides
citations behind [[N]] markers, wraps link labels as <xN>label</xN> and opens each record with a paragraph
"#### n ####", was translated on translate.google.com and downloaded. This script splits the translated file back into
records with the JSON map written beside the English file, puts the citations and link ids back, runs the same checks
as scripts/local-mt/translate.py against the English source, and writes content/<lang>/<class>/<slug>.md only for the
records that pass. A record that fails is left alone, so the local model translates it later.

    python3 scripts/local-mt/import_gt.py --lang es --map pilot-map.json --docx translated.docx --log gt-es.log

Always from English. Nothing here calls Google: the upload and download are done by hand in a browser.
"""
import argparse, collections, html, json, os, re, sys, time, zipfile

import yaml

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from translate import BROKEN, FIXED_HEADINGS, HONORIFIC, LEVELED, ROOT, check, protect, restore  # noqa: E402

REC = re.compile(r"^\s*#{3,4}\s*(\d+)\s*#{3,4}\s*$")
ERA = {"es": [(r"(\d) (?:AH|d\. ?H\.|A\.H\.)(?!\w)", r"\1 H"), (r"(\d) (?:BCE|a\. ?e\. ?c\.|AEC)(?!\w)", r"\1 a. C."), (r"(\d) (?:CE|e\. ?c\.|EC)(?!\w)", r"\1 d. C.")],
       "fr": [(r"(\d) (?:AH|A\.H\.)(?!\w)", r"\1 H"), (r"(\d) (?:BCE|av\. ?n\. ?è\.)(?!\w)", r"\1 av. J.-C."), (r"(\d) (?:CE|EC|de notre ère)(?!\w)", r"\1 apr. J.-C.")]}


def paragraphs(path):
    x = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    def link(m):  # a Word hyperlink carries a link label; Google lets spaces, brackets and stops drift into it
        t = html.unescape("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", m.group(2), re.S)))
        core = t.strip(); lead, trail = t[:len(t) - len(t.lstrip())], t[len(t.rstrip()):]
        while core and core[-1] in ".,;:!?»”" or (core.endswith(")") and core.count("(") < core.count(")")): trail = core[-1] + trail; core = core[:-1].rstrip()
        while core and (core[0] in "«“" or (core.startswith("(") and core.count("(") > core.count(")"))): lead += core[0]; core = core[1:].lstrip()
        return "<w:t>" + html.escape(f"{lead}<x{m.group(1)}>{core}</x{m.group(1)}>{trail}", quote=False) + "</w:t>"

    # Google Docs renames the anchors (x1 -> "98ct4i7k3fb7") but keeps one name per anchor. xN is in a paragraph only
    # if x1..xN-1 are, so the anchors' frequencies fall in the order of N; a tie is left unmapped (its records fail).
    x = re.sub(r"<w:hyperlink\b[^>]*/>", "", x)  # an empty link tag (Word writes one now and then) must not be read as the start of a link
    names = collections.Counter(re.findall(r'<w:hyperlink\b[^>]*w:anchor="([^"]+)"', x))
    x = re.sub(r'<w:hyperlink\b[^>]*w:anchor="c(\d+)"[^>]*>.*?</w:hyperlink>', lambda m: f"<w:t> [[{m.group(1)}]]</w:t>", x, flags=re.S)  # a citation carried as a link
    if any(not re.fullmatch(r"x\d+", n) and not re.fullmatch(r"c\d+", n) for n in names):
        ranked = names.most_common()
        alias = {n: i + 1 for i, (n, c) in enumerate(ranked) if all(c != c2 for j, (_, c2) in enumerate(ranked) if j != i)}
        x = re.sub(r'(<w:hyperlink\b[^>]*w:anchor=")([^"]+)(")', lambda m: f"{m.group(1)}x{alias[m.group(2)]}{m.group(3)}" if m.group(2) in alias else m.group(0), x)
    x = re.sub(r'<w:hyperlink\b[^>]*w:anchor="x(\d+)"[^>]*>(.*?)</w:hyperlink>', link, x, flags=re.S)
    return [html.unescape("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", m.group(0), re.S))) for m in re.finditer(r"<w:p[ >].*?</w:p>|<w:p/>", x, re.S)]


def tidy(s):
    s = s.replace(" ", " ").replace(" ", " ")
    s = re.sub(r"<\s*(/?)\s*x\s*(\d+)\s*>", r"<\1x\2>", s, flags=re.I)  # "< x1 >", "</ X1>"
    s = re.sub(r"(?<=[\w»”)\],;:])(<x\d+>)", r" \1", s); s = re.sub(r"(</x\d+>)(?=[\w«“(])", r"\1 ", s)  # a link glued to its neighbour word
    s = re.sub(r"\[\s*\[\s*(\d+)\s*\]\s*\]", r"[[\1]]", s)
    s = re.sub(r" {2,}", " ", s)
    s = re.sub(r"(\[\[\d+\]\])(?=[\w«“(])", r"\1 ", s)  # a citation marker glued to the next word
    s = re.sub(r"\( +", "(", s); s = re.sub(r" +(?=[.,)])", "", s)  # spaces Google leaves around a moved link
    return s.strip()


def from_numbers(s):
    """Numeric scheme: 80000000NN is citation marker NN, 81000000NN / 82000000NN open and close link NN."""
    s = re.sub(r"8[012](?:[ \u00a0\u202f.,]?\d){8}", lambda m: re.sub(r"\D", "", m.group(0)), s)
    s = re.sub(r"\(?\b80(\d{8})\b\)?", lambda m: f"[[{int(m.group(1))}]]", s)
    s = re.sub(r"\(?\b81(\d{8})\b\)?[,;]?\s*", lambda m: f"<x{int(m.group(1))}>", s)
    return re.sub(r"\s*\(?\b82(\d{8})\b\)?", lambda m: f"</x{int(m.group(1))}>", s)


def repair(tr, en, kept, links):
    """Google often strips the <xN> tags and sometimes a [[N]] marker. Put back what can be put back without guessing:
    "[N]" becomes "[[N]]"; a citation marker that closed the English paragraph is appended to the translation; a link
    whose English label (a name, usually) stands exactly once in the translation is wrapped again."""
    src = protect(en)[0]
    for i in range(1, len(kept) + 1):
        if f"[[{i}]]" in tr: continue
        tr, n = re.subn(rf"(?<!\[)\[{i}\](?!\])", f"[[{i}]]", tr)
        if n == 1: continue
        if n == 0 and re.search(rf"\[\[{i}\]\](?:[\s.;,:)]|\[\[\d+\]\])*$", src): tr = tr.rstrip() + f" [[{i}]]"
    for i in range(1, len(links) + 1):
        if f"<x{i}>" in tr or f"</x{i}>" in tr: continue
        m = re.search(rf"<x{i}>([^<]*)</x{i}>", src)
        label = m.group(1).strip() if m else ""
        plain = re.sub(r"<x\d+>[^<]*</x\d+>", lambda mm: " " * len(mm.group(0)), tr)  # never wrap inside another link
        hits = [h.start() for h in re.finditer(rf"(?<!\w){re.escape(label)}(?!\w)", plain)] if len(label) >= 3 else []
        if len(hits) == 1: tr = tr[:hits[0]] + f"<x{i}>{label}</x{i}>" + tr[hits[0] + len(label):]
    return tr


ARABIC = re.compile(r"[\u0600-\u06FF]")
UR_HONORIFIC = re.compile(r"(صلی اللہ علیہ|علیہ السلام|علیہا السلام|رضی اللہ عن|رحمہ اللہ|رحمۃ اللہ علیہ|ﷺ)")


def heading_map(src, lang):
    """Section headings the target language already uses for a source heading, learnt from the records that exist
    in both languages (same number of headings, pair seen 20 times or more and nine times in ten)."""
    pairs, total = collections.Counter(), collections.Counter()
    root = os.path.join(ROOT, "content", src)
    for d, _, fs in os.walk(root):
        for f in fs:
            t = os.path.join(ROOT, "content", lang, os.path.relpath(os.path.join(d, f), root))
            if not f.endswith(".md") or not os.path.exists(t): continue
            a = re.findall(r"^#{1,6} (.+)$", open(os.path.join(d, f), encoding="utf-8").read(), re.M)
            b = re.findall(r"^#{1,6} (.+)$", open(t, encoding="utf-8").read(), re.M)
            if len(a) != len(b): continue
            for x, y in zip(a, b): pairs[x.strip(), y.strip()] += 1; total[x.strip()] += 1
    return {x: y for (x, y), n in pairs.items() if n >= 20 and n >= 0.9 * total[x]}


def check_any(src_body, tr_body, src, lang):
    """The structural checks of translate.check() for pairs other than English -> Spanish/French."""
    links = lambda b: sorted(m.group(1).strip() for m in re.finditer(r"\[\[([^\]|]+)(?:\|[^\]]*)?\]\]", b))
    cites = lambda b: sorted(re.findall(r"\{cite:[^}]*\}", b))
    heads = lambda b: [m.group(1) for m in re.finditer(r"^(#{1,6}) .+$", b, re.M)]
    paras = lambda b: len([x for x in re.split(r"\n\s*\n", b) if x.strip()])
    words = lambda b: len(re.sub(r"\{cite:[^}]*\}|\[\[[^\]|]+\|", "", b).split())
    if re.search(r"</?[sx]\d+>|\[\[\d+\]\]|\b8[012]\d{8}\b", tr_body): return "internal marker left in the text"
    if links(src_body) != links(tr_body): return "wiki-link ids differ"
    if cites(src_body) != cites(tr_body): return "cite markers differ"
    if heads(src_body) != heads(tr_body): return "heading structure differs"
    if paras(src_body) != paras(tr_body): return "paragraph count differs"
    r = words(tr_body) / max(1, words(src_body)); lo, hi = (0.9, 2.4) if (src, lang) == ("ar", "en") else (0.7, 2.0)
    if not lo <= r <= hi: return f"length ratio {r:.2f}"
    m = (UR_HONORIFIC if lang == "ur" else HONORIFIC).search(tr_body)
    if m: return f"typed honorific: {m.group(0)}"
    if re.search("[﴿﴾]", tr_body): return "Qur'an brackets"
    plain = re.sub(r"\[\[[^\]|]+\||\{cite:[^}]*\}", "", tr_body); letters = len(re.findall(r"[A-Za-z\u0600-\u06FF]", plain)) or 1
    if lang == "en" and len(ARABIC.findall(plain)) / letters > 0.15: return "looks untranslated"
    if lang == "ur" and len(re.findall(r"[A-Za-z]", plain)) / letters > 0.35: return "looks untranslated"
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", required=True, choices=["es", "fr", "en", "ur"])
    ap.add_argument("--src", default="en", choices=["en", "ar"], help="language the file was translated from")
    ap.add_argument("--map", required=True)
    ap.add_argument("--docx", default="")
    ap.add_argument("--txt", default="", help="a plain-text answer instead of a Word file (Gemini): one paragraph per line")
    ap.add_argument("--log", required=True)
    ap.add_argument("--out", default=ROOT)
    ap.add_argument("--engine", default="google", choices=["google", "word", "gemini"], help="who translated the file: Google Translate documents, or Word for Mac (Microsoft Translator)")
    ap.add_argument("--taken", default="", help="file of ids another lane is translating; never written")
    ap.add_argument("--date", default=time.strftime("%Y-%m-%d"), help="day the file was translated on translate.google.com")
    a = ap.parse_args()
    lang, records = a.lang, json.load(open(a.map, encoding="utf-8"))
    paras = [l.strip() for l in open(a.txt, encoding="utf-8").read().split("\n") if l.strip() and not l.strip().startswith("```")] if a.txt else paragraphs(a.docx)
    chunks, cur = {}, None  # record number -> its translated paragraphs
    for p in paras:
        m = REC.match(p)
        if m: cur = int(m.group(1)); chunks[cur] = []
        elif cur is not None: chunks[cur].append(p)
    tally = collections.Counter(); english, last_ok = [], 0
    plain_pair = (a.src == "en" and lang in ("es", "fr"))  # the pair the lane began with: its own checks and fixed headings
    fixed = FIXED_HEADINGS[lang] if plain_pair else heading_map(a.src, lang)
    taken = set(l.strip() for l in open(a.taken, encoding="utf-8")) if a.taken and os.path.exists(a.taken) else set()
    with open(a.log, "a", encoding="utf-8") as lg:
        def note(event, ident, **kw):
            tally[kw.get("reason", event).split(":")[0]] += 1
            lg.write(json.dumps({"t": time.strftime("%Y-%m-%dT%H:%M:%S"), "event": event, "id": ident, **kw}, ensure_ascii=False) + "\n")

        for n, rec in enumerate(records, 1):
            ident = rec["id"]; target = os.path.join(a.out, "content", lang, ident + ".md")
            if os.path.exists(target): note("skipped", ident, reason="already translated"); continue
            if ident in taken: note("skipped", ident, reason="taken by another lane"); continue
            raw = open(os.path.join(ROOT, "content", a.src, ident + ".md"), encoding="utf-8").read()
            m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
            todo = [l for l in rec["lines"] if "en" in l]
            got = chunks.get(n)
            try:
                if not m: raise ValueError("no frontmatter")
                fm, body = yaml.safe_load(m.group(1)), m.group(2)
                if LEVELED.search(body) or BROKEN.search(body): raise ValueError("held")
                if body.split("\n") != [l["fixed"] if "fixed" in l else l["prefix"] + l["en"] for l in rec["lines"]]:
                    raise ValueError("English changed since the file was built")
                if got is None or len(got) != len(todo): raise ValueError("paragraphs do not line up")
                out, it = [], iter(got)
                for l in rec["lines"]:
                    if "fixed" in l: out.append(l["fixed"]); continue
                    tr, head = next(it), l["prefix"].startswith("#")
                    tr = tidy(from_numbers(tr) if rec.get("scheme") in ("num", "link", "link2") else tr)
                    if head and l["en"].strip() in fixed: out.append(l["prefix"] + fixed[l["en"].strip()]); continue
                    for m in re.finditer(r"(?<!\*)(\*{1,2})([^*\n]{2,80})\1(?!\*)", l["en"]):  # emphasis dropped around a title kept as written: put it back
                        whole, inner = m.group(0), m.group(2)
                        if whole not in tr and len(re.findall(rf"(?<![\w*]){re.escape(inner)}(?![\w*])", tr)) == 1:
                            tr = re.sub(rf"(?<![\w*]){re.escape(inner)}(?![\w*])", lambda _: whole, tr, count=1)
                    for star in ("**", "*"):  # Markdown emphasis must survive as written
                        if l["en"].count(star) != tr.count(star): raise ValueError("emphasis marks changed")
                    if re.search(r"\*\s+[^*]+\s+\*", tr) and not re.search(r"\*\s+[^*]+\s+\*", l["en"]): raise ValueError("emphasis marks changed")
                    done = restore(tr, l["kept"], l["links"])
                    if done is None: done = restore(repair(tr, l["en"], l["kept"], l["links"]), l["kept"], l["links"])
                    if done is None or not done.strip(): raise ValueError("markers lost")
                    for pat, rep in ERA.get(lang, []): done = re.sub(pat, rep, done)
                    if lang == "ur":  # Arabic-script parentheticals are isolated (AGENTS.md); others are left plain
                        done = done.replace("\u2066", "").replace("\u2069", "")
                        done = re.sub(r"\(([^()]*[\u0600-\u06FF][^()]*)\)", "\u2066(\\1)\u2069", done)
                    elif not plain_pair:  # Latin-script target from Arabic: keep the isolates only where Arabic is inside
                        done = re.sub(r"\u2066\(([^()\u0600-\u06FF]*)\)\u2069", r"(\1)", done)
                        if done.count("\u2066") != done.count("\u2069"): done = done.replace("\u2066", "").replace("\u2069", "")
                    if lang == "es":  # the lane's term is "suní" (the validator reads the first perspectives label by it)
                        done = re.sub(r"\b([Ss])unitas\b", r"\1uníes", done); done = re.sub(r"\b([Ss])unita\b", r"\1uní", done)
                        done = re.sub(r"^\*\*Punto de vista suní", "**Visión suní", done)
                        if re.match(r"\*\*Sunni", l["en"]) and not re.match(r"\*\*[^*]*\b[Ss]unn?í(?:es)?\b", done): raise ValueError("Sunni label reworded")
                    if head and not l["en"].endswith("."): done = done.rstrip(".")
                    out.append(l["prefix"] + done)
                tr_body = "\n".join(out)
                problem = check(body, tr_body, lang) if plain_pair else check_any(body, tr_body, a.src, lang)
                if problem: raise ValueError(problem)
                who = (f"Google Translate (document translation on translate.google.com, {a.date})", "google-translate", "Google Translate documents", "gt-docs") if a.engine == "google" else \
                      (f"Google Gemini (gemini.google.com, Task mode, model shown as Hydrogen, {a.date})", "gemini (Hydrogen)", "Google Gemini in the browser", "gemini") if a.engine == "gemini" else \
                      (f"Microsoft Translator (Translate Document in Word for Mac, {a.date})", "microsoft-translator", "Word for Mac Translate Document", "word-docs")
                new = {"id": ident, "lang": lang, "source_lang": a.src, "translators": [f"{who[0]}, draft translation"]}
                for k, v in fm.items():
                    if k not in ("id", "lang", "source_lang", "translators", "provenance", "translation_of"): new[k] = v
                new["provenance"] = {"generated_by": f"scripts/local-mt/import_gt.py (spanish lane, {who[2]}, managed by Claude Code)",
                                     "model": who[1], "run": f"{who[3]}-{lang}-{a.date}", "source": f"content/{a.src}/{ident}.md"}
                text = "---\n" + yaml.safe_dump(new, allow_unicode=True, sort_keys=False, width=10000, default_flow_style=None).rstrip("\n") + "\n---\n" + tr_body
                if not text.endswith("\n"): text += "\n"
                os.makedirs(os.path.dirname(target), exist_ok=True)
                with open(target + ".tmp", "w", encoding="utf-8") as f: f.write(text)
                os.replace(target + ".tmp", target)
                note("ok", ident, words=len(body.split())); last_ok = n
            except ValueError as e:
                note("failed", ident, reason=str(e)[:200])
                if a.engine == "word" and str(e) == "looks untranslated": english.append((n, ident))  # judged after the loop
                else:
                    with open(a.log + ".failed", "a", encoding="utf-8") as ff: ff.write(f"{ident}\t{e}\n")
    # Word leaves the tail of a long file in English: those records go into a later file. A record left in English
    # BEFORE the last translated one was reached by Word and still reads as English: that one has failed.
    with open(a.log + ".failed", "a", encoding="utf-8") as ff:
        for n, ident in english:
            if n < last_ok: ff.write(f"{ident}\tlooks untranslated\n")
    print(f"{lang}: {len(records)} records in the file; " + ", ".join(f"{k} {v}" for k, v in tally.most_common()))


if __name__ == "__main__":
    main()
