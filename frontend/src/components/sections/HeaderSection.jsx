import React from "react";

export default function SectionHeader({ topic, subtopic, onBack }) {
  return (
    <div className="p-16 flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-emerald-900 uppercase">
        {topic}
        {subtopic && ` > ${subtopic}`}
      </h1>

      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-emerald-700 hover:underline">
          ← Volver
        </button>
      )}
    </div>
  );
}
