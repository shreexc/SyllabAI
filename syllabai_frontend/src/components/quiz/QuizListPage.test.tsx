import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizListPage } from "@/components/quiz/QuizListPage";
import { listPreparations } from "@/lib/learning-api";
import type { PreparationRequest } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  listPreparations: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listPreparations).mockResolvedValue([]);
});

const savedQuiz: PreparationRequest = {
  id: "quiz-1",
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
  preparation_type: "quiz",
  status: "completed",
  options: {},
  result: {
    title: "Cell structures",
    difficulty: "medium",
    questions: [{ id: "q1", question: "What is a cell?", type: "mcq" }],
  },
  error_message: "",
  generator_version: "v1",
  prompt_version: "p1",
  model_name: "extractive",
  created_at: "2026-01-01",
  completed_at: "2026-01-01",
  progress: { step: 4, total: 4, label: "completed" },
};

describe("QuizListPage", () => {
  it("shows the designed empty state without unused filters", async () => {
    render(<QuizListPage role="student" />);

    expect(await screen.findByText("No quizzes created yet")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox", { name: "Search quizzes" })).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Filter by difficulty" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Prepare your first quiz/ })).toHaveAttribute(
      "href",
      "/student/prepare?type=quiz",
    );
    expect(screen.getByRole("status").querySelector("svg")).toBeInTheDocument();
  });

  it("keeps quiz search and difficulty filters available when quizzes exist", async () => {
    vi.mocked(listPreparations).mockResolvedValue([savedQuiz]);
    render(<QuizListPage role="student" />);

    expect(await screen.findByRole("heading", { name: "Cell structures" })).toBeInTheDocument();
    const search = screen.getByRole("searchbox", { name: "Search quizzes" });
    expect(screen.getByRole("combobox", { name: "Filter by difficulty" })).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "biology" } });
    expect(screen.queryByRole("heading", { name: "Cell structures" })).not.toBeInTheDocument();
    expect(screen.getByText("No matching quizzes found")).toBeInTheDocument();
  });

  it("does not apply the student empty-state design to teacher quizzes", async () => {
    render(<QuizListPage role="teacher" />);

    expect(await screen.findByText("No quizzes created yet")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search quizzes" })).toBeInTheDocument();
    expect(screen.getByRole("status").querySelector("svg")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create Quiz/ })).toHaveAttribute(
      "href",
      "/teacher/prepare?type=quiz",
    );
  });
});
