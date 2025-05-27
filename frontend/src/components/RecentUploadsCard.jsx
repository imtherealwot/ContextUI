import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecentUploadsCard() {
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats')
      .then((res) => {
        setRecentUploads(res.data?.recent_uploads || []);
      })
      .catch((err) => {
        console.error("Failed to fetch recent uploads:", err);
        setRecentUploads([]);
      });
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Recent Uploads</h2>
      {recentUploads.length === 0 ? (
        <p className="text-gray-500 text-sm">No uploads found.</p>
      ) : (
        <ul className="text-sm text-gray-700 divide-y divide-gray-200">
          {recentUploads.map((item, idx) => (
            <li key={idx} className="py-2">
              <span className="font-medium">{item.filename}</span>
              <span className="block text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}