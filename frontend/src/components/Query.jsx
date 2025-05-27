import React, { useState } from "react";
import axios from "axios";

export default function QueryCard() {
  const [question, setQuestion] = useState("");
  const [prompt, setPrompt] = useState(
    "Use the retrieved context to answer questions accurately and concisely. If the context contains a specific date or detail, use it exactly as written. If the context does not contain the answer, say you do not know.  If the context relates to a recipe, then always provide a list of every ingredient, including specific amounts, at the begginning of your response . Do not tell the user to refer to the provided context. Format your response in HTML"
  );
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.2);

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setIsLoading(true);
      setAnswer("");
      setContext("");

      const payload = {
        question,
        prompt,
        model: selectedModel,
        temperature,
      };

      console.log("🚀 Sending query payload:", payload);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/query/`, payload);
      const result = res.data;

      setAnswer(result.answer || "No answer received.");
      setContext(result.context || "No context returned.");
    } catch (err) {
      console.error("❌ Query failed:", err);
      setAnswer("Query failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mt-4 space-y-4">
      <h2 className="text-lg font-semibold">Ask a Question</h2>

      <input
        className="w-full border rounded p-2 text-sm"
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded"
          >
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature</label>
          <input
            type="number"
            value={temperature}
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="mt-1 block w-24 border-gray-300 rounded"
          />
        </div>
      </div>

      <h2 className="font-semibold">Use the following system prompt:</h2>
      <textarea
        className="w-full border rounded p-2 text-sm text-red-800 italic"
        rows={4}
        placeholder="System prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleAsk}
        disabled={isLoading}
      >
        {isLoading ? "Thinking..." : "Ask"}
      </button>

      {isLoading && (
        <div className="text-blue-600 text-sm italic animate-pulse">Generating answer...</div>
      )}

      {answer && !isLoading && (
        <div
          className="prose prose-sm max-w-none text-gray-800 mt-4"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      )}

      {context && !isLoading && (
        <div className="mt-4">
          <h3 className="font-semibold text-sm text-gray-600">Retrieved Context:</h3>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-2 rounded">
            {typeof context === "string"
              ? context
              : context.map((chunk, i) => `• ${chunk.text || chunk}\n`).join("")}
          </pre>
        </div>
      )}
    </div>
  );
}
