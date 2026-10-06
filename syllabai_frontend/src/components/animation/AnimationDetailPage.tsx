"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getPreparation, listPreparations } from "@/lib/learning-api";
import type { AnimationContent, AnimationScene, PreparationRequest, UserRole } from "@/types/learning";

interface AnimationDetailPageProps {
  role: UserRole;
  id: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function AnimationDetailPage({ role, id }: AnimationDetailPageProps) {
  const [animationPrep, setAnimationPrep] = useState<PreparationRequest | null>(null);
  const [related, setRelated] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout | null = null;

    async function load() {
      try {
        const data = await getPreparation(role, id);
        if (!mounted) return;
        setAnimationPrep(data);

        if (data.status === "pending" || data.status === "processing") {
          pollInterval = setTimeout(() => {
            void load();
          }, 3000);
          return;
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
        setError(err instanceof Error ? err.message : "Failed to load animation.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
      if (pollInterval) clearTimeout(pollInterval);
    };
  }, [role, id]);

  const result = animationPrep?.result as unknown as AnimationContent;
  const scenes: AnimationScene[] = useMemo(() => result?.scenes || [], [result]);
  const totalDuration = result?.duration || (scenes.length > 0 ? scenes.reduce((acc, s) => acc + (s.duration || 10), 0) : 60);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || scenes.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 1000 / playbackSpeed;
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration, scenes.length]);

  // Sync currentSceneIndex with elapsedSeconds
  useEffect(() => {
    if (scenes.length === 0) return;
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      const dur = scenes[i].duration || Math.max(5, Math.floor(totalDuration / scenes.length));
      accumulated += dur;
      if (elapsedSeconds < accumulated) {
        setCurrentSceneIndex(i);
        return;
      }
    }
    setCurrentSceneIndex(scenes.length - 1);
  }, [elapsedSeconds, scenes, totalDuration]);

  const handleSeekScene = (index: number) => {
    if (scenes.length === 0) return;
    let targetSeconds = 0;
    for (let i = 0; i < index; i++) {
      targetSeconds += scenes[i].duration || Math.max(5, Math.floor(totalDuration / scenes.length));
    }
    setElapsedSeconds(targetSeconds);
    setCurrentSceneIndex(index);
  };

  const handleTogglePlay = () => {
    if (elapsedSeconds >= totalDuration) {
      setElapsedSeconds(0);
      setCurrentSceneIndex(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      handleSeekScene(currentSceneIndex + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      handleSeekScene(currentSceneIndex - 1);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="document" />;
  }

  if (error || !animationPrep) {
    return (
      <ErrorState
        title="Animation not found"
        message={error || "This educational animation is unavailable."}
        backHref={`/${role}/animations`}
      />
    );
  }

  // Processing state
  if (animationPrep.status === "pending" || animationPrep.status === "processing") {
    return (
      <div className="animation-processing-container" style={{ maxWidth: "680px", margin: "40px auto", padding: "32px", background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "#ecf4ef", color: "#32735f", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>🎬</span>
          </div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", color: "#232d29", margin: "0 0 8px" }}>
            Creating your animation
          </h2>
          <p style={{ fontSize: "14px", color: "#6f7b73", margin: 0 }}>
            Processing source material from <strong>{animationPrep.resource?.title || "your resource"}</strong>.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#2d6a4f", fontSize: "14px" }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#d8f3dc", display: "grid", placeItems: "center", fontWeight: "bold" }}>✓</span>
            <span>Reading source material</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#2d6a4f", fontSize: "14px" }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#d8f3dc", display: "grid", placeItems: "center", fontWeight: "bold" }}>✓</span>
            <span>Extracting concepts & key statements</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#32735f", fontSize: "14px", fontWeight: 600 }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#b7e4c7", display: "grid", placeItems: "center", animation: "pulse 1.5s infinite" }}>●</span>
            <span>Sequencing animated scenes & storyboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#8a948e", fontSize: "14px" }}>
            <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1px solid #d3dcd5", display: "grid", placeItems: "center" }}>○</span>
            <span>Preparing final visual player</span>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#8a948e" }}>
          Polling status automatically… You may leave this page and check back later under <Link href={`/${role}/history`} style={{ color: "#32735f" }}>History</Link>.
        </div>
      </div>
    );
  }

  const currentScene = scenes[currentSceneIndex] || {
    type: "concept_explanation",
    duration: 10,
    narration: "Animation ready to play.",
    visual: "title_card",
  };

  const title = result?.title || `${animationPrep.resource?.title || "Educational"} Animation`;

  return (
    <div className="animation-detail-page">
      <PageHeader
        eyebrow="ANIMATED VISUAL EXPLANATION"
        title={title}
        description="Visual step-by-step concepts sequenced directly from verified course materials."
        backHref={`/${role}/animations`}
        backLabel="All Animations"
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <DifficultyBadge difficulty={result?.difficulty || "beginner"} />
          <StatusBadge status={animationPrep.status} />
        </div>
      </PageHeader>

      {/* Main Video / Storyboard Player Stage */}
      <div
        className="animation-player-frame"
        style={{
          background: "#161d19",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          marginBottom: "24px",
          color: "#ffffff",
        }}
      >
        {/* Visual Stage */}
        <div
          style={{
            position: "relative",
            minHeight: "380px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px",
            background: "radial-gradient(ellipse at 50% 30%, #253930 0%, #161d19 100%)",
          }}
        >
          {/* Top Bar on Stage */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0, 0, 0, 0.4)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isPlaying ? "#52b788" : "#e9c46a" }} />
              <span>Scene {currentSceneIndex + 1} of {Math.max(1, scenes.length)}</span>
              <span style={{ opacity: 0.6 }}>•</span>
              <span style={{ textTransform: "capitalize", opacity: 0.85 }}>{currentScene.type.replace(/_/g, " ")}</span>
            </div>

            <div style={{ fontSize: "13px", fontFamily: "monospace", background: "rgba(0, 0, 0, 0.4)", padding: "4px 10px", borderRadius: "6px" }}>
              {formatDuration(elapsedSeconds)} / {formatDuration(totalDuration)}
            </div>
          </div>

          {/* Central Animated Visual Canvas */}
          <div style={{ textAlign: "center", margin: "24px 0", padding: "16px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "24px 32px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(6px)",
                maxWidth: "680px",
                transition: "all .3s ease",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {currentScene.visual === "title_card" ? "📖" : "💡"}
              </div>
              <h3 style={{ margin: "0 0 12px", fontFamily: "var(--serif)", fontSize: "22px", fontWeight: 400, color: "#ecf4ef" }}>
                {currentScene.visual === "title_card" ? title : `Key Concept ${currentSceneIndex + 1}`}
              </h3>
              <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#d2dcd5" }}>
                {currentScene.narration}
              </p>
            </div>
          </div>

          {/* Captions Overlay */}
          {captionsEnabled && (
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(0, 0, 0, 0.75)",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#f8f9fa",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                💬 {currentScene.narration.slice(0, 140)}
                {currentScene.narration.length > 140 ? "…" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Player Controls Bar */}
        <div style={{ padding: "16px 24px", background: "#111714", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {/* Timeline Scrubber */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
            {scenes.map((sc, idx) => {
              const isActive = idx === currentSceneIndex;
              const isPast = idx < currentSceneIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSeekScene(idx)}
                  title={`Jump to Scene ${idx + 1}`}
                  style={{
                    flex: sc.duration || 1,
                    height: "6px",
                    borderRadius: "3px",
                    background: isActive ? "#52b788" : isPast ? "#2d6a4f" : "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background .2s",
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            {/* Playback action buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={handlePrevScene}
                disabled={currentSceneIndex === 0}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: currentSceneIndex === 0 ? "not-allowed" : "pointer",
                  opacity: currentSceneIndex === 0 ? 0.4 : 1,
                  fontSize: "13px",
                }}
              >
                ⏮ Prev Scene
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                style={{
                  background: "#32735f",
                  border: "none",
                  color: "white",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>

              <button
                type="button"
                onClick={handleNextScene}
                disabled={currentSceneIndex === scenes.length - 1}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: currentSceneIndex === scenes.length - 1 ? "not-allowed" : "pointer",
                  opacity: currentSceneIndex === scenes.length - 1 ? 0.4 : 1,
                  fontSize: "13px",
                }}
              >
                Next Scene ⏭
              </button>
            </div>

            {/* Subtitles & Speed */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setCaptionsEnabled((c) => !c)}
                style={{
                  background: captionsEnabled ? "rgba(255, 255, 255, 0.2)" : "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                CC {captionsEnabled ? "ON" : "OFF"}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                style={{
                  background: "#232d29",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                aria-label="Playback Speed"
              >
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x (Normal)</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Scene Storyboard breakdown & Metadata */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        {/* Left: About & Grounding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "12px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 12px", fontFamily: "var(--serif)", fontSize: "18px", color: "#232d29" }}>
              About this animation
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", lineHeight: 1.6, color: "#546059" }}>
              This sequenced visual animation explains core mechanisms, structures, and processes extracted directly from the verified course material.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "#6f7b73" }}>
              <div>
                <strong>Based on:</strong> <SourceBadge title={animationPrep.resource?.title} />
              </div>
              <div>
                <strong>Duration:</strong> {formatDuration(totalDuration)} ({scenes.length} scenes)
              </div>
              <div>
                <strong>Style:</strong> {result?.style || "Educational"}
              </div>
            </div>

            {result?.grounding && (
              <div style={{ marginTop: "16px", padding: "12px", background: "#f5f8f5", borderRadius: "8px", fontSize: "11px", color: "#4f685c", border: "1px solid #e0eae2" }}>
                🛡️ <strong>Source-grounded:</strong> {result.grounding}
              </div>
            )}
          </div>
        </div>

        {/* Right: Scene List / Jump to scene */}
        <div style={{ background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px", fontFamily: "var(--serif)", fontSize: "18px", color: "#232d29" }}>
            Scenes & Narration ({scenes.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto" }}>
            {scenes.map((scene, idx) => {
              const isSelected = idx === currentSceneIndex;
              return (
                <div
                  key={idx}
                  onClick={() => handleSeekScene(idx)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: isSelected ? "2px solid #32735f" : "1px solid #e5ebe2",
                    background: isSelected ? "#f0f7f3" : "#ffffff",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: isSelected ? "#2d6a4f" : "#45514a" }}>
                      Scene {idx + 1}
                    </span>
                    <span style={{ fontSize: "11px", color: "#8a948e" }}>
                      {scene.duration || 10}s
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#546059", lineHeight: 1.5 }}>
                    {scene.narration}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Connected Related Learning */}
      <RelatedLearning
        role={role}
        resourceId={animationPrep.resource?.id}
        resourceTitle={animationPrep.resource?.title}
        currentType="animation"
        relatedPreparations={related.map((r) => ({
          id: r.id,
          type: r.preparation_type,
          title: String(r.result?.title || r.resource?.title || ""),
        }))}
      />
    </div>
  );
}
