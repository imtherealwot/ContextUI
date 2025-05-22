import React, { useState } from "react";

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold text-sm text-gray-800"
      >
        {open ? "▼" : "▶"} {title}
      </button>
      {open && <div className="p-4 text-sm text-gray-800">{children}</div>}
    </div>
  );
}

export default function InstructionsCard() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📃 ContextUI Instructions</h1>

      <AccordionSection title="⚙️ How It Works" defaultOpen={true}>
        <ol className="list-decimal list-inside space-y-1">
          <li><strong>Upload</strong> a file (text, image, audio)</li>
          <li>Text is <strong>extracted</strong> (via Textract or Whisper), then <strong>chunked and embedded</strong></li>
          <li>Embeddings are <strong>stored in MongoDB</strong> with metadata (filename, timestamp, chunk index)</li>
          <li>When you submit a query:
            <ul className="list-disc list-inside ml-4">
              <li>The question is embedded</li>
              <li>Relevant chunks are retrieved via <strong>semantic similarity</strong></li>
              <li>Chunks + question + system prompt are passed to ChatGPT to generate the answer</li>
            </ul>
          </li>
        </ol>
      </AccordionSection>

      <AccordionSection title="💡 Capabilities">
        <h3 className="font-semibold">✍️ Use Case Examples</h3>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Upload <strong>photos of handwritten notes, recipes</strong> or <strong>printed documents</strong></li>
          <li>Upload <strong>meeting</strong> or <strong> lecture recordings</strong> to transcribe and query</li>
          <li>Manage and search <strong>technical documentation</strong></li>
        </ul>

        <h3 className="font-semibold">🧳 Multi-Modal Input</h3>
        <p className="mb-4">Supports text files, image files, and audio files.</p>

        <h3 className="font-semibold">🔧 Model, Temperature, and Prompt Control</h3>
        <p className="mb-4">Try different GPT models, adjust temperature (variation in models output), and customize the system prompt per query.</p>

        <h3 className="font-semibold">✉️ Chunk Management</h3>
        <p className="mb-4">Click a filename to view all associated information chunks and delete any individually.</p>

        <h3 className="font-semibold">🔍 Embedding Plot</h3>
        <p>Interactive 3D scatter plot of embeddings (dimensions reduced via PCA). Each point is a chunk, color-coded by file.</p>
      </AccordionSection>

      <AccordionSection title="✨ System Overview">
        <h3 className="font-semibold">💻 Frontend</h3>
        <p className="mb-4">React + Vite + TailwindCSS. <br></br>Includes uploader, query interface, plot visualisation, and dashboard components.</p>

        <h3 className="font-semibold">🚀 Backend</h3>
        <p className="mb-4">FastAPI (Python) with endpoints for uploads, querying, stats, and visualisation.</p>

        <h3 className="font-semibold">⛅ AWS Textract</h3>
        <p className="mb-4">Used for OCR on image files.</p>

        <h3 className="font-semibold">🧠 OpenAI APIs</h3>
        <p className="mb-4">Embeddings + Chat Completions. <br></br>Models include gpt-3.5-turbo, gpt-4, gpt-4-turbo.<br></br>Audio transcription via Whisper API</p>

        <h3 className="font-semibold">📂 MongoDB Atlas</h3>
        <p>Semantic vector store with document metadata.</p>
      </AccordionSection>

      <AccordionSection title="ℹ️ Notes">
        <ul className="list-disc list-inside ml-4">
          <li>Prompt, model, and temperature apply per query</li>
          <li>Files are persistent (unless deleted manually)</li>
          <li>Processing uses local logic and remote APIs (OpenAI, AWS, MongoDB)</li>
        </ul>
      </AccordionSection>
    </div>
  );
}
