"""Check the narration by ear-substitute: transcribe every sentence with Whisper and compare it with the script.

Arabic (SILMA): several takes exist for each sentence in voice/ar/takes/; the take whose transcript is closest to the
script is copied to voice/ar/<unit>.wav. English (Kokoro): one take per sentence, checked and reported.

The report (voice/<lang>/check.json) lists, for every sentence, what was meant, what Whisper heard, the similarity and
the duration, so a person can see at a glance which sentences deserve a listen. Numbers are spelled in the script and
written as digits by Whisper, so number words and digits are left out of the comparison.

  python3 scripts/voice_pick.py ar|en        (the Python that has mlx-whisper)
"""
import difflib, glob, json, os, re, shutil, subprocess, sys, wave
import mlx_whisper

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MODEL = "mlx-community/whisper-large-v3-turbo"
SPLIT = re.compile(r"(?<=[.?!؟])\s+")

AR_NUM = set("ثلاثة آلاف وثمانمئة وخمسة وسبعون اثنتي عشرة ستمئة وثلاث وتسعون أربعة عشر أربعين خمسين وستين ألف وتسعة تسعة الثلاثة".split())
EN_NUM = set("three thousand eight hundred and seventy five twelve six ninety fourteen forty fifty sixty nine".split())

def norm_ar(t):
    t = re.sub(r"[ً-ْٰـ]", "", t)
    t = re.sub(r"[إأآٱ]", "ا", t).replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    t = re.sub(r"[^ء-ي\s]", " ", t)
    return [w for w in t.split() if w not in {norm1(x) for x in AR_NUM}]

def norm1(w):
    w = re.sub(r"[ً-ْٰـ]", "", w)
    return re.sub(r"[إأآٱ]", "ا", w).replace("ى", "ي").replace("ة", "ه")

def norm_en(t):
    t = t.lower().replace("-", " ")
    t = re.sub(r"[^a-z\s']", " ", t)
    return [w for w in t.split() if w not in EN_NUM]

def dur(path):
    with wave.open(path) as w: return w.getnframes() / w.getframerate()

def hear(path, lang):
    r = mlx_whisper.transcribe(path, path_or_hf_repo=MODEL, language=lang, condition_on_previous_text=False, temperature=0.0)
    return r["text"].strip()

def main():
    lang = sys.argv[1]
    script = json.load(open(os.path.join(ROOT, f"script/{lang}.json"), encoding="utf8"))
    norm = norm_ar if lang == "ar" else norm_en
    report = []
    for line in script["lines"]:
        for k, sent in enumerate([s for s in SPLIT.split(line["say"].strip()) if s.strip()]):
            unit = f"{line['id']}_{k}"
            want = norm(sent)
            if lang == "ar":
                takes = sorted(glob.glob(os.path.join(ROOT, f"voice/ar/takes/{unit}_*.wav")))
            else:
                takes = [os.path.join(ROOT, f"voice/en/{unit}.wav")]
            scored = []
            for t in takes:
                if not os.path.exists(t): continue
                heard = hear(t, lang)
                sim = difflib.SequenceMatcher(None, want, norm(heard)).ratio()
                scored.append({"take": os.path.basename(t), "sim": round(sim, 3), "dur": round(dur(t), 2), "heard": heard})
            if not scored:
                report.append({"unit": unit, "error": "no audio"}); print(unit, "NO AUDIO"); continue
            if lang == "ar":
                # closest transcript first; among equals, the take nearest the median length (an outlier length is a slip)
                med = sorted(s["dur"] for s in scored)[len(scored) // 2]
                scored.sort(key=lambda s: (-s["sim"], abs(s["dur"] - med)))
                # a take named in the script ("prefer") wins: the choice of a person who compared the takes
                want_seed = script["voice"].get("prefer", {}).get(unit)
                if want_seed is not None:
                    scored.sort(key=lambda s: 0 if s["take"].endswith(f"_{want_seed}.wav") else 1)
                src, dst = os.path.join(ROOT, "voice/ar/takes", scored[0]["take"]), os.path.join(ROOT, f"voice/ar/{unit}.wav")
                tempo = float(script["voice"].get("tempo", 1))
                if tempo == 1: shutil.copyfile(src, dst)
                else:  # a slightly quicker reading, pitch unchanged
                    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-af", f"atempo={tempo}", dst], check=True)
                    scored[0]["dur"] = round(dur(dst), 2)
            best = scored[0]
            flag = "" if best["sim"] >= 0.9 else "  <-- LISTEN"
            print(f"{unit:7} {best['sim']:.2f} {best['dur']:5.2f}s  {best['heard']}{flag}", flush=True)
            report.append({"unit": unit, "meant": sent, "picked": best, "others": scored[1:]})
    json.dump(report, open(os.path.join(ROOT, f"voice/{lang}/check.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
