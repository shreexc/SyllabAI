"use client";

import Link from "next/link";
import React from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information right now. Please try again.",
  onRetry,
  backHref,
}: ErrorStateProps) {
  return (
    <div className="error-state-box" role="alert">
      <div className="error-state-icon" aria-hidden="true">!</div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      <div className="error-state-actions">
        {onRetry && (
          <button type="button" onClick={onRetry} className="error-retry-btn">
            Try again ↻
          </button>
        )}
        {backHref && (
          <Link href={backHref} className="error-back-link">
            ← Return to dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
