#!/usr/bin/env python3
"""Translate a checked claims file into Urdu, French and Spanish with a local TranslateGemma model (no API cost).

Reads claims/epNN.json (claims-brief.md shape) and writes claims/epNN.tr.json (translate-brief.md shape). English is
the pivot for Urdu, French and Spanish; the Arabic summary is translated from the English summary; the title is
translated from the lecture's Arabic title. A section's claims go in one call as a numbered list; if the model returns a
different count the section is redone claim by claim. Quotation marks are removed and Arabic-script parentheticals are
wrapped in the direction isolates afterwards, so check_tr.py has nothing to repair.

Usage: local_translate.py --claims epNN.json --title-ar "<title as published, after the series and number>" --out epNN.tr.json
       [--model translategemma:27b-it-q8_0] [--host 127.0.0.1:11435]
Standard library only.
"""
import argparse, json, re, sys, time, urllib.request

LRI, PDI = "⁦", "⁩"
LANG = {"en": ("English", "en"), "ar": ("Arabic", "ar"), "ur": ("Urdu", "ur"), "fr": ("French", "fr"), "es": ("Spanish", "es")}


def prompt(src, tgt, text):
    (sn, sc), (tn, tc) = LANG[src], LANG[tgt]
    return (f"You are a professional {sn} ({sc}) to {tn} ({tc}) translator. Your goal is to accurately convey the meaning and nuances "
            f"of the original {sn} text while adhering to {tn} grammar, vocabulary, and cultural sensitivities.\n"
            f"Produce only the {tn} translation, without any additional explanations or commentary. "
            f"Please translate the following {sn} text into {tn}:\n\n\n{text}")


def chat(host, model, content, retries=3):
    body = {"model": model, "stream": False, "options": {"temperature": 0.1, "num_ctx": 8192},
            "messages": [{"role": "user", "content": content}]}
    for k in range(retries):
        try:
            req = urllib.request.Request(f"http://{host}/api/chat", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=1800) as r:
                return json.loads(r.read())["message"]["content"].strip()
        except Exception as e:  # noqa: BLE001
            print(f"  retry {k + 1}: {e}", file=sys.stderr); time.sleep(3)
    return ""


HON = re.compile(r"\s*[,،]?\s*(?:\(?\s*)?(صلى الله عليه وآله وسلم|صلى الله عليه وسلم|صلي الله عليه وسلم|ﷺ|عليه الصلاة والسلام|عليه السلام|عليهم السلام|عليها السلام|رضي الله عنهما|رضي الله عنهم|رضي الله عنها|رضي الله عنه|رحمه الله|رحمهم الله|صلی اللہ علیہ وآلہ وسلم|صلی اللہ علیہ وسلم|علیہ الصلوٰۃ والسلام|علیہ السلام|علیہم السلام|علیہا السلام|رضی اللہ عنہما|رضی اللہ عنہم|رضی اللہ عنہا|رضی اللہ عنہ|رحمۃ اللہ علیہ|رحمہ اللہ|que la paix (?:et les bénédictions )?(?:de Dieu )?soi(?:en)?t sur (?:lui|eux|elle)|paix (?:et salut )?sur lui|que Dieu soit satisfait de lui|la paz (?:y las bendiciones )?(?:de Dios )?sea con (?:él|ellos|ella)|que la paz sea con él|que Dios esté complacido con él|peace be upon him|may God be pleased with him)(?:\s*\))?")


def clean(text, lang):
    text = re.sub(r"[\"“”«»„‟]", "", text).strip()
    text = HON.sub("", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    if lang in ("ar", "ur"):
        text = re.sub(r"(?<!⁦)\(([^()]*[؀-ۿ][^()]*)\)", lambda m: LRI + "(" + m.group(1) + ")" + PDI, text)
    return text


def tr_one(a, src, tgt, text, title=False):
    out = clean(chat(a.host, a.model, prompt(src, tgt, text)), tgt)
    return out.rstrip(".۔。 ") if title else out


def tr_list(a, src, tgt, items):
    if not items:
        return []
    numbered = "\n".join(f"{i + 1}. {t}" for i, t in enumerate(items))
    out = chat(a.host, a.model, prompt(src, tgt, numbered))
    got = [re.sub(r"^\s*\d+[\.\)]\s*", "", l).strip() for l in out.split("\n") if re.match(r"^\s*\d+[\.\)]\s", l)]
    if len(got) != len(items):
        got = [chat(a.host, a.model, prompt(src, tgt, t)) for t in items]
    return [clean(x, tgt) for x in got]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--claims", required=True); ap.add_argument("--title-ar", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="translategemma:27b-it-q8_0"); ap.add_argument("--host", default="127.0.0.1:11435")
    a = ap.parse_args()
    c = json.load(open(a.claims, encoding="utf8"))
    t0 = time.time()
    out = {"episode": c["episode"], "title": {"en": tr_one(a, "ar", "en", a.title_ar, True)}, "summary": {"ar": tr_one(a, "en", "ar", c["summary_en"])}, "sections": []}
    for l in ("ur", "fr", "es"):
        out["title"][l] = tr_one(a, "ar", l, a.title_ar, True)
        out["summary"][l] = tr_one(a, "en", l, c["summary_en"])
    for i, s in enumerate(c["sections"]):
        sec = {}
        for l in ("ur", "fr", "es"):
            sec[f"topic_{l}"] = tr_one(a, "en", l, s["topic_en"])
            sec[f"claims_{l}"] = tr_list(a, "en", l, s["claims_en"])
        out["sections"].append(sec)
        print(f"section {i + 1}/{len(c['sections'])} {int(time.time() - t0)}s", file=sys.stderr)
    out["_engine"] = {"model": a.model, "host": "local Ollama"}
    open(a.out, "w", encoding="utf8").write(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(out['sections'])} sections, {int(time.time() - t0)}s -> {a.out}")


if __name__ == "__main__":
    main()
