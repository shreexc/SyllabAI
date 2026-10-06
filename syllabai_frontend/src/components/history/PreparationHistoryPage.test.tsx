import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreparationHistoryPage } from "@/components/history/PreparationHistoryPage";
import { listPreparations } from "@/lib/learning-api";
import type { PreparationRequest } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  listPreparations: vi.fn(),
  cancelPreparation: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn(), message: vi.fn() } }));

const preparation: PreparationRequest = {
  id: "job-1",
  resource: {
    id: "resource-1", owner_id: "student-1", title: "Cell biology", description: "", resource_type: "pdf", source_type: "upload", source_url: "", source_provider: "", license_name: "", mime_type: "application/pdf", file_size: 2048, status: "ready", processing_error: "", resource_version: 1, page_count: 12, chunk_count: 2, preview: "Cell structures include membranes.", file_url: null, relevant_pages: [], created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  preparation_type: "quiz", status: "completed", options: {}, result: { title: "Cell biology quiz", questions: [] }, error_message: "", generator_version: "v1", prompt_version: "p1", model_name: "extractive", created_at: new Date().toISOString(), completed_at: new Date().toISOString(), progress: { step: 4, total: 4, label: "completed" },
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(listPreparations).mockResolvedValue([preparation]);
});

describe("preparation history", () => {
  it("lists a user's saved preparations and shows selected output details", async () => {
    render(<PreparationHistoryPage role="student" />);

    expect(await screen.findByRole("heading", { name: "Preparation history" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /Cell biology/ })).toBeInTheDocument();
    expect(await screen.findByText("Cell biology quiz")).toBeInTheDocument();
    expect(listPreparations).toHaveBeenCalledWith("student", {});
  });

  it("passes material and status filters to the history API", async () => {
    render(<PreparationHistoryPage role="teacher" />);
    await screen.findByRole("button", { name: /Cell biology/ });

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    await waitFor(() => expect(listPreparations).toHaveBeenLastCalledWith("teacher", { type: "flashcard" }));

    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "failed" } });
    await waitFor(() => expect(listPreparations).toHaveBeenLastCalledWith("teacher", { type: "flashcard", status: "failed" }));
  });
});
