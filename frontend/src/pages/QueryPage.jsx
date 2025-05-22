import React from "react";
import QueryCard from "../components/Query";
import WordCloudCard from "../components/WordCloudCard";
import EmbeddingPlotCard from "../components/EmbeddingPlotCard";

export default function QueryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
      <QueryCard />
      <WordCloudCard />
    </div>
  );
}