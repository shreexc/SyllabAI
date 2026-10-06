"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { API_URL } from "@/lib/constants";
import { listPreparations } from "@/lib/learning-api";
import type { ImageContent, PreparationRequest, UserRole } from "@/types/learning";

interface ImageGalleryPageProps {
  role: UserRole;
}

export function ImageGalleryPage({ role }: ImageGalleryPageProps) {
  const [images, setImages] = useState<PreparationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listPreparations(role, { type: "image" });
      setImages(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadImages();
  }, [role]);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const result = img.result as unknown as ImageContent;
      const title = (result?.title || img.resource?.title || "").toLowerCase();
      const mode = (result?.image_mode || "diagram").toLowerCase();
      const matchesSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase());
      const matchesMode = modeFilter === "all" || mode === modeFilter;
      return matchesSearch && matchesMode;
    });
  }, [images, searchQuery, modeFilter]);

  const getImageSrc = (result: ImageContent) => {
    if (result.image_url) {
      return result.image_url.startsWith("http") ? result.image_url : `${API_URL}${result.image_url}`;
    }
    if (result.svg) {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`;
    }
    if (result.image_data) {
      return `data:${result.mime_type || "image/png"};base64,${result.image_data}`;
    }
    return "";
  };

  return (
    <div className="images-gallery-page">
      <PageHeader
        eyebrow="VISUAL LEARNING AIDS"
        title={role === "teacher" ? "Teaching Visuals" : "Learning Images"}
        description="Source-grounded diagrams, extracted textbook figures, flowcharts, and infographics."
        actionHref={`/${role}/prepare?type=image`}
        actionLabel="＋ Create Image Visual"
      />

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "24px" }}>
        <input
          type="search"
          placeholder="Search images by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field-input"
          style={{ maxWidth: "320px" }}
          aria-label="Search images"
        />
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          className="field-input"
          style={{ width: "auto", height: "44px" }}
          aria-label="Filter by image mode"
        >
          <option value="all">All Visual Types</option>
          <option value="diagram">Diagram</option>
          <option value="infographic">Infographic</option>
          <option value="flowchart">Flowchart</option>
          <option value="source_image">Source Image</option>
          <option value="extracted_image">Extracted Image</option>
        </select>
      </div>

      {loading && <LoadingSkeleton type="cards" count={3} />}

      {error && <ErrorState message={error} onRetry={loadImages} />}

      {!loading && !error && filteredImages.length === 0 && (
        <EmptyState
          icon="▧"
          title={searchQuery || modeFilter !== "all" ? "No matching visuals found" : "No images generated yet"}
          description={
            searchQuery || modeFilter !== "all"
              ? "Try adjusting your search or visual type filter."
              : "Generate educational diagrams, flowcharts, or extract textbook figures from your course materials."
          }
          actionLabel={searchQuery || modeFilter !== "all" ? undefined : "Prepare your first image"}
          actionHref={searchQuery || modeFilter !== "all" ? undefined : `/${role}/prepare?type=image`}
        />
      )}

      {!loading && !error && filteredImages.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredImages.map((img) => {
            const result = img.result as unknown as ImageContent;
            const title = result?.title || `${img.resource?.title || "Visual"} Image`;
            const mode = result?.image_mode || "diagram";
            const imageSrc = getImageSrc(result);

            return (
              <div
                key={img.id}
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
                {/* Preview Thumbnail */}
                <div style={{ position: "relative", width: "100%", height: "180px", background: "#f5f7f4", display: "grid", placeItems: "center", borderBottom: "1px solid #edf1ea" }}>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={result?.alt || title}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "12px" }}
                    />
                  ) : (
                    <span style={{ fontSize: "32px", color: "#8ca094" }}>▧</span>
                  )}
                  <span style={{ position: "absolute", top: "12px", left: "12px", padding: "3px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.9)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#2f6854" }}>
                    {mode.replace("_", " ")}
                  </span>
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3 style={{ margin: "0 0 10px", fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 400, color: "#232d29" }}>
                    {title}
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <SourceBadge title={img.resource?.title} />
                  </div>

                  <div style={{ borderTop: "1px solid #edf1ea", paddingTop: "14px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#8a948e" }}>
                      {new Date(img.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/${role}/images/${img.id}`}
                      style={{ fontSize: "12px", color: "#32735f", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      View Image ↗
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
