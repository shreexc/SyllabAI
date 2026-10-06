import Link from "next/link";
import React from "react";
import type { PreparationType, UserRole } from "@/types/learning";

interface RelatedLearningProps {
  role: UserRole;
  resourceId?: string;
  resourceTitle?: string;
  currentType?: PreparationType;
  relatedPreparations?: Array<{
    id: string;
    type: PreparationType;
    title?: string;
  }>;
}

const formatMeta: Record<PreparationType, { label: string; icon: string; path: string }> = {
  short_note: { label: "Short Notes", icon: "▤", path: "notes" },
  quiz: { label: "Quiz", icon: "✦", path: "quizzes" },
  flashcard: { label: "Flashcards", icon: "▱", path: "flashcards" },
  image: { label: "Visual Images", icon: "▧", path: "images" },
  animation: { label: "Animation", icon: "▷", path: "animations" },
  other: { label: "Custom Material", icon: "＋", path: "history" },
};

export function RelatedLearning({
  role,
  resourceId,
  resourceTitle,
  currentType,
  relatedPreparations = [],
}: RelatedLearningProps) {
  const formats: PreparationType[] = ["short_note", "quiz", "flashcard", "image", "animation"];
  const otherFormats = formats.filter((f) => f !== currentType);

  return (
    <section className="related-learning-section" aria-label="Related learning tools">
      <div className="related-learning-header">
        <span className="eyebrow">CONNECTED STUDY TOOLS</span>
        <h3 className="related-learning-title">
          Explore {resourceTitle ? `“${resourceTitle}”` : "this topic"} from other angles
        </h3>
        <p className="related-learning-subtitle">
          Reinforce your understanding by switching between summary notes, practice questions, memory cards, and animations.
        </p>
      </div>

      <div className="related-learning-grid">
        {otherFormats.map((format) => {
          const meta = formatMeta[format];
          // Check if we have an existing preparation for this format
          const existing = relatedPreparations.find((p) => p.type === format);
          const href = existing
            ? `/${role}/${meta.path}/${existing.id}`
            : `/${role}/prepare${resourceId ? `?resource=${resourceId}&type=${format}` : ""}`;
          const isReady = Boolean(existing);

          return (
            <Link key={format} href={href} className="related-learning-card">
              <span className="related-learning-icon" aria-hidden="true">{meta.icon}</span>
              <div className="related-learning-text">
                <strong>{meta.label}</strong>
                <span>{isReady ? "Open ready material ↗" : "Prepare for this source ＋"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
