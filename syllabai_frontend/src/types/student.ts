import type { User } from "@/types/auth";

export interface StudentDashboardData {
  role: "student";
  user: User;
  summary: Record<string, never>;
}
