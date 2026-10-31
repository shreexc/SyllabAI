import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudentChatPage } from "@/components/chat/StudentChatPage";

describe("StudentChatPage", () => {
  it("renders the empty state, composer, and suggested prompts", () => {
    render(<StudentChatPage />);

    expect(screen.getByRole("heading", { name: "Chat with SyllabAI Assistant" })).toBeInTheDocument();
    expect(screen.getByText("Where should we begin?")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Ask SyllabAI Assistant" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Write a summary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain a concept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Animation" })).toBeInTheDocument();
  });

  it("puts the selected suggestion in the prompt field", () => {
    render(<StudentChatPage />);

    fireEvent.click(screen.getByRole("button", { name: "Explain a concept" }));

    expect(screen.getByRole("textbox", { name: "Ask SyllabAI Assistant" })).toHaveValue(
      "Explain a concept from my syllabus",
    );
  });

  it("does not imply a reply when chat is not connected", () => {
    render(<StudentChatPage />);

    fireEvent.change(screen.getByRole("textbox", { name: "Ask SyllabAI Assistant" }), {
      target: { value: "Summarize my syllabus" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "AI chat is not connected yet. Your message has not been sent.",
    );
  });
});
