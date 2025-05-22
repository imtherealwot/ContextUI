
from fastapi import FastAPI
from app.routes import upload, query, stats, wordcloud_route, file_chunks_route, embedding_plot


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(upload.router, prefix="/upload")
app.include_router(query.router, prefix="/query")
app.include_router(stats.router)
app.include_router(wordcloud_route.router)
app.include_router(file_chunks_route.router)
app.include_router(embedding_plot.router)

@app.get("/")
def read_root():
    return {"message": "RAG API is up"}
