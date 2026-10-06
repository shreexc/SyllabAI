"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { RelatedLearning } from "@/components/shared/RelatedLearning";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { API_URL } from "@/lib/constants";
import { getPreparation, listPreparations } from "@/lib/learning-api";
import type { ImageContent, PreparationRequest, UserRole } from "@/types/learning";

interface ImageDetailPageProps {
  role: UserRole;
  id: string;
}

export function ImageDetailPage({ role, id }: ImageDetailPageProps) {
  const [imagePrep, setImagePrep] = useState<PreparationRequest | null>(null);
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
        setImagePrep(data);

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
        setError(err instanceof Error ? err.message : "Failed to load image.");
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

  if (error || !imagePrep) {
    return (
      <ErrorState
        title="Visual not found"
        message={error || "This learning image is unavailable."}
        backHref={`/${role}/images`}
      />
    );
  }

  const result = imagePrep.result as unknown as ImageContent;
  const title = result?.title || `${imagePrep.resource?.title || "Visual"} Image`;
  const mode = result?.image_mode || "diagram";
  const mime = result?.mime_type || "image/svg+xml";

  const imageSrc =
    typeof result?.image_url === "string"
      ? result.image_url.startsWith("http")
        ? result.image_url
        : `${API_URL}${result.image_url}`
      : typeof result?.svg === "string"
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`
      : typeof result?.image_data === "string"
      ? `data:${mime};base64,${result.image_data}`
      : "";

  const filename = `${title.toLowerCase().replace(/[^a-z0-9-_]+/gi, "-")}.${mime === "image/svg+xml" ? "svg" : "png"}`;

  return (
    <div className="image-detail-page">
      <PageHeader
        eyebrow="LEARNING VISUAL DETAIL"
        title={title}
        description="Inspect diagrams, illustrations, and figures generated from your course documents."
        backHref={`/${role}/images`}
        backLabel="All Images"
      >
        {imageSrc && (
          <a
            href={imageSrc}
            download={filename}
            className="quiz-btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            Download Visual ↓
          </a>
        )}
      </PageHeader>

      <div className="image-detail-card">
        {/* Large Image Frame */}
        <div className="image-detail-frame">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={result?.alt || title}
              style={{ maxWidth: "100%", maxHeight: "560px", objectFit: "contain" }}
            />
          ) : (
            <p style={{ color: "#748078" }}>Image preview could not be generated.</p>
          )}
        </div>

        {/* Image Metadata & Grounding */}
        <div className="image-detail-body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", background: "#eef6f0", color: "#286851", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
              {mode.replace("_", " ")}
            </span>
            <span style={{ fontSize: "12px", color: "#8a968f" }}>
              Created {new Date(imagePrep.created_at).toLocaleDateString()}
            </span>
          </div>

          <h2 style={{ fontFamily: "var(--serif)", fontSize: "24px", fontWeight: 400, color: "#232d29", margin: "0 0 12px" }}>
            {title}
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <SourceBadge title={imagePrep.resource?.title} grounding={result?.grounding} />
          </div>

          {result?.grounding && (
            <p style={{ fontSize: "12px", color: "#6a776f", background: "#f8faf7", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e7ede4" }}>
              <strong>Notice:</strong> {result.grounding}
            </p>
          )}
        </div>
      </div>

      <RelatedLearning
        role={role}
        resourceId={imagePrep.resource?.id}
        resourceTitle={imagePrep.resource?.title}
        currentType="image"
        relatedPreparations={related.map((r) => ({
          id: r.id,
          type: r.preparation_type,
          title: String(r.result?.title || r.resource?.title || ""),
        }))}
      />
    </div>
  );
}
