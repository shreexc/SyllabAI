import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TeacherClassroomPage } from "@/components/classroom/TeacherClassroomPage";
import { createClassroom, listClassrooms } from "@/lib/classroom-api";

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
  teacher_name: "Terry Teacher",
  student_count: 0,
  created_at: "2026-01-01T00:00:00Z",
};

describe("TeacherClassroomPage", () => {
  beforeEach(() => {
    vi.mocked(listClassrooms).mockResolvedValue([]);
    vi.mocked(createClassroom).mockResolvedValue(classroom);
  });

  it("creates a class and displays the generated code for sharing", async () => {
    render(<TeacherClassroomPage />);

    expect(screen.getByRole("heading", { name: "Create a class" })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading your classes...")).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText("Class name"), { target: { value: "Grade 8 Biology" } });
    fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Biology" } });
    fireEvent.click(screen.getByRole("button", { name: "Create class" }));

    await waitFor(() => expect(createClassroom).toHaveBeenCalledWith("Grade 8 Biology", "Biology"));
    expect(await screen.findByText("B7K2LM")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeInTheDocument();
  });
});
