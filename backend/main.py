from fastapi import FastAPI, UploadFile, File
from whisper_service import transcribe_audio
from nlp_pipeline import analyze_complaint

app = FastAPI()


@app.post("/voice-report")
async def voice_report(audio: UploadFile = File(...)):

    file_location = f"temp/{audio.filename}"

    with open(file_location, "wb") as f:
        f.write(await audio.read())

    transcript = transcribe_audio(file_location)

    nlp_result = analyze_complaint(transcript["text"])

    return {
        "transcript": transcript,
        "analysis": nlp_result
    }