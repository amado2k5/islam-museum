#!/usr/bin/env python3
"""Drives Azure AI Document Translation (async batch) for the local-mt Word files (turkish-indonesian lane).

    python3 scripts/local-mt/azure_round.py containers
    python3 scripts/local-mt/azure_round.py round --src-lang ar --target-langs tr,id --dir DIR --glob 'azdocs-*-ar.docx'
    python3 scripts/local-mt/azure_round.py submit --dir DIR --glob 'azdocs-*-ar.docx'
    python3 scripts/local-mt/azure_round.py poll
    python3 scripts/local-mt/azure_round.py download --dir DIR
    python3 scripts/local-mt/azure_round.py status

The Word file format is the one build_gt.py / data_strings.py write (#### n #### markers, hyperlink link labels):
nothing here changes it — the file is uploaded, translated and downloaded byte for byte.

Credentials come from the environment and are never written to the repository:
    AZURE_TRANSLATOR_ENDPOINT   https://<name>.cognitiveservices.azure.com
    AZURE_TRANSLATOR_KEY        resource key
    AZURE_TRANSLATOR_REGION     e.g. eastus
    AZURE_STORAGE_CONNECTION_STRING  DefaultEndpointsProtocol=...;AccountKey=...

The ledger DIR/azure-ledger.json makes every step resumable: batch id, per-file status, which blobs are up, which
downloads are in. A batch translates one source container; targets tr and id in the same job (up to 10 targets allowed).
"""
import argparse, base64, datetime, glob as globmod, hashlib, hmac, json, os, re, sys, time, urllib.parse, urllib.request

def env(k):
    v = os.environ.get(k)
    if not v: sys.exit(f"missing environment variable {k}")
    return v

def storage():
    parts = dict(x.split("=", 1) for x in env("AZURE_STORAGE_CONNECTION_STRING").rstrip(";").split(";"))
    return parts["AccountName"], parts["AccountKey"]

ACCT, KEY = None, None
def acct_key():
    global ACCT, KEY
    if ACCT is None: ACCT, KEY = storage()
    return ACCT, KEY

def sas(container, perms, days=2):
    """Service SAS for a whole container, signed with the account key."""
    acct, key = acct_key()
    st = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=10)
    se = st + datetime.timedelta(days=days)
    f = lambda d: d.strftime("%Y-%m-%dT%H:%M:%SZ")
    sv, sr = "2020-12-06", "c"
    canonical = f"/blob/{acct}/{container}"
    tosign = "\n".join([perms, f(st), f(se), canonical, "", "", "https", sv, sr, "", "", "", "", "", ""])
    sig = base64.b64encode(hmac.new(base64.b64decode(key), tosign.encode(), hashlib.sha256).digest()).decode()
    q = urllib.parse.urlencode({"sp": perms, "st": f(st), "se": f(se), "spr": "https", "sv": sv, "sr": sr, "sig": sig})
    return f"https://{acct}.blob.core.windows.net/{container}?{q}"

def req(method, url, data=None, headers=None, raw=False):
    r = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    with urllib.request.urlopen(r, timeout=300) as resp:
        return (resp.read() if raw else resp.read().decode("utf-8")), dict(resp.headers)

def blob(method, url, data=None, headers=None):
    return req(method, url, data, {**(headers or {}), "x-ms-version": "2020-12-06"})

def containers():
    acct, _ = acct_key()
    for c in ("trans-src", "trans-tr", "trans-id", "trans-gloss"):
        try:
            blob("PUT", f"https://{acct}.blob.core.windows.net/{c}?restype=container", headers={"Content-Length": "0"})
            print(f"created {c}")
        except urllib.error.HTTPError as e:
            print(f"{c}: {e.code} (exists)" if e.code == 409 else f"{c}: {e.code} {e.read()[:200]}")

def sas_headers(url):
    """Container-level ops need no auth header beyond the SAS in the URL."""
    return url

def upload(container, path, dest=None):
    dest = dest or os.path.basename(path)
    data = open(path, "rb").read()
    url = f"https://{acct_key()[0]}.blob.core.windows.net/{container}/{urllib.parse.quote(dest)}"
    # block-blob PUT signed with a shared-key Authorization header
    acct, key = acct_key()
    length = str(len(data))
    md5 = base64.b64encode(hashlib.md5(data).digest()).decode()
    date = datetime.datetime.now(datetime.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    canon = "\n".join(["PUT", "", "", length, md5, "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                       "", "", "", "", "", ""] + [f"x-ms-blob-type:BlockBlob", f"x-ms-date:{date}", "x-ms-version:2020-12-06",
                                                  f"/{acct}/{container}/{dest}"])
    sig = base64.b64encode(hmac.new(base64.b64decode(key), canon.encode(), hashlib.sha256).digest()).decode()
    blob("PUT", url, data, {"Content-Length": length, "Content-MD5": md5, "x-ms-blob-type": "BlockBlob",
                            "x-ms-date": date, "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            "Authorization": f"SharedKey {acct}:{sig}"})
    return dest

def list_blobs(container, prefix=""):
    acct, key = acct_key()
    out, marker = [], ""
    while True:
        q = f"restype=container&comp=list&prefix={urllib.parse.quote(prefix)}" + (f"&marker={urllib.parse.quote(marker)}" if marker else "")
        date = datetime.datetime.now(datetime.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
        canon = "\n".join(["GET"] + [""] * 12 + [f"x-ms-date:{date}", "x-ms-version:2020-12-06", f"/{acct}/{container}", "comp:list", f"prefix:{prefix}", "restype:container"])
        sig = base64.b64encode(hmac.new(base64.b64decode(key), canon.encode(), hashlib.sha256).digest()).decode()
        text, _ = blob("GET", f"https://{acct}.blob.core.windows.net/{container}?{q}", headers={"x-ms-date": date, "Authorization": f"SharedKey {acct}:{sig}"})
        out += re.findall(r"<Name>(.*?)</Name>", text)
        m = re.search(r"<NextMarker>(.*?)</NextMarker>", text)
        if not m or not m.group(1): return out
        marker = m.group(1)

def download_blob(container, name, path):
    url = sas(container, "rl").split("?")[0] + "/" + urllib.parse.quote(name) + "?" + sas(container, "rl").split("?")[1]
    data, _ = req("GET", url, raw=True)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(data)
    return len(data)

def delete_blob(container, name):
    acct, key = acct_key()
    date = datetime.datetime.now(datetime.timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
    canon = "\n".join(["DELETE"] + [""] * 12 + [f"x-ms-date:{date}", "x-ms-version:2020-12-06", f"/{acct}/{container}/{name}"])
    sig = base64.b64encode(hmac.new(base64.b64decode(key), canon.encode(), hashlib.sha256).digest()).decode()
    blob("DELETE", f"https://{acct}.blob.core.windows.net/{container}/{urllib.parse.quote(name)}",
         headers={"x-ms-date": date, "Authorization": f"SharedKey {acct}:{sig}"})

def turl(path):
    return env("AZURE_TRANSLATOR_ENDPOINT").rstrip("/") + path

def theaders(json_=True):
    h = {"Ocp-Apim-Subscription-Key": env("AZURE_TRANSLATOR_KEY"), "Ocp-Apim-Subscription-Region": env("AZURE_TRANSLATOR_REGION")}
    if json_: h["Content-Type"] = "application/json"
    return h

def ledger_path(a): return os.path.join(a.dir, "azure-ledger.json")
def ledger(a):
    p = ledger_path(a)
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {"batches": [], "uploads": {}, "downloads": {}}
def save_ledger(a, l): json.dump(l, open(ledger_path(a), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["containers", "sas", "upload", "submit", "poll", "download", "round", "status", "clean", "languages"])
    ap.add_argument("--dir", default="/Volumes/exmicroSD/islam-museum-local-mt/az")
    ap.add_argument("--glob", default="*-ar.docx")
    ap.add_argument("--src-lang", default="ar")
    ap.add_argument("--target-langs", default="tr,id")
    ap.add_argument("--file", default="")
    ap.add_argument("--glossary", default="", help="a TSV glossary already uploaded to trans-gloss (blob name)")
    ap.add_argument("--batch-prefix", default="azdocs", help="source blobs are uploaded under this prefix inside trans-src")
    a = ap.parse_args()

    if a.cmd == "languages":
        text, _ = req("GET", turl("/translator/text/batch/v1.1/languages?api-version=1.1"), headers=theaders(False))
        d = json.loads(text)
        for code in ("ar", "tr", "id"): print(code, "yes" if code in json.dumps(d) else "MISSING")
        return

    if a.cmd == "containers": containers(); return
    if a.cmd == "sas":
        for c in ("trans-src", "trans-tr", "trans-id"): print(c, sas(c, "rwl" if c != "trans-src" else "rl"))
        return

    if a.cmd == "upload":
        l = ledger(a)
        files = [a.file] if a.file else sorted(globmod.glob(os.path.join(a.dir, a.glob)))
        for f in files:
            dest = f"{a.batch_prefix}/{os.path.basename(f)}"
            if l["uploads"].get(dest) == os.path.getsize(f): print("up-to-date", dest); continue
            upload("trans-src", f, dest); l["uploads"][dest] = os.path.getsize(f); print("uploaded", dest, l["uploads"][dest])
        save_ledger(a, l); return

    if a.cmd == "submit":
        l = ledger(a)
        # target containers: one per language; optional glossary per target
        targets = []
        for lang in a.target_langs.split(","):
            t = {"targetUrl": sas(f"trans-{lang}", "rwl"), "language": lang}
            if a.glossary:
                t["glossaries"] = [{"glossaryUrl": sas("trans-gloss", "rl").replace("?", f"/{urllib.parse.quote(a.glossary)}?", 1).replace("/trans-gloss", "/trans-gloss"), "format": "TSV", "version": "1"}]
            targets.append(t)
        body = {"inputs": [{"source": {"sourceUrl": sas("trans-src", "rl"), "language": a.src_lang, "storageSource": "AzureBlob"},
                            "targets": targets, "storageType": "File"}]}
        text, h = req("POST", turl("/translator/text/batch/v1.1/batches"), json.dumps(body).encode(), theaders())
        op = h.get("Operation-Location") or h.get("operation-location")
        bid = (op or "").rstrip("/").split("/")[-1]
        l["batches"].append({"id": bid, "op": op, "submitted": time.strftime("%Y-%m-%dT%H:%M:%S"), "files": a.glob, "targets": a.target_langs})
        save_ledger(a, l)
        print("batch", bid, op or text); return

    if a.cmd == "poll":
        l = ledger(a)
        for b in l["batches"]:
            text, _ = req("GET", turl(f"/translator/text/batch/v1.1/batches/{b['id']}"), headers=theaders(False))
            d = json.loads(text); b["status"] = d.get("status") or d.get("statusSummary", {}).get("status")
            print(b["id"], b.get("status"), json.dumps(d.get("summary", d.get("statusSummary", "")), ensure_ascii=False)[:400])
        save_ledger(a, l); return

    if a.cmd == "status":
        l = ledger(a)
        print(json.dumps({k: len(v) if isinstance(v, list) else len(v) for k, v in l.items()})); return

    if a.cmd == "download":
        l = ledger(a)
        for lang in a.target_langs.split(","):
            for name in list_blobs(f"trans-{lang}", f"{a.batch_prefix}/"):
                dst = os.path.join(a.dir, f"{lang}", os.path.basename(name))
                if l["downloads"].get(dst): continue
                n = download_blob(f"trans-{lang}", name, dst); l["downloads"][dst] = n; print("downloaded", lang, os.path.basename(name), n)
        save_ledger(a, l); return

    if a.cmd == "round":
        l = ledger(a)
        files = sorted(globmod.glob(os.path.join(a.dir, a.glob)))
        if not files: sys.exit("no files match --glob")
        print(f"{len(files)} files")
        for f in files:
            dest = f"{a.batch_prefix}/{os.path.basename(f)}"
            if not l["uploads"].get(dest): upload("trans-src", f, dest); l["uploads"][dest] = os.path.getsize(f)
        save_ledger(a, l)
        # submit
        targets = [{"targetUrl": sas(f"trans-{lang}", "rwl"), "language": lang} for lang in a.target_langs.split(",")]
        body = {"inputs": [{"source": {"sourceUrl": sas("trans-src", "rl"), "language": a.src_lang, "storageSource": "AzureBlob"},
                            "targets": targets, "storageType": "File"}]}
        text, h = req("POST", turl("/translator/text/batch/v1.1/batches"), json.dumps(body).encode(), theaders())
        op = h.get("Operation-Location") or h.get("operation-location")
        bid = (op or "").rstrip("/").split("/")[-1]
        l["batches"].append({"id": bid, "op": op, "submitted": time.strftime("%Y-%m-%dT%H:%M:%S"), "files": a.glob})
        save_ledger(a, l); print("batch", bid)
        # poll until done
        for _ in range(240):
            time.sleep(30)
            text, _ = req("GET", turl(f"/translator/text/batch/v1.1/batches/{bid}"), headers=theaders(False))
            d = json.loads(text); st = d.get("status")
            print("status", st, json.dumps(d.get("summary", {}), ensure_ascii=False)[:200])
            if st in ("Succeeded", "Failed", "Cancelled", "ValidationFailed"): break
        # download what landed
        for lang in a.target_langs.split(","):
            for name in list_blobs(f"trans-{lang}", f"{a.batch_prefix}/"):
                dst = os.path.join(a.dir, f"{lang}", os.path.basename(name))
                if not l["downloads"].get(dst):
                    n = download_blob(f"trans-{lang}", name, dst); l["downloads"][dst] = n; print("downloaded", lang, os.path.basename(name))
        save_ledger(a, l); return

    if a.cmd == "clean":  # delete source + target blobs for the prefix (after import succeeded)
        for c in ("trans-src", "trans-tr", "trans-id"):
            for name in list_blobs(c, f"{a.batch_prefix}/"):
                delete_blob(c, name); print("deleted", c, name)
        return

if __name__ == "__main__":
    main()
