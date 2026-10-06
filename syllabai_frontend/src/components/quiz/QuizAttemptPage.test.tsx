import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuizAttemptPage } from "@/components/quiz/QuizAttemptPage";
import { getPreparation, listPreparations, submitQuizAttempt } from "@/lib/learning-api";
import type { PreparationRequest, QuizAttemptResult } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  getPreparation: vi.fn(),
  listPreparations: vi.fn(),
  submitQuizAttempt: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockQuizPrep: PreparationRequest = {
  id: "quiz-123",
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
  preparation_type: "quiz",
  status: "completed",
  options: {},
  result: {
    title: "Cardiovascular Quiz",
    difficulty: "medium",
    questions: [
      {
        id: "q1",
        question: "Which chamber pumps blood to the lungs?",
        type: "mcq",
        choices: ["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"],
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

const mockResult: QuizAttemptResult = {
  score: 1,
  total: 1,
  percentage: 100,
  review: [
    {
      id: "q1",
      question: "Which chamber pumps blood to the lungs?",
      type: "mcq",
      user_answer: "Right Ventricle",
      correct_answer: "Right Ventricle",
      is_correct: true,
      explanation: "The right ventricle pumps deoxygenated blood into the pulmonary artery.",
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getPreparation).mockResolvedValue(mockQuizPrep);
  vi.mocked(listPreparations).mockResolvedValue([]);
  vi.mocked(submitQuizAttempt).mockResolvedValue(mockResult);
});

describe("QuizAttemptPage", () => {
  it("renders questions and allows submitting answers", async () => {
    render(<QuizAttemptPage id="quiz-123" />);

    expect(await screen.findByText("Which chamber pumps blood to the lungs?")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 1")).toBeInTheDocument();

    // Select an option
    const option = screen.getByLabelText("Right Ventricle");
    fireEvent.click(option);

    // Click submit
    const submitBtn = screen.getByRole("button", { name: /Submit Quiz/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitQuizAttempt).toHaveBeenCalledWith("student", "quiz-123", { q1: "Right Ventricle" });
    });

    // Verify results screen
    expect(await screen.findByText("Quiz Results")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText(/1 out of 1/i)).toBeInTheDocument();
  });
});
