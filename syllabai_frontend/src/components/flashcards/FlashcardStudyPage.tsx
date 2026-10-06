"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { getPreparation, listPreparations, submitFlashcardReview } from "@/lib/learning-api";
import type { FlashcardContent, FlashcardItem, PreparationRequest, UserRole } from "@/types/learning";

interface FlashcardStudyPageProps {
  role: UserRole;
  id: string;
}

export function FlashcardStudyPage({ role, id }: FlashcardStudyPageProps) {
  const [deck, setDeck] = useState<PreparationRequest | null>(null);
  const [related, setRelated] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Study State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPreparation(role, id);
        if (!mounted) return;
        setDeck(data);

        // Preload any existing reviews saved in options
        if (data.options?.reviews && typeof data.options.reviews === "object") {
          setReviews(data.options.reviews as Record<string, string>);
        }

        if (data.resource?.id) {
          try {
            const all = await listPreparations(role);
            if (mounted) {
              setRelated(all.filter((p) => p.resource?.id === data.resource?.id && p.id !== data.id));
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load deck.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [role, id]);

  const cards: FlashcardItem[] = (deck?.result as unknown as FlashcardContent)?.cards || [];
  const total = cards.length;
  const currentCard = cards[cardIndex];

  const handleRateCard = async (rating: "again" | "hard" | "good" | "easy") => {
    if (!currentCard) return;
    const cardIdStr = String(currentCard.id);
    setRecording(true);
    try {
      const stats = await submitFlashcardReview(role, id, currentCard.id, rating);
      setReviews((prev) => ({ ...prev, [cardIdStr]: rating }));
      toast.message(`Rated as ${rating.toUpperCase()}`);

      // Auto-advance to next card if available
      if (cardIndex < total - 1) {
        setCardIndex((prev) => prev + 1);
        setIsFlipped(false);
      }
    } catch (err) {
      toast.error("Could not record review rating.");
    } finally {
      setRecording(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="document" />;
  }

  if (error || !deck || total === 0) {
    return (
      <ErrorState
        title="Deck not found or empty"
        message={error || "This flashcard deck contains no study cards."}
        backHref={`/${role}/flashcards`}
      />
    );
  }

  // Calculate real progress
  const reviewedCount = Object.keys(reviews).length;
  const knownCount = Object.values(reviews).filter((r) => r === "good" || r === "easy").length;
  const needReviewCount = Object.values(reviews).filter((r) => r === "again" || r === "hard").length;

  return (
    <div className="flashcard-study-page">
      <PageHeader
        eyebrow="ACTIVE RECALL STUDY"
        title={String(deck.result?.title || deck.resource?.title || "Flashcards")}
        description="Tap card to flip between prompt and source explanation. Rate your recall to track mastery."
        backHref={`/${role}/flashcards`}
        backLabel="All Decks"
      />

      {/* Progress stats bar */}
      <div style={{ maxWidth: "620px", margin: "0 auto 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", textAlign: "center" }}>
        <div style={{ padding: "10px", borderRadius: "8px", background: "#f8faf7", border: "1px solid #e7efe4" }}>
          <span style={{ fontSize: "10px", color: "#8a968f", textTransform: "uppercase", fontWeight: 700 }}>Total</span>
          <strong style={{ display: "block", fontSize: "16px", color: "#28332d" }}>{total}</strong>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "#f8faf7", border: "1px solid #e7efe4" }}>
          <span style={{ fontSize: "10px", color: "#8a968f", textTransform: "uppercase", fontWeight: 700 }}>Reviewed</span>
          <strong style={{ display: "block", fontSize: "16px", color: "#28332d" }}>{reviewedCount}</strong>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "#eef8f0", border: "1px solid #d5ebd8" }}>
          <span style={{ fontSize: "10px", color: "#2d7a46", textTransform: "uppercase", fontWeight: 700 }}>Mastered</span>
          <strong style={{ display: "block", fontSize: "16px", color: "#2d7a46" }}>{knownCount}</strong>
        </div>
        <div style={{ padding: "10px", borderRadius: "8px", background: "#fdf3f2", border: "1px solid #f6d8d6" }}>
          <span style={{ fontSize: "10px", color: "#b83424", textTransform: "uppercase", fontWeight: 700 }}>Needs Work</span>
          <strong style={{ display: "block", fontSize: "16px", color: "#b83424" }}>{needReviewCount}</strong>
        </div>
      </div>

      <div className="flashcard-stage">
        <div className="flashcard-counter-row">
          <span>Card {cardIndex + 1} of {total}</span>
          <SourceBadge title={deck.resource?.title} />
        </div>

        {/* 3D Flip Card */}
        <div
          className="flashcard-3d-box"
          onClick={() => setIsFlipped((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setIsFlipped((prev) => !prev);
            }
          }}
          aria-label="Flashcard. Press to flip."
        >
          <div className={`flashcard-inner ${isFlipped ? "flashcard-inner--flipped" : ""}`}>
            {/* Front Prompt Face */}
            <div className="flashcard-side flashcard-side--front">
              <span className="flashcard-tag">PROMPT · CLICK TO REVEAL</span>
              <p className="flashcard-text">{currentCard?.front}</p>
              <span className="flashcard-hint">Tap card or press Space to reveal answer ↻</span>
            </div>

            {/* Back Answer Face */}
            <div className="flashcard-side flashcard-side--back">
              <span className="flashcard-tag" style={{ color: "#2d7a46" }}>SOURCE EXPLANATION</span>
              <p className="flashcard-text">{currentCard?.back}</p>
              <span className="flashcard-hint">Rate your recall below to record progress</span>
            </div>
          </div>
        </div>

        {/* Rating Buttons (when flipped) */}
        {isFlipped && (
          <div style={{ width: "100%", marginBottom: "20px" }}>
            <span style={{ display: "block", textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#8a968f", textTransform: "uppercase", marginBottom: "10px" }}>
              How well did you know this?
            </span>
            <div className="flashcard-action-bar">
              <button
                type="button"
                onClick={() => void handleRateCard("again")}
                disabled={recording}
                className="rating-btn rating-btn--again"
              >
                Again
              </button>
              <button
                type="button"
                onClick={() => void handleRateCard("hard")}
                disabled={recording}
                className="rating-btn rating-btn--hard"
              >
                Hard
              </button>
              <button
                type="button"
                onClick={() => void handleRateCard("good")}
                disabled={recording}
                className="rating-btn rating-btn--good"
              >
                Good
              </button>
              <button
                type="button"
                onClick={() => void handleRateCard("easy")}
                disabled={recording}
                className="rating-btn rating-btn--easy"
              >
                Easy
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px" }}>
          <button
            type="button"
            onClick={() => {
              setCardIndex((prev) => Math.max(0, prev - 1));
              setIsFlipped(false);
            }}
            disabled={cardIndex === 0}
            className="quiz-btn-secondary"
          >
            ← Previous Card
          </button>
          <button
            type="button"
            onClick={() => setIsFlipped((prev) => !prev)}
            className="quiz-btn-secondary"
          >
            {isFlipped ? "Show Prompt" : "Reveal Answer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCardIndex((prev) => Math.min(total - 1, prev + 1));
              setIsFlipped(false);
            }}
            disabled={cardIndex >= total - 1}
            className="quiz-btn-primary"
          >
            Next Card →
          </button>
        </div>
      </div>

      <RelatedLearning
        role={role}
        resourceId={deck.resource?.id}
        resourceTitle={deck.resource?.title}
        currentType="flashcard"
        relatedPreparations={related.map((r) => ({
          id: r.id,
          type: r.preparation_type,
          title: String(r.result?.title || r.resource?.title || ""),
        }))}
      />
    </div>
  );
}
