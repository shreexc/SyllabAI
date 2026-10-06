import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LandingNavigation } from "@/components/shared/LandingNavigation";
import type { User } from "@/types/auth";

const mocks = vi.hoisted(() => ({
  currentUser: vi.fn(),
  logout: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/hooks/useCurrentUser", () => ({ useCurrentUser: mocks.currentUser }));
vi.mock("@/lib/auth", () => ({ logout: mocks.logout }));
vi.mock("sonner", () => ({ toast: { success: mocks.toastSuccess, error: mocks.toastError } }));

const teacher: User = {
  id: "teacher-id",
  email: "teacher@example.com",
  first_name: "Taylor",
  last_name: "Teacher",
  role: "teacher",
  date_joined: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const student: User = { ...teacher, id: "student-id", role: "student" };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.currentUser.mockReturnValue({ user: null, loading: false, error: null, refreshUser: vi.fn() });
});

afterEach(cleanup);

describe("landing navigation by auth state", () => {
  it("shows public sign-in and registration links to visitors", () => {
    render(<LandingNavigation />);

    expect(screen.getByRole("link", { name: "SyllabAI home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /Get started/ })).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });

  it("shows teacher dashboard and account links for an authenticated teacher", () => {
    mocks.currentUser.mockReturnValue({ user: teacher, loading: false, error: null, refreshUser: vi.fn() });
    render(<LandingNavigation />);

    expect(screen.getByRole("link", { name: "Teaching space home" })).toHaveAttribute("href", "/teacher/dashboard");
    expect(screen.getByRole("link", { name: "Teaching space ↗" })).toHaveAttribute("href", "/teacher/dashboard");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/teacher/profile");
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("shows the learner dashboard for an authenticated student", () => {
    mocks.currentUser.mockReturnValue({ user: student, loading: false, error: null, refreshUser: vi.fn() });
    render(<LandingNavigation />);

    expect(screen.getByRole("link", { name: "Learning space home" })).toHaveAttribute("href", "/student/dashboard");
    expect(screen.getByRole("link", { name: "Learning space ↗" })).toHaveAttribute("href", "/student/dashboard");
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/student/profile");
  });

  it("signs the user out from the authenticated landing navbar", async () => {
    mocks.currentUser.mockReturnValue({ user: teacher, loading: false, error: null, refreshUser: vi.fn() });
    mocks.logout.mockResolvedValue(undefined);
    render(<LandingNavigation />);

    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Sign out" })));

    expect(mocks.logout).toHaveBeenCalledOnce();
    expect(mocks.toastSuccess).toHaveBeenCalledWith("You’ve signed out", { description: "See you next time." });
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });
});
