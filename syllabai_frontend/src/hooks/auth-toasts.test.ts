import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError } from "@/lib/api";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { useStudentAuth } from "@/hooks/useStudentAuth";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  apiPost: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }) }));
vi.mock("sonner", () => ({ toast: { success: mocks.success, error: mocks.error } }));
vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return { ...actual, api: { ...actual.api, post: mocks.apiPost } };
});

const teacher = { id: "teacher-1", email: "teacher@example.com", first_name: "Tess", last_name: "Teacher", role: "teacher" as const, date_joined: "2026-01-01", updated_at: "2026-01-01" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authentication toast feedback", () => {
  it("shows an actionable success toast after teacher login", async () => {
    mocks.apiPost.mockResolvedValueOnce({ user: teacher });
    const { result } = renderHook(() => useTeacherAuth());

    await act(async () => result.current.login({ email: teacher.email, password: "secret" }));

    expect(mocks.success).toHaveBeenCalledWith("Welcome back, Tess", { description: "Opening your teaching space…" });
    expect(mocks.replace).toHaveBeenCalledWith("/teacher/dashboard");
  });

  it("adds a retry action when teacher login fails", async () => {
    mocks.apiPost.mockRejectedValueOnce(new ApiRequestError("Invalid email or password.", 401));
    const { result } = renderHook(() => useTeacherAuth());

    await act(async () => result.current.login({ email: teacher.email, password: "wrong" }));

    expect(mocks.error).toHaveBeenCalledWith("Invalid email or password.", expect.objectContaining({
      action: expect.objectContaining({ label: "Try again", onClick: expect.any(Function) }),
    }));
  });

  it("lets a student move to educator sign-in after a wrong-role response", async () => {
    mocks.apiPost.mockRejectedValueOnce(new ApiRequestError("This account is registered as a teacher.", 403));
    const { result } = renderHook(() => useStudentAuth());

    await act(async () => result.current.login({ email: teacher.email, password: "secret" }));

    const options = mocks.error.mock.calls[0][1];
    expect(options.action.label).toBe("Educator sign in");
    act(() => options.action.onClick());
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/teacher/login"));
  });
});
