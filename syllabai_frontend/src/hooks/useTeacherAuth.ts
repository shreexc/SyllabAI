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

      if (path.includes("/login/") && result.user.role !== "teacher") {
        throw new Error("This account is registered as a student.");
      }

      if (path.includes("/register/")) {
        toast.success("Account created successfully", {
          description: "Check your email for the verification code.",
        });

        router.push(`/verify-email?email=${encodeURIComponent((data as Registration).email)}&role=teacher`);
        return;
      }

      toast.success(`Welcome back, ${result.user.first_name}`, {
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
          ? {
              action: {
                label: "Student sign in",
                onClick: () => router.replace(ROUTES.student.login),
              },
            }
          : path.includes("/login/")
            ? {
                action: {
                  label: "Try again",
                  onClick: () => {
                    void submit(path, data);
                  },
                },
              }
            : {}),
      });
    } finally {
      setLoading(false);
    }
  }

  async function login(data: Credentials) {
    return submit("/api/v1/auth/teacher/login/", data);
  }

  async function register(data: Registration) {
    return submit("/api/v1/auth/teacher/register/", data);
  }

  async function signOut() {
    try {
      await logout();
      toast.success("You’ve signed out", {
        description: "Your teaching space is secure.",
      });
      router.replace(ROUTES.home);
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not sign out. Please try again.", {
        action: {
          label: "Try again",
          onClick: () => {
            void signOut();
          },
        },
      });
    }
  }

  return { loading, login, register, signOut };
}