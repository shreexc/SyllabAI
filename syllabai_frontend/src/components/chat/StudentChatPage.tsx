"use client";

import React, { FormEvent, useRef, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";

const suggestions = [
  {
    label: "Write a summary",
    prompt: "Write a summary of my syllabus",
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    tone: "summary",
  },
  {
    label: "Explain a concept",
    prompt: "Explain a concept from my syllabus",
    icon: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M8.2 14.5A6 6 0 1 1 15.8 14.5c-.9.7-1.3 1.4-1.5 2.5h-4.6c-.2-1.1-.6-1.8-1.5-2.5Z" />
        <path d="M12 6v4M10 8h4" />
      </>
    ),
    tone: "explain",
  },
  {
    label: "Create Animation",
    prompt: "Create an animation to explain a concept",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
    tone: "animation",
  },
] as const;

export function StudentChatPage() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const promptInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setError("AI chat is not connected yet. Your message has not been sent.");
  };

  const chooseSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setError("");
    promptInput.current?.focus();
  };

  return (
    <div className="student-chat-page">
      <PageHeader
        eyebrow="PRACTICE & ASSESSMENT"
        title="Chat with SyllabAI Assistant"
        description="Ask questions about your syllabus and request instant summaries."
      />

      <section className="student-chat-workspace" aria-label="Chat with SyllabAI Assistant">
        <div className="student-chat-conversation" aria-live="polite">
          <p>Where should we begin?</p>
        </div>

        <form className="student-chat-composer" onSubmit={handleSubmit}>
          <span className="student-chat-add-icon" aria-hidden="true">+</span>
          <input
            ref={promptInput}
            aria-label="Ask SyllabAI Assistant"
            placeholder="Ask SyllabAI Assistant"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setError("");
            }}
          />
          <button
            type="submit"
            className="student-chat-send"
            aria-label="Send message"
            disabled={!prompt.trim()}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>

        {error && <p className="student-chat-error" role="alert">{error}</p>}

        <div className="student-chat-suggestions" aria-label="Suggested prompts">
          {suggestions.map((suggestion) => (
            <button
              className="student-chat-suggestion"
              key={suggestion.label}
              type="button"
              onClick={() => chooseSuggestion(suggestion.prompt)}
            >
              <span className={`student-chat-suggestion-icon student-chat-suggestion-icon--${suggestion.tone}`}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {suggestion.icon}
                </svg>
              </span>
              {suggestion.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
