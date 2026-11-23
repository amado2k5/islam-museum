#!/usr/bin/env python3
"""Azure Text Translation driver for the turkish-indonesian lane.

Same engine and key as Document Translation but ~33% cheaper ($10/M vs $15/M chars), no Blob
Storage, and markers survive exactly (no docx reparse). Reads the protected paragraphs out of
the docx files produced by build_gt.py / data_strings.py / yaml_strings.py, posts them to the
Text Translation REST API (api.cognitive.microsofttranslator.com, api-version 3.0, up to 1,000
array elements and 50k chars per request, several `to` languages in one call) and writes one
plain-text file per language — the format import_gt.py --txt and yaml_strings.py --txt consume.

    python3 scripts/local-mt/text_round.py --dir local-mt-work/tr-id --glob 'gt-tr-*-ar.docx'
    python3 scripts/local-mt/text_round.py --dir local-mt-work/data-tr-id --glob 'gtd-tr-*-ar.docx'

Ledger <dir>/text-ledger.json records per-file progress and characters sent, so reruns resume.
Env: AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_REGION.
"""
import argparse, glob as globmod, json, os, re, sys, time, urllib.request, urllib.error, zipfile

try:
    import certifi, ssl; SSL = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    import ssl; SSL = ssl.create_default_context()

API = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from={src}{tos}"
LIMIT_CHARS, LIMIT_ELEMS = 40000, 1000

def env(k):
    v = os.environ.get(k)
    if not v: sys.exit(f"missing environment variable {k}")
    return v

def docx_paras(path):
    x = zipfile.ZipFile(path).read("word/document.xml").decode("utf-8")
    out = []
    for p in re.findall(r"<w:p[ >].*?</w:p>", x, re.S):
        t = re.sub(r"<[^>]+>", "", p).replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&")
        if t.strip() or t.startswith("####"): out.append(t)
    return out

def translate(segs, src, tos, retries=5):
    url = API.format(src=src, tos="".join(f"&to={t}" for t in tos))
    body = json.dumps([{"Text": s} for s in segs], ensure_ascii=False).encode("utf-8")
    for attempt in range(retries):
        try:
            r = urllib.request.Request(url, data=body, method="POST", headers={
                "Ocp-Apim-Subscription-Key": env("AZURE_TRANSLATOR_KEY"),
                "Ocp-Apim-Subscription-Region": env("AZURE_TRANSLATOR_REGION"),
                "Content-Type": "application/json"})
            resp = json.loads(urllib.request.urlopen(r, timeout=300, context=SSL).read())
            out = {t: [] for t in tos}
            for item in resp:
                for tr in item["translations"]: out[tr["to"]].append(tr["text"])
            return out
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:
                wait = int(e.headers.get("Retry-After", 2 ** attempt * 10)); print(f"  {e.code}, retry in {wait}s"); time.sleep(wait); continue
            print("HTTP", e.code, e.read()[:300]); raise RuntimeError(f"chunk failed; first seg: {segs[0][:80]!r}")
        except Exception as e:
            if attempt == retries - 1: raise
            print("  retry:", e); time.sleep(2 ** attempt * 10)
    sys.exit("translate failed repeatedly")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--glob", default="*-ar.docx")
    ap.add_argument("--src-lang", default="ar")
    ap.add_argument("--target-langs", default="tr,id")
    ap.add_argument("--chars-per-req", type=int, default=0, help="0 = 40000 / number of target languages (multi-target requests count chars per target)")
    a = ap.parse_args()
    tos = a.target_langs.split(",")
    cap = a.chars_per_req or max(5000, LIMIT_CHARS // len(tos))
    lpath = os.path.join(a.dir, "text-ledger.json")
    ledger = json.load(open(lpath)) if os.path.exists(lpath) else {"files": {}, "chars": 0, "t0": time.time()}
    for f in sorted(globmod.glob(os.path.join(a.dir, a.glob))):
        base = os.path.basename(f)[:-5]
        if ledger["files"].get(base, {}).get("done"): continue
        paras = docx_paras(f)
        state = ledger["files"].setdefault(base, {"para_total": len(paras), "done_paras": 0, "done": False})
        out = {t: open(os.path.join(a.dir, f"{base}.{t}.txt"), "a", encoding="utf-8") for t in tos}
        i = state["done_paras"]
        t_start = time.time(); reqs = 0
        while i < len(paras):
            # chunk: as many paragraphs as fit under both limits; a paragraph over the char limit is split later upstream
            j, chars = i, 0
            while j < len(paras) and j - i < LIMIT_ELEMS and chars + len(paras[j]) <= cap:
                chars += len(paras[j]); j += 1
            if j == i:  # single paragraph over the limit: send it alone
                j = i + 1
            res = translate(paras[i:j], a.src_lang, tos)
            for t in tos:
                out[t].write("\n".join(res[t]) + "\n"); out[t].flush()
            state["done_paras"] = j; ledger["chars"] += chars; reqs += 1
            if reqs % 10 == 0: json.dump(ledger, open(lpath, "w")); print(f"  {base}: {j}/{len(paras)} paras, {ledger['chars']:,} chars, {time.strftime('%H:%M:%S')}")
            i = j
        for t in tos: out[t].close()
        state["done"] = True
        json.dump(ledger, open(lpath, "w"))
        print(f"{base}: {len(paras)} paras done in {time.time()-t_start:.0f}s; total chars {ledger['chars']:,}")
    json.dump(ledger, open(lpath, "w"))
    print(f"ALL DONE. billed ~{ledger['chars']*len(tos):,} chars across {len(tos)} targets; elapsed {time.time()-ledger['t0']:.0f}s")

if __name__ == "__main__":
    main()
