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
import type { AnimationContent, PreparationRequest, UserRole } from "@/types/learning";

interface AnimationListPageProps {
  role: UserRole;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function AnimationListPage({ role }: AnimationListPageProps) {
  const [animations, setAnimations] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAnimations = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listPreparations(role, { type: "animation" });
      setAnimations(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load animations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAnimations();
  }, [role]);

  const filteredAnimations = useMemo(() => {
    return animations.filter((a) => {
      const result = a.result as unknown as AnimationContent;
      const title = (result?.title || a.resource?.title || "").toLowerCase();
      return !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
    });
  }, [animations, searchQuery]);

  return (
    <div className="animation-list-page">
      <PageHeader
        eyebrow="ANIMATED VISUAL EXPLANATIONS"
        title={role === "teacher" ? "Teaching Animations" : "Educational Animations"}
        description="Step-by-step animated storyboard lessons and visual process explanations."
        actionHref={`/${role}/prepare?type=animation`}
        actionLabel="＋ Create Animation"
      />

      <div style={{ marginBottom: "24px", maxWidth: "380px" }}>
        <input
          type="search"
          placeholder="Search animations by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field-input"
          aria-label="Search animations"
        />
      </div>

      {loading && <LoadingSkeleton type="cards" count={3} />}

      {error && <ErrorState message={error} onRetry={loadAnimations} />}

      {!loading && !error && filteredAnimations.length === 0 && (
        <EmptyState
          icon="▷"
          title={searchQuery ? "No matching animations found" : "No animations generated yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms."
              : "Upload a document to generate an educational storyboard animation breaking mechanisms into visual steps."
          }
          actionLabel={searchQuery ? undefined : "Prepare your first animation"}
          actionHref={searchQuery ? undefined : `/${role}/prepare?type=animation`}
        />
      )}

      {!loading && !error && filteredAnimations.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredAnimations.map((anim) => {
            const result = anim.result as unknown as AnimationContent;
            const title = result?.title || `${anim.resource?.title || "Educational"} Animation`;
            const duration = result?.duration || 90;
            const sceneCount = result?.scenes?.length || 0;
            const diff = result?.difficulty || "beginner";

            return (
              <div
                key={anim.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #e5ebe2",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fffefa",
                  transition: "transform .15s, box-shadow .15s",
                }}
              >
                {/* Poster / Thumbnail */}
                <div style={{ position: "relative", width: "100%", height: "180px", background: "#1f2a24", display: "grid", placeItems: "center", color: "white" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", display: "grid", placeItems: "center", fontSize: "20px" }}>
                    ▷
                  </div>
                  <span style={{ position: "absolute", bottom: "12px", right: "12px", padding: "2px 8px", borderRadius: "4px", background: "rgba(0, 0, 0, 0.75)", fontSize: "11px", fontFamily: "monospace" }}>
                    {formatDuration(duration)}
                  </span>
                  <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                    <DifficultyBadge difficulty={diff} />
                  </div>
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3 style={{ margin: "0 0 8px", fontFamily: "var(--serif)", fontSize: "19px", fontWeight: 400, color: "#232d29" }}>
                    {title}
                  </h3>

                  <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6f7b73" }}>
                    {sceneCount > 0 ? `${sceneCount} sequenced animated scenes.` : "Visual storyboard ready to play."}
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <SourceBadge title={anim.resource?.title} />
                  </div>

                  <div style={{ borderTop: "1px solid #edf1ea", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#8a948e" }}>
                      {new Date(anim.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/${role}/animations/${anim.id}`}
                      style={{ fontSize: "12px", color: "#32735f", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      Watch Animation ↗
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
