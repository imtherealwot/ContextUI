import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCard() {
  const [stats, setStats] = useState(null);
  const [selectedChunks, setSelectedChunks] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats`)
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch stats.");
        setLoading(false);
      });
  }, []);

  const handleFileClick = async (filename) => {
  
    setActiveFile(filename);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/file/${encodeURIComponent(filename)}/chunks`);
      setSelectedChunks(res.data.chunks);
    } catch (err) {
      console.error("Error fetching chunks:", err);
      setSelectedChunks([]); // fallback to empty
    }
  };

  const handleDelete = async (chunkId) => {
    console.log("Deleting chunk:", chunkId);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/upload/chunks/${chunkId}`);
      setSelectedChunks(prev => prev.filter(c => c._id !== chunkId));
    } catch (err) {
      console.error("Failed to delete chunk:", err);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading stats...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* System Stats */}
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">System Stats</h2>
        <div className="space-y-2 text-gray-700 text-sm">
          <div><strong>Chunks Stored:</strong> {stats.doc_count}</div>
          <div><strong>Unique Files:</strong> {stats.file_count}</div>
          <div><strong>Average Chunk Length:</strong> {stats.avg_chunk_length}</div>
        </div>
      </div>

      {/* File Activity */}
      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Recent Uploads</h2>
        <div className="space-y-2 text-gray-700 text-sm">
          <div><strong>Last Updated:</strong> {stats.last_updated || "N/A"}</div>
          <ul className="mt-2 list-disc list-inside">
            {stats.recent_files.length === 0 ? (
              <li>No recent uploads.</li>
            ) : (
              stats.recent_files.map((file, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleFileClick(file.filename)}
                    className="text-blue-600 hover:underline"
                  >
                    {file.filename}
                  </button> — {new Date(file.timestamp).toLocaleString()}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Display selected chunks */}
      {activeFile && (
  <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 relative">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-md font-semibold text-gray-800">
        Chunks for {activeFile}
      </h3>
      <button
        onClick={() => {
          setActiveFile(null);
          setSelectedChunks([]);
        }}
        className="text-sm text-blue-600 hover:underline"
      >
        Hide
      </button>
    </div>

    <ul className="text-xs text-gray-700 space-y-2 max-h-64 overflow-y-auto">
      {selectedChunks.length === 0 ? (
        <li className="text-gray-400 italic">No chunks available.</li>
      ) : (
        selectedChunks.map((chunk, i) => (
          <li key={chunk._id || i} className="p-2 bg-gray-100 rounded relative">
            <div className="font-bold mb-1">Chunk {chunk.chunk_index ?? i}</div>
            <pre className="whitespace-pre-wrap">{chunk.text}</pre>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/upload/chunks/${chunk._id}`);
                  setSelectedChunks(prev => prev.filter(c => c._id !== chunk._id));
                } catch (err) {
                  console.error("Failed to delete chunk:", err);
                }
              }}
              className="absolute top-2 right-2 text-red-600 text-xs hover:underline"
            >
              Delete
            </button>
          </li>
        ))
      )}
    </ul>
  </div>
)}

    </div>
  );
}
