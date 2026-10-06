"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/student/login") || pathname.includes("/student/register");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AuthenticatedLayout role="student">{children}</AuthenticatedLayout>;
}
