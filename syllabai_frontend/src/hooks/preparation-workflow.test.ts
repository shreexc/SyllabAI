import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePreparationWorkflow } from "@/hooks/usePreparationWorkflow";
import type { LearningResource, PreparationRequest } from "@/types/learning";

const mocks = vi.hoisted(() => ({
  searchResources: vi.fn(), uploadResource: vi.fn(), getResource: vi.fn(),
  createPreparation: vi.fn(), getPreparation: vi.fn(), cancelPreparation: vi.fn(),
  toastSuccess: vi.fn(), toastError: vi.fn(), toastMessage: vi.fn(),
}));

vi.mock("@/lib/learning-api", () => ({
  searchResources: mocks.searchResources,
  uploadResource: mocks.uploadResource,
  getResource: mocks.getResource,
  createPreparation: mocks.createPreparation,
  getPreparation: mocks.getPreparation,
  cancelPreparation: mocks.cancelPreparation,
}));
vi.mock("sonner", () => ({ toast: { success: mocks.toastSuccess, error: mocks.toastError, message: mocks.toastMessage } }));

const resource: LearningResource = {
  id: "resource-1", owner_id: "teacher-1", title: "Heart notes", description: "", resource_type: "txt", source_type: "upload", source_url: "", source_provider: "", license_name: "", mime_type: "text/plain", file_size: 200, status: "ready", processing_error: "", resource_version: 1, page_count: null, chunk_count: 1, preview: "The heart pumps blood.", file_url: null, relevant_pages: [], created_at: "2026-01-01", updated_at: "2026-01-01",
};

function preparation(type: PreparationRequest["preparation_type"]): PreparationRequest {
  return {
    id: `job-${type}`, resource, preparation_type: type, status: "pending", options: {}, result: {}, error_message: "", generator_version: "v1", prompt_version: "p1", model_name: "extractive", created_at: "2026-01-01", completed_at: null, progress: { step: 1, total: 4, label: "pending" },
  };
}

beforeEach(() => vi.clearAllMocks());

describe("preparation search and multi-output workflow", () => {
  it("searches for source resources without requiring an output type", async () => {
    mocks.searchResources.mockResolvedValue([resource]);
    const { result } = renderHook(() => usePreparationWorkflow("teacher"));
    act(() => result.current.setQuery("human heart"));

    await act(async () => result.current.search());

    expect(mocks.searchResources).toHaveBeenCalledWith("teacher", "human heart");
    expect(result.current.resources).toEqual([resource]);
    expect(result.current.preparationTypes).toEqual([]);
    expect(result.current.hasSearched).toBe(true);
  });

  it("queues and tracks each selected output independently", async () => {
    mocks.createPreparation.mockImplementation(async (_role: string, _id: string, type: PreparationRequest["preparation_type"]) => preparation(type));
    const { result } = renderHook(() => usePreparationWorkflow("student"));
    act(() => {
      result.current.selectResource({ ...resource, owner_id: "student-1" });
      result.current.setPreparationTypes(["quiz", "flashcard"]);
    });

    await act(async () => result.current.prepare({
      quiz: { count: 5, difficulty: "medium" },
      flashcard: { count: 10, difficulty: "easy" },
    }));

    expect(mocks.createPreparation).toHaveBeenCalledTimes(2);
    expect(mocks.createPreparation).toHaveBeenNthCalledWith(1, "student", "resource-1", "quiz", { count: 5, difficulty: "medium" });
    expect(mocks.createPreparation).toHaveBeenNthCalledWith(2, "student", "resource-1", "flashcard", { count: 10, difficulty: "easy" });
    expect(result.current.preparations.map((job) => job.preparation_type)).toEqual(["quiz", "flashcard"]);
  });
});
