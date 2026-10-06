"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDashboard } from "@/lib/learning-api";
import type { DashboardSummary } from "@/types/learning";

export function StudentDashboard() {
  const { user } = useCurrentUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard("student");
      setSummary(data.summary || {});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load student dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  const notesCount = summary?.notes_count ?? 0;
  const quizzesCount = summary?.quizzes_count ?? 0;
  const flashcardsCount = summary?.flashcards_count ?? 0;
  const recentMaterials = summary?.recent_materials ?? [];
  const continueLearning = summary?.continue_learning ?? [];
  const recentActivity = summary?.recent_activity ?? [];

  const isEmpty = notesCount === 0 && quizzesCount === 0 && flashcardsCount === 0 && recentMaterials.length === 0;

  return (
    <div className="student-dashboard">
      <section className="welcome-banner welcome-banner--student" aria-label="Welcome">
        <div>
          <span className="banner-kicker">LEARNER DASHBOARD</span>
          <h2>
            Welcome back,<br />
            <em>{user?.first_name || "Student"}.</em>
          </h2>
          <p>Study at your own pace with quizzes, flashcards, short notes, and animations.</p>
          <div className="welcome-banner-actions" style={{ marginTop: "16px" }}>
            <Link href="/student/prepare" className="hero-button" style={{ padding: "10px 16px", fontSize: "12px", background: "#62507d" }}>
              ✧ Prepare Study Material <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="banner-art" aria-hidden="true">
          <span className="banner-spark" style={{ color: "#8c7da0" }}>✦</span>
          <span className="banner-orbit" style={{ borderColor: "#d8d0e2" }} />
          <span className="banner-dot">✳</span>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className="dashboard-section" aria-label="Study overview" style={{ marginTop: "28px" }}>
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <span className="eyebrow">YOUR STUDY STATS</span>
            <h2>Learning overview</h2>
          </div>
        </div>
        <div className="stat-cards-grid">
          <StatCard
            label="Notes"
            value={notesCount}
            icon="▤"
            tone="mint"
            caption="Concise reading summaries"
          />
          <StatCard
            label="Quizzes"
            value={quizzesCount}
            icon="✦"
            tone="peach"
            caption="Interactive practice quizzes"
          />
          <StatCard
            label="Flashcards"
            value={flashcardsCount}
            icon="▱"
            tone="lavender"
            caption="Active recall study decks"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section" aria-label="Quick actions" style={{ marginTop: "28px" }}>
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <span className="eyebrow">STUDY SHORTCUTS</span>
            <h2>Quick actions</h2>
          </div>
        </div>
        <div className="tool-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <Link href="/student/prepare" className="tool-card">
            <span className="tool-icon tool-icon--mint">✧</span>
            <h3>Prepare Material</h3>
            <p>Upload a PDF or note to make study tools.</p>
            <span className="tool-link">Start new <span>↗</span></span>
          </Link>
          <Link href="/student/quizzes" className="tool-card">
            <span className="tool-icon tool-icon--peach">✦</span>
            <h3>Start a Quiz</h3>
            <p>Test your knowledge with instant scoring.</p>
            <span className="tool-link">Take quiz <span>↗</span></span>
          </Link>
          <Link href="/student/flashcards" className="tool-card">
            <span className="tool-icon tool-icon--lavender">▱</span>
            <h3>Review Flashcards</h3>
            <p>Practice active recall cards to retain concepts.</p>
            <span className="tool-link">Review cards <span>↗</span></span>
          </Link>
          <Link href="/student/notes" className="tool-card">
            <span className="tool-icon tool-icon--blue">▤</span>
            <h3>Read Notes</h3>
            <p>Review key takeaways and defined terms.</p>
            <span className="tool-link">Read notes <span>↗</span></span>
          </Link>
        </div>
      </section>

      {/* Empty State */}
      {isEmpty && (
        <EmptyState
          icon="✦"
          title="No study tools yet"
          description="Prepare your first learning material from a lecture slide, textbook chapter, or PDF document to start practicing."
          actionLabel="Prepare study tools"
          actionHref="/student/prepare"
        />
      )}

      {/* Continue Learning & Recent Materials */}
      {!isEmpty && (
        <div className="dashboard-columns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "32px" }}>
          {/* Continue Learning */}
          <section className="dashboard-card" style={{ padding: "24px", border: "1px solid #e5ebe2", borderRadius: "12px", background: "#fffefa" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400 }}>Continue Learning</h3>
              <Link href="/student/history" style={{ fontSize: "11px", color: "#62507d", fontWeight: 600 }}>All materials ↗</Link>
            </div>
            {continueLearning.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#8a948d" }}>No materials ready to study right now.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {continueLearning.map((item) => {
                  const typePath = {
                    short_note: "notes",
                    quiz: "quizzes",
                    flashcard: "flashcards",
                    image: "images",
                    animation: "animations",
                    other: "history",
                  }[item.preparation_type] || "history";

                  return (
                    <Link
                      key={item.id}
                      href={`/student/${typePath}/${item.id}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "8px", background: "#fbfbf8", border: "1px solid #edf1eb", textDecoration: "none" }}
                    >
                      <div>
                        <strong style={{ display: "block", fontSize: "12px", color: "#28332d" }}>
                          {item.result?.title ? String(item.result.title) : item.resource?.title || "Study Material"}
                        </strong>
                        <span style={{ fontSize: "10px", color: "#86928a" }}>
                          {item.preparation_type.replace("_", " ").toUpperCase()} · Ready to practice
                        </span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#62507d", fontWeight: 700 }}>
                        Study →
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Materials */}
          <section className="dashboard-card" style={{ padding: "24px", border: "1px solid #e5ebe2", borderRadius: "12px", background: "#fffefa" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400 }}>Recent Documents</h3>
              <Link href="/student/prepare" style={{ fontSize: "11px", color: "#62507d", fontWeight: 600 }}>＋ Add Document</Link>
            </div>
            {recentMaterials.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#8a948d" }}>No documents uploaded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentMaterials.map((res) => (
                  <div key={res.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "#fbfbf8", border: "1px solid #edf1eb" }}>
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: "#28332d" }}>{res.title}</strong>
                      <span style={{ fontSize: "10px", color: "#86928a" }}>
                        {res.resource_type.toUpperCase()} {res.page_count ? `· ${res.page_count} pages` : ""}
                      </span>
                    </div>
                    <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "12px", background: res.status === "ready" ? "#eef7ef" : "#fef7e0", color: res.status === "ready" ? "#2d7a46" : "#856404" }}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
