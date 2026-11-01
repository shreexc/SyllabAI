import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StudentClassroomPage } from "@/components/classroom/StudentClassroomPage";
import { joinClassroom, listClassrooms } from "@/lib/classroom-api";

vi.mock("@/lib/classroom-api", () => ({
  createClassroom: vi.fn(),
  joinClassroom: vi.fn(),
  listClassrooms: vi.fn(),
}));

const classroom = {
  id: "room-1",
  name: "Grade 8 Biology",
  subject: "Biology",
  class_code: "B7K2LM",
  teacher_name: "Niru Koju",
  student_count: 1,
  created_at: "2026-01-01T00:00:00Z",
};

describe("StudentClassroomPage", () => {
  beforeEach(() => {
    vi.mocked(listClassrooms).mockResolvedValue([]);
    vi.mocked(joinClassroom).mockResolvedValue(classroom);
  });

  it("joins a class using the six-character code and lists the joined class", async () => {
    render(<StudentClassroomPage />);

    expect(screen.getByRole("heading", { name: "Join a class" })).toBeInTheDocument();
    expect(screen.getByText("To join, get the code from your teacher")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading your classes...")).not.toBeInTheDocument());

    for (const [index, character] of [..."B7K2LM"].entries()) {
      fireEvent.change(screen.getByLabelText(`Class code character ${index + 1} of 6`), {
        target: { value: character },
      });
    }

    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    await waitFor(() => expect(joinClassroom).toHaveBeenCalledWith("B7K2LM"));
    expect(await screen.findByRole("heading", { name: "Grade 8 Biology" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("You joined Grade 8 Biology.");
  });
});
