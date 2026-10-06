import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
  tone?: "mint" | "peach" | "lavender" | "blue" | "neutral";
  caption?: string;
}

export function StatCard({ label, value, icon, tone = "mint", caption }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card-head">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {caption && <p className="stat-card-caption">{caption}</p>}
    </div>
  );
}
