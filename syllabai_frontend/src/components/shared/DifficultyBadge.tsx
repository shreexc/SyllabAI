import React from "react";

interface DifficultyBadgeProps {
  difficulty?: string;
}

export function DifficultyBadge({ difficulty = "medium" }: DifficultyBadgeProps) {
  const norm = difficulty.toLowerCase();
  const tone =
    norm.includes("easy") || norm.includes("beginner") || norm.includes("student")
      ? "easy"
      : norm.includes("hard") || norm.includes("advanced")
      ? "hard"
      : "medium";

  return (
    <span className={`difficulty-badge difficulty-badge--${tone}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}
