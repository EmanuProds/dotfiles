"""Transcreve um WAV mono 16k com faster-whisper.

Uso: transcrever_trecho.py <arquivo.wav> <modelo> <saida.txt> [deslocamento_segundos]

O patch em av_open_exists_workaround existe porque o PyAV 19 removeu o parametro
metadata_errors, que o faster-whisper 1.2.1 ainda passa para av.open().
"""
import sys
import av

_orig_open = av.open


def _open_compat(*args, **kwargs):
    kwargs.pop("metadata_errors", None)
    return _orig_open(*args, **kwargs)


av.open = _open_compat

from faster_whisper import WhisperModel  # noqa: E402

src, modelo, saida = sys.argv[1], sys.argv[2], sys.argv[3]
offset = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0

m = WhisperModel(modelo, device="cpu", compute_type="int8")
segs, info = m.transcribe(src, language="pt", beam_size=5, vad_filter=True)
print(f"idioma={info.language} prob={info.language_probability:.2f}", flush=True)

with open(saida, "w", encoding="utf-8") as fh:
    for s in segs:
        t = s.start + offset
        linha = f"[{int(t//3600):d}:{int(t//60%60):02d}:{int(t%60):02d}] {s.text.strip()}"
        fh.write(linha + "\n")
        fh.flush()
        print(linha, flush=True)
