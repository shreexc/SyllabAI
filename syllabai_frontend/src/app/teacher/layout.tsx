"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/teacher/login") || pathname.includes("/teacher/register");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AuthenticatedLayout role="teacher">{children}</AuthenticatedLayout>;
}
