import React, { useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";
import axios from "axios";

export default function WordCloudCard() {
  const [words, setWords] = useState([]);


  useEffect(() => {
  axios.get(`${import.meta.env.VITE_BACKEND_URL}/wordcloud`)
    .then((res) => {
      console.log("WORDCLOUD RESPONSE:", res.data);

      if (res.data && Array.isArray(res.data)) {
        const formatted = res.data
          .filter(w => typeof w.text === "string" && typeof w.value === "number"); // ✅ match your backend format
        console.log("Formatted:", formatted);
        setWords(formatted);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch word cloud data:", err);
    });
}, []);


  //const fontSizeMapper = word => Math.log2(word.value + 1) * 10;
  const fontSizeMapper = word => word.value * 5 + 12;
  const rotate = word => ~~(Math.random() * 2) * 90;
  //const rotate = () => Math.floor(Math.random() * 360);



  return (
    <div className="bg-white shadow-md rounded p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Word Cloud</h2>
      {words.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available.</p>
      ) : (
        <WordCloud
          data={words}
          fontSizeMapper={fontSizeMapper}
          rotate={rotate}
          width={100}
          height={50}
          padding={0}
          spiral="rectangular"
        />
      )}
    </div>
  );
}