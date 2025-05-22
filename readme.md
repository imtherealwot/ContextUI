# ContextUI – Personal RAG Assistant

ContextUI is a multimodal Retrieval-Augmented Generation (RAG) assistant that lets you upload, embed, and query your own knowledge base. It supports text, image, and audio input, with semantic search powered by OpenAI embeddings and MongoDB Vector Search.

---

## ⚙️ Architecture Overview

| Component     | Tech Stack                              |
|---------------|------------------------------------------|
| Frontend      | React, Vite, TailwindCSS                 |
| Backend       | FastAPI (Python), LangChain              |
| Vector Store  | MongoDB Atlas with Vector Search         |
| Embeddings    | OpenAI `text-embedding-3-small`          |
| OCR           | AWS Textract                             |
| Audio         | OpenAI Whisper                           |

---

## 🔧 Features

- Upload `.txt`, image, and audio files
- Extract content via OCR or transcription
- Store embeddings with metadata in MongoDB
- Query with a dynamic system prompt and LLM choice
- Visualize document embeddings in 3D with PCA
- View and delete individual semantic chunks
- Responsive UI with mobile support

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/contextui.git
cd contextui
```

### 2. Setup the backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env  # Then fill in API keys
uvicorn app.main:app --reload
```

### 3. Setup the frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Environment Variables

Create a `.env` file in `/backend` with the following:

```env
MONGO_URI=
OPENAI_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Optional overrides
MONGO_DB_NAME=concierge
MONGO_COLLECTION_NAME=docs
MONGO_INDEX_NAME=vector_index
```

---

## 📂 Project Structure

```
contextui/
├── frontend/         # React UI (Vite + Tailwind)
├── backend/          # FastAPI + LangChain logic
├── .gitignore
├── .env.example
└── README.md
```

---

## 🧪 Demo Features

- Drag-and-drop file upload
- Real-time system prompt editing
- Query multiple LLMs (`gpt-3.5-turbo`, `gpt-4`, etc.)
- 3D embedding plot with file-based color coding
- Chunk-level view and deletion
- Whisper audio transcription and AWS Textract OCR

---

## 📋 License

This project is for demo and educational use only. License terms TBD.