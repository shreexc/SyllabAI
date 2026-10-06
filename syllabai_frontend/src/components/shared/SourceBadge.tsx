import React from "react";

interface SourceBadgeProps {
  title?: string;
  page?: number | null;
  grounding?: string;
}

export function SourceBadge({ title, page, grounding }: SourceBadgeProps) {
  if (!title && !grounding) return null;

  return (
    <div className="source-badge">
      <span className="source-badge-icon" aria-hidden="true">🗎</span>
      <div className="source-badge-content">
        {title && (
          <span className="source-badge-title">
            Source: <strong>{title}</strong>
            {page != null && page > 0 && <span> · Page {page}</span>}
          </span>
        )}
        {grounding && <span className="source-badge-grounding">{grounding}</span>}
      </div>
    </div>
  );
}
