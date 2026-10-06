export const ROUTES = {
  home: "/",
  teacher: {
    login: "/teacher/login",
    register: "/teacher/register",
    dashboard: "/teacher/dashboard",
    prepare: "/teacher/prepare",
    history: "/teacher/history",
  },
  student: {
    login: "/student/login",
    register: "/student/register",
    dashboard: "/student/dashboard",
    prepare: "/student/prepare",
    history: "/student/history",
  },
} as const;

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
