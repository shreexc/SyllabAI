import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfilePage } from "./ProfilePage";
import { api } from "@/lib/api";
import { getDashboard } from "@/lib/learning-api";

vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
  ApiRequestError: class ApiRequestError extends Error {},
}));

vi.mock("@/lib/learning-api", () => ({
  getDashboard: vi.fn(),
}));

const profile = {
  id: "profile-1",
  email: "alex@example.com",
  first_name: "Alex",
  last_name: "Morgan",
  role: "student" as const,
  date_joined: "2025-08-04T00:00:00.000Z",
  updated_at: "2025-08-04T00:00:00.000Z",
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.mocked(api.get).mockResolvedValue({ user: profile });
    vi.mocked(getDashboard).mockResolvedValue({
      role: "student",
      user: profile,
      summary: { quizzes_count: 7, flashcards_count: 12, animations_count: 3 },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it.each(["student", "teacher"] as const)("uses the shared profile layout for %s", async (role) => {
    render(<ProfilePage role={role} />);

    expect(await screen.findByRole("heading", { name: "Your Profile" })).toBeInTheDocument();
    expect(screen.getByText("LEARNING STATISTICS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your Progress" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /QUIZZES.*7.*Quizzes created|QUIZZES.*7.*Practice quizzes completed/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /FLASHCARDS.*12/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ANIMATION.*3/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Account Security" })).toBeInTheDocument();
  });
});
