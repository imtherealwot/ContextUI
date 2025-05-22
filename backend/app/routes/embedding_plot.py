from fastapi import APIRouter, HTTPException
from app.services.mongo import get_vector_collection
from sklearn.decomposition import PCA
from bson import ObjectId
import numpy as np

router = APIRouter()

@router.get("/embedding-plot")
def get_embedding_plot():
    collection = get_vector_collection()

    # Only fetch chunks with embeddings and metadata
    docs = list(collection.find(
        {"embedding": {"$exists": True}},
        {"embedding": 1, "metadata": 1}
    ))

    if not docs:
        raise HTTPException(status_code=404, detail="No embeddings found")

    try:
        # Convert embeddings to numpy array
        embeddings = np.array([doc["embedding"] for doc in docs])

        # Apply PCA to reduce to 3 dimensions
        pca = PCA(n_components=3)
        reduced = pca.fit_transform(embeddings)

        # Format results for frontend
        result = []
        for i, doc in enumerate(docs):
            result.append({
                "x": float(reduced[i, 0]),
                "y": float(reduced[i, 1]),
                "z": float(reduced[i, 2]),
                "label": doc.get("metadata", {}).get("source", "unknown"),
                "chunk_index": doc.get("metadata", {}).get("chunk_index", i),
                "id": str(doc["_id"])
            })

        return {"points": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during PCA: {str(e)}")
