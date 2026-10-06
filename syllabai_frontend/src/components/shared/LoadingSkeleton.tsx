import React from "react";

interface LoadingSkeletonProps {
  type?: "cards" | "document" | "list" | "dashboard";
  count?: number;
}

export function LoadingSkeleton({ type = "cards", count = 4 }: LoadingSkeletonProps) {
  if (type === "dashboard") {
    return (
      <div className="skeleton-container" aria-label="Loading dashboard">
        <div className="skeleton-banner skeleton-pulse" />
        <div className="skeleton-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card skeleton-pulse" />
          ))}
        </div>
        <div className="skeleton-rows">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-row skeleton-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (type === "document") {
    return (
      <div className="skeleton-container" aria-label="Loading content">
        <div className="skeleton-header skeleton-pulse" style={{ height: "48px", width: "65%" }} />
        <div className="skeleton-row skeleton-pulse" style={{ height: "24px", width: "40%", marginTop: "16px" }} />
        <div className="skeleton-body" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="skeleton-row skeleton-pulse" style={{ height: "18px", width: "100%" }} />
          <div className="skeleton-row skeleton-pulse" style={{ height: "18px", width: "95%" }} />
          <div className="skeleton-row skeleton-pulse" style={{ height: "18px", width: "90%" }} />
          <div className="skeleton-row skeleton-pulse" style={{ height: "18px", width: "80%" }} />
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="skeleton-list" aria-label="Loading items">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-row skeleton-pulse" style={{ height: "64px", marginBottom: "12px", borderRadius: "8px" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid" aria-label="Loading cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card skeleton-pulse" />
      ))}
    </div>
  );
}
