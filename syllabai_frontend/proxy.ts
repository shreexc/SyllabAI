import { NextResponse, type NextRequest } from "next/server";

const gatedAreas = ["/teacher", "/student"] as const;

/** Role cookies are navigation hints only; every API request is authorized by Django. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const area = gatedAreas.find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!area) return NextResponse.next();

  const expectedRole = area.slice(1);
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;
  const roleHint = request.cookies.get("user_role")?.value;
  const hasSessionCookie = Boolean(access || refresh);
  const isAuthPage = pathname === `${area}/login` || pathname === `${area}/register`;

  if (isAuthPage && hasSessionCookie && roleHint === "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  if (isAuthPage && hasSessionCookie && roleHint === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
  if (isAuthPage) return NextResponse.next();

  if (!hasSessionCookie) return NextResponse.redirect(new URL(`${area}/login`, request.url));
  if (roleHint === "teacher" && expectedRole !== "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
  if (roleHint === "student" && expectedRole !== "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/student/:path*"],
};
