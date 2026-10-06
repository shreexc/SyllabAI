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

function errorText(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message;
  return error instanceof Error ? error.message : "Could not load your preparation history.";
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
            <div className="history-empty"><span className="history-empty-icon">↗</span><h2>{typeFilter === "all" && statusFilter === "all" ? "Your story starts here" : "Nothing matches these filters"}</h2><p>{typeFilter === "all" && statusFilter === "all" ? "Prepared quizzes, notes, flashcards, images, animations and custom materials will be saved here." : "Try another material type or status, or start a new preparation."}</p><Link href={prepare} className="preparation-action">Prepare learning material <span>↗</span></Link></div>
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
