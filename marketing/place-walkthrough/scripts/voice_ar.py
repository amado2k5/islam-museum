"""Arabic narration: SILMA TTS v1 on this machine (Apache-2.0 weights, MIT code), with the Arabic reference voice
that ships with the model. Several takes of every sentence of script/ar.json are written to voice/ar/takes/;
scripts/voice_pick.py then transcribes them and keeps, for each sentence, the take that says the line most exactly.

Each sentence is generated whole (the library would cut it at commas), so the phrasing runs across the sentence, and
the pauses between sentences are set when the line is assembled, not by the model.

  .venv-voice/bin/python scripts/voice_ar.py [line ids...]
"""
import json, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import silma_shim
silma_shim.install(); silma_shim.patch_audio_loading()

import numpy as np, soundfile as sf, torch
from importlib.resources import files
from silma_tts.api import SilmaTTS
from silma_tts.infer import utils_infer as U
from silma_tts.model.utils import seed_everything

REF = str(files("silma_tts").joinpath("infer/ref_audio_samples/ar.ref.24k.wav"))
REF_TEXT = "ويدقق النظر في القرآن الكريم وسائر الكتب السماوية ويتبع مسالك الرسل العظام عليهم الصلاة والسلام."
SEEDS = [11, 23, 37, 53]
NFE = 32            # diffusion steps (the library's default is 16)
TASHKEEL_FACTOR = 1.3  # the library's own correction: vowel marks are characters but take no time to say

def sentences(text):
    parts = re.split(r"(?<=[.؟!])\s+", text.strip())
    return [p for p in parts if p.strip()]

def main():
    script = json.load(open(os.path.join(ROOT, "script/ar.json"), encoding="utf8"))
    only = sys.argv[1:]
    out = os.path.join(ROOT, "voice/ar/takes"); os.makedirs(out, exist_ok=True)
    tts = SilmaTTS(enable_normalizer=False, force_tashkeel=False)
    ref_file, ref_text = U.preprocess_ref_audio_text(REF, REF_TEXT)
    audio = U.torchaudio.load(ref_file)
    base = float(script["voice"].get("speed", 1.0))
    for line in script["lines"]:
        if only and line["id"] not in only: continue
        speed = float(line.get("speed", base)) * TASHKEEL_FACTOR
        for k, sent in enumerate(sentences(line["say"])):
            text = U.normalize_last_word(sent)
            if text[-1] not in ".,،؟؛:!?;": text += "."
            for seed in SEEDS:
                path = os.path.join(out, f"{line['id']}_{k}_{seed}.wav")
                if os.path.exists(path) and not only: continue
                seed_everything(seed)
                wav, sr, _ = next(U.infer_batch_process(audio, ref_text, [text + " "], tts.ema_model, tts.vocoder,
                    mel_spec_type=tts.mel_spec_type, progress=None, nfe_step=NFE, cfg_strength=2.0, sway_sampling_coef=-1,
                    speed=speed, device=tts.device))
                wav = U.fast_trim(np.asarray(wav, dtype=np.float32), top_db=40)
                sf.write(path, wav, sr)
                print(f"{line['id']}_{k}_{seed}  {len(wav)/sr:5.2f}s  {sent[:40]}", flush=True)

if __name__ == "__main__":
    main()
