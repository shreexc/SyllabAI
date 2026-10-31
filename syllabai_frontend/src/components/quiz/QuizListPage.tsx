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
import type { PreparationRequest, QuizContent, UserRole } from "@/types/learning";

interface QuizListPageProps {
  role: UserRole;
}

export function QuizListPage({ role }: QuizListPageProps) {
  const [quizzes, setQuizzes] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const fetchQuizzes = useCallback(() => listPreparations(role, { type: "quiz" }), [role]);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchQuizzes();
      setQuizzes(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetchQuizzes()
      .then((items) => {
        if (!cancelled) {
          setQuizzes(items);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quizzes.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchQuizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      const result = q.result as unknown as QuizContent;
      const title = (result?.title || q.resource?.title || "").toLowerCase();
      const diff = (result?.difficulty || "medium").toLowerCase();
      const matchesSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === "all" || diff === difficultyFilter;
      return matchesSearch && matchesDiff;
    });
  }, [quizzes, searchQuery, difficultyFilter]);

  return (
    <div className={`quiz-list-page${role === "student" ? " quiz-list-page--student" : ""}`}>
      <PageHeader
        eyebrow="PRACTICE & ASSESSMENT"
        title={role === "teacher" ? "Teaching Quizzes" : "Practice Quizzes"}
        description={
          role === "student"
            ? "Source grounded comprehension questions with instant feedback and explanations."
            : "Source-grounded comprehension questions with instant feedback and explanations."
        }
        actionHref={role === "teacher" ? `/${role}/prepare?type=quiz` : undefined}
        actionLabel={role === "teacher" ? "＋ Create Quiz" : undefined}
      />

      {!loading && !error && (role === "teacher" || quizzes.length > 0) && (
        <div className="quiz-filter-toolbar">
          <input
            type="search"
            placeholder="Search quizzes by title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input"
            aria-label="Search quizzes"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="field-input"
            aria-label="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      {loading &&
        (role === "student" ? (
          <div className="quiz-loading-state">
            <LoadingSkeleton type="cards" count={3} />
          </div>
        ) : (
          <LoadingSkeleton type="cards" count={3} />
        ))}

      {error && <ErrorState message={error} onRetry={loadQuizzes} />}

      {!loading && !error && filteredQuizzes.length === 0 && (
        <EmptyState
          className={role === "student" ? "quiz-empty-state" : undefined}
          icon={
            role === "student" ? (
              <svg
                width="48"
                height="48"
                viewBox="0 0 42 42"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="7" y="5" width="27" height="32" rx="3" />
                <rect x="11" y="11" width="4" height="4" rx="0.5" />
                <rect x="11" y="19" width="4" height="4" rx="0.5" />
                <rect x="11" y="27" width="4" height="4" rx="0.5" />
                <path d="M19 13h10M19 21h10M19 29h7" />
                <path d="m36 11 2 2-1 19-2 5-2-5 1-19 2-2Z" />
              </svg>
            ) : "✦"
          }
          title={searchQuery || difficultyFilter !== "all" ? "No matching quizzes found" : "No quizzes created yet"}
          description={
            searchQuery || difficultyFilter !== "all"
              ? "Try adjusting your search or difficulty filter."
              : "Upload a document to generate multiple choice and fill in the blank practice questions with source grounding."
          }
          actionLabel={searchQuery || difficultyFilter !== "all" ? undefined : "Prepare your first quiz"}
          actionHref={searchQuery || difficultyFilter !== "all" ? undefined : `/${role}/prepare?type=quiz`}
        />
      )}

      {!loading && !error && filteredQuizzes.length > 0 && (
        <div className="quiz-card-grid">
          {filteredQuizzes.map((quiz) => {
            const result = quiz.result as unknown as QuizContent;
            const title = result?.title || `${quiz.resource?.title || "Topic"} Quiz`;
            const qCount = result?.questions?.length ?? result?.count ?? 0;
            const diff = result?.difficulty || "medium";
            const estTime = `${Math.max(3, Math.ceil(qCount * 0.8))} min`;

            return (
              <article key={quiz.id} className={`quiz-card quiz-card--${role}`}>
                <div className="quiz-card-meta">
                  <DifficultyBadge difficulty={diff} />
                  <span className="quiz-card-time">~{estTime}</span>
                </div>

                <h3 className="quiz-card-title">{title}</h3>

                <p className="quiz-card-description">
                  {qCount} comprehension questions derived from source text.
                </p>

                <div className="quiz-card-source">
                  <SourceBadge title={quiz.resource?.title} />
                </div>

                <div className="quiz-card-footer">
                  <span className="quiz-card-date">
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={role === "student" ? `/student/quizzes/${quiz.id}` : `/teacher/quizzes/${quiz.id}`}
                    className="quiz-card-link"
                  >
                    {role === "student" ? "Start Quiz ↗" : "View Quiz ↗"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
