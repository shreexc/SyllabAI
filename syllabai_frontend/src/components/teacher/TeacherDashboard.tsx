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

export function TeacherDashboard() {
  const { user } = useCurrentUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard("teacher");
      setSummary(data.summary || {});
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
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

  const resourcesCount = summary?.resources_count ?? 0;
  const quizzesCount = summary?.quizzes_count ?? 0;
  const flashcardsCount = summary?.flashcards_count ?? 0;
  const notesCount = summary?.notes_count ?? 0;
  const recentResources = summary?.recent_resources ?? [];
  const recentPreparations = summary?.recent_preparations ?? [];

  const isEmpty = resourcesCount === 0 && recentPreparations.length === 0;

  return (
    <div className="teacher-dashboard">
      <section className="welcome-banner" aria-label="Welcome">
        <div>
          <span className="banner-kicker">EDUCATOR DASHBOARD</span>
          <h2>
            Good to have you here,<br />
            <em>{user?.first_name || "Teacher"}.</em>
          </h2>
          <p>Prepare smarter study tools for your students from any document or syllabus.</p>
          <div className="welcome-banner-actions" style={{ marginTop: "16px" }}>
            <Link href="/teacher/prepare" className="hero-button" style={{ padding: "10px 16px", fontSize: "12px" }}>
              ✧ Prepare Material <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="banner-art" aria-hidden="true">
          <span className="banner-spark">✳</span>
          <span className="banner-orbit" />
          <span className="banner-dot">✦</span>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className="dashboard-section" aria-label="Overview statistics" style={{ marginTop: "28px" }}>
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <span className="eyebrow">WORKSPACE SUMMARY</span>
            <h2>Teaching overview</h2>
          </div>
        </div>
        <div className="stat-cards-grid">
          <StatCard
            label="Resources"
            value={resourcesCount}
            icon="🗎"
            tone="mint"
            caption="Uploaded teaching materials"
          />
          <StatCard
            label="Quizzes"
            value={quizzesCount}
            icon="✦"
            tone="peach"
            caption="Ready practice quizzes"
          />
          <StatCard
            label="Flashcard Decks"
            value={flashcardsCount}
            icon="▱"
            tone="lavender"
            caption="Active recall sets"
          />
          <StatCard
            label="Short Notes"
            value={notesCount}
            icon="▤"
            tone="blue"
            caption="Extracted reading summaries"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section" aria-label="Quick actions" style={{ marginTop: "28px" }}>
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <span className="eyebrow">CREATION SHORTCUTS</span>
            <h2>Quick actions</h2>
          </div>
        </div>
        <div className="tool-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <Link href="/teacher/prepare" className="tool-card">
            <span className="tool-icon tool-icon--mint">✧</span>
            <h3>Prepare Material</h3>
            <p>Upload a document and select what to generate.</p>
            <span className="tool-link">Start workspace <span>↗</span></span>
          </Link>
          <Link href="/teacher/prepare?type=quiz" className="tool-card">
            <span className="tool-icon tool-icon--peach">✦</span>
            <h3>Create Quiz</h3>
            <p>Generate comprehension questions from text.</p>
            <span className="tool-link">Create quiz <span>↗</span></span>
          </Link>
          <Link href="/teacher/prepare?type=flashcard" className="tool-card">
            <span className="tool-icon tool-icon--lavender">▱</span>
            <h3>Create Flashcards</h3>
            <p>Extract prompt and reveal memory cards.</p>
            <span className="tool-link">Create deck <span>↗</span></span>
          </Link>
          <Link href="/teacher/prepare?type=short_note" className="tool-card">
            <span className="tool-icon tool-icon--blue">▤</span>
            <h3>Generate Notes</h3>
            <p>Summarize lengthy material into bullet points.</p>
            <span className="tool-link">Create notes <span>↗</span></span>
          </Link>
        </div>
      </section>

      {/* Empty State if no materials */}
      {isEmpty && (
        <EmptyState
          icon="✧"
          title="No materials prepared yet"
          description="Upload your first syllabus, lecture document, or textbook chapter to generate quizzes, flashcards, short notes, diagrams, or animations."
          actionLabel="Prepare your first material"
          actionHref="/teacher/prepare"
        />
      )}

      {/* Recent Resources & Content */}
      {!isEmpty && (
        <div className="dashboard-columns-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginTop: "32px" }}>
          {/* Recent Resources */}
          <section className="dashboard-card" style={{ padding: "24px", border: "1px solid #e5ebe2", borderRadius: "12px", background: "#fffefa" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400 }}>Recent Resources</h3>
              <Link href="/teacher/prepare" style={{ fontSize: "11px", color: "#32735f", fontWeight: 600 }}>＋ Upload</Link>
            </div>
            {recentResources.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#8a948d" }}>No resources uploaded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentResources.map((res) => (
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

          {/* Recent Generated Content */}
          <section className="dashboard-card" style={{ padding: "24px", border: "1px solid #e5ebe2", borderRadius: "12px", background: "#fffefa" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400 }}>Recent Generated Content</h3>
              <Link href="/teacher/history" style={{ fontSize: "11px", color: "#32735f", fontWeight: 600 }}>View All ↗</Link>
            </div>
            {recentPreparations.length === 0 ? (
              <p style={{ fontSize: "12px", color: "#8a948d" }}>No preparations created yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentPreparations.map((prep) => {
                  const typePath = {
                    short_note: "notes",
                    quiz: "quizzes",
                    flashcard: "flashcards",
                    image: "images",
                    animation: "animations",
                    other: "history",
                  }[prep.preparation_type] || "history";

                  return (
                    <Link
                      key={prep.id}
                      href={`/teacher/${typePath}/${prep.id}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "8px", background: "#fbfbf8", border: "1px solid #edf1eb", textDecoration: "none" }}
                    >
                      <div>
                        <strong style={{ display: "block", fontSize: "12px", color: "#28332d" }}>
                          {prep.result?.title ? String(prep.result.title) : prep.resource?.title || "Prepared Material"}
                        </strong>
                        <span style={{ fontSize: "10px", color: "#86928a" }}>
                          {prep.preparation_type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <StatusBadge status={prep.status} />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
