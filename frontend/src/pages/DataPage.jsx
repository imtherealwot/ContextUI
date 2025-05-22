import React from "react";
import UploadCard from "../components/UploadCard";
import StatsCard from "../components/StatsCard";
import EmbeddingPlotCard from "../components/EmbeddingPlotCard";

export default function DataPage() {
  return (
<div className="mx-auto px-4">
  <h1 className="text-2xl font-bold mb-4">Data Management</h1>
  <div className="flex flex-col space-y-6">
    <UploadCard />
    <StatsCard />
    <EmbeddingPlotCard />
  </div>
</div>
  );
}