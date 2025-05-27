import React, { useState } from "react";
import axios from "axios";

export default function UploadCard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResponse(null);
    setError(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setResponse(null);
      setError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log("Uploading to:", `${import.meta.env.VITE_BACKEND_URL}/upload`);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 transition-colors duration-200 ${
        dragActive ? "border-2 border-dashed border-blue-500 bg-blue-50" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload a File or Image</h2>

      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="block cursor-pointer border border-gray-300 rounded p-4 text-center text-sm text-gray-500 hover:border-blue-500"
        >
          {selectedFile ? selectedFile.name : "Drag & drop a file here, or click to browse"}
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Upload
      </button>

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      {response && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">{response.details}</p>
          {response.preview_text && (
            <>
              <h3 className="mt-4 text-sm font-medium text-gray-800">Extracted/Uploaded Text Preview:</h3>
              <pre className="mt-1 bg-gray-100 p-2 text-xs overflow-x-auto max-h-64">{response.preview_text}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
