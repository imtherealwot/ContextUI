import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";

export default function EmbeddingPlotCard() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/embedding-plot`)
      .then(res => {
        setPoints(res.data.points);
      })
      .catch(err => {
        console.error("Failed to load embedding plot data", err);
      });
  }, []);

  const getTraces = () => {
    const grouped = points.reduce((acc, p) => {
      acc[p.label] = acc[p.label] || [];
      acc[p.label].push(p);
      return acc;
    }, {});

    return Object.entries(grouped).map(([filename, pts]) => ({
      x: pts.map(p => p.x),
      y: pts.map(p => p.y),
      z: pts.map(p => p.z),
      text: pts.map(p => `File: ${p.label}<br>Chunk: ${p.chunk_index}`),
      name: filename,
      mode: "markers",
      type: "scatter3d",
      marker: { size: 4 },
      hovertemplate: "%{text}<extra></extra>"
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 relative">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Embedding Plot (colored by file)</h2>
      <div className="plotly-wrapper" style={{ position: "relative" }}>
        <Plot
          data={getTraces()}
          layout={{
            autosize: true,
            height: 500,
            margin: { l: 0, r: 0, t: 30, b: 30 },
            scene: {
              xaxis: { title: "PC1" },
              yaxis: { title: "PC2" },
              zaxis: { title: "PC3" }
            },
            legend: {
              orientation: "v",
              x: -0.2,
              xanchor: "right",
              y: 0.5,
              font: { size: 10 }
            }
          }}
          config={{ responsive: true, displayModeBar: true }}
          style={{ width: "100%" }}
        />
      </div>

      {/* CSS fix to reposition modebar */}
      <style jsx>{`
        .modebar-container {
          top: 10px !important;
          right: auto !important;
          left: 10px !important;
        }
      `}</style>
    </div>
  );
}
