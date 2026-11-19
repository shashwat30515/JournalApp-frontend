import React from "react";

const STYLES: Record<string, string> = {
  Happy: "bg-green-100 text-green-700",
  Sad: "bg-blue-100 text-blue-700",
  Angry: "bg-red-100 text-red-700",
  Anxious: "bg-amber-100 text-amber-700",
};

const EMOJI: Record<string, string> = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😠",
  Anxious: "😰",
};

export const SentimentBadge: React.FC<{ sentiment?: string }> = ({ sentiment }) => {
  if (!sentiment) return null;

  // accepts HAPPY, happy or Happy
  const key = sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        STYLES[key] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      <span>{EMOJI[key] ?? ""}</span>
      {key}
    </span>
  );
};