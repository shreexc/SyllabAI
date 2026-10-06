import { api } from "@/lib/api";
import type { LearningResource, PreparationOptions, PreparationRequest, PreparationType } from "@/types/learning";

function rolePath(role: "teacher" | "student", path: string): string {
  return `/api/v1/learning/${role}/${path}`;
}

export async function searchResources(role: "teacher" | "student", query: string, type?: PreparationType): Promise<LearningResource[]> {
  const params = new URLSearchParams({ q: query });
  if (type) params.set("type", type);
  const data = await api.get<{ results: LearningResource[] }>(`${rolePath(role, "search/")}?${params}`);
  return data.results;
}

export async function uploadResource(role: "teacher" | "student", file: File): Promise<LearningResource> {
  const form = new FormData();
  form.append("file", file);
  const data = await api.postForm<{ resource: LearningResource }>(rolePath(role, "resources/upload/"), form);
  return data.resource;
}

export async function getResource(role: "teacher" | "student", id: string): Promise<LearningResource> {
  const data = await api.get<{ resource: LearningResource }>(rolePath(role, `resources/${id}/`));
  return data.resource;
}

export async function createPreparation(
  role: "teacher" | "student",
  resourceId: string,
  type: PreparationType,
  options: PreparationOptions,
): Promise<PreparationRequest> {
  const data = await api.post<{ preparation: PreparationRequest }>(rolePath(role, "preparations/"), {
    resource_id: resourceId,
    preparation_type: type,
    options,
  });
  return data.preparation;
}

export async function getPreparation(role: "teacher" | "student", id: string): Promise<PreparationRequest> {
  const data = await api.get<{ preparation: PreparationRequest }>(rolePath(role, `preparations/${id}/`));
  return data.preparation;
}

export async function listPreparations(
  role: "teacher" | "student",
  filters: { type?: PreparationType; status?: PreparationRequest["status"] } = {},
): Promise<PreparationRequest[]> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  const query = params.size ? `?${params.toString()}` : "";
  const data = await api.get<{ results: PreparationRequest[]; count: number }>(rolePath(role, `preparations/${query}`));
  return data.results;
}

export async function cancelPreparation(role: "teacher" | "student", id: string): Promise<PreparationRequest> {
  const data = await api.post<{ preparation: PreparationRequest }>(rolePath(role, `preparations/${id}/cancel/`));
  return data.preparation;
}

export async function getDashboard(role: "teacher" | "student"): Promise<{ role: "teacher" | "student"; user: any; summary: any }> {
  return await api.get<{ role: "teacher" | "student"; user: any; summary: any }>(`/api/v1/${role}/dashboard/`);
}

export async function listResources(role: "teacher" | "student"): Promise<LearningResource[]> {
  const data = await api.get<{ results: LearningResource[]; count: number }>(rolePath(role, "resources/"));
  return data.results;
}

export async function submitQuizAttempt(
  role: "teacher" | "student",
  quizId: string,
  answers: Record<string, string>,
): Promise<{ score: number; total: number; percentage: number; review: any[] }> {
  return await api.post<{ score: number; total: number; percentage: number; review: any[] }>(
    rolePath(role, `preparations/${quizId}/attempts/`),
    { answers },
  );
}

export async function submitFlashcardReview(
  role: "teacher" | "student",
  deckId: string,
  cardId: string | number,
  rating: string,
): Promise<{ total: number; reviewed: number; known: number; need_review: number; reviews?: Record<string, string> }> {
  return await api.post<{ total: number; reviewed: number; known: number; need_review: number; reviews?: Record<string, string> }>(
    rolePath(role, `preparations/${deckId}/reviews/`),
    { card_id: String(cardId), rating },
  );
}

