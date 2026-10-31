"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  const fetchDecks = useCallback(() => listPreparations(role, { type: "flashcard" }), [role]);

  const loadDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchDecks();
      setDecks(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flashcard decks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    fetchDecks()
      .then((items) => {
        if (active) {
          setDecks(items);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load flashcard decks.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [fetchDecks]);

  const filteredDecks = useMemo(() => {
    return decks.filter((d) => {
      const result = d.result as unknown as FlashcardContent;
      const title = (result?.title || d.resource?.title || "").toLowerCase();
      return !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
    });
  }, [decks, searchQuery]);

  return (
    <div className={`flashcard-list-page${role === "student" ? " flashcard-list-page--student" : ""}`}>
      <PageHeader
        eyebrow="ACTIVE RECALL STUDY DECKS"
        title={role === "teacher" ? "Teaching Flashcards" : "Study Flashcards"}
        description="Prompt and reveal flashcard decks derived from your uploaded documents to boost memory retention."
        actionHref={role === "teacher" ? `/${role}/prepare?type=flashcard` : undefined}
        actionLabel={role === "teacher" ? "＋ Create Flashcards" : undefined}
      />

      {(role === "teacher" || decks.length > 0) && (
        <div className="flashcard-filter-toolbar">
          <input
            type="search"
            placeholder="Search flashcard decks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input"
            aria-label="Search flashcards"
          />
        </div>
      )}

      {loading &&
        (role === "student" ? (
          <div className="flashcard-list-loading-state">
            <LoadingSkeleton type="cards" count={3} />
          </div>
        ) : (
          <LoadingSkeleton type="cards" count={3} />
        ))}

      {error && <ErrorState message={error} onRetry={loadDecks} />}

      {!loading && !error && filteredDecks.length === 0 && (
        <EmptyState
          className={role === "student" ? "flashcard-empty-state" : undefined}
          icon={
            role === "student" ? (
              <svg
                width="180"
                height="120"
                viewBox="0 0 180 120"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="89" cy="63" r="48" fill="#D7D1FA" />
                <g transform="rotate(-17 82 62)">
                  <rect x="57" y="24" width="72" height="82" rx="9" fill="#6555C1" />
                  <rect x="61" y="28" width="67" height="76" rx="8" fill="#806CF4" />
                </g>
                <g transform="rotate(-11 102 62)">
                  <rect x="72" y="30" width="82" height="72" rx="10" fill="#B7D7FF" />
                  <rect x="77" y="34" width="73" height="65" rx="8" fill="#F8F6FF" />
                  <rect x="91" y="51" width="45" height="6" rx="3" fill="#9E8FFA" />
                  <circle cx="94" cy="68" r="3" fill="#806CF4" />
                  <rect x="102" y="65" width="34" height="6" rx="3" fill="#806CF4" />
                  <circle cx="94" cy="82" r="3" fill="#806CF4" />
                  <rect x="102" y="79" width="28" height="6" rx="3" fill="#806CF4" />
                </g>
                <path d="M37 48 41 59 52 63 41 67 37 78 33 67 22 63 33 59 37 48Z" fill="#F45FC5" />
                <path d="M151 12 155 23 166 27 155 31 151 42 147 31 136 27 147 23 151 12Z" fill="#38A8FF" />
                <path d="M164 47 167 55 175 58 167 61 164 69 161 61 153 58 161 55 164 47Z" fill="#D946EF" />
                <path d="M52 82 55 90 63 93 55 96 52 104 49 96 41 93 49 90 52 82Z" fill="#38A8FF" />
                <path d="M145 83 148 91 156 94 148 97 145 105 142 97 134 94 142 91 145 83Z" fill="#A78BFA" />
              </svg>
            ) : "▱"
          }
          title={
            searchQuery
              ? "No matching flashcard decks found"
              : role === "student"
                ? "No flashcard decks generated yet"
                : "No flashcard decks prepared yet"
          }
          description={
            searchQuery
              ? "Try adjusting your search query."
              : role === "student"
                ? "Upload a syllabus, textbook chapter, or lecture document to extract key concepts, prompts, and answer study cards."
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
