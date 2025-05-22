from fastapi import APIRouter
from app.services.mongo import get_vector_collection
from datetime import datetime

router = APIRouter()

@router.get("/stats")
def get_stats():
    collection = get_vector_collection()

    # Total number of chunks
    doc_count = collection.count_documents({})

    # Unique file sources
    unique_files = collection.distinct("metadata.source")
    file_count = len(unique_files)

    # Average chunk size (by character count)
    pipeline = [
        {"$project": {"length": {"$strLenCP": "$text"}}},
        {"$group": {"_id": None, "avgLength": {"$avg": "$length"}}}
    ]
    avg_chunk_length_result = list(collection.aggregate(pipeline))
    avg_chunk_length = (
        round(avg_chunk_length_result[0]["avgLength"], 2)
        if avg_chunk_length_result else 0
    )

    # Most recent upload (based on timestamp field)
    latest_doc = collection.find_one(
        {"metadata.timestamp": {"$exists": True}},
        sort=[("metadata.timestamp", -1)]
    )
    latest_file = (
        latest_doc["metadata"]["source"]
        if latest_doc and "metadata" in latest_doc else None
    )
    last_updated = (
        latest_doc["metadata"]["timestamp"]
        if latest_doc and "metadata" in latest_doc else None
    )

    # Most recent N files
    recent_files = collection.aggregate([
        {"$sort": {"metadata.timestamp": -1}},
        {"$group": {"_id": "$metadata.source", "timestamp": {"$first": "$metadata.timestamp"}}},
        {"$sort": {"timestamp": -1}},
        {"$limit": 50}
    ])
    recent_files_list = [
        {"filename": doc["_id"], "timestamp": doc["timestamp"]}
        for doc in recent_files
    ]

    return {
        "doc_count": doc_count,
        "file_count": file_count,
        "avg_chunk_length": avg_chunk_length,
        "latest_file": latest_file,
        "last_updated": last_updated,
        "recent_files": recent_files_list
    }