"use client";

import Link from "next/link";
import React from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "✦",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state-box" role="status">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="empty-state-action">
          {actionLabel} <span>↗</span>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button type="button" onClick={onAction} className="empty-state-action">
          {actionLabel} <span>↗</span>
        </button>
      )}
    </div>
  );
}
