import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeacherClassroomPage } from "@/components/classroom/TeacherClassroomPage";

describe("TeacherClassroomPage", () => {
  it("renders teacher classes and the create-class tile", () => {
    render(<TeacherClassroomPage />);

    expect(screen.getByRole("heading", { name: "My Classes" })).toBeInTheDocument();
    expect(
      screen.getByText("Create and manage your classes, share learning materials, quizzes and assignments."),
    ).toBeInTheDocument();

    for (const subject of ["Biology", "Physics", "Chemistry"]) {
      expect(screen.getAllByRole("heading", { name: subject }).length).toBeGreaterThan(0);
    }

    expect(screen.getAllByText("Students")).toHaveLength(3);
    expect(screen.getAllByText("Learning materials")).toHaveLength(3);
    expect(screen.getAllByText("Assignments & quizzes")).toHaveLength(3);
    expect(screen.getByLabelText("Create New Class")).toBeInTheDocument();
  });
});
