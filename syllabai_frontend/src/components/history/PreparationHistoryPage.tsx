"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PreparationResult } from "@/components/preparation/PreparationResult";
import { ProcessingStatus } from "@/components/preparation/ProcessingStatus";
import { ApiRequestError } from "@/lib/api";
import { cancelPreparation, listPreparations } from "@/lib/learning-api";
import { ROUTES } from "@/lib/constants";
import type { PreparationRequest, PreparationStatus, PreparationType, UserRole } from "@/types/learning";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const teacherTypeFilters = [
  { label: "All materials", value: "all"       },
  { label: "Quizzes",       value: "quiz"      },
  { label: "Chat",          value: "chat"      },
  { label: "Flashcards",    value: "flashcard" },
  { label: "Animation",     value: "animation" },
] as const;

const studentTypeFilters = [
  { label: "All materials", value: "all"       },
  { label: "Quizzes",       value: "quiz"      },
  { label: "Chat",          value: "chat"      },
  { label: "Flashcards",    value: "flashcard" },
  { label: "Animation",     value: "animation" },
] as const;

const typeNames: Record<PreparationType, string> = {
  quiz:       "Quiz",
  short_note: "Short notes",
  flashcard:  "Flashcards",
  image:      "Image",
  animation:  "Animation",
  other:      "Other",
};

const statusNames: Record<PreparationStatus, string> = {
  pending:    "Queued",
  processing: "In progress",
  completed:  "Ready",
  failed:     "Needs attention",
  cancelled:  "Cancelled",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function relativeDate(date: string): string {
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return "Recently";
  const elapsedHours = Math.max(0, Math.floor((Date.now() - timestamp) / 3_600_000));
  if (elapsedHours < 1) return "Just now";
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays === 1) return "Yesterday";
  if (elapsedDays < 7) return `${elapsedDays} days ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dateGroupLabel(date: string): string {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Earlier";
  const now = new Date();
  const itemDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDifference = Math.round((today.getTime() - itemDay.getTime()) / 86_400_000);
  if (dayDifference === 0) return "Today";
  if (dayDifference === 1) return "Yesterday";
  return parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function monthValue(date: string): string | null {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}`;
}

function errorText(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message;
  return error instanceof Error ? error.message : "Could not load your preparation history.";
}

type HistoryDateFilter = "all" | "today" | "week";

/* ─── Type Icon (SVG) ────────────────────────────────────────────────────── */

function HistoryTypeIcon({ type }: { type: string }) {
  const iconProps = {
    width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.6,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (type === "quiz")
    return <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>;
  if (type === "chat")
    return <svg {...iconProps}><rect x="4" y="6" width="16" height="13" rx="3" /><path d="M12 2v4" /><circle cx="9" cy="12" r="1.5" fill="currentColor" /><circle cx="15" cy="12" r="1.5" fill="currentColor" /><path d="M9 16h6M2 11h2M20 11h2" /></svg>;
  if (type === "flashcard")
    return <svg {...iconProps}><path d="M5 19 9 5h10l-4 14H5z" /></svg>;
  if (type === "animation")
    return <svg {...iconProps}><polygon points="7 4 19 12 7 20 7 4" /></svg>;
  if (type === "short_note")
    return <svg {...iconProps}><path d="M4 6h16M4 10h16M4 14h10" /></svg>;
  if (type === "image")
    return <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
  if (type === "resource")
    return <svg {...iconProps}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
  return <svg {...iconProps}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
}

/* ─── Shared History View ────────────────────────────────────────────────── */

interface SharedHistoryViewProps {
  role: UserRole;
  items: PreparationRequest[];
  loading: boolean;
  error: string | null;
  typeFilter: PreparationType | "all";
  onTypeFilterChange: (value: PreparationType | "all") => void;
  prepare: string;
  onRetry: () => void;
  onCancel: (id: string) => Promise<void>;
}

function SharedHistoryView({
  role, items, loading, error, typeFilter, onTypeFilterChange, prepare, onRetry, onCancel,
}: SharedHistoryViewProps) {
  const [dateFilter, setDateFilter] = useState<HistoryDateFilter>("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const availableMonths = useMemo(() => {
    const months = new Map<string, string>();
    for (const item of items) {
      const month = monthValue(item.created_at);
      if (!month || months.has(month)) continue;
      const [year, monthNumber] = month.split("-").map(Number);
      months.set(month, new Date(year, monthNumber - 1).toLocaleDateString(undefined, { month: "long", year: "numeric" }));
    }
    return [...months.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [items]);

  const visibleItems = useMemo(() => items.filter((item) => {
    if (monthFilter !== "all" && monthValue(item.created_at) !== monthFilter) return false;
    if (dateFilter === "all" || monthFilter !== "all") return true;
    const date = new Date(item.created_at);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysAgo = Math.floor((today.getTime() - itemDay.getTime()) / 86_400_000);
    if (dateFilter === "today") return daysAgo === 0;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return itemDay >= startOfWeek && itemDay <= today;
  }), [dateFilter, items, monthFilter]);

  const groups = useMemo(() => {
    const grouped = new Map<string, PreparationRequest[]>();
    for (const item of visibleItems) {
      const label = dateGroupLabel(item.created_at);
      grouped.set(label, [...(grouped.get(label) ?? []), item]);
    }
    return [...grouped.entries()];
  }, [visibleItems]);

  const filters = role === "teacher" ? teacherTypeFilters : studentTypeFilters;

  const eyebrow = role === "teacher"
    ? "YOUR TEACHING WORK, KEPT TOGETHER"
    : "YOUR LEARNING WORK, KEPT TOGETHER";
  const heading = role === "teacher"
    ? "Teaching History & Archives"
    : "Learning History & Archives";
  const emptyTitle = role === "teacher"
    ? "No Teaching History Yet"
    : "No Learning History Yet";

  const pageClass = role === "teacher"
    ? "history-page history-page--teacher"
    : "history-page history-page--student";

  return (
    <main className={pageClass}>
      {/* ── Page heading ── */}
      <section className="history-heading history-heading--archive">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{heading}</h1>
        </div>
      </section>

      {/* ── Type filter pills ── */}
      <section className="history-toolbar history-toolbar--archive" aria-label="Filter by material type">
        <div className="history-type-filters" role="group" aria-label="Filter by material type">
          {filters.map((filter) => {
            const isActive = typeFilter === filter.value;
            const cls = isActive ? "history-filter history-filter--active" : "history-filter";
            const content = (
              <>
                <HistoryTypeIcon type={filter.value} />
                <span>{filter.label}</span>
              </>
            );
            if (filter.value === "chat") {
              return (
                <Link key={filter.value} href={`/${role}/chat`} className={cls}>
                  {content}
                </Link>
              );
            }
            return (
              <button
                key={filter.value}
                type="button"
                className={cls}
                aria-pressed={isActive}
                onClick={() => onTypeFilterChange(filter.value as PreparationType | "all")}
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Date filter bar ── */}
      <section className="history-date-toolbar history-date-toolbar--archive" aria-label="Filter by date">
        <div className="history-date-presets" role="group" aria-label="Date range">
          <button
            type="button"
            className={dateFilter === "all" && monthFilter === "all" ? "history-date-filter history-date-filter--active" : "history-date-filter"}
            onClick={() => { setDateFilter("all"); setMonthFilter("all"); }}
          >
            All Time
          </button>
          <button
            type="button"
            className={dateFilter === "today" ? "history-date-filter history-date-filter--active" : "history-date-filter"}
            onClick={() => { setDateFilter("today"); setMonthFilter("all"); }}
          >
            Today
          </button>
          <button
            type="button"
            className={dateFilter === "week" ? "history-date-filter history-date-filter--active" : "history-date-filter"}
            onClick={() => { setDateFilter("week"); setMonthFilter("all"); }}
          >
            This Week
          </button>
        </div>
        <label className="history-month-select">
          <span>Select Date:</span>
          <span className="history-month-select-control">
            <select
              aria-label="Select month and year"
              value={monthFilter}
              onChange={(e) => { setMonthFilter(e.target.value); setDateFilter("all"); }}
            >
              <option value="all">All Months Available</option>
              {availableMonths.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </label>
      </section>

      {/* ── Error banner ── */}
      {error && (
        <div className="history-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      )}

      {/* ── Content area ── */}
      <section
        className={`history-student-content history-archive-content${!loading && !error && items.length === 0 ? " history-layout--empty" : ""}`}
      >
        {loading ? (
          <div className="history-skeleton" aria-label="Loading preparation history">
            <span /><span /><span /><span />
          </div>
        ) : error ? (
          <div className="history-empty history-empty--student" role="status">
            <h2>History unavailable</h2>
            <p>We couldn&apos;t load your history. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="history-empty history-empty--student" role="status">
            <h2>{emptyTitle}</h2>
          </div>
        ) : groups.length === 0 ? (
          <div className="history-no-results" role="status">
            No materials found for this date range.
          </div>
        ) : (
          <div className="history-student-feed">
            {groups.map(([label, groupItems]) => (
              <section key={label} className="history-date-group" aria-label={label}>
                <h2 className="history-date-divider"><span>{label}</span></h2>
                <div className="history-student-list">
                  {groupItems.map((item) => (
                    <details key={item.id} className="history-student-item">
                      <summary>
                        <span className={`history-student-item-icon history-student-item-icon--${item.preparation_type}`}>
                          <HistoryTypeIcon type={item.preparation_type} />
                        </span>
                        <span className="history-student-item-title">{item.resource.title}</span>
                        <span className="history-student-item-meta">
                          {item.status === "completed"
                            ? new Date(item.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            : statusNames[item.status]}
                        </span>
                      </summary>
                      <div className="history-student-item-details">
                        <div className="history-student-detail-head">
                          <span>{typeNames[item.preparation_type]}</span>
                          <span>{statusNames[item.status]} · {relativeDate(item.created_at)}</span>
                        </div>
                        {item.status === "completed" && (
                          <>
                            <p>Your prepared material is ready to revisit.</p>
                            <PreparationResult preparation={item} />
                          </>
                        )}
                        {(item.status === "pending" || item.status === "processing") && (
                          <ProcessingStatus preparation={item} onCancel={() => void onCancel(item.id)} />
                        )}
                        {item.status === "failed" && (
                          <div className="history-failure">
                            <strong>We couldn&apos;t prepare this material.</strong>
                            <p>{item.error_message || "The source could not be processed. Please try again with a different resource."}</p>
                            <Link href={prepare} className="text-action">Try a new preparation →</Link>
                          </div>
                        )}
                        {item.status === "cancelled" && (
                          <div className="history-cancelled">
                            <p>This preparation was cancelled before completion.</p>
                            <Link href={prepare} className="text-action">Prepare this source again →</Link>
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ─── Exported Page Component ────────────────────────────────────────────── */

export function PreparationHistoryPage({ role }: { role: UserRole }) {
  const [typeFilter, setTypeFilter]   = useState<PreparationType | "all">("all");
  const [items, setItems]             = useState<PreparationRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const prepare   = role === "teacher" ? ROUTES.teacher.prepare   : ROUTES.student.prepare;

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError(null);
    try {
      const result = await listPreparations(role, {
        ...(typeFilter !== "all"   ? { type:   typeFilter   } : {}),
      });
      setItems(result);
    } catch (caught) {
      setError(errorText(caught));
      if (!quiet) toast.error("History couldn't be loaded", { description: errorText(caught) });
    } finally {
      setLoading(false);
    }
  }, [role, typeFilter]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (!items.some((item) => item.status === "pending" || item.status === "processing")) return;
    const interval = setInterval(() => void load(true), 5000);
    return () => clearInterval(interval);
  }, [items, load]);

  const cancelJob = async (id: string) => {
    try {
      const updated = await cancelPreparation(role, id);
      setItems((current) => current.map((item) => (item.id === id ? updated : item)));
      toast.message("Preparation cancelled");
    } catch (caught) {
      toast.error("Could not cancel preparation", { description: errorText(caught) });
    }
  };

  return (
    <SharedHistoryView
      role={role}
      items={items}
      loading={loading}
      error={error}
      typeFilter={typeFilter}
      onTypeFilterChange={setTypeFilter}
      prepare={prepare}
      onRetry={() => void load()}
      onCancel={cancelJob}
    />
  );
}
