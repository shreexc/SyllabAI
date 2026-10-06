import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TeacherLoginForm } from "@/components/auth/teacher/TeacherLoginForm";
import { TeacherRegisterForm } from "@/components/auth/teacher/TeacherRegisterForm";
import { StudentLoginForm } from "@/components/auth/student/StudentLoginForm";
import { StudentRegisterForm } from "@/components/auth/student/StudentRegisterForm";

const authMocks = vi.hoisted(() => ({
  teacherLogin: vi.fn(), teacherRegister: vi.fn(), studentLogin: vi.fn(), studentRegister: vi.fn(),
}));

vi.mock("@/hooks/useTeacherAuth", () => ({ useTeacherAuth: () => ({ loading: false, error: null, login: authMocks.teacherLogin, register: authMocks.teacherRegister }) }));
vi.mock("@/hooks/useStudentAuth", () => ({ useStudentAuth: () => ({ loading: false, error: null, login: authMocks.studentLogin, register: authMocks.studentRegister }) }));

function submitForm(buttonName: string) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(buttonName) }));
}

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe("role-specific authentication forms", () => {
  it("submits teacher login credentials through the teacher flow", () => {
    render(<TeacherLoginForm />);
    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "teach@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass" } });
    submitForm("Sign in as an educator");
    expect(authMocks.teacherLogin).toHaveBeenCalledWith({ email: "teach@example.com", password: "pass" });
    expect(authMocks.studentLogin).not.toHaveBeenCalled();
  });

  it("submits teacher registration without a client-selected role", () => {
    render(<TeacherRegisterForm />);
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Taylor" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Teacher" } });
    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "teach@example.com" } });
    fireEvent.change(screen.getByLabelText("Create a password"), { target: { value: "StrongPass123!" } });
    submitForm("Create educator account");
    expect(authMocks.teacherRegister).toHaveBeenCalledWith({ first_name: "Taylor", last_name: "Teacher", email: "teach@example.com", password: "StrongPass123!" });
  });

  it("submits student login credentials through the student flow", () => {
    render(<StudentLoginForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "learn@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "pass" } });
    submitForm("Sign in as a learner");
    expect(authMocks.studentLogin).toHaveBeenCalledWith({ email: "learn@example.com", password: "pass" });
    expect(authMocks.teacherLogin).not.toHaveBeenCalled();
  });

  it("submits student registration without a client-selected role", () => {
    render(<StudentRegisterForm />);
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Learner" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "learn@example.com" } });
    fireEvent.change(screen.getByLabelText("Create a password"), { target: { value: "StrongPass123!" } });
    submitForm("Create learner account");
    expect(authMocks.studentRegister).toHaveBeenCalledWith({ first_name: "Alex", last_name: "Learner", email: "learn@example.com", password: "StrongPass123!" });
  });
});
