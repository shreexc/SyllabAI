"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiRequestError, getApiErrorDescription } from "@/lib/api";
import { logout, type Credentials, type Registration } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import type { User } from "@/types/auth";

export function useTeacherAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(path: string, data: Credentials | Registration) {
    setLoading(true);
    try {
      const result = await api.post<{ user: User }>(path, data);
      if (result.user.role !== "teacher") throw new Error("This account is registered as a student.");
      toast.success(path.includes("register") ? "Educator account created" : `Welcome back, ${result.user.first_name}`, {
        description: "Opening your teaching space…",
      });
      router.replace(ROUTES.teacher.dashboard);
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Authentication failed.";
      const isWrongRole = caught instanceof ApiRequestError && caught.status === 403;
      toast.error(message, {
        description: getApiErrorDescription(caught),
        ...(isWrongRole
          ? { action: { label: "Student sign in", onClick: () => router.replace(ROUTES.student.login) } }
          : path.includes("login")
            ? { action: { label: "Try again", onClick: () => void submit(path, data) } }
            : {}),
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    login: (data: Credentials) => submit("/api/v1/auth/teacher/login/", data),
    register: (data: Registration) => submit("/api/v1/auth/teacher/register/", data),
    async signOut() {
      try {
        await logout();
        toast.success("You’ve signed out", { description: "Your teaching space is secure." });
        router.replace(ROUTES.teacher.login);
        router.refresh();
      } catch (caught) {
        toast.error(caught instanceof Error ? caught.message : "Could not sign out. Please try again.", {
          action: {
            label: "Try again",
            onClick: () => void logout().then(() => {
              toast.success("You’ve signed out");
              router.replace(ROUTES.teacher.login);
              router.refresh();
            }).catch((retryError: unknown) => toast.error(retryError instanceof Error ? retryError.message : "Could not sign out.")),
          },
        });
      }
    },
  };
}
