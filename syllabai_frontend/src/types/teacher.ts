import type { User } from "@/types/auth";

export interface TeacherDashboardData {
  role: "teacher";
  user: User;
  summary: Record<string, never>;
}
