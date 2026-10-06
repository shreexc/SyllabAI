import React from "react";
import type { PreparationStatus } from "@/types/learning";

interface StatusBadgeProps {
  status: PreparationStatus;
}

const labels: Record<PreparationStatus, string> = {
  pending: "Queued",
  processing: "Processing",
  completed: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge-dot" aria-hidden="true" />
      {labels[status] || status}
    </span>
  );
}
