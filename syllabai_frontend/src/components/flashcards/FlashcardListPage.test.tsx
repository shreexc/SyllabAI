import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlashcardListPage } from "@/components/flashcards/FlashcardListPage";
import { listPreparations } from "@/lib/learning-api";
import type { PreparationRequest } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  listPreparations: vi.fn(),
}));

const savedDeck: PreparationRequest = {
  id: "deck-1",
  resource: {
    id: "resource-1",
    owner_id: "student-1",
    title: "Cell biology",
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
    page_count: 4,
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
    title: "Cell structures",
    cards: [{ id: "card-1", front: "What is a cell?", back: "The basic unit of life." }],
  },
  error_message: "",
  generator_version: "v1",
  prompt_version: "p1",
  model_name: "extractive",
  created_at: "2026-01-01",
  completed_at: "2026-01-01",
  progress: { step: 4, total: 4, label: "completed" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listPreparations).mockResolvedValue([]);
});

describe("FlashcardListPage", () => {
  it("renders the student empty state without empty-list controls", async () => {
    render(<FlashcardListPage role="student" />);

    expect(await screen.findByText("No flashcard decks generated yet")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Study Flashcards" })).toBeInTheDocument();
    expect(screen.queryByRole("searchbox", { name: "Search flashcards" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Create Flashcards/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Prepare your first deck/ })).toHaveAttribute(
      "href",
      "/student/prepare?type=flashcard",
    );
    expect(screen.getByRole("status").querySelector("svg")).toBeInTheDocument();
  });

  it("shows student search when decks exist", async () => {
    vi.mocked(listPreparations).mockResolvedValue([savedDeck]);
    render(<FlashcardListPage role="student" />);

    expect(await screen.findByRole("heading", { name: "Cell structures" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search flashcards" }), {
      target: { value: "biology" },
    });
    expect(screen.queryByRole("heading", { name: "Cell structures" })).not.toBeInTheDocument();
    expect(screen.getByText("No matching flashcard decks found")).toBeInTheDocument();
  });

  it("renders the teacher empty state without empty-list controls", async () => {
    render(<FlashcardListPage role="teacher" />);

    expect(await screen.findByText("No flashcard decks prepared yet")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Teaching Flashcards" })).toBeInTheDocument();
    expect(screen.queryByRole("searchbox", { name: "Search flashcards" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Create Flashcards/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Prepare your first deck/ })).toHaveAttribute(
      "href",
      "/teacher/prepare?type=flashcard",
    );
    expect(screen.getByRole("status").querySelector("svg")).toBeInTheDocument();
  });

  it("preserves teacher create and search controls when decks exist", async () => {
    vi.mocked(listPreparations).mockResolvedValue([savedDeck]);
    render(<FlashcardListPage role="teacher" />);

    expect(await screen.findByRole("heading", { name: "Cell structures" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search flashcards" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create Flashcards/ })).toHaveAttribute(
      "href",
      "/teacher/prepare?type=flashcard",
    );
  });
});
