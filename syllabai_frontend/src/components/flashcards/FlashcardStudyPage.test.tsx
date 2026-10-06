import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlashcardStudyPage } from "@/components/flashcards/FlashcardStudyPage";
import { getPreparation, listPreparations, submitFlashcardReview } from "@/lib/learning-api";
import type { PreparationRequest } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  getPreparation: vi.fn(),
  listPreparations: vi.fn(),
  submitFlashcardReview: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockDeck: PreparationRequest = {
  id: "deck-1",
  resource: {
    id: "res-1",
    owner_id: "s-1",
    title: "Cardiovascular System",
    description: "",
    resource_type: "pdf",
    source_type: "upload",
    source_url: "",
    source_provider: "",
    license_name: "",
    mime_type: "application/pdf",
    file_size: 1024,
    status: "ready",
    processing_error: "",
    resource_version: 1,
    page_count: 5,
    chunk_count: 2,
    preview: "",
    file_url: null,
    relevant_pages: [],
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  preparation_type: "flashcard",
  status: "completed",
  options: {},
  result: {
    title: "Heart Anatomy Flashcards",
    cards: [
      {
        id: "fc1",
        front: "What is the function of the Sinoatrial Node?",
        back: "It acts as the natural pacemaker generating electrical impulses.",
      },
    ],
  },
  error_message: "",
  generator_version: "v1",
  prompt_version: "p1",
  model_name: "extractive",
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  progress: { step: 4, total: 4, label: "completed" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPreparation).mockResolvedValue(mockDeck);
  vi.mocked(listPreparations).mockResolvedValue([]);
  vi.mocked(submitFlashcardReview).mockResolvedValue({
    total: 1,
    reviewed: 1,
    known: 1,
    need_review: 0,
  });
});

describe("FlashcardStudyPage", () => {
  it("renders front of the card, reveals answer on click, and allows submitting review", async () => {
    render(<FlashcardStudyPage role="student" id="deck-1" />);

    expect(await screen.findByText("What is the function of the Sinoatrial Node?")).toBeInTheDocument();
    expect(screen.getByText("Card 1 of 1")).toBeInTheDocument();

    // Click to reveal answer
    const flipButton = screen.getByLabelText("Flashcard. Press to flip.");
    fireEvent.click(flipButton);

    expect(screen.getByText("It acts as the natural pacemaker generating electrical impulses.")).toBeInTheDocument();

    // Rating buttons are now visible
    const goodButton = screen.getByRole("button", { name: /Good/i });
    fireEvent.click(goodButton);

    await waitFor(() => {
      expect(submitFlashcardReview).toHaveBeenCalledWith("student", "deck-1", "fc1", "good");
    });
  });
});
