import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeacherChatPage } from "@/components/chat/StudentChatPage";

describe("TeacherChatPage", () => {
  it("renders the chat workspace and suggested prompts", () => {
    render(<TeacherChatPage />);

    expect(screen.getByRole("heading", { name: "Chat with SyllabAI Assistant" })).toBeInTheDocument();
    expect(screen.getByText("Where should we begin?")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Ask SyllabAI Assistant" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Write a summary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain a concept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Animation" })).toBeInTheDocument();
  });

  it("keeps suggestion and unavailable-chat behavior consistent", () => {
    render(<TeacherChatPage />);

    fireEvent.click(screen.getByRole("button", { name: "Explain a concept" }));
    expect(screen.getByRole("textbox", { name: "Ask SyllabAI Assistant" })).toHaveValue(
      "Explain a concept from my syllabus",
    );

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "AI chat is not connected yet. Your message has not been sent.",
    );
  });
});
