"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
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
      <main className="dashboard-loading" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Opening your {role === "teacher" ? "teaching" : "learning"} space…</p>
      </main>
    );
  }

  if (!user || user.role !== role) {
    return (
      <main className="dashboard-loading" role="alert">
        <p>{error || "Please sign in to continue."}</p>
        <Link
          href={role === "teacher" ? ROUTES.teacher.login : ROUTES.student.login}
          className="dashboard-loading-link"
        >
          Go to {role === "teacher" ? "educator" : "student"} sign in →
        </Link>
      </main>
    );
  }

  return (
    <div className={`dashboard-page dashboard-page--${role}`}>
      <AppSidebar
        role={role}
        onSignOut={handleSignOut}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="dashboard-content-area">
        <Topbar
          role={role}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="dashboard-main-content">
          {children}
        </main>
      </div>
      <MobileNavigation role={role} />
    </div>
  );
}
