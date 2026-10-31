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

const typeFilters: Array<{ label: string; value: PreparationType | "all" }> = [
  { label: "All materials", value: "all" },
  { label: "Quizzes", value: "quiz" },
  { label: "Short notes", value: "short_note" },
  { label: "Flashcards", value: "flashcard" },
  { label: "Images", value: "image" },
  { label: "Animation", value: "animation" },
  { label: "Other", value: "other" },
];

const studentTypeFilters = [
  { label: "All materials", value: "all" },
  { label: "Quizzes", value: "quiz" },
  { label: "Chat", value: "chat" },
  { label: "Flashcards", value: "flashcard" },
  { label: "Animation", value: "animation" },
] as const;

const typeNames: Record<PreparationType, string> = {
  quiz: "Quiz",
  short_note: "Short notes",
  flashcard: "Flashcards",
  image: "Image",
  animation: "Animation",
  other: "Other",
};

const statusNames: Record<PreparationStatus, string> = {
  pending: "Queued",
  processing: "In progress",
  completed: "Ready",
  failed: "Needs attention",
  cancelled: "Cancelled",
};

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

function typeIcon(type: PreparationType): string {
  return { quiz: "?", short_note: "≡", flashcard: "▱", image: "▧", animation: "▷", other: "＋" }[type];
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

type HistoryDateFilter = "all" | "today" | "week";

function StudentHistoryTypeIcon({ type }: { type: (typeof studentTypeFilters)[number]["value"] }) {
  const iconProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (type === "quiz") {
    return <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>;
  }
  if (type === "chat") {
    return <svg {...iconProps}><rect x="4" y="6" width="16" height="13" rx="3" /><path d="M12 2v4" /><circle cx="9" cy="12" r="1.5" fill="currentColor" /><circle cx="15" cy="12" r="1.5" fill="currentColor" /><path d="M9 16h6M2 11h2M20 11h2" /></svg>;
  }
  if (type === "flashcard") {
    return <svg {...iconProps}><path d="M5 19 9 5h10l-4 14H5z" /></svg>;
  }
  if (type === "animation") {
    return <svg {...iconProps}><polygon points="7 4 19 12 7 20 7 4" /></svg>;
  }
  return <svg {...iconProps}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
}

function errorText(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message;
  return error instanceof Error ? error.message : "Could not load your preparation history.";
}

function StudentHistoryView({
  items,
  loading,
  error,
  typeFilter,
  onTypeFilterChange,
  prepare,
  onRetry,
  onCancel,
}: {
  items: PreparationRequest[];
  loading: boolean;
  error: string | null;
  typeFilter: PreparationType | "all";
  onTypeFilterChange: (value: PreparationType | "all") => void;
  prepare: string;
  onRetry: () => void;
  onCancel: (id: string) => Promise<void>;
}) {
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
    return [...months.entries()].sort(([first], [second]) => second.localeCompare(first));
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

  return (
    <main className="history-page history-page--student">
      <section className="history-heading history-heading--student">
        <div>
          <span className="eyebrow">YOUR LEARNING WORK, KEPT TOGETHER</span>
          <h1>Learning History &amp; Archives</h1>
        </div>
      </section>

      <section className="history-toolbar history-toolbar--student" aria-label="Filter by material type">
        <div className="history-type-filters" role="group" aria-label="Filter by material type">
          {studentTypeFilters.map((filter) => {
            const className = typeFilter === filter.value ? "history-filter history-filter--active" : "history-filter";
            const content = <><StudentHistoryTypeIcon type={filter.value} /><span>{filter.label}</span></>;
            return filter.value === "chat" ? (
              <Link key={filter.value} href="/student/chat" className={className}>{content}</Link>
            ) : (
              <button
                key={filter.value}
                type="button"
                className={className}
                aria-pressed={typeFilter === filter.value}
                onClick={() => onTypeFilterChange(filter.value)}
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>

      <section className="history-date-toolbar" aria-label="Filter by date">
        <div className="history-date-presets" role="group" aria-label="Date range">
          <button type="button" className={dateFilter === "all" && monthFilter === "all" ? "history-date-filter history-date-filter--active" : "history-date-filter"} onClick={() => { setDateFilter("all"); setMonthFilter("all"); }}>All Time</button>
          <button type="button" className={dateFilter === "today" ? "history-date-filter history-date-filter--active" : "history-date-filter"} onClick={() => { setDateFilter("today"); setMonthFilter("all"); }}>Today</button>
          <button type="button" className={dateFilter === "week" ? "history-date-filter history-date-filter--active" : "history-date-filter"} onClick={() => { setDateFilter("week"); setMonthFilter("all"); }}>This Week</button>
        </div>
        <label className="history-month-select">
          <span>Select Month:</span>
          <span className="history-month-select-control">
            <select aria-label="Select month and year" value={monthFilter} onChange={(event) => { setMonthFilter(event.target.value); setDateFilter("all"); }}>
              <option value="all">All Months and Years</option>
              {availableMonths.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </label>
      </section>

      {error && <div className="history-error" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>Try again</button></div>}

      <section className={`history-student-content${!loading && !error && items.length === 0 ? " history-layout--empty" : ""}`}>
        {loading ? (
          <div className="history-skeleton" aria-label="Loading preparation history"><span /><span /><span /><span /></div>
        ) : error ? (
          <div className="history-empty history-empty--student" role="status">
            <h2>History unavailable</h2>
            <p>We couldn’t load your learning history. Please try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="history-empty history-empty--student" role="status">
            <h2>No Learning History Yet</h2>
          </div>
        ) : groups.length === 0 ? (
          <div className="history-no-results" role="status">No learning materials found for this date range.</div>
        ) : (
          <div className="history-student-feed">
            {groups.map(([label, groupItems]) => (
              <section key={label} className="history-date-group" aria-label={label}>
                <h2 className="history-date-divider"><span>{label}</span></h2>
                <div className="history-student-list">
                  {groupItems.map((item) => (
                    <details key={item.id} className="history-student-item">
                      <summary>
                        <span className={`history-student-item-icon history-student-item-icon--${item.preparation_type}`}>{typeIcon(item.preparation_type)}</span>
                        <span className="history-student-item-title">{item.resource.title}</span>
                        <span className="history-student-item-meta">{item.status === "completed" ? relativeDate(item.created_at) : statusNames[item.status]}</span>
                      </summary>
                      <div className="history-student-item-details">
                        <div className="history-student-detail-head"><span>{typeNames[item.preparation_type]}</span><span>{statusNames[item.status]} · {relativeDate(item.created_at)}</span></div>
                        {item.status === "completed" && <><p>Your prepared material is ready to revisit.</p><PreparationResult preparation={item} /></>}
                        {(item.status === "pending" || item.status === "processing") && <ProcessingStatus preparation={item} onCancel={() => void onCancel(item.id)} />}
                        {item.status === "failed" && <div className="history-failure"><strong>We couldn’t prepare this material.</strong><p>{item.error_message || "The source could not be processed. Please try again with a different resource."}</p><Link href={prepare} className="text-action">Try a new preparation →</Link></div>}
                        {item.status === "cancelled" && <div className="history-cancelled"><p>This preparation was cancelled before completion.</p><Link href={prepare} className="text-action">Prepare this source again →</Link></div>}
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

export function PreparationHistoryPage({ role }: { role: UserRole }) {
  const [typeFilter, setTypeFilter] = useState<PreparationType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PreparationStatus | "all">("all");
  const [items, setItems] = useState<PreparationRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const result = await listPreparations(role, {
        ...(typeFilter !== "all" ? { type: typeFilter } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      });
      setItems(result);
      setSelectedId((current) => current && result.some((item) => item.id === current) ? current : result[0]?.id ?? null);
    } catch (caught) {
      setError(errorText(caught));
      if (!quiet) toast.error("History couldn’t be loaded", { description: errorText(caught) });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [role, statusFilter, typeFilter]);

  useEffect(() => {
    const initialLoad = setTimeout(() => void load(), 0);
    return () => clearTimeout(initialLoad);
  }, [load]);
  useEffect(() => {
    if (!items.some((item) => item.status === "pending" || item.status === "processing")) return;
    const interval = setInterval(() => void load(true), 5000);
    return () => clearInterval(interval);
  }, [items, load]);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const dashboard = role === "teacher" ? ROUTES.teacher.dashboard : ROUTES.student.dashboard;
  const prepare = role === "teacher" ? ROUTES.teacher.prepare : ROUTES.student.prepare;
  const activeCount = items.filter((item) => item.status === "pending" || item.status === "processing").length;

  const cancelJob = async (id: string) => {
    try {
      const updated = await cancelPreparation(role, id);
      setItems((current) => current.map((item) => item.id === id ? updated : item));
      toast.message("Preparation cancelled");
    } catch (caught) {
      toast.error("Could not cancel preparation", { description: errorText(caught) });
    }
  };

  if (role === "student") {
    return (
      <StudentHistoryView
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

  return (
    <main className={`history-page history-page--${role}`}>
      <header className="history-topbar">
        <Link href={dashboard} className="brand-lockup" aria-label="Dashboard home"><span className="brand-mark">s.</span><span>SyllabAI</span></Link>
        <div className="history-topbar-actions"><Link href={prepare} className="history-prepare-link">＋ New preparation</Link><Link href={dashboard} className="workspace-back">← Dashboard</Link></div>
      </header>

      <section className="history-heading">
        <div><span className="eyebrow">YOUR LEARNING WORK, KEPT TOGETHER</span><h1>Preparation history</h1><p>Pick up where you left off. Your source material and results are private to your account.</p></div>
        <div className="history-total"><strong>{items.length}</strong><span>saved materials</span></div>
      </section>

      <section className="history-toolbar" aria-label="History filters">
        <div className="history-type-filters" role="group" aria-label="Filter by material type">
          {typeFilters.map((filter) => <button key={filter.value} type="button" className={typeFilter === filter.value ? "history-filter history-filter--active" : "history-filter"} aria-pressed={typeFilter === filter.value} onClick={() => setTypeFilter(filter.value)}>{filter.label}</button>)}
        </div>
        <label className="history-status-select"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as PreparationStatus | "all")}><option value="all">All statuses</option><option value="pending">Queued</option><option value="processing">In progress</option><option value="completed">Ready</option><option value="failed">Needs attention</option><option value="cancelled">Cancelled</option></select></label>
        <button type="button" className="history-refresh" disabled={refreshing} onClick={() => void load(true)}>{refreshing ? "Refreshing…" : "Refresh ↻"}</button>
      </section>

      {error && <div className="history-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div>}
      <section className="history-layout">
        <div className="history-list-panel">
          {loading ? <div className="history-skeleton" aria-label="Loading preparation history"><span /><span /><span /><span /></div> : items.length === 0 ? (
            <div className="history-empty"><span className="history-empty-icon">↗</span><h2>Your story starts here</h2><p>Prepared quizzes, notes, flashcards, images, animations and custom materials will be saved here.</p><Link href={prepare} className="preparation-action">Prepare learning material <span>↗</span></Link></div>
          ) : (
            <>
              <div className="history-list-heading"><span>{items.length} {items.length === 1 ? "item" : "items"}</span>{activeCount > 0 && <span className="history-active-count"><i />{activeCount} processing</span>}</div>
              <div className="history-list" role="list">
                {items.map((item) => <button key={item.id} type="button" className={`history-item${selectedId === item.id ? " history-item--selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                  <span className="history-item-icon">{typeIcon(item.preparation_type)}</span>
                  <span className="history-item-copy"><strong>{item.resource.title}</strong><span>{typeNames[item.preparation_type]} <i>·</i> {relativeDate(item.created_at)}</span></span>
                  <span className={`history-status history-status--${item.status}`}><i />{statusNames[item.status]}</span>
                  <span className="history-item-chevron">›</span>
                </button>)}
              </div>
            </>
          )}
        </div>
        <aside className="history-detail-panel" aria-label="Selected preparation details">
          {selected ? <>
            <div className="history-detail-head"><span className="history-item-icon">{typeIcon(selected.preparation_type)}</span><div><span className="eyebrow">{typeNames[selected.preparation_type]}</span><h2>{selected.resource.title}</h2></div></div>
            <div className={`history-detail-status history-status--${selected.status}`}><i />{statusNames[selected.status]} <span>·</span> {relativeDate(selected.created_at)}</div>
            {selected.status === "completed" && <><p className="history-detail-description">Your prepared material is ready to revisit.</p><PreparationResult preparation={selected} /></>}
            {(selected.status === "pending" || selected.status === "processing") && <ProcessingStatus preparation={selected} onCancel={() => void cancelJob(selected.id)} />}
            {selected.status === "failed" && <div className="history-failure"><strong>We couldn’t prepare this material.</strong><p>{selected.error_message || "The source could not be processed. Please try again with a different resource."}</p><Link href={prepare} className="text-action">Try a new preparation →</Link></div>}
            {selected.status === "cancelled" && <div className="history-cancelled"><p>This preparation was cancelled before completion.</p><Link href={prepare} className="text-action">Prepare this source again →</Link></div>}
          </> : !loading && <div className="history-detail-placeholder"><span>↖</span><h2>Select a preparation</h2><p>Choose an item to see its status, options, and result.</p></div>}
        </aside>
      </section>
      <footer className="history-footer"><span>Only you can see your preparation history.</span><span>{items.length} of up to 100 most recent preparations</span></footer>
    </main>
  );
}
