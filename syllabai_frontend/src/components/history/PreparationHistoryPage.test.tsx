import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

    expect(await screen.findByRole("heading", { name: "Learning History & Archives" })).toBeInTheDocument();
    expect(await screen.findByText("Cell biology")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cell biology"));
    expect(await screen.findByText("Cell biology quiz")).toBeInTheDocument();
    expect(listPreparations).toHaveBeenCalledWith("student", {});
  });

  it("shows a centered empty state when a student has no learning history", async () => {
    vi.mocked(listPreparations).mockResolvedValue([]);
    render(<PreparationHistoryPage role="student" />);

    expect(await screen.findByRole("heading", { name: "No Learning History Yet" })).toBeInTheDocument();
    expect(screen.queryByText("Upload documents or generate quizzes and flashcards to build your archive.")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Prepare learning material/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows only the requested student material tabs with sidebar-matching icons", async () => {
    vi.mocked(listPreparations).mockResolvedValue([]);
    render(<PreparationHistoryPage role="student" />);

    expect(await screen.findByRole("button", { name: /All materials/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Quizzes/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Chat/ })).toHaveAttribute("href", "/student/chat");
    expect(screen.getByRole("button", { name: /Flashcards/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Animation/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Short notes|Images/ })).not.toBeInTheDocument();
  });

  it("does not show an empty archive when history fails to load", async () => {
    vi.mocked(listPreparations).mockRejectedValue(new Error("offline"));
    render(<PreparationHistoryPage role="student" />);

    expect(await screen.findByRole("heading", { name: "History unavailable" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "No Learning History Yet" })).not.toBeInTheDocument();
    expect(within(screen.getByRole("alert")).getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("renders teacher archive controls and filters materials", async () => {
    render(<PreparationHistoryPage role="teacher" />);
    await screen.findByText("Cell biology");

    expect(screen.getByRole("heading", { name: "Teaching History & Archives" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Chat/ })).toHaveAttribute("href", "/teacher/chat");
    expect(screen.queryByRole("button", { name: /Resources/ })).not.toBeInTheDocument();
    expect(screen.getByText("Select Date:")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All Months Available" })).toBeInTheDocument();
    expect(screen.getByText(new Date(preparation.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    await waitFor(() => expect(listPreparations).toHaveBeenLastCalledWith("teacher", { type: "flashcard" }));
  });
});
