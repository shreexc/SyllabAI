"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { listPreparations } from "@/lib/learning-api";
import type { FlashcardContent, PreparationRequest, UserRole } from "@/types/learning";

interface FlashcardListPageProps {
  role: UserRole;
}

export function FlashcardListPage({ role }: FlashcardListPageProps) {
  const [decks, setDecks] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listPreparations(role, { type: "flashcard" });
      setDecks(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flashcard decks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDecks();
  }, [role]);

  const filteredDecks = useMemo(() => {
    return decks.filter((d) => {
      const result = d.result as unknown as FlashcardContent;
      const title = (result?.title || d.resource?.title || "").toLowerCase();
      return !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
    });
  }, [decks, searchQuery]);

  return (
    <div className="flashcard-list-page">
      <PageHeader
        eyebrow="ACTIVE RECALL STUDY DECKS"
        title={role === "teacher" ? "Teaching Flashcards" : "Study Flashcards"}
        description="Prompt and reveal flashcard decks derived from your uploaded documents to boost memory retention."
        actionHref={`/${role}/prepare?type=flashcard`}
        actionLabel="＋ Create Flashcards"
      />

      <div style={{ marginBottom: "24px", maxWidth: "380px" }}>
        <input
          type="search"
          placeholder="Search flashcard decks…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field-input"
          aria-label="Search flashcards"
        />
      </div>

      {loading && <LoadingSkeleton type="cards" count={3} />}

      {error && <ErrorState message={error} onRetry={loadDecks} />}

      {!loading && !error && filteredDecks.length === 0 && (
        <EmptyState
          icon="▱"
          title={searchQuery ? "No matching flashcard decks found" : "No flashcard decks prepared yet"}
          description={
            searchQuery
              ? "Try adjusting your search query."
              : "Upload a syllabus, textbook chapter, or lecture document to extract key concept prompt-and-answer study cards."
          }
          actionLabel={searchQuery ? undefined : "Prepare your first deck"}
          actionHref={searchQuery ? undefined : `/${role}/prepare?type=flashcard`}
        />
      )}

      {!loading && !error && filteredDecks.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredDecks.map((deck) => {
            const result = deck.result as unknown as FlashcardContent;
            const title = result?.title || `${deck.resource?.title || "Topic"} Flashcards`;
            const cardCount = result?.cards?.length || result?.count || 0;
            const diff = result?.difficulty || "medium";

            return (
              <div
                key={deck.id}
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
                  <DifficultyBadge difficulty={diff} />
                  <span style={{ fontSize: "11px", color: "#8a948e" }}>
                    {cardCount} cards
                  </span>
                </div>

                <h3 style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, color: "#232d29" }}>
                  {title}
                </h3>

                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6f7b73" }}>
                  Active recall card deck generated from source statements.
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <SourceBadge title={deck.resource?.title} />
                </div>

                <div style={{ borderTop: "1px solid #edf1ea", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#8a948e" }}>
                    {new Date(deck.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/${role}/flashcards/${deck.id}`}
                    style={{ fontSize: "12px", color: "#32735f", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    Study Deck ↗
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
