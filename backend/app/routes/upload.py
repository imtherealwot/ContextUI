from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
from pathlib import Path
from app.services.ingest import process_file
from app.services.textract_ocr import extract_text_from_image
from app.services.audio_transcription import transcribe_audio
from app.services.mongo import get_vector_collection
from bson import ObjectId
import shutil
import os
import mimetypes

router = APIRouter()

@router.delete("/chunks/{chunk_id}")
async def delete_chunk(chunk_id: str):
    print(f"Received chunk_id: {chunk_id}")
    collection = get_vector_collection()

    # ✅ Validate ObjectId format
    if not ObjectId.is_valid(chunk_id):
        raise HTTPException(status_code=400, detail="Invalid chunk ID format")

    result = collection.delete_one({"_id": ObjectId(chunk_id)})

    if result.deleted_count == 1:
        print(f"Deleted chunk: {chunk_id}")
        return {"success": True}
    else:
        print(f"Chunk not found: {chunk_id}")
        raise HTTPException(status_code=404, detail="Chunk not found")

@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix
    print(f"Received file: {file.filename}, suffix: {suffix}")

    try:
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            contents = await file.read()
            tmp.write(contents)
            temp_path = tmp.name

        mime_type, _ = mimetypes.guess_type(temp_path)
        print(f"Detected MIME type: {mime_type}")

        preview_text = None

        if mime_type and mime_type.startswith("image/"):
            print("Processing as image...")
            preview_text = extract_text_from_image(temp_path)
            temp_txt = f"{temp_path}.txt"
            with open(temp_txt, "w", encoding="utf-8") as f:
                f.write(preview_text)
            result = await process_file(temp_txt, file.filename)
            os.remove(temp_txt)

        elif mime_type and mime_type.startswith("audio/"):
            print("Processing as audio...")
            preview_text = await transcribe_audio(temp_path)
            temp_txt = f"{temp_path}.txt"
            with open(temp_txt, "w", encoding="utf-8") as f:
                f.write(preview_text)
            result = await process_file(temp_txt, file.filename)
            os.remove(temp_txt)

        elif suffix.lower() == ".txt" or mime_type == "text/plain":
            print("Processing as plain text...")
            with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                preview_text = f.read()
            result = await process_file(temp_path, file.filename)

        else:
            print("Unsupported file type")
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {mime_type}")

    except Exception as e:
        print("Upload failed:", str(e))
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        try:
            os.remove(temp_path)
        except Exception as cleanup_error:
            print(f"Warning: failed to remove temp file {temp_path}: {cleanup_error}")

    return {
        "result": result,
        "preview_text": preview_text[:5000] if preview_text else ""
    }
