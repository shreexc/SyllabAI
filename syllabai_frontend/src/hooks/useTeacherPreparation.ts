"use client";

import { usePreparationWorkflow } from "@/hooks/usePreparationWorkflow";

export function useTeacherPreparation() {
  return usePreparationWorkflow("teacher");
}
