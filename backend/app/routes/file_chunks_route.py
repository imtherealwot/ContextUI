from fastapi import APIRouter
from app.services.mongo import get_vector_collection

router = APIRouter()

@router.get("/file/{filename}/chunks")
def get_chunks_by_filename(filename: str):
    collection = get_vector_collection()
    docs = collection.find({"metadata.source": filename})
    chunks = [{"_id": str(doc["_id"]), "text": doc["text"]} for doc in docs]
    return {"chunks": chunks}