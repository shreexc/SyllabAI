import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "../../proxy";

function request(path: string, cookies = "") {
  return new NextRequest(`http://localhost:3000${path}`, { headers: cookies ? { cookie: cookies } : undefined });
}

describe("role route proxy", () => {
  it("redirects unauthenticated visitors to the matching role login", () => {
    const response = proxy(request("/teacher/dashboard"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/teacher/login");
  });

  it("sends a student role hint away from teacher screens", () => {
    const response = proxy(request("/teacher/notes", "access_token=access; user_role=student"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/student/dashboard");
  });

  it("allows authenticated same-role pages", () => {
    const response = proxy(request("/student/dashboard", "access_token=access; user_role=student"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("sends authenticated users away from their role login screen", () => {
    const response = proxy(request("/teacher/login", "access_token=access; user_role=teacher"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/teacher/dashboard");
  });
});
