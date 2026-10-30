import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqSection } from "./FaqSection";
import { FormatsSection } from "./FormatsSection";
import { WorkflowSection } from "./WorkflowSection";

describe("landing page sections", () => {
  it("shows the four requested workflow steps", () => {
    render(<WorkflowSection />);

    expect(screen.getByRole("heading", { name: "SyllabAI workflow" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Search or Upload" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose What to Prepare" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Let SyllabAI Process" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Study the Result" })).toBeInTheDocument();
  });

  it("links each study format to its existing student route", () => {
    render(<FormatsSection />);

    expect(screen.getByRole("link", { name: /Explore Quizzes/ })).toHaveAttribute("href", "/student/quizzes");
    expect(screen.getByRole("link", { name: /Explore Notes/ })).toHaveAttribute("href", "/student/flashcards");
    expect(screen.getByRole("link", { name: /Explore AI Buddy/ })).toHaveAttribute("href", "/student/prepare");
    expect(screen.getByRole("link", { name: /Explore Animation/ })).toHaveAttribute("href", "/student/animations");
  });

  it("allows FAQ answers to be collapsed and expanded", () => {
    render(<FaqSection />);

    const answer = screen.getByText(/text extracted from your source materials/);
    const question = screen.getByText("How does SyllabAI ensure accuracy?");
    expect(answer).toBeVisible();

    fireEvent.click(question);
    expect(answer).not.toBeVisible();

    fireEvent.click(question);
    expect(answer).toBeVisible();
  });
});
