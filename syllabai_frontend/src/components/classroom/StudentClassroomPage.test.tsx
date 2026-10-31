import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudentClassroomPage } from "@/components/classroom/StudentClassroomPage";

describe("StudentClassroomPage", () => {
  it("renders the subject cards and join-subject tile", () => {
    render(<StudentClassroomPage />);

    expect(screen.getByRole("heading", { name: "My Subjects" })).toBeInTheDocument();
    expect(
      screen.getByText("Access your enrolled subjects, notes, quizzes and announcements."),
    ).toBeInTheDocument();

    for (const subject of ["Biology", "Physics", "Chemistry"]) {
      expect(screen.getAllByRole("heading", { name: subject }).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByText("Published notes")).toHaveLength(3);
    expect(screen.getAllByText("Assigned quizzes")).toHaveLength(3);
    expect(screen.getAllByText("Announcements")).toHaveLength(3);
    expect(screen.getByLabelText("Join Subject")).toBeInTheDocument();
  });
});
