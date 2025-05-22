
import os
import openai
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from datetime import datetime

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
collection = client["concierge"]["docs"]

embedding_model = OpenAIEmbeddings()

async def process_file(file_path: str, original_filename: str):
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Chunk the text
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=300)
    chunks = splitter.split_text(text)

    for idx, chunk in enumerate(chunks):
        print(f"Chunk {idx}: {chunk[:100]}")

    documents = []
    for i, chunk in enumerate(chunks):
        embedding = embedding_model.embed_query(chunk)
        doc = {
            "text": chunk,
            "embedding": embedding,
            "metadata": {
                "source": original_filename,
                "chunk_index": i,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        documents.append(doc)
    
    print(f"Chunking file: {original_filename}")
    print(f"First 100 characters: {text[:100]}")
    
    collection.insert_many(documents)
    return f"Stored {len(documents)} chunks from {os.path.basename(file_path)}"
