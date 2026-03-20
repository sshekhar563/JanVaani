import os
from pathlib import Path
from typing import Dict, Optional

try:
    import torch
    from transformers import pipeline
    from transformers.pipelines import Pipeline
except ImportError as exc:
    pipeline = None
    Pipeline = None
    _hf_import_error = exc
else:
    _hf_import_error = None

from language_codes import LANGUAGE_CODE_MAP

HF_ASR_MODEL = os.environ.get("HF_ASR_MODEL", "openai/whisper-small")
_hf_pipeline: Optional[Pipeline] = None


def _normalize_language(language_hint: Optional[str]) -> Optional[str]:
    if not language_hint:
        return None
    normalized = language_hint.strip().lower()
    return LANGUAGE_CODE_MAP.get(normalized, normalized[:2])


def _language_label(code: Optional[str]) -> str:
    if not code:
        return "unknown"
    return next(
        (name.title() for name, mapped in LANGUAGE_CODE_MAP.items() if mapped == code),
        code,
    )


def _load_pipeline() -> Pipeline:
    global _hf_pipeline
    if _hf_pipeline is not None:
        return _hf_pipeline

    if pipeline is None:
        raise RuntimeError(
            "Transformers ASR pipeline is unavailable (install the 'transformers' package)."
        )

    device = 0 if torch.cuda.is_available() else -1
    _hf_pipeline = pipeline(
        task="automatic-speech-recognition",
        model=HF_ASR_MODEL,
        device=device,
        chunk_length_s=30,
        stride_length_s=(5, 2),
        return_timestamps=False,
    )
    return _hf_pipeline


def transcribe_with_transformers(file_path: str, language_hint: Optional[str] = None) -> Dict[str, str]:
    if _hf_import_error and pipeline is None:
        raise RuntimeError(
            "Transformers ASR pipeline cannot be used because the import failed."
        )

    language_code = _normalize_language(language_hint)
    asr_pipeline = _load_pipeline()
    kwargs = {}
    if language_code:
        kwargs["language"] = language_code
    result = asr_pipeline(Path(file_path), **kwargs)
    text = (result.get("text") or "").strip()
    return {
        "text": text,
        "language": language_code,
        "language_label": _language_label(language_code),
    }
