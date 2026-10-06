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

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listPreparations(role, { type: "quiz" });
      setQuizzes(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuizzes();
  }, [role]);

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
    <div className="quiz-list-page">
      <PageHeader
        eyebrow="PRACTICE & ASSESSMENT"
        title={role === "teacher" ? "Teaching Quizzes" : "Practice Quizzes"}
        description="Source-grounded comprehension questions with instant feedback and explanations."
        actionHref={`/${role}/prepare?type=quiz`}
        actionLabel="＋ Create Quiz"
      />

      {/* Filter toolbar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}>
        <input
          type="search"
          placeholder="Search quizzes by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field-input"
          style={{ maxWidth: "320px" }}
          aria-label="Search quizzes"
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="field-input"
          style={{ width: "auto", height: "44px" }}
          aria-label="Filter by difficulty"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {loading && <LoadingSkeleton type="cards" count={3} />}

      {error && <ErrorState message={error} onRetry={loadQuizzes} />}

      {!loading && !error && filteredQuizzes.length === 0 && (
        <EmptyState
          icon="✦"
          title={searchQuery || difficultyFilter !== "all" ? "No matching quizzes found" : "No quizzes created yet"}
          description={
            searchQuery || difficultyFilter !== "all"
              ? "Try adjusting your search or difficulty filter."
              : "Upload a document to generate multiple choice and fill-in-the-blank practice questions with source grounding."
          }
          actionLabel={searchQuery || difficultyFilter !== "all" ? undefined : "Prepare your first quiz"}
          actionHref={searchQuery || difficultyFilter !== "all" ? undefined : `/${role}/prepare?type=quiz`}
        />
      )}

      {!loading && !error && filteredQuizzes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredQuizzes.map((quiz) => {
            const result = quiz.result as unknown as QuizContent;
            const title = result?.title || `${quiz.resource?.title || "Topic"} Quiz`;
            const qCount = result?.questions?.length ?? result?.count ?? 0;
            const diff = result?.difficulty || "medium";
            const estTime = `${Math.max(3, Math.ceil(qCount * 0.8))} min`;

            return (
              <div
                key={quiz.id}
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
                    ~{estTime}
                  </span>
                </div>

                <h3 style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400, color: "#232d29" }}>
                  {title}
                </h3>

                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6f7b73" }}>
                  {qCount} comprehension questions derived from source text.
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <SourceBadge title={quiz.resource?.title} />
                </div>

                <div style={{ borderTop: "1px solid #edf1ea", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#8a948e" }}>
                    {new Date(quiz.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    href={role === "student" ? `/student/quizzes/${quiz.id}` : `/teacher/quizzes/${quiz.id}`}
                    style={{ fontSize: "12px", color: "#32735f", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    {role === "student" ? "Start Quiz ↗" : "View Quiz ↗"}
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
