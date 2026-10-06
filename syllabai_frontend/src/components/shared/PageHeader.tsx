import Link from "next/link";
import React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = "Back",
  actionHref,
  actionLabel,
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      {backHref && (
        <Link href={backHref} className="page-back-link">
          ← {backLabel}
        </Link>
      )}
      <div className="page-header-row">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        <div className="page-header-actions">
          {actionHref && actionLabel && (
            <Link href={actionHref} className="page-primary-action">
              {actionLabel} <span>↗</span>
            </Link>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
