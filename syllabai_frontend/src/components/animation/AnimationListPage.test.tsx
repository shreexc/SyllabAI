import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnimationListPage } from "@/components/animation/AnimationListPage";
import { listPreparations } from "@/lib/learning-api";
import type { PreparationRequest } from "@/types/learning";

vi.mock("@/lib/learning-api", () => ({
  listPreparations: vi.fn(),
}));

const mockAnimation: PreparationRequest = {
  id: "anim-1",
  resource: {
    id: "res-1",
    owner_id: "u-1",
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
  preparation_type: "animation",
  status: "completed",
  options: {},
  result: {
    title: "Cardiovascular System — Storyboard",
    duration: 90,
    scenes: [
      { type: "intro", duration: 15, narration: "Welcome to cardiovascular flow.", visual: "title_card" },
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
  vi.mocked(listPreparations).mockResolvedValue([mockAnimation]);
});

describe("AnimationListPage", () => {
  it("renders animations and calls listPreparations with animation filter", async () => {
    render(<AnimationListPage role="student" />);

    expect(await screen.findByText("Cardiovascular System — Storyboard")).toBeInTheDocument();
    expect(screen.getByText("Cardiovascular System")).toBeInTheDocument();
    expect(listPreparations).toHaveBeenCalledWith("student", { type: "animation" });
  });

  it("shows empty state when no animations are returned", async () => {
    vi.mocked(listPreparations).mockResolvedValue([]);
    render(<AnimationListPage role="teacher" />);

    expect(await screen.findByText("No animations generated yet")).toBeInTheDocument();
  });
});
