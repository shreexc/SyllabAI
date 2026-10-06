"use client";

import { usePreparationWorkflow } from "@/hooks/usePreparationWorkflow";

export function useStudentPreparation() {
  return usePreparationWorkflow("student");
}
