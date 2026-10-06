"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPreparation } from "@/lib/learning-api";
import type { PreparationRequest, PreparationType, UserRole } from "@/types/learning";

function getRouteForType(type: PreparationType, role: UserRole, id: string): string {
  switch (type) {
    case "quiz":
      return `/${role}/quizzes/${id}`;
    case "short_note":
      return `/${role}/notes/${id}`;
    case "flashcard":
      return `/${role}/flashcards/${id}`;
    case "image":
      return `/${role}/images/${id}`;
    case "animation":
      return `/${role}/animations/${id}`;
    default:
      return `/${role}/history`;
  }
}

export default function PreparationJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [prepId, setPrepId] = useState<string | null>(null);
  const [prep, setPrep] = useState<PreparationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void params.then((p) => setPrepId(p.id));
  }, [params]);

  useEffect(() => {
    if (!prepId || userLoading) return;
    const role = user?.role || "student";
    let active = true;
    let pollTimeout: NodeJS.Timeout | null = null;

    async function checkJob() {
      try {
        const data = await getPreparation(role, prepId!);
        if (!active) return;
        setPrep(data);

        if (data.status === "completed") {
          // If completed, redirect to the final content page
          const target = getRouteForType(data.preparation_type, role, data.id);
          router.replace(target);
          return;
        }

        if (data.status === "pending" || data.status === "processing") {
          pollTimeout = setTimeout(() => {
            void checkJob();
          }, 3000);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to retrieve preparation job status.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void checkJob();

    return () => {
      active = false;
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [prepId, user, userLoading, router]);

  const role = user?.role || "student";

  if (userLoading || loading) {
    return (
      <div style={{ maxWidth: "600px", margin: "60px auto", padding: "24px" }}>
        <LoadingSkeleton type="document" />
      </div>
    );
  }

  if (error || !prep) {
    return (
      <div style={{ maxWidth: "560px", margin: "60px auto", padding: "32px", background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "16px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "#232d29", margin: "0 0 12px" }}>
          Preparation job not found
        </h2>
        <p style={{ fontSize: "14px", color: "#6f7b73", marginBottom: "24px" }}>
          {error || "We could not find the requested preparation process."}
        </p>
        <Link href={`/${role}/prepare`} className="quiz-btn-primary" style={{ textDecoration: "none" }}>
          Go to Prepare
        </Link>
      </div>
    );
  }

  // Failed state
  if (prep.status === "failed") {
    return (
      <div style={{ maxWidth: "560px", margin: "60px auto", padding: "32px", background: "#fffefa", border: "1px solid #f2c6c2", borderRadius: "16px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "#fde8e8", color: "#9c2a2a", marginBottom: "16px", fontSize: "24px" }}>
          ✕
        </div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "#232d29", margin: "0 0 12px" }}>
          We couldn’t prepare this material
        </h2>
        <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px", textAlign: "left" }}>
          <strong style={{ fontSize: "12px", color: "#9c2a2a", display: "block", marginBottom: "4px" }}>Reason:</strong>
          <span style={{ fontSize: "13px", color: "#546059" }}>
            {prep.error_message || "The document could not be processed."}
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href={`/${role}/prepare`} className="quiz-btn-primary" style={{ textDecoration: "none" }}>
            Try Again ↻
          </Link>
          <Link href={`/${role}/history`} className="quiz-btn-secondary" style={{ textDecoration: "none" }}>
            View History
          </Link>
        </div>
      </div>
    );
  }

  // Cancelled state
  if (prep.status === "cancelled") {
    return (
      <div style={{ maxWidth: "560px", margin: "60px auto", padding: "32px", background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "16px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "#232d29", margin: "0 0 12px" }}>
          Preparation Cancelled
        </h2>
        <p style={{ fontSize: "14px", color: "#6f7b73", marginBottom: "24px" }}>
          This preparation request was cancelled before completion.
        </p>
        <Link href={`/${role}/prepare`} className="quiz-btn-primary" style={{ textDecoration: "none" }}>
          Prepare Material
        </Link>
      </div>
    );
  }

  // Pending / Processing State
  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "36px", background: "#fffefa", border: "1px solid #e5ebe2", borderRadius: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "0.08em", fontWeight: 700, color: "#74837a", textTransform: "uppercase" }}>
            PREPARING MATERIAL
          </span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "22px", color: "#232d29", margin: "4px 0 0" }}>
            {prep.resource?.title || "Course Material"}
          </h2>
        </div>
        <StatusBadge status={prep.status} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#2d6a4f", fontSize: "14px" }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#d8f3dc", display: "grid", placeItems: "center", fontWeight: "bold" }}>✓</span>
          <span>Reading material</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#2d6a4f", fontSize: "14px" }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#d8f3dc", display: "grid", placeItems: "center", fontWeight: "bold" }}>✓</span>
          <span>Finding relevant info</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#32735f", fontSize: "14px", fontWeight: 600 }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#b7e4c7", display: "grid", placeItems: "center" }}>●</span>
          <span>Generating {prep.preparation_type.replace(/_/g, " ")} content</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#8a948e", fontSize: "14px" }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1px solid #d3dcd5", display: "grid", placeItems: "center" }}>○</span>
          <span>Validating result</span>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#8a948e" }}>
        Auto-redirecting when ready… Or review status in <Link href={`/${role}/history`} style={{ color: "#32735f" }}>History</Link>.
      </div>
    </div>
  );
}
