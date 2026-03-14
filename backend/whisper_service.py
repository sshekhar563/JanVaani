import whisper

model = whisper.load_model("base")

def transcribe_audio(file_path):

    result = model.transcribe(
        file_path,
        task="translate"
    )

    return {
        "text": result["text"],
        "language": result["language"]
    }