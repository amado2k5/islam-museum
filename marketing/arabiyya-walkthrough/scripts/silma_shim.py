"""Load SILMA TTS on a Mac.

SILMA TTS (Apache-2.0 weights, MIT code) lists two dependencies that have no macOS build: NeMo text
processing (needs pynini/OpenFst) and the GPU build of onnxruntime. Neither is needed here: every number in the
scripts is written out in words, and the Arabic is fully vowelled by hand, so the number normaliser and the
automatic diacritiser are never called. This module stands in for the normaliser so the package imports.
"""
import sys, types

def install():
    if "nemo_text_processing" in sys.modules:
        return
    root = types.ModuleType("nemo_text_processing")
    tn = types.ModuleType("nemo_text_processing.text_normalization")
    norm = types.ModuleType("nemo_text_processing.text_normalization.normalize")

    class Normalizer:  # never used: scripts carry no digits
        def __init__(self, *a, **k): pass
        def normalize(self, text, **k): return text

    norm.Normalizer = Normalizer
    root.text_normalization = tn
    tn.normalize = norm
    sys.modules["nemo_text_processing"] = root
    sys.modules["nemo_text_processing.text_normalization"] = tn
    sys.modules["nemo_text_processing.text_normalization.normalize"] = norm


def patch_audio_loading():
    """torchaudio now reads files through torchcodec, which is not installed; read WAVs with soundfile instead."""
    import soundfile as sf, torch, torchaudio

    def _load(path, *a, **k):
        data, sr = sf.read(str(path), dtype="float32", always_2d=True)
        return torch.from_numpy(data.T.copy()), sr

    torchaudio.load = _load
