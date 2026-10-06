import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileUpload } from "@/components/preparation/FileUpload";
import { OutputTypeSelector } from "@/components/preparation/OutputTypeSelector";
import { PreparationOptions } from "@/components/preparation/PreparationOptions";
import { ResourceResults } from "@/components/preparation/ResourceResults";
import { SearchResource } from "@/components/preparation/SearchResource";
import { ProcessingStatus } from "@/components/preparation/ProcessingStatus";
import { PreparationResult } from "@/components/preparation/PreparationResult";
import { validateLearningFile } from "@/lib/learning-validation";
import type { LearningResource } from "@/types/learning";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const resource: LearningResource = {
  id: "resource-1", owner_id: "owner-1", title: "The Human Heart", description: "Heart anatomy notes", resource_type: "pdf", source_type: "upload", source_url: "", source_provider: "", license_name: "", mime_type: "application/pdf", file_size: 2048, status: "ready", processing_error: "", resource_version: 1, page_count: 12, chunk_count: 3, preview: "The heart pumps blood.", file_url: null, relevant_pages: [2, 4], created_at: "2026-01-01", updated_at: "2026-01-01",
};

describe("learning preparation controls", () => {
  it("supports selecting one controlled preparation type", () => {
    const onChange = vi.fn();
    render(<OutputTypeSelector value={["quiz"]} onChange={onChange} />);
    expect(screen.getByRole("button", { name: /Quiz/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /Flashcards/ }));
    expect(onChange).toHaveBeenCalledWith(["quiz", "flashcard"]);
    fireEvent.click(screen.getByRole("button", { name: /Other/ }));
    expect(onChange).toHaveBeenLastCalledWith(["quiz", "other"]);
    fireEvent.click(screen.getByRole("button", { name: /Quiz/ }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("submits type-specific options with quiz question formats", () => {
    const onPrepare = vi.fn();
    render(<PreparationOptions type="quiz" disabled={false} onPrepare={onPrepare} />);
    fireEvent.click(screen.getByRole("button", { name: /Prepare my material/ }));
    expect(onPrepare).toHaveBeenCalledWith(expect.objectContaining({ count: 10, difficulty: "medium", question_types: ["mcq", "true_false"], language: "en" }));
  });

  it("validates extensions, MIME and upload size before sending", () => {
    expect(validateLearningFile(new File(["notes"], "notes.txt", { type: "text/plain" }))).toBeNull();
    expect(validateLearningFile(new File(["data"], "fake.pdf", { type: "text/plain" }))).toMatch(/valid PDF/);
    expect(validateLearningFile(new File(["script"], "run.py", { type: "text/plain" }))).toMatch(/Choose a PDF/);
    expect(validateLearningFile(new File([new Uint8Array(20 * 1024 * 1024 + 1)], "big.txt", { type: "text/plain" }))).toMatch(/20 MB/);
  });

  it("does not upload invalid file and invokes upload for supported type", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<FileUpload loading={false} onUpload={onUpload} />);
    const input = container.querySelector("input[type=file]");
    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, { target: { files: [new File(["hello world"], "notes.txt", { type: "text/plain" })] } });
    expect(onUpload).toHaveBeenCalledOnce();
  });

  it("rejects an invalid selected file before calling upload", () => {
    const onUpload = vi.fn();
    const { container } = render(<FileUpload loading={false} onUpload={onUpload} />);
    const input = container.querySelector("input[type=file]");
    fireEvent.change(input as HTMLInputElement, { target: { files: [new File(["script"], "bad.exe", { type: "application/octet-stream" })] } });
    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a PDF");
  });

  it("displays relevant resource metadata and selects the resource", () => {
    const onSelect = vi.fn();
    render(<ResourceResults resources={[resource]} onSelect={onSelect} />);
    expect(screen.getByText("Relevant pages: 2, 4")).toBeInTheDocument();
    expect(screen.getByText("The heart pumps blood.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Use this resource" }));
    expect(onSelect).toHaveBeenCalledWith(resource);
  });

  it("keeps source search separate from the prepare action", () => {
    const onSearch = vi.fn();
    render(<SearchResource query="heart" loading={false} onQueryChange={vi.fn()} onSearch={onSearch} />);
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalledOnce();
  });

  it("shows processing and failure states without blocking the page", () => {
    const preparation = {
      id: "job-1", resource, preparation_type: "quiz" as const, status: "processing" as const, options: {}, result: {}, error_message: "", generator_version: "v1", prompt_version: "p1", model_name: "extractive", created_at: "2026-01-01", completed_at: null, progress: { step: 3, total: 4, label: "processing" },
    };
    const { rerender } = render(<ProcessingStatus preparation={preparation} onCancel={vi.fn()} />);
    expect(screen.getByText("Generating material")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel preparation" })).toBeInTheDocument();
    rerender(<ProcessingStatus preparation={{ ...preparation, status: "failed", error_message: "Not enough readable source." }} onCancel={vi.fn()} />);
    expect(screen.getByText("We couldn’t finish this one.")).toBeInTheDocument();
    expect(screen.getByText("Not enough readable source.")).toBeInTheDocument();
  });

  it("renders a completed quiz and interactive answer score", () => {
    const preparation = {
      id: "job-2", resource, preparation_type: "quiz" as const, status: "completed" as const, options: {}, result: { title: "Heart Quiz", questions: [{ id: 1, type: "true_false", question: "The heart pumps blood.", answer: "true", explanation: "The source states this." }] }, error_message: "", generator_version: "v1", prompt_version: "p1", model_name: "extractive", created_at: "2026-01-01", completed_at: "2026-01-01", progress: { step: 4, total: 4, label: "completed" },
    };
    render(<PreparationResult preparation={preparation} />);
    fireEvent.click(screen.getByRole("radio", { name: "true" }));
    fireEvent.click(screen.getByRole("button", { name: "Check answers" }));
    expect(screen.getByText("Score: 1 / 1")).toBeInTheDocument();
    expect(screen.getByText(/The source states this\./)).toBeInTheDocument();
  });
});
