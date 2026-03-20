
import os
from pathlib import Path
from typing import Dict, Optional

import requests
from dotenv import load_dotenv

from language_codes import LANGUAGE_CODE_MAP
from transformers_asr import transcribe_with_transformers

try:
    import whisper
except Exception as exc:  # pragma: no cover
    whisper = None
    _whisper_import_error = exc
else:
    _whisper_import_error = None

ROOT_DIR = Path(__file__).resolve().parent.parent

if load_dotenv:
    env_path = ROOT_DIR / ".env"
    load_dotenv(env_path)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_API_BASE = os.environ.get("OPENAI_API_BASE", "https://api.openai.com/v1")
OPENAI_WHISPER_MODEL = os.environ.get("OPENAI_WHISPER_MODEL", "gpt-4o-mini-transcribe")
LOCAL_WHISPER_MODEL = os.environ.get("LOCAL_WHISPER_MODEL", "base")
_local_model = None
_local_model_error: Optional[Exception] = None

if whisper:
    try:
        _local_model = whisper.load_model(LOCAL_WHISPER_MODEL)
    except Exception as exc:  # pragma: no cover
        _local_model_error = exc
else:
    _local_model_error = _whisper_import_error


def normalize_language(language_hint: Optional[str]) -> Optional[str]:
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


def _transcribe_with_openai(file_path: str, language_hint: Optional[str]) -> Dict[str, str]:
    if not OPENAI_API_KEY:
        raise RuntimeError("OpenAI API key is not configured for transcription.")

    language_code = normalize_language(language_hint)
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
    }

    data = {"model": OPENAI_WHISPER_MODEL}
    if language_code:
        data["language"] = language_code

    url = f"{OPENAI_API_BASE}/audio/transcriptions"
    with open(file_path, "rb") as audio_file:
        response = requests.post(
            url,
            headers=headers,
            data=data,
            files={"file": audio_file},
            timeout=60,
        )

    response.raise_for_status()
    payload = response.json()
    detected_language = payload.get("language")
    return {
        "text": (payload.get("text") or "").strip(),
        "language": detected_language,
        "language_label": _language_label(detected_language or language_code),
    }


def _transcribe_locally(file_path: str, language_hint: Optional[str]) -> Dict[str, str]:
    if not _local_model:
        raise RuntimeError(
            "Local Whisper model is unavailable"
            + (f": {_local_model_error}" if _local_model_error else "")
        )

    language_code = normalize_language(language_hint)
    result = _local_model.transcribe(
        file_path,
        task="transcribe",
        language=language_code,
        fp16=False,
    )

    detected_language = result.get("language")
    return {
        "text": result.get("text", "").strip(),
        "language": detected_language,
        "language_label": _language_label(detected_language),
    }


def _transcribe_with_transformers_fallback(file_path: str, language_hint: Optional[str]) -> Dict[str, str]:
    try:
        return transcribe_with_transformers(file_path, language_hint)
    except Exception as exc:
        raise RuntimeError(f"Transformers ASR fallback failed: {exc}")


def transcribe_audio(file_path: str, language_hint: Optional[str] = None) -> Dict[str, str]:
    if OPENAI_API_KEY:
        return _transcribe_with_openai(file_path, language_hint)

    try:
        return _transcribe_locally(file_path, language_hint)
    except Exception as exc:
        try:
            return _transcribe_with_transformers_fallback(file_path, language_hint)
        except Exception as fallback_exc:
            raise RuntimeError(
                f"Local transcription failed: {exc}; transformers fallback failed: {fallback_exc}"
            )
