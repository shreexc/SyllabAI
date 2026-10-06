"use client";

import { PreparationWorkspace } from "@/components/preparation/PreparationWorkspace";
import { useStudentPreparation } from "@/hooks/useStudentPreparation";

export function StudentPreparationPage() {
  const workflow = useStudentPreparation();
  return <PreparationWorkspace workflow={workflow} />;
}
