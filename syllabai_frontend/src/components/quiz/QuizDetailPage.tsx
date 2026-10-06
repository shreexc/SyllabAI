"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { getPreparation, listPreparations } from "@/lib/learning-api";
import type { PreparationRequest, QuizContent, UserRole } from "@/types/learning";

interface QuizDetailPageProps {
  role: UserRole;
  id: string;
}

export function QuizDetailPage({ role, id }: QuizDetailPageProps) {
  const [quiz, setQuiz] = useState<PreparationRequest | null>(null);
  const [related, setRelated] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPreparation(role, id);
        if (!mounted) return;
        setQuiz(data);

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
        setError(err instanceof Error ? err.message : "Failed to load quiz.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [role, id]);

  if (loading) {
    return <LoadingSkeleton type="document" />;
  }

  if (error || !quiz) {
    return (
      <ErrorState
        title="Quiz not found"
        message={error || "This quiz is not available."}
        backHref={`/${role}/quizzes`}
      />
    );
  }

  const result = quiz.result as unknown as QuizContent;
  const questions = result?.questions || [];
  const title = result?.title || `${quiz.resource?.title || "Topic"} Quiz`;
  const count = questions.length || result?.count || 0;
  const difficulty = result?.difficulty || "medium";
  const estTime = `${Math.max(3, Math.ceil(count * 0.8))} minutes`;

  return (
    <div className="quiz-detail-page">
      <PageHeader
        eyebrow="PRACTICE QUIZ OVERVIEW"
        title={title}
        description="Review quiz details, topics covered, and question formats before beginning."
        backHref={`/${role}/quizzes`}
        backLabel="All Quizzes"
      />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "36px", border: "1px solid #e5ebe2", borderRadius: "14px", background: "#fffefa", boxShadow: "0 16px 40px #22352508" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <DifficultyBadge difficulty={difficulty} />
          <span style={{ fontSize: "12px", color: "#6f7b73" }}>⏱ Estimated time: ~{estTime}</span>
        </div>

        <h2 style={{ fontFamily: "var(--serif)", fontSize: "28px", fontWeight: 400, color: "#232d29", margin: "0 0 16px" }}>
          {title}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "20px", borderRadius: "10px", background: "#f8faf7", border: "1px solid #e6ede4", marginBottom: "28px" }}>
          <div>
            <span style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#8a968f", textTransform: "uppercase" }}>Questions</span>
            <strong style={{ fontSize: "20px", color: "#28332d" }}>{count} items</strong>
          </div>
          <div>
            <span style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#8a968f", textTransform: "uppercase" }}>Source Document</span>
            <strong style={{ fontSize: "14px", color: "#28332d", marginTop: "4px", display: "block" }}>
              {quiz.resource?.title || "Uploaded Resource"}
            </strong>
          </div>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#36423b", marginBottom: "8px" }}>What to expect</h3>
          <ul style={{ listStyle: "disc", paddingLeft: "20px", fontSize: "13px", color: "#5d6a62", lineHeight: 1.7 }}>
            <li>Questions are derived directly from the source material.</li>
            <li>No answers are exposed before you submit your complete attempt.</li>
            <li>Instant scoring with explanations for every correct and incorrect answer.</li>
          </ul>
        </div>

        {/* Action Button */}
        <div style={{ borderTop: "1px solid #edf1eb", paddingTop: "24px", display: "flex", gap: "12px", alignItems: "center" }}>
          {role === "student" ? (
            <Link
              href={`/student/quizzes/${quiz.id}/attempt`}
              className="quiz-btn-primary"
              style={{ padding: "14px 28px", fontSize: "14px", textDecoration: "none" }}
            >
              Start Quiz Now <span>→</span>
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Link
                href={`/teacher/quizzes/${quiz.id}`}
                className="quiz-btn-primary"
                style={{ padding: "12px 20px", fontSize: "13px", textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  // toggle preview
                  alert(`This quiz has ${count} questions generated for students.`);
                }}
              >
                Inspect Questions ({count})
              </Link>
              <Link
                href={`/teacher/prepare?type=quiz&resource=${quiz.resource?.id}`}
                className="quiz-btn-secondary"
                style={{ padding: "12px 20px", fontSize: "13px", textDecoration: "none" }}
              >
                Regenerate Quiz
              </Link>
            </div>
          )}
        </div>
      </div>

      <RelatedLearning
        role={role}
        resourceId={quiz.resource?.id}
        resourceTitle={quiz.resource?.title}
        currentType="quiz"
        relatedPreparations={related.map((r) => ({
          id: r.id,
          type: r.preparation_type,
          title: String(r.result?.title || r.resource?.title || ""),
        }))}
      />
    </div>
  );
}
