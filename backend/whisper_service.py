"""
Whisper speech-to-text service.
Gracefully falls back to a stub when OpenAI Whisper is not installed.
"""

try:
    import whisper
    model = whisper.load_model("base")
    WHISPER_AVAILABLE = True
except Exception:
    model = None
    WHISPER_AVAILABLE = False


def transcribe_audio(file_path):
    """Transcribe audio file. Returns dict with 'text' and 'language'."""
    if WHISPER_AVAILABLE and model is not None:
        result = model.transcribe(file_path, task="translate")
        return {
            "text": result["text"],
            "language": result["language"],
        }

    # Fallback when Whisper is not installed
    return {
        "text": "[Whisper not available] Audio transcription placeholder — install openai-whisper for real transcription.",
        "language": "unknown",
    }