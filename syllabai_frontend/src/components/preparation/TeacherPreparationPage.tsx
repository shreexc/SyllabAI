"use client";

import { PreparationWorkspace } from "@/components/preparation/PreparationWorkspace";
import { useTeacherPreparation } from "@/hooks/useTeacherPreparation";

export function TeacherPreparationPage() {
  const workflow = useTeacherPreparation();
  return <PreparationWorkspace workflow={workflow} />;
}
