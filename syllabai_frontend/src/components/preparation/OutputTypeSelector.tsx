"use client";

import type { PreparationType } from "@/types/learning";

const outputs: Array<{ type: PreparationType; title: string; detail: string; icon: string }> = [
  { type: "quiz", title: "Quiz", detail: "Check your understanding", icon: "?" },
  { type: "short_note", title: "Short notes", detail: "Keep the key ideas close", icon: "≡" },
  { type: "flashcard", title: "Flashcards", detail: "Practice one idea at a time", icon: "▱" },
  { type: "image", title: "Images", detail: "Find or shape a visual", icon: "▧" },
  { type: "animation", title: "Animation", detail: "Build a visual storyboard", icon: "▷" },
  { type: "other", title: "Other", detail: "Describe another source-based format", icon: "＋" },
];

export function OutputTypeSelector({ value, onChange }: { value: PreparationType[]; onChange: (value: PreparationType[]) => void }) {
  function toggle(type: PreparationType) {
    onChange(value.includes(type) ? value.filter((selected) => selected !== type) : [...value, type]);
  }

  return (
    <fieldset className="preparation-output-fieldset">
      <legend className="preparation-section-title">What would you like to prepare? <span className="preparation-optional-label">Optional · choose one or more</span></legend>
      <div className="preparation-output-grid">
        {outputs.map((output) => (
          <button
            key={output.type}
            type="button"
            className={`preparation-output-card${value.includes(output.type) ? " preparation-output-card--active" : ""}`}
            aria-pressed={value.includes(output.type)}
            onClick={() => toggle(output.type)}
          >
            <span className="preparation-output-icon" aria-hidden="true">{output.icon}</span>
            <span className="preparation-output-name">{output.title}</span>
            <span className="preparation-output-detail">{output.detail}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
