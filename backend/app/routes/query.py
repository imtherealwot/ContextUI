
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.query_engine import query_rag

router = APIRouter()

class QueryRequest(BaseModel):
    question: str
    prompt: str
    
@router.post("/")
async def query(request: QueryRequest):
    return await query_rag({"question": request.question, "prompt": request.prompt})
