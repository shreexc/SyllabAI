"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ViewTransition, useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { ROUTES } from "@/lib/constants";
import type { UserRole } from "@/types/learning";

interface AuthenticatedLayoutProps {
  role: UserRole;
  children: React.ReactNode;
}

export function AuthenticatedLayout({ role, children }: AuthenticatedLayoutProps) {
  const router = useRouter();
  const { user, loading, error } = useCurrentUser();
  const teacherAuth = useTeacherAuth();
  const studentAuth = useStudentAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== role) {
        router.replace(ROUTES[user.role].dashboard);
      }
    }
  }, [user, loading, role, router]);

  const handleSignOut = () => {
    if (role === "teacher") {
      void teacherAuth.signOut();
    } else {
      void studentAuth.signOut();
    }
  };
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6FF]" role="status">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#7665F5] border-t-transparent" />
          <p className="text-[15px] font-medium text-[#756A6A]">
            Opening your {role === "teacher" ? "teaching" : "learning"} space…
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6FF]" role="alert">
        <div className="flex flex-col items-center gap-4 rounded-[15px] bg-white p-8 shadow-sm">
          <p className="text-[15px] font-medium text-[#756A6A]">
            {error || "Please sign in to continue."}
          </p>
          <Link
            href={role === "teacher" ? ROUTES.teacher.login : ROUTES.student.login}
            className="rounded-[12px] bg-[#7665F5] px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Go to {role === "teacher" ? "educator" : "student"} sign in →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div
      className="min-h-screen w-full font-ui"
      style={{
        backgroundColor: "#F8F6FF",
        color: "#000000",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] gap-6 p-6 min-h-screen">
        <AppSidebar
          role={role}
          onSignOut={handleSignOut}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className={`flex flex-1 flex-col gap-6 ${role === "student" ? "mx-auto w-full max-w-[1016px]" : ""}`}>
          <Topbar
            role={role}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1">
            <ViewTransition
              enter="route-fade-in"
              exit="route-fade-out"
              default="none"
            >
              {children}
            </ViewTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
