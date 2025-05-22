import os
from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi import APIRouter
from langchain.chains import RetrievalQA
from langchain_openai import OpenAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI

load_dotenv()
router = APIRouter()

DEFAULT_PROMPT = """Precede every answer with the word Bananna"""

# ✅ 1. Get vector store
def get_vector_store():
    mongo_uri = os.getenv("MONGO_URI")
    mongo_db = os.getenv("MONGO_DB_NAME", "concierge")
    mongo_collection = os.getenv("MONGO_COLLECTION_NAME", "docs")
    mongo_index = os.getenv("MONGO_INDEX_NAME", "vector_index")

    client = MongoClient(mongo_uri)
    collection = client[mongo_db][mongo_collection]
    embedding = OpenAIEmbeddings()

    return MongoDBAtlasVectorSearch(collection, embedding, index_name=mongo_index)

# ✅ 2. Create QA chain using system prompt, model, and temperature
def get_qa_chain(vector_store, prompt, model_name="gpt-4", temperature=0.7):
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    llm = ChatOpenAI(
        model_name=model_name,
        temperature=temperature
    )

    prompt_template = PromptTemplate.from_template(
        "{system}\n\nContext:\n{context}\n\nQ: {question}\nA:"
    )
    full_prompt = prompt_template.partial(system=prompt)

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": full_prompt}
    )

# ✅ 3. Query endpoint
@router.post("/query/")
async def query_rag(payload: dict):
    question = payload.get("question")
    prompt = payload.get("prompt", DEFAULT_PROMPT)
    model_name = payload.get("model", "gpt-4")
    temperature = float(payload.get("temperature", 0.7))

    print("📥 Received payload:", payload)
    print("🧠 Using system prompt:", prompt)
    print("🤖 Model:", model_name, "Temperature:", temperature)

    if not question:
        return {"answer": "No question provided.", "prompt": prompt}

    vector_store = get_vector_store()
    qa_chain = get_qa_chain(vector_store, prompt, model_name, temperature)
    result = qa_chain.invoke({"query": question})

    return {
        "answer": result["result"],
        "context": [
            {
                "text": doc.page_content,
                "metadata": doc.metadata
            } for doc in result.get("source_documents", [])
        ],
        "prompt": prompt
    }
