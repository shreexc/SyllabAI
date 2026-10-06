"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { getPreparation, listPreparations } from "@/lib/learning-api";
import type { NoteContent, PreparationRequest, UserRole } from "@/types/learning";

interface NoteDetailPageProps {
  role: UserRole;
  id: string;
}

export function NoteDetailPage({ role, id }: NoteDetailPageProps) {
  const [note, setNote] = useState<PreparationRequest | null>(null);
  const [related, setRelated] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPreparation(role, id);
      setNote(data);

      // Also fetch other preparations for this resource to link in RelatedLearning
      if (data.resource?.id) {
        try {
          const allPreps = await listPreparations(role);
          setRelated(allPreps.filter((p) => p.resource?.id === data.resource?.id && p.id !== data.id));
        } catch {
          // ignore related fetch error
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load note.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchNote();
  }, [role, id]);

  const handleCopyNotes = () => {
    if (!note) return;
    const content = note.result as unknown as NoteContent;
    const textToCopy = [
      content?.title || note.resource?.title || "Short Notes",
      "",
      "=== OVERVIEW ===",
      content?.summary || "",
      "",
      "=== KEY POINTS ===",
      ...(content?.key_points || []).map((pt) => `• ${pt}`),
      "",
      "=== IMPORTANT TERMS ===",
      ...(content?.important_terms || []).map((t) => `${t.term}: ${t.meaning}`),
      "",
      `Source: ${note.resource?.title || "SyllabAI"}`,
    ].join("\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Notes copied to clipboard!");
    }).catch(() => {
      toast.error("Could not copy notes to clipboard.");
    });
  };

  if (loading) {
    return <LoadingSkeleton type="document" />;
  }

  if (error || !note) {
    return (
      <ErrorState
        title="Could not find this note"
        message={error || "This note may have been removed or is unavailable."}
        backHref={`/${role}/notes`}
      />
    );
  }

  const content = note.result as unknown as NoteContent;
  const title = content?.title || note.resource?.title || "Short Notes";
  const keyPoints = content?.key_points || [];
  const importantTerms = content?.important_terms || [];
  const paragraph = content?.paragraph || "";

  return (
    <div className="note-detail-page">
      <PageHeader
        eyebrow="STUDY NOTES"
        title={title}
        description="Grounded summary extracted directly from your study material."
        backHref={`/${role}/notes`}
        backLabel="All Notes"
      >
        <button
          type="button"
          onClick={handleCopyNotes}
          className="quiz-btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          📋 Copy Notes
        </button>
      </PageHeader>

      <article className="note-reading-article">
        {/* Source citation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #edf1eb", paddingBottom: "16px" }}>
          <SourceBadge title={note.resource?.title} grounding={content?.grounding} />
          <span style={{ fontSize: "11px", color: "#8a948e" }}>
            Generated {new Date(note.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Overview summary */}
        {content?.summary && (
          <div className="note-summary-box">
            <strong>Overview Summary</strong>
            <p>{content.summary}</p>
          </div>
        )}

        {/* Paragraph style if present */}
        {paragraph && (
          <section className="note-content-section">
            <h2>Detailed Synthesis</h2>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#38453e" }}>{paragraph}</p>
          </section>
        )}

        {/* Key Points */}
        {keyPoints.length > 0 && (
          <section className="note-content-section">
            <h2>Key Takeaways</h2>
            <ul className="note-points-list">
              {keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Important Terms Dictionary */}
        {importantTerms.length > 0 && (
          <section className="note-content-section">
            <h2>Essential Terminology</h2>
            <div className="terms-dictionary-grid">
              {importantTerms.map((item, index) => (
                <div key={index} className="term-card">
                  <dt>{item.term}</dt>
                  <dd>{item.meaning}</dd>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Connected Related Learning Tools */}
      <RelatedLearning
        role={role}
        resourceId={note.resource?.id}
        resourceTitle={note.resource?.title}
        currentType="short_note"
        relatedPreparations={related.map((r) => ({
          id: r.id,
          type: r.preparation_type,
          title: String(r.result?.title || r.resource?.title || ""),
        }))}
      />
    </div>
  );
}
