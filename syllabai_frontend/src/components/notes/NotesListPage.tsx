"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { listPreparations } from "@/lib/learning-api";
import type { NoteContent, PreparationRequest, UserRole } from "@/types/learning";

interface NotesListPageProps {
  role: UserRole;
}

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
}

export function NotesListPage({ role }: NotesListPageProps) {
  const [notes, setNotes] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listPreparations(role, { type: "short_note" });
      setNotes(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotes();
  }, [role]);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((n) => {
      const title = (n.result?.title ? String(n.result.title) : n.resource?.title || "").toLowerCase();
      const summary = (n.result?.summary ? String(n.result.summary) : "").toLowerCase();
      return title.includes(q) || summary.includes(q);
    });
  }, [notes, searchQuery]);

  return (
    <div className="notes-list-page">
      <PageHeader
        eyebrow="CONCISE STUDY MATERIAL"
        title={role === "teacher" ? "Teaching Notes" : "My Study Notes"}
        description="Source-grounded summaries, key takeaways, and essential terms extracted from your documents."
        actionHref={`/${role}/prepare?type=short_note`}
        actionLabel="＋ Create Short Notes"
      />

      {/* Search Bar */}
      <div style={{ marginBottom: "24px", maxWidth: "420px" }}>
        <input
          type="search"
          placeholder="Search notes by keyword or title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field-input"
          aria-label="Search notes"
        />
      </div>

      {loading && <LoadingSkeleton type="cards" count={3} />}

      {error && <ErrorState message={error} onRetry={loadNotes} />}

      {!loading && !error && filteredNotes.length === 0 && (
        <EmptyState
          icon="▤"
          title={searchQuery ? "No matching notes found" : "No short notes prepared yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms to find other study notes."
              : "Upload a syllabus, lecture PDF, or article to generate structured summary notes with key points and definitions."
          }
          actionLabel={searchQuery ? undefined : "Prepare your first note"}
          actionHref={searchQuery ? undefined : `/${role}/prepare?type=short_note`}
        />
      )}

      {!loading && !error && filteredNotes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredNotes.map((note) => {
            const result = note.result as unknown as NoteContent;
            const title = result?.title || note.resource?.title || "Short Notes";
            const summary = result?.summary || "Structured takeaways extracted from document.";
            const readTime = calculateReadingTime(`${title} ${summary} ${(result?.key_points || []).join(" ")}`);

            return (
              <div
                key={note.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                  border: "1px solid #e5ebe2",
                  borderRadius: "12px",
                  background: "#fffefa",
                  transition: "transform .15s, box-shadow .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#32735f" }}>
                    {readTime}
                  </span>
                  <span style={{ fontSize: "11px", color: "#8a948e" }}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, color: "#232d29" }}>
                  {title}
                </h3>

                <p style={{ margin: "0 0 18px", fontSize: "12px", color: "#6f7b73", lineHeight: 1.6, flexGrow: 1 }}>
                  {summary.length > 160 ? `${summary.slice(0, 160)}…` : summary}
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <SourceBadge title={note.resource?.title} />
                </div>

                <div style={{ borderTop: "1px solid #edf1ea", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#8a948e" }}>
                    {result?.key_points?.length ? `${result.key_points.length} key points` : "Ready"}
                  </span>
                  <Link
                    href={`/${role}/notes/${note.id}`}
                    style={{ fontSize: "12px", color: "#32735f", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    Open Notes ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
